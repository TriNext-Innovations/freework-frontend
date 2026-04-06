# Production Ready — Freework Frontend

Security audit and production readiness checklist for the Freework Angular 18 application.
**Audit date:** 2026-04-06 | **Release:** 1.0

---

## Security Audit

### CSRF

**Status: N/A — CORRECTLY HANDLED**

The frontend uses `HttpClient` with Bearer token headers (`Authorization: Bearer <token>`). CSRF protection does not apply here because:

- Authentication is via `Authorization` header, not cookies.
- The backend is stateless (no session cookies).
- CSRF attacks require cookie-based session state — which this app does not use.

Angular's `HttpClientXsrfModule` is intentionally not needed.

---

### Content Security Policy (CSP)

**Status: CONFIGURED — REVIEW UNSAFE DIRECTIVES**

CSP is set in `public/_headers` (Cloudflare Pages deployment):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://ai-chatbot-backend-production-d810.up.railway.app;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.freework.co.za wss://api.freework.co.za https://cloudflareinsights.com https://ai-chatbot-backend-production-d810.up.railway.app;
```

| Check | Status | Notes |
|-------|--------|-------|
| CSP present | ✅ Active | Via Cloudflare `_headers` file |
| `X-Frame-Options` | ✅ `SAMEORIGIN` | Clickjacking protection |
| `X-Content-Type-Options` | ✅ `nosniff` | MIME sniffing protection |
| `Referrer-Policy` | ✅ `strict-origin-when-cross-origin` | Referrer leakage protection |
| `unsafe-inline` in script-src | ⚠️ Present | Weakens CSP; needed for Angular inline scripts |
| `unsafe-eval` in script-src | ⚠️ Present | Required by some Angular dependencies |
| Third-party chatbot script | ⚠️ External | `up.railway.app` domain — third-party risk |

**Action items:**
- [ ] Evaluate whether `unsafe-eval` can be removed (check bundle carefully)
- [ ] Audit the third-party chatbot script from `ai-chatbot-backend-production-d810.up.railway.app` — it has full script access to your page
- [ ] Consider a nonce-based CSP for Angular to eliminate `unsafe-inline`
- [ ] Add `Permissions-Policy` header to restrict browser features

---

### Token Storage

**Status: localStorage — DOCUMENTED RISK**

JWT access and refresh tokens are stored in `localStorage`:
- `freework_access_token`
- `freework_refresh_token`

**Risk:** `localStorage` is accessible to JavaScript, making tokens vulnerable if XSS is achieved.

**Mitigating factors:**
- Angular's template engine auto-escapes HTML (XSS-resistant by default)
- CSP is configured to restrict script sources
- This is the industry standard pattern for SPAs without server-side rendering

**Action items (post-1.0 backlog):**
- [ ] Evaluate migration to `HttpOnly` cookie storage for tokens (requires backend changes)
- [ ] Ensure all user-generated content rendered in templates uses Angular's safe binding (no `[innerHTML]` with untrusted data)

---

### Console Logging in Production

**Status: NEEDS ATTENTION**

`auth.service.ts` contains extensive `console.log` statements including:
- Token presence/absence (lines 117–118, 451)
- User data and roles (lines 92–94, 419–420, 448)
- Decoded token payload (line 531)

This exposes sensitive auth flow details in the browser console in production.

**Action items:**
- [ ] Remove all `console.log`, `console.error` debug statements from `auth.service.ts` before production release
- [ ] Keep `console.error` only for genuine error states, not debug flow

---

### Mock Authentication Code

**Status: NEEDS CLEANUP**

`auth.service.ts` contains mock authentication bypassing real JWT validation:
- `private useMockData = false;` (line 17)
- `private mockUsers: User[]` (lines 26–44)
- `private mockLogin()` method

While `useMockData = false` means mocks are inactive, the code ships in the production bundle and represents unnecessary risk surface.

**Action items:**
- [ ] Remove `useMockData`, `mockUsers`, and `mockLogin()` before 1.0 release
- [ ] Use environment-specific service mocking via Angular's DI instead if needed for testing

---

### Route Protection

**Status: CORRECTLY IMPLEMENTED**

| Guard | Routes Protected | Status |
|-------|-----------------|--------|
| `AuthGuard` | All authenticated routes | ✅ Active |
| `ProfileCompletionGuard` | Job posting, applications, etc. | ✅ Active |

Route guards check `AuthService.isLoggedIn()` and `isAuthenticated` (validates token expiry client-side).

---

### Token Interceptor

**Status: CORRECT**

`token.interceptor.ts` correctly:
- Skips auth header for `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/refresh`
- Attaches `Authorization: Bearer <token>` to all other requests
- Handles 401 by attempting token refresh, then logging out on failure

---

### XSS Protection

**Status: PROTECTED BY ANGULAR**

Angular's template engine auto-escapes all interpolated values. No direct DOM manipulation or `innerHTML` usage was observed in the security-critical paths.

---

## Production Build Checklist

### Pre-build

- [ ] `useMockData = false` confirmed in all services (`auth.service.ts`, `profile.service.ts`, `job.service.ts`)
- [ ] Remove debug `console.log` statements from `auth.service.ts`
- [ ] Remove mock authentication code from `auth.service.ts`
- [ ] Verify `src/environments/environment.prod.ts` points to `https://api.freework.co.za`
- [ ] Verify `public/_headers` CSP allows production API domain
- [ ] Audit third-party chatbot script inclusion in `index.html`

### Build

```bash
npm run build              # production build
# or
ng build --configuration production
```

Output: `dist/angular-app/browser/`

### Environment configuration

| File | Used by | API URL |
|------|---------|---------|
| `src/environments/environment.ts` | `ng serve` (dev) | `http://localhost:8080` |
| `src/environments/environment.prod.ts` | `ng build` (prod) | `https://api.freework.co.za` |

### Deployment (Cloudflare Pages / Vercel)

- `public/_headers` contains security headers for Cloudflare Pages deployment
- Ensure `_headers` is in the build output (`dist/`)
- SPA routing: configure the host to serve `index.html` for all 404s

### Post-deploy verification

- [ ] Login flow works end-to-end
- [ ] Token refresh works (login, wait for near-expiry, verify token refresh)
- [ ] CSP headers present in network tab (check browser DevTools)
- [ ] No `console.log` output in browser console for auth flows
- [ ] Profile completion guard redirects incomplete profiles to `/profile/setup`
- [ ] Protected routes require authentication

---

## Known Gaps (Post 1.0 Backlog)

| Gap | Priority | Notes |
|-----|----------|-------|
| Debug console.log in production build | High | Remove before release |
| Mock auth code in production bundle | High | Remove before release |
| Token storage in localStorage | Medium | Industry standard but XSS risk |
| `unsafe-inline` / `unsafe-eval` in CSP | Medium | Required by Angular build currently |
| Third-party chatbot script risk | Medium | Audit or remove |
| No `Permissions-Policy` header | Low | Browser feature restrictions |
| No `HSTS` header (frontend side) | Low | Backend/CDN responsibility |
