# Modernization Decision — UrbanBuild

**Decision: Strategy C — hybrid modernization in the existing repository**, done on a branch with small, verified PRs, starting with a same-day security fix.

Status: _Proposed, awaiting approval._ Date: 2026-10-10.

## 1. Options considered

- **A. In-place modernization:** upgrade and refactor the existing files.
- **B. Greenfield rebuild:** a new repository (create-next-app + `shadcn init`), porting content and assets.
- **C. Hybrid:** keep the repo, its tokens, content, assets, primitives and tooling. Rewrite the section components (the part that is structurally wrong) one at a time behind screenshot and accessibility baselines, and add the new modules (lead capture, env, tests, CI) cleanly.

How the decision was reached:

- Each option was argued by an independent advocate instructed to make the strongest honest case.
- Each advocate had to concede the points where the other option wins.
- The evidence base is [CURRENT_STATE_AUDIT](CURRENT_STATE_AUDIT.md) and [DEPENDENCY_AUDIT](DEPENDENCY_AUDIT.md).

## 2. Evidence that shapes the decision

1. **The foundation is right.** Next 16 App Router, React 19 with the Compiler, Tailwind 4, shadcn/ui, TypeScript strict and bun. [TARGET_ARCHITECTURE](TARGET_ARCHITECTURE.md) arrives at the same stack independently. A rebuild would reinstall the same framework at the same versions.
2. **"Update all libraries" is mostly in-major.** The critical security fixes are minor bumps: next 16.1.1 → 16.3.8, swiper 12.0.3 → 12.2.0. The only true majors (lucide 1.x, motion 14, swiper 14, ESLint 10, TS 6/7) are either drop-ins, blocked upstream, or better solved by removing the package. None requires a new repository.
3. **Most defects are local.** Of 26 verified findings, most touch 1–3 files:
   - the Portfolio id is one string;
   - the active nav colour is one class;
   - the heading styles are missing CSS utilities;
   - the mobile overflow is one `whitespace-nowrap`;
   - the build crash is three env reads.
4. **One structural problem exists.** `"use client"` is on 11 of 12 sections, and motion hides content until hydration. Fixing it means rewriting most section files, but section by section, in the same paths, with the old rendering as the visual oracle.
5. **The code is small** (about 1,900 hand-written LOC including content). Rewrite cost is not decisive either way. **Risk, continuity and time to first value are what decide it.**
6. **The business is losing leads today** (S3). The faster path to a working quote form wins.

## 3. Comparison

