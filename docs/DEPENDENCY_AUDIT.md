# Dependency Audit — UrbanBuild

Audit date: 2026-10-10. Package manager: bun 1.3.8 (`bun.lock`). Local Node: 24.13.0.

## Method

- Installed versions were read from `node_modules/*/package.json`.
- Every import was traced with grep across `app/`, `components/` and `lib/`.
- Latest versions came from the npm registry.
- Security data came from `bun audit` and the per-advisory GitHub Advisory Database.
- Breaking changes came from official changelogs and migration guides (Next.js blog and releases, react.dev, shadcn changelog, tailwindcss.com, motion CHANGELOG, swiper changelog, ESLint migration guide, Vitest blog).

Versions marked "unverified" could not be confirmed from a primary source. **No manifest or lockfile was changed during this audit.**

## Headline

| Metric                 | Value                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Direct dependencies    | 19 runtime + 16 dev = 35                                                                                                                   |
| `bun audit`            | **87 advisories: 3 critical, 49 high, 30 moderate, 5 low**                                                                                 |
| Criticals              | `next` ×2 (RCE), `swiper` ×1 (prototype pollution). All three are fixable with in-major bumps.                                             |
| Unused packages        | `sonner` (no `<Toaster>` mounted). `next-themes` has no effect (dark mode unreachable).                                                    |
| Replaceable or dormant | `react-scroll` (causes the keyboard-inaccessible nav), `react-countup` (no release since 2024-03), `swiper` (heavy for a 2-slide carousel) |
| Mis-placed             | `@types/react-scroll` sits in `dependencies`                                                                                               |

### Version policy

1. **Patch security first**, within the current major.
2. Prefer releases that have been out **at least 14 days**. Security patches are exempt.
3. Upgrade **coupled packages together**:
   - next + eslint-config-next
   - react + react-dom + @types
   - tailwindcss + @tailwindcss/postcss + tailwind-merge
   - prettier + prettier-plugin-tailwindcss
4. Each **major** upgrade gets its own PR, only after tests exist.
5. Do not chase "latest" for its own sake. The targets below are a coherent, supported set.

---

## 1. Critical security updates (do first — Milestone 1)

| Package                       | Installed          | Target                                     | Why                                                                                                                                                                                                                                                                                                                                                                                                                          | Risk                                                                                                                                                                                              |
| ----------------------------- | ------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                        | 16.1.1 (exact pin) | **16.3.8** (exact pin)                     | 37 advisories (2 critical, 15 high).<br>GHSA-p293-qw3h-jr36 (Windows-host RCE) and GHSA-2xp9-vwfh-vxw4 (AVIF/libheif RCE) are fixed from 16.3.3.<br>GHSA-cjq9-62q9-8jv4 (image SSRF) and GHSA-mcj8-r9mp-w47p / GHSA-4jqv-mc3x-m676 (SSG/ISR cache poisoning) are fixed in **16.3.8**.<br>bun's combined range `<16.2.5` understates what is needed.<br>16.3.8 also pins postcss 8.5.23, which clears the postcss advisories. | Medium. 16.1 → 16.3 changes: native Node streams for SSR, `images.maximumResponseBody`, redesigned default error pages, `javascript:` URLs rejected. None of these touch the APIs this site uses. |
| `eslint-config-next`          | 16.1.1             | **16.3.8**                                 | Keep in lockstep with next. Clears the transitive `braces`, `@babel/core` and `browserslist` advisories.                                                                                                                                                                                                                                                                                                                     | Low                                                                                                                                                                                               |
| `sharp` (transitive via next) | 0.34.5             | **≥ 0.35.5** after the lockfile refresh    | GHSA-f88m-g3jw-g9cj (libvips, fixed 0.35.0); GHSA-rgj7-g3m4-5g8c (libheif, fixed 0.35.4); GHSA-wq5f-xc86-pv6w (librsvg, fixed 0.35.5, published 2026-10-06). next 16.3.4+ allows `^0.35.4`, so confirm the lockfile resolves 0.35.5+. Otherwise add an `overrides` entry.                                                                                                                                                    | Low. sharp 0.35 needs Node ≥ 20.9.                                                                                                                                                                |
| `swiper`                      | 12.0.3             | **12.2.0** (interim), then **remove** (§6) | GHSA-hmx5-qpq5-p643 / CVE-2026-27212, affected `>=6.5.1 <12.1.2`. 12.2.0 has no breaking changes.                                                                                                                                                                                                                                                                                                                            | Low                                                                                                                                                                                               |

