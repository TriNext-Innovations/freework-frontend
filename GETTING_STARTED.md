# Getting Started — Freework Frontend

Local development setup for the Freework Angular 18 application.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Angular CLI | 18 (`npm install -g @angular/cli`) |
| Freework Backend | Running on `localhost:8080` |

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure environment

The frontend connects to the backend via `src/environments/`:

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.freework.co.za'
};
```

For local dev, the backend should be running on `http://localhost:8080` with the `dev` profile.

---

## 3. Start the dev server

```bash
ng serve
# or
npm start
```

Open `http://localhost:4200`. The app will hot-reload on file changes.

---

## 4. Mock data vs real backend

Services have a `useMockData` flag. For development against the real backend, confirm it is set to `false`:

- `src/app/auth/auth.service.ts` — `useMockData = false`
- `src/app/profile/profile.service.ts` — `useMockData = false`
- `src/app/jobs/job.service.ts` — `useMockData = false`

---

## 5. Dev accounts (backend `dev` profile)

| Email | Password | Role |
|-------|----------|------|
| `customer@example.com` | `password` | CUSTOMER |
| `freelancer@example.com` | `password` | FREELANCER |
| `admin@example.com` | `password` | ADMIN |

---

## 6. Run tests

```bash
ng test               # unit tests (Karma + Jasmine, watch mode)
ng test --no-watch    # single run
```

---

## 7. Build for production

```bash
ng build --configuration production
# or
npm run build
```

Output: `dist/angular-app/browser/`

---

## Project structure

```
src/
├── app/
│   ├── auth/           Login, register, email verify, guards, token interceptor
│   ├── jobs/           Job listing, search, posting, detail
│   ├── payments/       PayFast + PayPal payment flows
│   ├── subscription/   Subscription tier management
│   ├── profile/        Profile view, setup wizard, completion guard
│   ├── messaging/      Direct messaging
│   ├── reviews/        Review submission + display
│   ├── settings/       Account settings
│   ├── admin/          Admin panel (ADMIN role)
│   ├── legal/          Legal pages, cookie consent
│   ├── shared/         Shared components, pipes, services
│   ├── app.routes.ts   Route definitions
│   ├── app.config.ts   App bootstrap config
│   └── api.config.ts   API URL helpers
├── environments/       environment.ts + environment.prod.ts
└── index.html          App shell (CSP meta tag, fonts)
```

---

## Authentication flow

1. User submits login form → `AuthService.login()`
2. Token stored in `localStorage` (`freework_access_token`)
3. `token.interceptor.ts` attaches `Authorization: Bearer <token>` to all subsequent requests
4. `AuthGuard` checks `AuthService.isLoggedIn()` on every protected route
5. `ProfileCompletionGuard` redirects to `/profile/setup` if `profileCompleted === false`
6. Token refresh runs automatically 1 minute before expiry

---

## Common issues

| Problem | Fix |
|---------|-----|
| `CORS error` in browser | Backend `APP_CORS_ALLOWED_ORIGINS` must include `http://localhost:4200` (dev profile handles this automatically) |
| `401 Unauthorized` on all requests | Check that a valid token exists in `localStorage` under `freework_access_token` |
| Profile redirect loop | Ensure the backend `GET /api/profile` response includes `profileCompleted: true` |
| `ng: command not found` | `npm install -g @angular/cli` |
| Build fails with module errors | `rm -rf node_modules && npm install` |

---

## Useful CLI commands

```bash
ng generate component shared/my-component   # generate component
ng generate service jobs/my-service         # generate service
ng build --stats-json                       # bundle analysis
npx ngx-bundle-analyzer dist/angular-app/browser/stats.json  # visualize bundle
```

---

## Deployment

Deploys to Cloudflare Pages / Vercel from the `main` branch via GitHub Actions.

Security headers are applied at CDN level via `public/_headers`:
- `Content-Security-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

See [PRODUCTION_READY.md](./PRODUCTION_READY.md) for the full security audit and production checklist.
