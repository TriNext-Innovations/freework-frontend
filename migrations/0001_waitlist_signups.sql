-- D1 database freework-waitlist, bound to the Pages project as WAITLIST_DB.
-- Applied 2026-09-26 with: npx wrangler d1 execute freework-waitlist --remote --file <this file>
CREATE TABLE IF NOT EXISTS signups (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  audience    TEXT    NOT NULL CHECK (audience IN ('client', 'freelancer')),
  first_name  TEXT,
  last_name   TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  company     TEXT    NOT NULL,
  description TEXT    NOT NULL,
  -- 1 once the row exists as a Zoho CRM lead; rows at 0 still need syncing
  zoho_synced INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups (created_at);
CREATE INDEX IF NOT EXISTS idx_signups_zoho_synced ON signups (zoho_synced);
