# Freework Frontend

Angular 18 application for the Freework freelance marketplace platform.

## Overview

Freework connects freelancers with clients (customers). The frontend is a standalone Angular SPA with Angular Material UI, real-time messaging, payment flows, and a full admin panel.

**Tech stack:**

| Layer | Technology |
|-------|-----------|
| Framework | Angular 18.2.14 |
| Language | TypeScript 5.4.2 |
| UI Components | Angular Material 18.2.14 |
| HTTP | Angular HttpClient + token interceptor |
| Reactive | RxJS 7.8.0 |
| Testing | Karma 6.4.0 + Jasmine 5.1.0 |
| Styling | SCSS |
| Build | Angular CLI 18 / Vite |

## Documentation

| Document | Description |
|----------|-------------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Local dev setup, environment config, Angular CLI commands |
| [SPEC.md](./SPEC.md) | API contract, route map, data models, auth flow |
| [PRODUCTION_READY.md](./PRODUCTION_READY.md) | Security audit, CSP, production build checklist |

## Quick start

```bash
# Install dependencies
npm install

# Start dev server (connects to http://localhost:8080)
ng serve

# Open http://localhost:4200
```

See [GETTING_STARTED.md](./GETTING_STARTED.md) for full setup including environment configuration and backend connection.

## Application structure

```
src/app/
├── auth/           Login, register, email verification, guards, token interceptor
├── jobs/           Job listing, search, posting, detail view
├── payments/       PayFast + PayPal payment flows
├── subscription/   Subscription tier management
├── profile/        User profile, setup wizard, completion guard
├── messaging/      Direct messaging between users
├── reviews/        Review submission and display
├── settings/       Account settings
├── admin/          Admin panel (ADMIN role only)
├── legal/          Legal pages, cookie consent
└── shared/         Shared components, pipes, services
```

## Authentication

- JWT Bearer token stored in `localStorage`
- `token.interceptor.ts` attaches `Authorization: Bearer <token>` to all API requests (except `/auth/*`)
- `AuthGuard` protects authenticated routes
- `ProfileCompletionGuard` redirects to profile setup if profile is incomplete
- Automatic token refresh 1 minute before expiry

## Security

- Angular templates auto-escape all interpolated values (XSS protection)
- CSP configured in `public/_headers` for Cloudflare Pages deployment
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

See [PRODUCTION_READY.md](./PRODUCTION_READY.md) for the full security audit.

## Key routes

| Path | Auth | Description |
|------|------|-------------|
| `/jobs` | Public | Job listings |
| `/jobs/:id` | Public | Job detail |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/profile/setup` | Required | First-time profile setup |
| `/profile` | Required | View/edit profile |
| `/jobs/new` | Required + profile complete | Post a job |
| `/applications` | Required | My applications |
| `/messages` | Required | Direct messages |
| `/subscription` | Required | Manage subscription |
| `/admin` | ADMIN role | Admin panel |

## Environment configuration

| File | Environment | API URL |
|------|-------------|---------|
| `src/environments/environment.ts` | Development | `http://localhost:8080` |
| `src/environments/environment.prod.ts` | Production | `https://api.freework.co.za` |

## Build and deploy

```bash
npm run build                          # production build → dist/angular-app/browser/
ng build --configuration production    # equivalent

ng serve                               # dev server on :4200
ng test                                # unit tests
```

Deployment: Cloudflare Pages / Vercel. The `public/_headers` file sets security headers at the CDN level.