After Milestone 1, re-run `bun audit`. The acceptance target is **0 critical and 0 high in runtime dependencies**. Dev-only transitive advisories are tracked in §3 and §4.

## 2. Low-risk patch updates

| Package                             | Installed      | Target     | Notes                                                                                                                                                          |
| ----------------------------------- | -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react`, `react-dom`                | 19.2.3         | **19.2.8** | Patch line, no breaking changes. No advisory affects the `react` package itself; the RSC CVEs are in next's vendored `react-server-dom-*` and are fixed by S1. |
| `@types/react`                      | 19.2.7 (`^19`) | `~19.2.18` | Match the runtime minor. `^19` would otherwise resolve to 19.3 types.                                                                                          |
| `@types/react-dom`                  | 19.2.3 (`^19`) | `~19.2.7`  | Same reasoning.                                                                                                                                                |
| `eslint`                            | 9.39.2         | **9.39.5** | Final v9 release. Clears ajv, minimatch, flatted and other transitive advisories.                                                                              |
| `eslint-import-resolver-typescript` | 4.4.4          | ^4.4.5     | Patch only.                                                                                                                                                    |
| `sonner`                            | 2.0.7          | —          | Remove instead (§6).                                                                                                                                           |

## 3. Minor feature updates

| Package                                                                    | Installed        | Target                                             | Notes                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------- | ---------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwindcss`, `@tailwindcss/postcss`                                      | 4.1.18 (`^4`)    | **4.3.3**, same version for both                   | 4.3.0 changed _functional_ `@utility` syntax (`--value()`), which affects the new `@utility h2` definitions only if they take a value. `start-*`/`end-*` are deprecated (unused here). Clears the transitive postcss, nanoid and source-map-js advisories. |
| `tailwind-merge`                                                           | 3.4.0            | **3.7.0**                                          | **Required** with Tailwind 4.3: 3.6.0+ is the first release that knows the 4.2/4.3 utilities. Upgrade it in the same PR.                                                                                                                                   |
| `@radix-ui/react-*` (dialog 1.1.15, select 2.2.6, slot 1.2.4, tabs 1.1.13) | —                | Migrate to the unified **`radix-ui`** package (§7) | Fixes since the installed versions include React 19 infinite re-render loops (slot 1.2.5, select 2.3.2), which are relevant with the React Compiler.                                                                                                       |
| `motion`                                                                   | 12.23.26         | **12.43.0**                                        | Within the current range, no code changes. Adopt `MotionConfig reducedMotion="user"` and `LazyMotion` + `m`, which are available in every 12.x and save about 12 KB gzip.                                                                                  |
| `react-icons`                                                              | 5.5.0            | **5.7.0**                                          | Icon-set bumps. All 23 used Ri*/Pi* names were verified to exist in 5.7.0. Do **not** adopt the 6.0 beta.                                                                                                                                                  |
| `prettier`                                                                 | 3.7.4            | **3.9.9**                                          | Some JS/JSX formatting changes. Run `prettier --write` in a dedicated formatting-only commit.                                                                                                                                                              |
| `prettier-plugin-tailwindcss`                                              | 0.7.2            | **0.8.1**                                          | Needs Prettier ≥ 3.7. **Add `"tailwindStylesheet": "./app/globals.css"`** to `.prettierrc`; without it, v4 custom tokens are sorted incorrectly.                                                                                                           |
| `@types/node`                                                              | 20.19.27 (`^20`) | **^24**                                            | Node 20 reached end of life on 2026-04-30. Match the deployment runtime (Node 24 LTS). Add `"engines": { "node": ">=24" }` once hosting is confirmed.                                                                                                      |

## 4. Major (breaking) upgrades — isolated PRs after the test net exists

