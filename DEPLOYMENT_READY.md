# Deployment Configuration

## Current Setup

This application is configured to show **ONLY the Not Found (404) page** when deployed.

### Configuration Details

1. **Routing** (`src/app/app.routes.ts`):
   - All routes (including home `/`) redirect to `/404`
   - The NotFoundComponent is loaded for the 404 route
   - Wildcard route catches all other paths and redirects to `/404`

2. **App Component** (`src/app/app.component.ts` & `src/app/app.component.html`):
   - Navigation bar and sidenav are hidden when on the 404 route
   - Only the router outlet is shown full-screen

3. **Security Configuration**:
   - **Content Security Policy** (`src/index.html`):
     - Added CSP meta tag to allow Angular scripts and external resources
     - Allows scripts from self, CDN (particles.js), and Cloudflare Insights
     - Allows styles from self and Google Fonts
     - Properly configured for production deployment
   
   - **HTTP Headers** (`public/_headers`):
     - Cloudflare-compatible headers file
     - Sets CSP headers at the server level
     - Includes security headers (X-Frame-Options, X-Content-Type-Options)

4. **GitHub Pages Deployment** (`.github/workflows/deploy.yml`):
   - Automatically builds and deploys on push to `main` branch
   - Creates `404.html` from `index.html` for SPA fallback
   - Deployed to GitHub Pages with proper configuration

### Deployment

The site deploys automatically via GitHub Actions when you push to the `main` branch.

**Manual Deployment:**
```bash
npm run build
# The built files are in dist/angular-app/browser/
```

### What Users Will See

When users visit the deployed site at any URL:
- They will see the animated 404 page with particles background
- No navigation, no other pages accessible
- Only the "Back to Homepage" button (which also leads back to 404)

### Security Fix Applied

Fixed Content Security Policy errors that were blocking scripts from loading:
- Added CSP meta tag in `index.html`
- Created `_headers` file for Cloudflare Pages
- Scripts now load properly from CDN and inline sources

---

**Status**: ✅ Deployment Ready - Configured for 404 Page Only with CSP Fixed
