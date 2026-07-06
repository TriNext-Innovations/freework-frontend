# Design rollout — apply "The Weave" across all pages

> **STATUS: PARKED — post-golive.** Backlog item #21 in `docs/BACKLOG.md`.
> Do not start this work before launch. The jobs page already implements the
> design and ships as-is; this doc is the spec for extending it later.

Task for the implementing agent: restyle every user-facing page to match the design
language defined in `CLAUDE.md` ("Design language" section). The **jobs page is the
canonical reference** — open `src/app/jobs/job-list/job-list.component.{html,scss,ts}`
and study it before touching anything else.

## Ground rules

1. **Visual changes only.** Do not change component logic, services, routing, guards,
   or API calls. Adding small presentational helpers to a component (a getter, a label
   map) is fine; changing behavior is not.
2. **Keep the modern syntax.** All templates use `@if`/`@for` (never `*ngIf`/`*ngFor`);
   all DI uses `inject()` (never constructor params). Lint enforces this.
3. **Theme tokens only.** Use the `--color-*`, `--spacing-*`, `--radius-*` variables
   from `src/styles.scss`. The only allowed hardcoded color is the brand gradient
   `linear-gradient(135deg, #2BB88A 0%, #1A8D6F 100%)` (and its rgba shadows).
   Every page must look right in BOTH dark and light mode — test by toggling
   `data-theme` in your head: no hardcoded blacks/whites.
4. **Inline SCSS per component** — don't add global styles for component concerns.
5. **Component style budget**: warning at 20 kB, error at 30 kB per component
   stylesheet. If you approach it, trim — don't raise the budget.
6. **A11y is part of the design**: focus-visible outlines, keyboard operability for
   clickable cards (`role="link" tabindex="0" (keyup.enter)`), `prefers-reduced-motion`
   guards on animations, aria-labels on icon-only buttons.
7. **All three states** (loading skeleton / empty / error with retry) on every page
   that fetches data, using the `.state-block` + shimmer-skeleton patterns from the
   jobs page.

## Page-by-page scope (priority order)

For every page: hero treatment (eyebrow + h1 with ONE serif-italic `<em>` word),
pill CTAs, badge/pill statuses, glass cards, states. Specific notes:

1. **Login / Register** (`src/app/auth/login`, `src/app/auth/register`)
   Already partially styled (Instrument Serif is used). Align CTAs to the gradient
   pill, unify form-field sizing with the jobs filter bar conventions.
2. **Job detail** (`src/app/jobs/job-detail`)
   Mirror the job-card vocabulary: category icon tile, loc-badge pills, skill-pills,
   teal budget. Hero = job title (serif moment on one word of the eyebrow or section
   header, NOT the user-generated title).
3. **Job form** (`src/app/jobs/job-form`) — hero + section grouping; segmented pill
   chips for enum fields (work type, budget type) matching `.worktype-chips`.
4. **My applications / My active jobs / Job applications** (`src/app/jobs/*`)
   Status badges as custom span pills using the `--chip-status-*` tokens (NOT mat-chip).
5. **Profile view / edit / setup** (`src/app/profile/*`)
   Avatar treatment, skill-pills, rating display; edit/setup forms follow job-form
   conventions.
6. **Payments** (`src/app/payments/*`) — payment status pills from chip tokens,
   amounts in teal accent like `.budget-amount`.
7. **Messaging** (`src/app/messaging/chat`) — conversation list + bubbles using
   surface/border tokens; keep it quieter (no hero), but states + skeletons required.
8. **Pricing / Billing / Subscription results** (`src/app/subscription/*`)
   Billing is already close; align card radii, pills, and CTAs.
9. **Settings** (`src/app/settings`), **Reviews** (`src/app/reviews/*`),
   **Legal pages** (`src/app/legal/*`) — light touch: typography, tokens, states.
10. **Email verify / verified, payment/subscription result pages** — `.state-block`
    pattern, brand header consistent with login.

## Verification (required after EVERY page, not just at the end)

```bash
npx eslint src/app/<feature>       # must be clean
npm run build                      # dev build must succeed
npm run build -- --configuration production   # before finishing
```

If the production build's font-inlining step fails due to no network access to
fonts.googleapis.com, that failure is environmental and can be ignored — every other
error cannot.

## Working style

- One feature area per commit-sized chunk; verify before moving on.
- When in doubt about a pattern, copy the jobs page implementation rather than
  inventing a new one. Consistency beats novelty everywhere except the hero copy.
- Hero copy: short, confident, second person where natural. One serif moment per page.
  Examples: "Your <em>profile</em>", "Messages that <em>matter</em>" (pick tastefully;
  don't force it on dense utility pages).