| Package               | Installed       | Target                                              | Breaking changes / blockers                                                                                                                                                                                                                                                                                                  | When                      |
| --------------------- | --------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `lucide-react`        | 0.562.0         | **^1.55** (≥ 1.0.1; 1.0.0 was published by mistake) | All brand icons removed (unused here). `aria-hidden="true"` by default. UMD build dropped. The 9 used names were verified in 1.55.0, so it is effectively a drop-in.                                                                                                                                                         | Milestone 6               |
| `next` + `react` 19.3 | 16.3.8 / 19.2.8 | 16.4.x / 19.3.0                                     | 16.4.0 was published 2026-10-06. Wait for 16.4.1+. Cache Components stays opt-in until Next 17, so the change is safe. react-dom 19.3 has a strict peer on react ^19.3.                                                                                                                                                      | After 16.4.1 plus 14 days |
| `motion`              | 12.43.0         | 14.x                                                | Changes from 13 to 14 are internal APIs, not used here. 14.1.0 was published 2026-10-09; let it soak. Re-evaluate whether motion is still needed after the refactor (CSS reveals may be enough).                                                                                                                             | Milestone 6 or later      |
| `eslint`              | 9.39.5          | 10.x                                                | **Blocked.** eslint-config-next 16.4 still bundles eslint-plugin-react, jsx-a11y and import, whose peer ranges stop at v9 (vercel/next.js#89764 is open). ESLint 9 has been EOL since 2026-08-06, so track this. Migration then: `eslint-plugin-import` → **`eslint-plugin-import-x`** (verified working in a scratch copy). | When next supports it     |
| `typescript`          | 5.9.3           | stay **5.9.3**. Defer 6.0 and 7.0.                  | TS 6 changes defaults (`types: []`, strict on, `baseUrl` deprecated). TS 7 (native Go port) is supported by `next build` only experimentally, and typescript-eslint caps TypeScript at `<6.1.0`.                                                                                                                             | Re-evaluate in Q1 2027    |
| `swiper`              | 12.2.0          | 14.3.0 **or removal**                               | v14 is a TypeScript rewrite with no code changes but a higher browser baseline. Removal is recommended instead (§6).                                                                                                                                                                                                         | Milestone 3               |

## 5. Deprecated, dormant or abandoned

| Package                       | Status                                                                                                                                                                                                 | Action                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `react-scroll` 1.9.3          | One release in 20 months; CommonJS, not tree-shakable (12.3 KB gzip). **It causes U1:** its links render without `href`, so they are keyboard-unreachable. It also conflicts with CSS `scroll-smooth`. | **Remove.** Use native `<a href="#id">`, `scroll-padding-top`, and a ~30-line IntersectionObserver hook for the active link.        |
| `@types/react-scroll` 1.8.10  | Only needed for react-scroll, and wrongly placed in `dependencies`.                                                                                                                                    | **Remove** together with react-scroll.                                                                                              |
| `react-countup` 6.5.3         | No release since 2024-03-22. No reduced-motion handling (verified). Renders "0" in server HTML.                                                                                                        | **Remove.** Write a small `count-up` client island with motion's `animate()`: final value in the SSR HTML, respects reduced motion. |
| `next-themes` 0.4.6           | Last release 2025-03-11, last commit 2025-05-31. Open React 19.2 dev-mode issues. **No effect today** (light theme forced, no toggle).                                                                 | **Remove** with the `.dark` tokens unless dark mode becomes a requirement.                                                          |
| `eslint-plugin-import` 2.32.0 | No ESLint 10 support; its release is stalled upstream.                                                                                                                                                 | Keep for now. Replace with `eslint-plugin-import-x` in the ESLint 10 PR.                                                            |

## 6. Redundant or unnecessary

| Package                               | Finding                                                                                                                                                    | Action                                                                                                                                                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sonner` + `components/ui/sonner.tsx` | Not mounted anywhere. No `toast()` calls.                                                                                                                  | **Remove.** Form feedback will be an inline, persistent status message, which is more accessible than a transient toast. Re-add via `shadcn add sonner` if toasts are ever needed.                                                              |
| `swiper`                              | 29 KB gzip + CSS for a 2-slide testimonial carousel. Fails WCAG 2.2.2 (no pause) and 2.5.8 (8 px bullets) as configured.                                   | **Replace** with the shadcn **Carousel** (`embla-carousel-react` 8.6.0 + `embla-carousel-autoplay` 8.6.0, about 9 KB gzip, no CSS), with a pause control. Alternatively, a static two-quote layout with no carousel at all (a design decision). |
| `react-icons` **and** `lucide-react`  | Two icon sets. lucide is used only by the generated shadcn files (4 icons). react-icons supplies the app icons and the brand logos that lucide v1 removed. | **Keep both for now.** shadcn generates lucide imports, and brand logos need react-icons or inline SVG. Optional later: standardise on lucide plus 4 inline brand SVGs. Low value.                                                              |
| `babel-plugin-react-compiler` 1.0.0   | Used through `reactCompiler: true`. It slows builds slightly (Babel pass).                                                                                 | Keep. Next 16.3+ has an experimental Rust compiler; revisit when it is stable.                                                                                                                                                                  |

## 7. Packages requiring an architectural decision

| Decision                | Options                                                                                      | Recommendation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Radix packaging**     | Keep 4 individual `@radix-ui/react-*` packages, or migrate to the unified `radix-ui` package | Migrate. Radix now publishes one unified `radix-ui` package; 1.7.0 bundles dialog 1.2.0, select 2.3.8, slot 1.4.0, tabs 1.1.22 and accordion 1.2.21 (npm, verified 2026-10-10). shadcn's Feb 2026 changelog says new-york now uses `radix-ui`, and `bunx shadcn@latest migrate radix` (CLI 4.21.4) rewrites the imports. Target **`radix-ui@1.6.7`** first (released 2026-07-24). Move to **1.7.x** once it has soaked 14 days: 1.7.0 was released 2026-10-05 and re-lands a Slot change for React Server Components that was reverted once in July. Verify `Button asChild` in a server component (404 page) after each step. shadcn's default for new projects is now Base UI, but "Radix is not being deprecated" and existing projects need not migrate. Stay on Radix. |
| **Lead delivery** (new) | Email API (Resend, Postmark, SES), a CRM form API, plus optional persistence                 | Product owner decision. Implement behind a `deliverLead()` adapter so the provider can change. Add the SDK only once the provider is chosen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Validation** (new)    | zod 4 vs valibot vs hand-written                                                             | **zod ^4** (4.6.x per the registry on 2026-10-10). One schema shared by the Server Action and the client hints, plus env validation. Next.js docs use zod in their forms guide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Testing** (new)       | Vitest vs Jest; Playwright                                                                   | **Vitest + RTL** (official Next guide) and **Playwright + @axe-core/playwright**. Exact versions are in §8.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Dark mode**           | Fix it vs remove it                                                                          | Remove unless required (open question in CURRENT_STATE_AUDIT §4).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## 8. New devDependencies proposed (versions checked on npm, 2026-10-10)

Add these only in Milestone 0 or 2, when tests are introduced.

| Package                                                      | Version                           | Note                                                                                                                        |
| ------------------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `vitest`                                                     | ^5.0.x (fallback ^4.1.11)         | Vitest 5 needs Node ^22.12 or ≥24, and Vite 8. Breaking changes: mocks are cleared per test, and unawaited assertions fail. |
| `vite`, `@vitejs/plugin-react`, `vite-tsconfig-paths`        | ^8.3, ^6.1, ^6.1                  | As in the Next.js Vitest guide.                                                                                             |
| `@testing-library/react`, `/dom`, `/user-event`, `/jest-dom` | ^16.3.3, ^10.4.2, ^14.6.7, ^7.0.1 |                                                                                                                             |
| `jsdom`                                                      | **^29.1** (not 30.x)              | jsdom 30 needs Node ≥ 24.15; the local machine has 24.13.                                                                   |
| `@playwright/test`                                           | ^1.63.0                           | 1.64.0 is only 3 days old.                                                                                                  |
| `@axe-core/playwright`                                       | ^4.13.0                           | WCAG scans in e2e.                                                                                                          |
| `zod`                                                        | ^4                                | Runtime dependency (Milestone 1/2).                                                                                         |

## 9. Packages that stay unchanged

`class-variance-authority` 0.7.1, `clsx` 2.1.1, `tw-animate-css` 1.4.0, `eslint-config-prettier` 10.1.8 and `babel-plugin-react-compiler` 1.0.0 are all already on their latest stable release with no advisories.

## 10. Target `package.json` shape (after Milestone 6)

```jsonc
{
  "name": "urban-build-pro",
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:e2e": "playwright test",
  },
  "dependencies": {
    "next": "16.3.8", // → 16.4.x later
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "radix-ui": "1.6.7", // → ^1.7.x after soak
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.7.0",
    "lucide-react": "^1.55.0",
    "react-icons": "^5.7.0",
    "motion": "^12.43.0",
    "embla-carousel-react": "^8.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    "zod": "^4",
    // + lead-delivery SDK once chosen
  },
  // removed: swiper, react-scroll, @types/react-scroll, react-countup, sonner, next-themes, 4× @radix-ui/react-*
}
```
