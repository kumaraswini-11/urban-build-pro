# Implementation Roadmap — UrbanBuild

Strategy: **hybrid in-place modernization** ([MODERNIZATION_DECISION](MODERNIZATION_DECISION.md)). Total effort is about 13–19 engineer-days (central estimate ~15) for one senior engineer.

## Working rules (apply to every milestone)

- Work on a branch (`modernize/<milestone>`). One logical change per PR. No mixed refactor + upgrade + formatting PRs.
- Before risky steps, confirm the baseline is green (or document known failures), and read the migration guide for any package being upgraded.
- Every PR must pass:
  - `typecheck`, `lint`, `test`, `build` **without `.env`**;
  - Playwright e2e + axe;
  - screenshot diff at 390, 768 and 1440 px (intentional changes are re-baselined in the same PR, with before/after screenshots in the description).
- Dependency changes: one coupled group per PR, a lockfile refresh, `bun audit` before and after, and the release notes linked in the PR.
- **Rollback:** every PR is independently revertable. The original state is tagged `baseline-2026-10-10`.
- Report only checks that were actually run.

## Milestones

### M0 — Safety net and baselines · ~1–1.5 d · _no product changes_

1. Tag `baseline-2026-10-10`. Create branch `modernize/m0-baseline`.
2. Add `typecheck` (`tsc --noEmit`) and `test` scripts. Make `prettier` scripts use the local version (drop `bunx prettier@latest`).
3. Add Playwright + `@axe-core/playwright` and write these tests:
   - `smoke`: the page loads with no console errors, and every nav target id exists;
   - `visual`: section screenshots at 390, 768 and 1440 px (baseline = current site);
   - `a11y`: axe scan, **with current violations recorded as the baseline** (2 button-name, 7 color-contrast, 2 heading-order, 1 landmark-unique), so CI fails on any _new_ violation;
   - `responsive`: `scrollWidth <= innerWidth` at 320 and 390 px, marked `test.fail()` (known U6).
4. Add Vitest + RTL config (one trivial test, so the pipeline exists).
5. GitHub Actions CI: `bun install --frozen-lockfile` → typecheck → lint → test → `next build` with no env → e2e.

**Acceptance:** CI is green on an unchanged codebase. Baselines are committed.

### M1 — Security and build stability · ~1 d

1. **PR 1a (security):**
   - next + eslint-config-next **16.3.8**, react/react-dom **19.2.8**, @types/react(-dom) pinned to 19.2;
   - swiper **12.2.0**;
   - refresh the lockfile and confirm `sharp >= 0.35.5`, adding an `overrides` entry if needed.
2. **PR 1b (config):**
   - `lib/env.ts` (zod): `NEXT_PUBLIC_SITE_URL` falls back to localhost in development and must be a valid non-localhost URL in production;
   - use it in `layout.tsx`, `robots.ts` and `sitemap.ts`;
   - remove `/contact` from the sitemap and the non-existent robots disallows;
   - add `alternates.canonical`.