| Criterion                                    | A. In-place                                              | B. Greenfield                                                                                     | C. Hybrid (recommended)                                                           |
| -------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Engineering effort                           | ~10–14 d (risk of leaving structural debt)               | ~13–17 d (rebuild advocate) to ~18–26 d (modernize advocate's estimate including visual re-QA)    | **~13–19 d** (central ~15 d)                                                      |
| Time to first value (security, working form) | Day 1 / week 1                                           | Security needs a hotfix in the old repo anyway. A working form only arrives at cutover (~week 3). | **Day 1 / week 1**                                                                |
| Migration complexity                         | Low                                                      | High: cutover, DNS and env move, two repos during the transition                                  | Low to medium                                                                     |
| Regression risk                              | Medium (no tests today)                                  | Medium to high: no visual oracle, so drift is found by the client                                 | **Low:** screenshot and axe baselines captured before any change, one PR per area |
| Dependency compatibility                     | Same targets                                             | Same targets                                                                                      | Same targets                                                                      |
| UI/UX improvement potential                  | Medium (temptation to patch rather than redesign states) | High                                                                                              | **High:** sections are rebuilt properly while the approved look is preserved      |
| Architecture and maintainability             | Medium                                                   | High from day 1                                                                                   | **High:** same target tree, reached incrementally                                 |
| Feature parity                               | Guaranteed                                               | Must be re-proven                                                                                 | Guaranteed, verified by e2e and visual tests                                      |
| Testing requirements                         | Retrofit tests to existing code                          | Tests from commit 1                                                                               | Baseline tests first (M0), then tests per PR                                      |
| Deployment and rollback                      | Revert PR                                                | Revert = DNS switch back to the old site                                                          | **Revert PR.** Every merge is deployable.                                         |
| Long-term ownership cost                     | Medium                                                   | Low                                                                                               | **Low:** converges on the same target structure and standards                     |

## 4. What each side conceded

**The rebuild advocate conceded:**

- The P0s need no rebuild. They must be hot-fixed in the existing repo on day 0 regardless.
- In-place reaches the same quality bar **2–4 engineer-days sooner**.
- In-place keeps the deploy target, env, domain and links for free.
- A rebuild has a parity gap where visual drift slips in.
- Second-system scope creep (CMS, blog, dark mode) is a real risk.
- At 1,600 LOC, the difference between "greenfield" and "rewrite every file in place" is small.

**The modernize advocate conceded:**

- Most section files will be substantially rewritten anyway.
- Git history (10 commits) has little value.
- A greenfield build starts directly on current majors and drops cruft by construction.
- **If the product becomes multi-page (service pages, case studies, CMS, i18n), a route-first rebuild becomes the better option.**

## 5. Decision

Adopt **Strategy C**. In detail:

| Category     | Items                                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep**     | Next/React/Tailwind/shadcn/TypeScript/bun foundation. OKLCH tokens and radius-0 visual identity. DM Sans + Barlow. Content in `lib/constants.ts` (moved to `content/`). Brand atoms (`logo`, `pretitle`, `construction-button` → `cta-button`). shadcn primitives. ESLint/Prettier/tsconfig setup. Section order and information architecture. Image masters as re-encode sources. |
| **Upgrade**  | next 16.3.8 (→ 16.4.x), eslint-config-next, react 19.2.8 (→ 19.3), Tailwind 4.3.3 + tailwind-merge 3.7, motion 12.43, react-icons 5.7, lucide 1.x, prettier 3.9 + plugin 0.8.1, eslint 9.39.5, @types/node 24, radix → unified `radix-ui`.                                                                                                                                         |
| **Refactor** | Section components → Server Components + client islands. Single sticky header. Native anchor navigation. Type scale and semantic tokens. Contact section. Forms with labels and states. Images via `next/image`. Fonts. `not-found` as a server component. `layout.tsx` landmarks and skip link.                                                                                   |
| **Replace**  | `react-scroll` → native anchors + hook. `swiper` → shadcn Carousel (Embla) with pause. `react-countup` → small motion island. Custom FAQ → shadcn Accordion. `console.log` form → Server Action + zod + delivery adapter. CSS background hero → `next/image`.                                                                                                                      |
| **Remove**   | `sonner` + `ui/sonner.tsx`, `next-themes` + `.dark`/sidebar/chart tokens (unless dark mode is required), `@types/react-scroll`. Unused assets: `next.svg`, `vercel.svg`, `bg2.jpg`, `thumb-6.jpg`, `logo-only.svg`, the 0-byte `screenshot.png`. The fake `/contact` sitemap entry and the non-existent robots disallows.                                                          |
| **Defer**    | ESLint 10 + import-x (blocked by eslint-config-next). TypeScript 6/7. motion 14. next 16.4 until 16.4.1+. Single icon library. CMS. Dark mode. Turnstile (only if spam appears). Lighthouse CI budgets (after the first deploy).                                                                                                                                                   |

## 6. Conditions that would reverse this decision

Re-open the decision with a **route-first greenfield** (or a new app inside this repo) if any of these become true:

- the product needs multiple routes (per-service pages, project case studies, a blog, careers);
- non-developers must edit content regularly (a headless CMS);
- i18n or multi-region sites are needed;
- the brand or visual identity is being redesigned, so the current look stops being the acceptance oracle.

## 7. Risks and mitigations

| Risk                                           | Mitigation                                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Next 16.1 → 16.3 regression                    | The app uses no route handlers, middleware or caching APIs. Smoke, screenshot and axe baselines run before and after. Revertable PR. |
| Visual regressions during the section refactor | Playwright screenshot baselines at 390, 768 and 1440 px. One PR per section with side-by-side review.                                |
| Lead delivery failure after go-live            | Provider adapter, server-side failure log (or a persisted copy), e2e test against a sandbox, monitoring of action errors.            |
| Spam once the form works                       | Honeypot + rate limit at launch. Turnstile if needed.                                                                                |
| Scope creep                                    | v1 scope is frozen to today's single page plus working lead capture. Everything else goes on a parking list.                         |

## 8. First implementation milestone

**M0 + M1 — "Safe to build, safe to run, measured"** (about 2–2.5 engineer-days, two PRs). Details and acceptance criteria are in [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md).

**M0 — safety net:**

- Create a branch and tag the current commit `baseline-2026-10-10`.
- Add a Playwright smoke test, screenshot baselines, a recorded axe baseline, and an overflow assertion (expected to fail for now).
- Add `typecheck` and `test` scripts.
- Add CI that builds without `.env`.

**M1 — security and build:**

- Upgrade to next and eslint-config-next 16.3.8, react 19.2.8 and swiper 12.2.0, with `sharp ≥ 0.35.5` resolved in the lockfile.
- Add `lib/env.ts` and fix `layout.tsx`, `robots.ts` and `sitemap.ts`.
- Set `poweredByHeader: false` and baseline security headers.
- Exit criteria:
  - a fresh clone builds with no `.env`;
  - `bun audit` shows 0 critical and 0 high in runtime dependencies;
  - screenshots are unchanged;
  - the axe count is no worse than the baseline.

**Next: M2 (lead capture),** which stops the ongoing loss of leads.
