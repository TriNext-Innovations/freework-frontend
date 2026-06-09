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
- Follow existing lazy-loading pattern when adding feature modules

## Environment files

- `src/environments/environment.ts` — dev (`apiUrl: 'http://localhost:8080'`)
- `src/environments/environment.prod.ts` — prod (`apiUrl: 'https://api.freework.co.za'`)

## Active branch

Development happens on `feature/ui-max`. Do not commit directly to `main` — GitHub Actions deploys to GitHub Pages from that branch.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages (`gh-pages` branch) on push to `main` and feature branches. Vercel is also configured (`vercel.json`) as an alternative host — output dir is `dist/angular-app/browser/`.
