# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Angular 20.3, TypeScript 5.8 (strict), SCSS, Angular Material 20 + CDK, RxJS, Karma/Jasmine.

## Commands

```bash
npm start                                        # dev server → http://localhost:4200
npm test                                         # Karma/Jasmine unit tests (headless Chrome)
npm run lint                                     # ESLint (errors block; warnings = migration backlog)
npm run build                                    # dev build
npm run build -- --configuration production      # production build → dist/angular-app/browser/
npm run build -- --configuration staging         # staging build (api-staging.freework.co.za)
```

## Architecture

- Lazy-loaded feature modules: `auth`, `jobs`, `messaging`, `profile`, `reviews`, `payments`, `settings`, `subscription`, `admin`, `legal`, `shared`
- Routes: `src/app/app.routes.ts`
- API URL: `src/environments/environment.ts` → `src/app/api.config.ts` (use `buildApiEndpointUrl()` for all `/api/*` calls)
- WebSocket URL: derived from `API_BASE_URL` (http → ws) in `api.config.ts`
- Auth guards: `authGuard`, `guestGuard`, `roleGuard(['CUSTOMER'|'FREELANCER'|'ADMIN'])`
- JWT stored in localStorage; BroadcastChannel for cross-tab sync

## Code style

- Inline SCSS per component (no global style sheets for component concerns)
- Strict TypeScript — no `any`, no implicit `any`
- Use Angular Material components before rolling custom UI
- Use Angular 20 built-in control flow (`@if`, `@for`, `@switch`) — not `*ngIf` / `*ngFor`
- Follow existing lazy-loading pattern when adding feature modules

## Environment files

| File | Used for | API target |
|------|----------|-----------|
| `src/environments/environment.ts` | local dev | `http://localhost:8080` |
| `src/environments/environment.staging.ts` | staging build | `https://api-staging.freework.co.za` |
| `src/environments/environment.prod.ts` | production build | `https://api.freework.co.za` |

`apiUrl` must never include `/api` — the prefix is added by `buildApiEndpointUrl()` in `api.config.ts`.
The backend has two conventions: `/auth` and `/jobs` have no `/api` prefix (use `buildApiUrl`);
all other authenticated endpoints are under `/api/*` (use `buildApiEndpointUrl`).

## Branch model

| Branch | Deploys to | URL |
|--------|-----------|-----|
| `feature/*` | — (CI only) | — |
| `develop` | — (CI only; dev is local) | — |
| `staging` | staging — **Cloudflare Pages** | staging.freework.co.za |
| `main` | — (CI only for now) | freework.co.za (prod, deferred) |

## Deployment

`.github/workflows/deploy.yml`:
- **CI** (lint + build, Node 24) runs on every push/PR
- **`staging`** → **Cloudflare Pages** project `freework-frontend-staging` via
  `wrangler-action` → staging.freework.co.za (talks to `api-staging.freework.co.za`)
- **`main`** → CI only. Prod frontend is deferred until the prod backend
  (`api.freework.co.za`) exists; then add a Cloudflare Pages prod deploy.

Cloudflare Pages specifics:
- **Direct Upload only — do NOT connect the Pages project's Git integration.**
  We build in GitHub Actions (Node 24) and `wrangler pages deploy` the prebuilt
  `dist/angular-app/browser`. CF's native Git-integration build is redundant and,
  with no `.node-version`/`.nvmrc` in the repo, runs on CF's default (old) Node,
  which Angular 20 + the npm 11 lockfile reject — so it fails on every branch and
  posts a permanently-red **`Cloudflare Pages`** check (distinct from the green
  GHA **`Deploy → Staging`** check). If you ever see that red check return, someone
  re-connected the Git integration in the dashboard — disconnect it, don't "fix" it.
- Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` live in the `staging`
  GitHub environment. The Pages project auto-creates on first deploy.
- `public/_redirects` (`/* /index.html 200`) gives SPA deep-link routing — do NOT
  add a `404.html` back (it intercepts routes on Cloudflare and breaks deep links).
- `public/_headers` sets the CSP; `connect-src` must list every API origin the build
  talks to (currently both `api.freework.co.za` and `api-staging.freework.co.za`).
- CI runs **Node 24** to match the npm 11 lockfile; Node 20 (npm 10) rejects it.
