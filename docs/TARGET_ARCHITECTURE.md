# Target Architecture — UrbanBuild

This is how we would build this product **from scratch today**, given the same requirements:

- a fast, accessible, single-page marketing site for a construction firm;
- reliable capture of quote requests;
- easy content updates;
- enterprise-grade quality gates.

It is sized for the product as it actually is, not for a generic enterprise template.

> **Key observation:** the ideal stack is nearly identical to the stack already in the repo. The gap is in _how_ the stack is used (server/client boundaries, forms, assets, accessibility, quality gates), not in _which_ stack. That is the main input to [MODERNIZATION_DECISION](MODERNIZATION_DECISION.md).

## 1. Requirements that drive the design

| Requirement                                                 | Consequence                                                                                                                                   |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Public marketing page; SEO and first impressions matter     | Static rendering (SSG). Server Components by default. Content visible without JavaScript. Optimized LCP image.                                |
| The site's one job is turning visitors into leads           | A Server Action form with validation, spam protection, guaranteed delivery and clear feedback. It works without JS (progressive enhancement). |
| Content changes occasionally (copy, projects, testimonials) | Typed content modules validated at build. A CMS is **not** justified yet (re-evaluate if non-developers must edit weekly).                    |
| Enterprise client: accessibility, security, maintainability | WCAG 2.2 AA as a gate, security headers, dependency policy, CI with tests, accessibility scans and screenshot diffs.                          |
| Small team, small codebase                                  | Minimal dependencies. No state library, no data-fetching library, no monorepo, no micro-frontends.                                            |

## 2. Technology stack

### Essential

| Concern                   | Choice (version)                                                                                                                                             | Why this, for this app                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                 | **Next.js 16.3.8** App Router (→ 16.4.x after its first patch)                                                                                               | SSG + Server Components + Server Actions + `next/image` + `next/font` + metadata routes in one supported framework. The team already uses it. |
| UI runtime                | **React 19.2.8** (→ 19.3 with Next 16.4), React Compiler on                                                                                                  | `useActionState` for forms. The Compiler removes manual memoisation.                                                                          |
| Language                  | **TypeScript 5.9.3**, `strict`                                                                                                                               | TS 6/7 deferred: typescript-eslint caps at <6.1, and TS 7 support in Next is experimental.                                                    |
| Styling                   | **Tailwind CSS 4.3.3** (CSS-first `@theme`), `tailwind-merge` 3.7, `clsx`, `cva`                                                                             | Design tokens live in CSS. No runtime CSS-in-JS. This is the shadcn baseline.                                                                 |
| UI primitives             | **shadcn/ui new-york on unified `radix-ui`**                                                                                                                 | Accessible primitives (Dialog/Sheet, Select, Tabs, Accordion, Carousel, Label) that we own and can restyle to radius 0.                       |
| Validation                | **zod 4**                                                                                                                                                    | One schema for the Server Action, the client hints and the environment variables.                                                             |
| Package manager / runtime | **bun 1.3.x** (frozen lockfile in CI), **Node 24 LTS**                                                                                                       | The team already uses bun. Node 20 is end of life.                                                                                            |
| Quality                   | **Biome** (format, lint, imports, class sorting) + minimal **ESLint 10** (react-hooks v7, @next/next) per D-007, **Vitest + RTL**, **Playwright + axe-core** | Covered in [ENGINEERING_STANDARDS](ENGINEERING_STANDARDS.md).                                                                                 |
| CI                        | GitHub Actions                                                                                                                                               | Install → typecheck → lint → unit → build (**without .env**) → e2e + axe + visual → `bun audit`.                                              |

### Chosen with restraint

| Concern         | Choice                                                                                    | Notes                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Animation       | **motion 12.43** via `LazyMotion` + `m`, wrapped in `<MotionConfig reducedMotion="user">` | Used only for reveal choreography and the count-up. Content must render visible on the server. If CSS reveals cover all needs after the refactor, motion can be dropped. |
| Carousel        | shadcn **Carousel** (Embla 8.6)                                                           | Replaces swiper. Must have a pause control.                                                                                                                              |
| Icons           | `lucide-react` 1.x (shadcn default) + `react-icons` for brand logos                       | Consolidating to one library is optional and low value.                                                                                                                  |
| Lead delivery   | `deliverLead()` adapter → email API (Resend, Postmark or SES) and/or CRM                  | The provider is a business decision. The adapter keeps it swappable. Persist a copy, or at least log the failure, so a provider outage never loses a lead.               |
| Spam protection | Honeypot field + per-IP rate limit; Cloudflare Turnstile if spam appears                  | Start simple. Add Turnstile only on evidence.                                                                                                                            |

### Deliberately not used

- **State management** (Redux, Zustand, Jotai): there is no shared client state.
- **Data fetching** (TanStack Query, SWR): there is no client-side data.
- **Form libraries** (react-hook-form): 5 fields plus `useActionState` is enough.
- **CMS**: there is no non-developer editing requirement yet.
- **i18n**: not required.
- **Auth**: there are no user accounts.
- _(Dark mode **is** required — see D-003: `next-themes` + an accessible light/dark/system toggle, with semantic surface tokens.)_
- **CSS-in-JS**, **Storybook** (not worth it for about 15 components), **monorepo tooling**.

