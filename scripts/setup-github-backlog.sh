#!/usr/bin/env bash
#
# setup-github-backlog.sh  (freework-frontend)
# -----------------------------------------------------------------------------
# Creates the SINGLE "FreeWork Frontend Roadmap" backlog in GitHub:
#   1. Priority / Area / Phase labels
#   2. All roadmap issues, each labelled
#   3. One GitHub Project (v2) board, with every issue added
#
# One board. No sprawl. Filter the board by label for any slice.
#
# PREREQUISITES (one-time):
#   - GitHub CLI:                 https://cli.github.com
#   - Auth with project scope:    gh auth login -s project,repo   (or: gh auth refresh -s project,repo)
#
# USAGE (run from anywhere):
#   bash scripts/setup-github-backlog.sh
#
# Re-running creates DUPLICATE issues. Run once. (Label creation is idempotent.)
# -----------------------------------------------------------------------------
set -euo pipefail

OWNER="TriNext-Innovations"
REPO="TriNext-Innovations/freework-frontend"
PROJECT_TITLE="FreeWork Frontend Roadmap"

command -v gh >/dev/null 2>&1 || { echo "ERROR: GitHub CLI (gh) not installed. See https://cli.github.com"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "ERROR: Not authenticated. Run: gh auth login -s project,repo"; exit 1; }

