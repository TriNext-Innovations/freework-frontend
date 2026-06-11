# FreeWork Frontend — Roadmap & Backlog

Single source of truth for the **freework-frontend** (Angular 20) roadmap.
Mirrored into **one** GitHub Project board ("FreeWork Frontend Roadmap") by
`scripts/setup-github-backlog.sh`. One board — filter/group by **Priority**,
**Area** and **Phase** labels.

> Context from review: Angular 20.3, Angular Material, hosted on GitHub Pages
> behind Cloudflare (`freework.co.za`). `tsconfig` is strict (good). Gaps below
> are grounded in the actual code on the `feature/ui-max` branch.

---

## Phase 0 — Blockers (before launch)

| # | Item | Area | Priority |
|---|------|------|----------|
| 1 | Wire real backend services; remove/guard `Mock*Service` fallbacks in prod | Frontend | Need-to-have |
| 2 | Fix API base URL config (dev `localhost:8080` vs prod `/api` mismatch) | Frontend | Need-to-have |
| 3 | Align auth refresh flow with backend `/auth/refresh` | Frontend | Need-to-have |
| 4 | Lock deploy workflow to `main` only (currently deploys feature branches live) | DevOps | Need-to-have |
| 5 | Reconcile/clean docs (stale `DEPLOYMENT_READY.md`, empty `.md` files, `.DS_Store`) | Docs | Need-to-have |
| 6 | Align payment UI with backend providers (PayFast/PayPal vs Stripe component) | Frontend | Need-to-have |

## Phase 1 — Hardening (launch week ±)

| # | Item | Area | Priority |
|---|------|------|----------|
| 7 | Real test coverage (auth, payments, core services) + CI coverage gate — *only 1 spec today* | Testing | Need-to-have |
| 8 | Frontend error tracking (Sentry browser SDK) | Frontend | Need-to-have |
| 9 | Security headers / CSP review (lock to api + wss origins) | Security | Need-to-have |
| 10 | Verify POPIA UX wired end-to-end (consent, request, reconsent, unsubscribe, delete) | Compliance | Need-to-have |
| 11 | Loading / empty / error states across all flows | Frontend | Nice-to-have |
| 12 | Performance: lazy-load routes, bundle budgets, review particles.js | Frontend | Nice-to-have |
| 13 | Accessibility audit (WCAG AA basics) | Frontend | Nice-to-have |
| 14 | E2E tests for the core loop (Playwright) | Testing | Nice-to-have |

## Later — Growth & upside

| # | Item | Area | Priority |
|---|------|------|----------|
| 15 | Integrate marketing chatbot (Zoho SalesIQ/Zobot) via existing `chatbotApiKey` | Marketing | Nice-to-have |
| 16 | SEO / meta / Open Graph for public job & profile pages | Frontend | Nice-to-have |
| 17 | Privacy-friendly analytics + funnel events to Zoho | Marketing | Nice-to-have |
| 18 | PWA / offline support | Frontend | Have-if-time |
| 19 | i18n scaffolding for pan-African expansion | Frontend | Have-if-time |
| 20 | Storybook component library + visual regression | Frontend | Have-if-time |
| 21 | Design rollout: apply "The Weave" style across all pages (see `docs/DESIGN-ROLLOUT.md`; jobs page = reference impl) | Frontend | Nice-to-have |

---

### Load into GitHub (one board)

```bash
gh auth login -s project,repo      # one-time
bash scripts/setup-github-backlog.sh
```