## 3. Rendering and module architecture

```
                     ┌─────────────────────────── Server (build time, SSG) ───────────────────────────┐
 content/*.ts ──────►│ app/page.tsx (Server)                                                          │
 (zod-validated)     │   └─ components/sections/*  (Server Components: markup, copy, next/image)      │
                     │        └─ components/interactive/*  ("use client" leaves only where needed)    │
                     └────────────────────────────────────────────────────────────────────────────────┘
 Browser ── <form action={submitQuote}> ──► features/lead-capture/actions.ts ("use server")
                                              ├─ schema.ts (zod) → field errors back to useActionState
                                              ├─ spam.ts  (honeypot, rate limit)
                                              └─ deliver.ts (provider adapter; log/persist on failure)
```

Rules:

1. **Sections are Server Components.** `"use client"` appears only in files under `components/interactive/`, in feature form components, and in `components/ui` primitives that need it.
2. **Content is visible by default.** Animations enhance; they never gate visibility. There is no `opacity: 0` in server HTML for essential content.
3. **One source of truth for anchors.** `lib/section-ids.ts` exports typed ids that both the sections and the navigation use.
4. **Dependencies point one way:**
   - `app` → `features` | `components` → `content` | `lib`.
   - `components/ui` imports only `lib/utils`.
   - `content` imports nothing from `components`.
5. **Server-only code** (actions, delivery, secrets) lives in `features/*/actions.ts` and `deliver.ts`, imports `server-only` where applicable, and reads secrets only through `lib/env.ts`.

## 4. Target repository structure

The repo keeps the root-level `app/` layout. A `src/` move adds churn without value at this size.

```
urban-build-pro/
├─ .github/workflows/ci.yml
├─ app/
│  ├─ layout.tsx            # <html>, fonts, metadata (from lib/seo), skip link, MotionConfig provider
│  ├─ page.tsx              # Server: <SiteHeader/> <main id="content">…sections…</main> <SiteFooter/>
│  ├─ opengraph-image.tsx   # real 1200×630 social image
│  ├─ robots.ts · sitemap.ts
│  ├─ not-found.tsx         # Server Component, CSS-only motion
│  ├─ error.tsx · global-error.tsx  # styled, accessible
│  └─ globals.css           # tokens + @utility type scale + base (scroll-padding, focus ring)
├─ components/
│  ├─ ui/                   # shadcn primitives (generated, then owned and linted)
│  ├─ brand/                # logo, pretitle, cta-button (ex construction-button), social-links
│  ├─ layout/               # site-header, site-footer, topbar, section (wrapper with id + heading)
│  ├─ sections/             # hero, about, stats, services, projects, testimonials, faq, contact  (Server)
│  └─ interactive/          # "use client": mobile-nav, active-section-nav, count-up, reveal, testimonials-carousel
├─ features/
│  └─ lead-capture/
│     ├─ actions.ts         # "use server": submitQuote (+ subscribeNewsletter when the newsletter returns, D-004)
│     ├─ schema.ts          # zod schemas + inferred types
│     ├─ deliver.ts         # provider adapter (server-only)
│     ├─ spam.ts            # honeypot + rate limit
│     ├─ quote-form.tsx     # "use client": useActionState, labelled fields, status region
│     └─ schema.test.ts · actions.test.ts
├─ content/
│  ├─ site.ts               # brand name, contact info, socials, nav (from section ids)
│  ├─ services.ts · projects.ts · testimonials.ts · faqs.ts · stats.ts
│  └─ schema.ts             # zod schemas; content parsed at build so bad data fails CI
├─ lib/
│  ├─ env.ts                # zod-validated env; SITE_URL fallback in dev, required in prod
│  ├─ seo.ts                # metadata helpers, JSON-LD
│  ├─ section-ids.ts
│  └─ utils.ts              # cn()
├─ hooks/                   # use-active-section.ts, use-scrolled.ts (client hooks)
├─ public/images/…          # re-encoded masters only (AVIF/WebP/JPEG), brand SVGs
├─ scripts/optimize-images.ts   # one-off sharp re-encode, kept for future assets
├─ tests/
│  ├─ e2e/   navigation.spec.ts · lead-capture.spec.ts · responsive.spec.ts · no-js.spec.ts
│  ├─ a11y/  axe.spec.ts           # every section, 390 + 1440
│  └─ visual/ home.spec.ts (+ snapshots)
├─ docs/   (these documents) · docs/adr/
├─ next.config.ts           # reactCompiler, poweredByHeader:false, headers(), images config
├─ vitest.config.ts · playwright.config.ts
├─ biome.json · eslint.config.mjs (minimal) · components.json · tsconfig.json
├─ .env.example · README.md · LICENSE
└─ package.json
```

