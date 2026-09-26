// Pages Function tests — plain Node test runner (type stripping), no Angular/Karma.
// Kept outside functions/ because every file there becomes a Pages route.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toLead, onRequestPost } from '../../functions/api/waitlist.ts';

const client = { audience: 'client', name: 'Thandi Mokoena', email: 'thandi@example.co.za', consent: true,
  company: 'Acme', need: 'Fix checkout', budget: 'R5,000 – R20,000', start: 'Within a month', website: '' };
const freelancer = { audience: 'freelancer', name: 'Sipho', email: 'sipho@example.com', consent: true, stack: 'Angular', github: 'github.com/sipho' };
const env = { ZOHO_CLIENT_ID: 'id', ZOHO_CLIENT_SECRET: 's', ZOHO_REFRESH_TOKEN: 'r' };
const req = (body: unknown, origin: string | null = 'https://freework.co.za') =>
  new Request('https://freework.co.za/api/waitlist', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: origin ? { origin, 'content-type': 'application/json' } : { 'content-type': 'application/json' } });

test('client lead maps to playbook convention', () => {
  const r = toLead(client, new Date('2026-09-26T00:00:00Z'));
  assert.equal(r.ok, true);
  if (r.ok !== true) return;
  assert.equal(r.lead.First_Name, 'Thandi'); assert.equal(r.lead.Last_Name, 'Mokoena'); assert.equal(r.lead.Company, 'Acme');
  assert.equal(r.lead.Description, 'FreeWork — waitlist-client — JOB: Fix checkout · budget R5,000 – R20,000 · start Within a month · consent 2026-09-26T00:00:00.000Z');
});
test('freelancer lead, single name, no company', () => {
  const r = toLead(freelancer); assert.equal(r.ok, true);
  if (r.ok !== true) return;
  assert.equal(r.lead.Last_Name, 'Sipho'); assert.equal(r.lead.First_Name, undefined); assert.equal(r.lead.Company, 'Freelancer');
  assert.match(r.lead.Description, /^FreeWork — waitlist-freelancer — stack: Angular · GitHub: github.com\/sipho · consent /);
});
test('client without company gets individual company', () => {
  const r = toLead({ ...client, company: '' }); assert.ok(r.ok === true && r.lead.Company === 'Thandi Mokoena (individual)');
});
test('rejections', () => {
  for (const bad of [null, 'x', { ...client, consent: false }, { ...client, audience: 'admin' }, { ...client, email: 'nope' },
    { ...client, budget: 'R1' }, { ...client, start: 'x' }, { ...client, need: '' }, { ...client, name: 'x'.repeat(121) },
    { ...client, need: 42 }, { ...freelancer, stack: '' }, { ...freelancer, github: 'https://evil.com/x' }]) {
    assert.equal(toLead(bad).ok, false, JSON.stringify(bad)?.slice(0, 60));
  }
});
test('honeypot is a silent bot', () => { assert.equal(toLead({ ...client, website: 'spam' }).ok, 'bot'); });

test('handler: origin, size, json, bot, config errors', async () => {
  assert.equal((await onRequestPost({ request: req(client, null), env })).status, 403);
  assert.equal((await onRequestPost({ request: req(client, 'https://evil.com'), env })).status, 403);
  assert.equal((await onRequestPost({ request: req('x'.repeat(10_001)), env })).status, 413);
  assert.equal((await onRequestPost({ request: req('{bad'), env })).status, 400);
  assert.equal((await onRequestPost({ request: req({ ...client, website: 'x' }), env })).status, 202);
  const r = await onRequestPost({ request: req(client), env: {} });
  assert.equal(r.status, 502); assert.deepEqual(await r.json(), { ok: false, error: 'Could not record your sign-up' });
});

test('handler: refreshes token once, upserts with Email dedupe', async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    if (url.includes('/oauth/v2/token')) return Response.json({ access_token: 'tok', api_domain: 'https://www.zohoapis.com', expires_in: 3600 });
    return Response.json({ data: [{ status: 'success', code: 'SUCCESS' }] });
  }) as typeof fetch;
  assert.equal((await onRequestPost({ request: req(client), env })).status, 202);
  assert.equal((await onRequestPost({ request: req(freelancer), env })).status, 202);
  assert.equal(calls.filter(c => c.url.includes('oauth')).length, 1, 'token cached');
  const up = calls.find(c => c.url.endsWith('/crm/v8/Leads/upsert'))!;
  assert.equal((up.init!.headers as Record<string, string>)['Authorization'], 'Zoho-oauthtoken tok');
  const body = JSON.parse(up.init!.body as string);
  assert.deepEqual(body.duplicate_check_fields, ['Email']); assert.equal(body.data[0].Email, 'thandi@example.co.za');
});

test('handler: Zoho failure → 502 without detail', async () => {
  globalThis.fetch = (async () => Response.json({ data: [{ status: 'error', code: 'MANDATORY_NOT_FOUND' }] }, { status: 400 })) as typeof fetch;
  const r = await onRequestPost({ request: req(client), env });
  assert.equal(r.status, 502); assert.equal(JSON.stringify(await r.json()).includes('MANDATORY'), false);
});

function fakeDb(fail = false) {
  const rows: unknown[][] = [];
  const db = {
    prepare: (_q: string) => ({
      bind: (...values: unknown[]) => ({
        run: async () => {
          if (fail) throw new Error('D1 down');
          rows.push(values);
          return {};
        }
      })
    })
  };
  return { db, rows };
}

test('handler: stores in D1 when Zoho is not configured', async () => {
  const { db, rows } = fakeDb();
  const r = await onRequestPost({ request: req(client), env: { WAITLIST_DB: db } });
  assert.equal(r.status, 202);
  assert.equal(rows.length, 1);
  const [audience, first, last, email, company, description, synced] = rows[0];
  assert.deepEqual([audience, first, last, email, company, synced], ['client', 'Thandi', 'Mokoena', 'thandi@example.co.za', 'Acme', 0]);
  assert.match(String(description), /^FreeWork — waitlist-client — JOB: Fix checkout/);
});

test('handler: Zoho failure still succeeds when D1 stores, flagged unsynced', async () => {
  globalThis.fetch = (async () => Response.json({ data: [{ status: 'error' }] }, { status: 500 })) as typeof fetch;
  const { db, rows } = fakeDb();
  const r = await onRequestPost({ request: req(freelancer), env: { ...env, WAITLIST_DB: db } });
  assert.equal(r.status, 202);
  assert.equal(rows[0][6], 0);
});

test('handler: D1 failure still succeeds when Zoho syncs; both failing is 502', async () => {
  globalThis.fetch = (async (url: string) => url.includes('oauth')
    ? Response.json({ access_token: 'tok2', expires_in: 3600 })
    : Response.json({ data: [{ status: 'success' }] })) as typeof fetch;
  assert.equal((await onRequestPost({ request: req(client), env: { ...env, WAITLIST_DB: fakeDb(true).db } })).status, 202);
  assert.equal((await onRequestPost({ request: req(client), env: { WAITLIST_DB: fakeDb(true).db } })).status, 502);
});
