/**
 * Cloudflare Pages Function: POST /api/waitlist
 *
 * Records a waitlist sign-up as a Zoho CRM lead while the Spring API is not deployed.
 * Leads follow the CRM convention in freework-operations/sales/OUTREACH_PLAYBOOK.md:
 * the Description starts with "FreeWork — waitlist-client —" or "FreeWork — waitlist-freelancer —".
 *
 * Required env vars (Pages project → Settings → Variables and Secrets, never committed):
 *   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN  — a Zoho self-client with scope ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.UPDATE
 * Optional:
 *   ZOHO_ACCOUNTS_URL          — default https://accounts.zoho.com (use your data centre's accounts domain)
 *   WAITLIST_ALLOWED_ORIGINS   — comma-separated; default https://freework.co.za,https://www.freework.co.za
 */

export const BUDGETS = ['Under R5,000', 'R5,000 – R20,000', 'R20,000 – R50,000', 'R50,000+'];
export const STARTS = ['As soon as possible', 'Within a month', 'In 1–3 months', 'Just exploring'];

const MAX_BODY_BYTES = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB_PATTERN = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/;

export interface ZohoLead {
  Last_Name: string;
  First_Name?: string;
  Email: string;
  Company: string;
  Description: string;
}

type Validation = { ok: true; lead: ZohoLead } | { ok: false; error: string } | { ok: 'bot' };

function text(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

/** Validates the raw request body and builds the Zoho lead. Never trusts the client. */
export function toLead(body: unknown, now: Date = new Date()): Validation {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Invalid request' };
  const b = body as Record<string, unknown>;

  // Honeypot: accept silently so bots get no signal
  if (typeof b['website'] === 'string' && b['website'].trim() !== '') return { ok: 'bot' };

  const audience = b['audience'];
  if (audience !== 'client' && audience !== 'freelancer') return { ok: false, error: 'Invalid audience' };
  if (b['consent'] !== true) return { ok: false, error: 'Consent is required' };

  const name = text(b['name'], 120);
  const email = text(b['email'], 200);
  if (!name) return { ok: false, error: 'Name is required' };
  if (!email || !EMAIL_PATTERN.test(email)) return { ok: false, error: 'A valid email is required' };

  const [first, ...rest] = name.split(/\s+/);
  const names = rest.length > 0 ? { First_Name: first, Last_Name: rest.join(' ') } : { Last_Name: first };
  const consentAt = `consent ${now.toISOString()}`;

  if (audience === 'client') {
    const company = text(b['company'], 120);
    const need = text(b['need'], 1000);
    const budget = b['budget'];
    const start = b['start'];
    if (company === null) return { ok: false, error: 'Company is too long' };
    if (!need) return { ok: false, error: 'Describe what you need' };
    if (typeof budget !== 'string' || !BUDGETS.includes(budget)) return { ok: false, error: 'Invalid budget' };
    if (typeof start !== 'string' || !STARTS.includes(start)) return { ok: false, error: 'Invalid start' };
    return {
      ok: true,
      lead: {
        ...names,
        Email: email,
        Company: company || `${name} (individual)`,
        Description: `FreeWork — waitlist-client — JOB: ${need} · budget ${budget} · start ${start} · ${consentAt}`
      }
    };
  }

  const stack = text(b['stack'], 200);
  const github = text(b['github'], 200);
  if (!stack) return { ok: false, error: 'Stack is required' };
  if (github === null || (github !== '' && !GITHUB_PATTERN.test(github))) return { ok: false, error: 'Invalid GitHub link' };
  return {
    ok: true,
    lead: {
      ...names,
      Email: email,
      Company: 'Freelancer',
      Description: `FreeWork — waitlist-freelancer — stack: ${stack}${github ? ` · GitHub: ${github}` : ''} · ${consentAt}`
    }
  };
}

// Access tokens live an hour; reuse one across invocations on a warm instance.
export interface Env {
  ZOHO_CLIENT_ID?: string;
  ZOHO_CLIENT_SECRET?: string;
  ZOHO_REFRESH_TOKEN?: string;
  ZOHO_ACCOUNTS_URL?: string;
  WAITLIST_ALLOWED_ORIGINS?: string;
}

/** The subset of Cloudflare's EventContext this function uses. */
interface PagesContext {
  request: Request;
  env: Env;
}

let cachedToken: { value: string; apiDomain: string; expiresAt: number } | null = null;

async function zohoToken(env: Env): Promise<{ value: string; apiDomain: string }> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken;

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = env;
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) throw new Error('Zoho credentials not configured');

  const accounts = env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token'
  });
  const res = await fetch(`${accounts}/oauth/v2/token`, { method: 'POST', body: params });
  const json = (await res.json()) as { access_token?: string; api_domain?: string; expires_in?: number; error?: string };
  if (!res.ok || !json.access_token) throw new Error(`Zoho token refresh failed: ${json.error ?? res.status}`);

  cachedToken = {
    value: json.access_token,
    apiDomain: json.api_domain || 'https://www.zohoapis.com',
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000
  };
  return cachedToken;
}

async function upsertLead(lead: ZohoLead, env: Env): Promise<void> {
  const token = await zohoToken(env);
  const res = await fetch(`${token.apiDomain}/crm/v8/Leads/upsert`, {
    method: 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${token.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [lead], duplicate_check_fields: ['Email'], trigger: [] })
  });
  const json = (await res.json().catch(() => ({}))) as { data?: { status?: string; code?: string }[] };
  const result = json.data?.[0];
  if (!res.ok || result?.status !== 'success') {
    throw new Error(`Zoho lead upsert failed: ${res.status} ${result?.code ?? ''}`);
  }
}

function reply(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

function originAllowed(origin: string | null, env: Env): boolean {
  // Same-origin form posts from browsers always send Origin; requests without one are not browsers we serve.
  if (!origin) return false;
  const allowed = (env.WAITLIST_ALLOWED_ORIGINS || 'https://freework.co.za,https://www.freework.co.za')
    .split(',')
    .map(o => o.trim());
  return allowed.includes(origin);
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!originAllowed(request.headers.get('origin'), env)) return reply(403, { ok: false, error: 'Forbidden' });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'Request too large' });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, error: 'Invalid JSON' });
  }

  const result = toLead(body);
  if (result.ok === 'bot') return reply(202, { ok: true });
  if (!result.ok) return reply(400, { ok: false, error: result.error });

  try {
    await upsertLead(result.lead, env);
  } catch (err) {
    // Visible in the Pages function logs; never echo upstream detail to the client
    console.error('waitlist: lead not recorded', err instanceof Error ? err.message : err);
    return reply(502, { ok: false, error: 'Could not record your sign-up' });
  }
  return reply(202, { ok: true });
}