echo "==> Creating labels (skips existing)…"
mklabel () { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" 2>/dev/null \
  && echo "    + $1" || echo "    = $1 (exists)"; }

mklabel "priority:need-to-have" "B00020" "Required to launch safely / compete"
mklabel "priority:nice-to-have" "B26A00" "Strengthens UX soon after launch"
mklabel "priority:have-if-time" "2E7D32" "Upside / later"
mklabel "area:frontend"   "2E75B6" "Angular app code / UX"
mklabel "area:testing"    "0E8A16" "Unit / E2E tests"
mklabel "area:devops"     "5319E7" "Build / deploy / CI"
mklabel "area:security"   "B00020" "Security / CSP / headers"
mklabel "area:compliance" "6F42C1" "POPIA / legal UX"
mklabel "area:marketing"  "D93F0B" "Growth / chatbot / analytics"
mklabel "area:docs"       "555555" "Docs / repo hygiene"
mklabel "phase:0-blocker"   "D73A4A" "Do before launch"
mklabel "phase:1-hardening" "FBCA04" "Launch week +/-"
mklabel "phase:later"       "C5DEF5" "Post-launch / future"

echo "==> Creating issues…"
CREATED_URLS=()
mkissue () {
  local title="$1" labels="$2" body="$3" url
  url=$(gh issue create --repo "$REPO" --title "$title" --label "$labels" --body "$body")
  echo "    + $title"
  CREATED_URLS+=("$url")
}

# ---------------- PHASE 0 — BLOCKERS ----------------
mkissue "Wire real backend services; remove/guard mock-service fallbacks before prod" \
  "priority:need-to-have,area:frontend,phase:0-blocker" \
  "job.service, application.service, messaging.service, payment.service and review.service all inject Mock*Service. Ensure prod builds call the real backend and that mock data can never leak into production. **Acceptance:** prod uses live API; mocks compiled out or behind a dev-only flag."

mkissue "Fix API base URL config (dev vs prod /api mismatch)" \
  "priority:need-to-have,area:frontend,phase:0-blocker" \
  "environment.ts dev apiUrl is http://localhost:8080 (no /api) while environment.prod.ts is https://api.freework.co.za/api. This mismatch breaks integration. Centralise the base URL and make paths consistent. **Acceptance:** one source of truth; all services resolve the same way in dev and prod."

mkissue "Align auth refresh flow with backend /auth/refresh" \
  "priority:need-to-have,area:frontend,phase:0-blocker" \
  "token.interceptor already calls authService.refreshToken() on 401, but the backend currently lacks /auth/refresh. Coordinate with the backend refresh+revocation work so logout and token expiry behave correctly. **Acceptance:** 401 -> refresh -> retry works against the real backend; clean logout."

mkissue "Lock the deploy workflow to the main branch only" \
  "priority:need-to-have,area:devops,phase:0-blocker" \
  ".github/workflows/deploy.yml triggers on main AND feature branches (feature/api-live-test, feature/404-not-found), publishing to the live freework.co.za domain. Restrict production deploys to main; use previews for branches. **Acceptance:** only main deploys to production."

mkissue "Reconcile and clean repo docs + hygiene" \
  "priority:need-to-have,area:docs,phase:0-blocker" \
  "DEPLOYMENT_READY.md describes a '404-only' placeholder that no longer matches the live routes; several root markdown files are 0 bytes; .DS_Store is committed. Update/remove stale docs, delete empty files, add .DS_Store to .gitignore. **Acceptance:** docs match reality; no junk tracked."

mkissue "Align payment UI with backend providers (PayFast/PayPal vs Stripe)" \
  "priority:need-to-have,area:frontend,phase:0-blocker" \
  "There is a stripe-payment component, but the backend implements PayFast (ZAR) + PayPal. Implement the correct provider UI and remove or gate the unused one. **Acceptance:** checkout uses the live provider(s); no dead Stripe path."

# ---------------- PHASE 1 — HARDENING ----------------
mkissue "Establish real test coverage (auth, payments, core services) + CI gate" \
  "priority:need-to-have,area:testing,phase:1-hardening" \
  "Only 1 .spec.ts exists across 42 components. Add meaningful unit tests for auth.service/guard/token.interceptor, payment + escrow flows, and core data services; run karma coverage in CI with a threshold. **Acceptance:** coverage gate enforced; critical paths tested."

mkissue "Add frontend error tracking (Sentry browser SDK)" \
  "priority:need-to-have,area:frontend,phase:1-hardening" \
  "No client-side error visibility. Add Sentry (or equivalent) with release + source maps. **Acceptance:** runtime errors reported with stack traces."

mkissue "Security headers / CSP review" \
  "priority:need-to-have,area:security,phase:1-hardening" \
  "Tighten the CSP (index.html meta + Cloudflare public/_headers) to only required origins, including api.freework.co.za and the WebSocket (wss) origin. **Acceptance:** CSP passes with no console violations; no wildcard sources."

mkissue "Verify POPIA UX wired end-to-end" \
  "priority:need-to-have,area:compliance,phase:1-hardening" \
  "Legal components exist (cookie-consent-banner, popia-request, reconsent, unsubscribe, delete-account, popia-admin). Confirm each is reachable, functional, and backed by an API. **Acceptance:** a user can consent, request data, withdraw, and delete their account."

mkissue "Loading / empty / error states across all flows" \
  "priority:nice-to-have,area:frontend,phase:1-hardening" \
  "Add consistent loading skeletons, empty states, and error handling for jobs, messaging, payments, profile and reviews. **Acceptance:** no blank screens on slow/failed requests."

mkissue "Performance: lazy-load routes, bundle budgets, review particles.js" \
  "priority:nice-to-have,area:frontend,phase:1-hardening" \
  "Lazy-load feature routes, set Angular bundle budgets, and assess the cost of particles.js. **Acceptance:** fast first load on mobile; budgets enforced in CI."

mkissue "Accessibility audit (WCAG AA basics)" \
  "priority:nice-to-have,area:frontend,phase:1-hardening" \
  "Audit colour contrast, focus order, labels and keyboard nav (Angular Material helps). **Acceptance:** core flows pass an automated a11y check."

mkissue "E2E tests for the core loop (Playwright)" \
  "priority:nice-to-have,area:testing,phase:1-hardening" \
  "Cover register -> verify -> post/apply -> message -> pay -> review against a staging backend. **Acceptance:** green E2E run in CI."

# ---------------- LATER ----------------
mkissue "Integrate the marketing chatbot (Zoho SalesIQ / Zobot)" \
  "priority:nice-to-have,area:marketing,phase:later" \
  "An empty chatbotApiKey already exists in environment config. Embed the SalesIQ/Zobot widget and wire onboarding/help flows. **Acceptance:** bot live on the site; leads flow to CRM via Zoho Flow."

mkissue "SEO / meta / Open Graph for public job & profile pages" \
  "priority:nice-to-have,area:frontend,phase:later" \
  "Add titles, meta descriptions and OG tags; ensure public pages are crawlable for organic acquisition. **Acceptance:** rich previews + indexable public pages."

mkissue "Privacy-friendly analytics + funnel events to Zoho" \
  "priority:nice-to-have,area:marketing,phase:later" \
  "Track signup/post/apply/hire funnel events (POPIA-compliant) and feed Zoho journeys. **Acceptance:** funnel visible; events trigger lifecycle automation."

mkissue "PWA / offline support" \
  "priority:have-if-time,area:frontend,phase:later" \
  "Add a service worker + installable PWA for mobile reach. **Acceptance:** installable; core pages work offline."

mkissue "i18n scaffolding for pan-African expansion" \
  "priority:have-if-time,area:frontend,phase:later" \
  "Externalise strings and add locale support ahead of multi-market growth. **Acceptance:** at least one additional locale buildable."

mkissue "Storybook component library + visual regression" \
  "priority:have-if-time,area:frontend,phase:later" \
  "Document shared components and add visual regression tests. **Acceptance:** Storybook published; snapshots gating UI changes."

echo "==> Creating the single Project board: \"$PROJECT_TITLE\"…"
if gh project create --owner "$OWNER" --title "$PROJECT_TITLE" >/dev/null 2>&1; then
  PROJ_NUM=$(gh project list --owner "$OWNER" --format json --jq ".projects[] | select(.title==\"$PROJECT_TITLE\") | .number" | head -n1)
  echo "    Project #$PROJ_NUM created. Adding ${#CREATED_URLS[@]} issues…"
  for u in "${CREATED_URLS[@]}"; do
    gh project item-add "$PROJ_NUM" --owner "$OWNER" --url "$u" >/dev/null 2>&1 && echo "    + added $u" || echo "    ! could not add $u"
  done
  echo ""; echo "DONE. Open the board and group/filter by label (Priority / Area / Phase)."
else
  echo ""; echo "NOTE: Could not auto-create the Project (likely missing 'project' scope)."
  echo "Run: gh auth refresh -s project   then create it manually and 'Add items' filtered by label."
  echo "All issues were created and labelled, ready to add."
fi