3. **PR 1c (hardening):**
   - `poweredByHeader: false`;
   - `headers()` with HSTS, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` and a static CSP (validated against next/image and motion inline styles).

**Acceptance:**

- A fresh clone builds with no `.env`.
- `bun audit` shows **0 critical / 0 high in runtime dependencies**.
- Screenshots are unchanged.
- The axe count is ≤ baseline.
- The headers are present in `curl -I`.

### M1b — Tooling: Biome + minimal ESLint 10 · ~0.5–1 d · _D-007_

1. `.gitattributes` with `* text=auto eol=lf` (+ binary types), then `git add --renormalize .` in its own commit.
2. Add `@biomejs/biome` (pinned exactly) and `biome.json` (formatter matching current Prettier style, `css.parser.tailwindDirectives`, recommended rules + react/test/playwright domains, `organizeImports` groups, `useSortedClasses` for `cn`/`cva`/`clsx`; `components/ui` not linted).
3. Separate commits for: Biome format, import/`useImportType` fixes, the one-time class re-sort. List those SHAs in `.git-blame-ignore-revs`.
4. Fix the real Biome findings (index keys, non-null assertion, header aria-label, unused param).
5. Replace ESLint: remove eslint-config-next, eslint-config-prettier, eslint-plugin-import, eslint-import-resolver-typescript, prettier, prettier-plugin-tailwindcss and `.prettierrc`; add eslint 10 + eslint-plugin-react-hooks 7 + typescript-eslint + @next/eslint-plugin-next (same version as next) with a minimal `eslint.config.mjs`.
6. Scripts (`lint` = `biome check . && eslint . --max-warnings=0`) and CI (`biome ci .` + `eslint . --max-warnings=0`). No editor-specific settings are committed (editor-agnostic, D-007).

**Acceptance:** `biome ci .` and `eslint .` clean; typecheck, unit, e2e green; screenshot diff unchanged (formatting-only changes).

### M2 — Lead capture (stops the lost leads) · ~2.5–3.5 d · _provider adapter with Resend default (D-005)_

1. `features/lead-capture/`:
   - `schema.ts` (zod);
   - `actions.ts` (`"use server"`, re-validate, honeypot, rate limit, typed result);
   - `deliver.ts` (provider adapter; server-side failure log or persisted copy).
2. `quote-form.tsx`:
   - `useActionState`;
   - visible `<Label>`s;
   - `aria-invalid` + `aria-describedby` errors;
   - pending/disabled submit;
   - `role="status"` success/error message;
   - works without JS.
3. The Select gets a label (fixes the axe button-name issue). Phone input uses `type="tel"` and `autocomplete` attributes.
4. Newsletter: removed from the footer until it is wanted (D-004); rebuild later on this module.
5. Tests:
   - unit tests for schema and action (valid, invalid, honeypot, provider failure);
   - e2e: submit → success state, invalid → field errors, no-JS submit.
6. Link a privacy notice near the submit button (content from the client).

**Acceptance:**

- A real submission reaches the chosen inbox or CRM in staging.
- A provider failure is logged and shown to the user as a recoverable error.
- axe has no form violations.
- e2e is green.

### M3 — Navigation, core UX and accessibility defects · ~3–4 d

1. `lib/section-ids.ts`; nav built from it (fixes the Portfolio target, U2). Add an id to Testimonials.
2. Replace react-scroll:
   - native anchors;
   - `scroll-padding-top`;
   - `use-active-section` hook with `aria-current`;
   - active style `text-primary`;
   - remove react-scroll and `@types/react-scroll` (fixes U1, U3, A8).
3. Single sticky header (CSS sticky + `use-scrolled`). Delete `StickyHeader` duplication (U9).
4. Move Topbar, Header and Footer out of `<main>`. Add a skip link. Make Socials a labelled list (A6).
5. CTAs: `CtaButton` supports `asChild` / `href`, and "Get a quote", "Service Details" and "Partner With Us" point to real targets. Portfolio `href="#"` links are removed or point to real pages (U4).
6. Type scale with `@utility` (`h1`–`h4`, eyebrow, lead), applied to every heading. Fix heading levels (U5, A9).
7. FAQ → shadcn Accordion, which also fixes the mobile overflow (U6, A9). Flip the responsive test from `test.fail()` to passing.
8. Focus ring token (≥ 3:1). Contrast-fixed `--muted-foreground`. No yellow text on white (A3, A5).
9. Testimonials → shadcn Carousel (Embla) with a pause control and 24 px+ targets, or a static layout (A2). Remove swiper.
10. Portfolio card details visible on touch and focus (U8). Contact details as `tel:`, `mailto:` and map links, with fixed copy (U10). Services Tabs orientation (A9). Sheet title "Site menu".

**Acceptance:**

- Keyboard Tab walk reaches every nav item and CTA, with visible focus everywhere.
- **axe: 0 critical / 0 serious.**
- No horizontal overflow at 320 px.
- Every nav link scrolls to its section.
- Screenshot changes are reviewed and approved.

### M4 — Performance and rendering · ~3–4 d

1. `scripts/optimize-images.ts` (sharp):
   - re-encode the hero (PNG 7.8 MB → AVIF/WebP/JPEG about 1920w, ≤ 300 KB) and the work images (≤ 120 KB);
   - fix the `.jpg`-named PNGs;
   - delete unused assets.
2. Hero via `next/image` (`fill`, `sizes="100vw"`, `preload` or `fetchPriority="high"`, `placeholder="blur"`). Remove the `--background-image-hero` token.
3. Correct `sizes` on every `fill` image. Remove `quality={100}`. Replace `priority` with `preload` / `fetchPriority`.
4. Sections → Server Components. Interactivity moves to `components/interactive/*`. `not-found.tsx` becomes a server component with CSS-only motion (removes the duplicated 53 KB gzip motion chunk).
5. motion: `LazyMotion` + `m`, `<MotionConfig reducedMotion="user">`, content visible in server HTML (no `opacity: 0` gating). The testimonial card uses `viewport.once`.
6. Stats: a count-up island with the final value in the HTML and reduced-motion respected. Remove react-countup.
7. Fonts: DM Sans as a variable font (no `weight`), Barlow limited to the weights in use. Rename the next/font CSS variables (no self-reference).

**Acceptance (throttled mobile Lighthouse on a preview deploy):**

- LCP < 2.5 s, CLS < 0.1;
- first-viewport images ≤ 400 KB;
- shared first-load JS ≤ 120 KB gzip;
- ≤ 4 font files preloaded;
- no-JS screenshot shows all content.

### M5 — Content, SEO and hygiene · ~1.5–2 d

1. Move `lib/constants.ts` into `content/*` with zod schemas parsed at build. Use one naming convention. Add a brand-name constant.
2. Real OG image (1200×630). Consistent brand name and alt texts. JSON-LD (`GeneralContractor`) once the content is real.
3. Remove `sonner` + `ui/sonner.tsx` and unused tokens (`sidebar-*`, `chart-*`). Replace raw palette colours with tokens. **Dark mode (D-003):** fix `.dark` tokens, add `surface-inverse`/`on-inverse`, ship an accessible theme toggle, and run axe + visual baselines in both themes.
4. Rewrite the README (bun, Next 16, setup, scripts, env, architecture link). Add a LICENSE (confirm with the client). Real screenshot. Package name `urban-build-pro`.
5. Lint `components/ui/**` (remove the ignore). Fix the findings.
6. Placeholder content checklist handed to the client (phone, socials, CEO name and signature, testimonials, project links).

**Acceptance:** no 404s in the sitemap; social preview validates; README setup works on a fresh machine.

### M6 — Remaining upgrades (isolated PRs) · ~1–2 d

| PR    | Change                                                                                                                                          | Gate                                                                         |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 6a    | Radix → unified `radix-ui@1.6.7` via `bunx shadcn@latest migrate radix`. Remove the 4 `@radix-ui/react-*` packages.                             | Sheet, Select, Tabs, Accordion and `Button asChild` on the 404 page all work |
| 6b    | tailwindcss + @tailwindcss/postcss **4.3.3** + tailwind-merge **3.7.0**                                                                         | Screenshot diff is clean                                                     |
| 6c    | lucide-react **1.x**, react-icons **5.7.0**                                                                                                     | Visual check of the icons                                                    |
| 6d    | _(superseded by the tooling phase — Biome + minimal ESLint 10, D-007)_                                                                          | Format check                                                                 |
| 6e    | motion **12.43.0** (if not already done in M4); @types/node 24 (ESLint already on 10 since M1b)                                                                   | CI                                                                           |
| later | next 16.4.x + react 19.3 (after 16.4.1+, 14-day soak) · radix-ui 1.7.x · motion 14 · drop ESLint (when Biome useReactCompiler is stable) · TS 6 | Each its own PR                                                              |

**Acceptance:** `bun outdated` shows only deliberately deferred majors. `bun audit` is clean for runtime dependencies. All gates are green.

### M7 (optional) — Operations

- Renovate or Dependabot: grouped updates, 14-day minimum release age, security exempt.
- Lighthouse CI budgets in CI.
- Field Web Vitals and an error tracker after launch.
- ADRs for the decisions in these documents.

## Sequencing and dependencies

```
M0 ─► M1 ─► M2 (needs provider decision) ─┐
         └► M3 ─► M4 ─► M5 ─► M6 ─► (M7) ◄┘
```

- M2 and M3 can run in parallel with two engineers. Otherwise M2 goes first, because it stops the business loss.
- M3 comes before M4: navigation and FAQ rewrites change the same files as the server/client split, so do correctness first, then performance.
- 6a (Radix) can be pulled earlier into M3 if Accordion and Carousel are being added anyway, since `shadcn add` will generate unified-package imports.

## Decisions needed from the product owner before M2

1. Lead destination and provider (email, CRM, or both; persistence and privacy notice).
2. ~~Hosting target~~ → Vercel (D-002).
3. ~~Newsletter~~ → later (D-004). 4. ~~Dark mode~~ → required (D-003). 5. Real content and assets. 6. Will the site go multi-page? (This would trigger re-evaluation; see MODERNIZATION_DECISION §6.)