**Why this shape:**

- `features/` holds the one area with real behaviour (lead capture), so its server, client, schema and tests sit together.
- `components/` holds presentation, split by role: generated primitives, brand atoms, layout chrome, page sections, and client islands.
- `content/` is the boundary a future CMS would replace.

Naming conventions are in [ENGINEERING_STANDARDS](ENGINEERING_STANDARDS.md).

## 5. Key design decisions

### 5.1 Navigation and scrolling

- Use native `<a href="#about">` links (keyboard and no-JS friendly) with `html { scroll-behavior: smooth }` behind `@media (prefers-reduced-motion: no-preference)`.
- Add `scroll-padding-top` equal to the sticky header height.
- Use **one** header, `position: sticky`. A tiny client hook toggles the compact style.
- The active link comes from an IntersectionObserver hook (`use-active-section`) and is exposed with `aria-current="true"`.
- The mobile menu uses the Sheet, with an sr-only "Site menu" title and links that close the sheet.

### 5.2 Forms (lead capture)

- `<form action={formAction}>` with `useActionState`.
- The server re-validates with zod and returns `{ status, fieldErrors, message }`.
- Each field gets a visible `<Label>`, `aria-invalid` and an `aria-describedby` error. The submit button is disabled while pending. A persistent `role="status"` message reports success or failure.
- A hidden honeypot field and a rate limit protect the endpoint.
- The action never trusts the client. It logs failures server-side without PII in the message. The privacy notice is linked next to the submit button.

### 5.3 Images

- Re-encode the masters (hero about 1920w AVIF/WebP, ≤ 300 KB; cards ≤ 120 KB).
- Hero: `next/image` with `fill`, `sizes="100vw"`, `preload` (or `fetchPriority="high"`) and `placeholder="blur"` from a static import.
- Every `fill` image gets correct `sizes`.
- Configure `images.formats: ['image/avif','image/webp']` only after next ≥ 16.3.3 (AVIF advisory). Use the default `qualities: [75]`.

### 5.4 Design tokens

Keep the current OKLCH palette and radius 0, and add what is missing:

- semantic `--surface-inverse` / `--on-inverse` (replacing the `bg-foreground text-background` inversions);
- a `--focus-ring` token with ≥ 3:1 contrast;
- a contrast-fixed `--muted-foreground`;
- a type scale through `@utility` (`display`, `h1`–`h4`, `eyebrow`, `lead`, `body`, `caption`);
- spacing and section rhythm tokens (`section-y`).

Remove the unused `.dark`, `sidebar-*` and `chart-*` tokens.

### 5.5 Accessibility baseline

- WCAG 2.2 AA.
- Skip link, and landmarks outside `<main>`.
- Visible focus everywhere. 24 px minimum targets (44 px for primary touch actions).
- Reduced motion honoured globally (MotionConfig + CSS `motion-safe:`).
- No auto-advancing content without pause.
- Colour is never the only signal. Yellow is used as a fill behind dark text only, never as text on white.

### 5.6 Security and configuration

- `lib/env.ts` (zod):
  - `NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000` in development and is required in production (not localhost);
  - provider secrets are server-only.
- `next.config.ts`:
  - `poweredByHeader: false`;
  - `headers()` with HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `frame-ancestors 'none'`;
  - a static CSP (a nonce CSP would force dynamic rendering, which is not worth it for a static page).
- Dependencies: Renovate or Dependabot with a minimum release age of 14 days (security exempt), and `bun audit` in CI that fails on runtime high or critical advisories.

### 5.7 Performance budgets (enforced in CI where possible)

| Metric                     | Budget                  |
| -------------------------- | ----------------------- |
| LCP (mobile, throttled)    | < 2.5 s                 |
| CLS                        | < 0.1 (currently 0.002) |
| INP                        | < 200 ms                |
| First-load JS (gzip)       | ≤ 120 KB shared         |
| First-viewport image bytes | ≤ 400 KB                |
| Fonts preloaded            | ≤ 4 files               |

### 5.8 Observability

- Server-side structured log line per lead submission (outcome and provider id, no message body).
- Optional: Vercel Analytics / Speed Insights, or an equivalent, for field Web Vitals, plus an error tracker (e.g. Sentry) once the site is live. These are additions, not essentials.

## 6. Essential vs optional summary

| Essential now                                                          | Optional / later                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Next 16.3.8, React 19.2, TS 5.9, Tailwind 4.3, shadcn on radix-ui, zod | motion (could become CSS-only)                                                     |
| Server Action lead capture + delivery adapter + spam protection        | Turnstile, CRM integration, lead persistence store                                 |
| Env validation, security headers, CI, Vitest, Playwright + axe         | Lighthouse CI budgets, visual-diff service, error tracking, analytics              |
| Re-encoded images, trimmed fonts                                       | `opengraph-image.tsx` dynamic generation (a static asset is fine too)              |
|                                                                        | JSON-LD structured data (after the content is real), CMS (only if editors need it) |
