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
| `develop` | dev (Vercel) | dev.freework.co.za |
| `staging` | staging (Vercel) | staging.freework.co.za |
| `main` | prod (GitHub Pages) | freework.co.za |

Do not commit directly to `main` or `staging`.

## Deployment

`.github/workflows/deploy.yml` handles all three environments:
- **CI** (lint + build) runs on every push and PR to the three protected branches
- **`main`** → GitHub Pages (`gh-pages` branch) → freework.co.za
- **`staging`** → Vercel → staging.freework.co.za
- **`develop`** → Vercel → dev.freework.co.za

Vercel is also configured via `vercel.json`; output dir is `dist/angular-app/browser/`.
Set `ANGULAR_CONFIGURATION` env var in Vercel per environment (production / staging).
