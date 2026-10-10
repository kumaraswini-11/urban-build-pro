# Decision Log — UrbanBuild

This file is the single source of truth for decisions about this project. It lives in the repo so the context survives a change of machine, person or AI tool. Do not keep decisions only in an assistant's private memory.

Add new entries at the bottom. Never rewrite an old entry: supersede it with a new one and update its status.

Format: **ID — title** · date · status · who decided, followed by the decision, the reason, and its consequences.

---

### D-001 — Modernize in place (hybrid), not a greenfield rebuild

2026-10-10 · Accepted · Product owner (on Claude's recommendation)

- **Decision:** keep this repository. Rewrite the section components incrementally behind screenshot and accessibility baselines. Add new modules (lead capture, env, tests, CI) cleanly.
- **Why:** the existing stack is the stack a greenfield build would pick. The defects are mostly local. This route gives working leads in week 1 and every change can be reverted. Evidence is in [MODERNIZATION_DECISION](MODERNIZATION_DECISION.md).
- **Revisit if:** the site goes multi-page, needs a CMS or i18n, or the visual identity is redesigned.

### D-002 — Hosting: Vercel

2026-10-10 · Accepted · Product owner

- **Consequences:**
  - The site URL falls back to `VERCEL_PROJECT_PRODUCTION_URL` when `NEXT_PUBLIC_SITE_URL` is not set.
  - The Windows-host Next.js RCE advisory (GHSA-p293-qw3h-jr36) does not apply in production, but Next.js is still upgraded for the other advisories.
  - Image optimization runs on Vercel.
  - Lead delivery defaults to a Vercel-friendly provider (D-005).

### D-003 — Dark mode is required

2026-10-10 · Accepted · Product owner · _Supersedes the audit's suggestion to remove dark mode._

- **Decision:** keep `next-themes` and ship an accessible theme toggle (light / dark / system).
- **Implementation:**
  - fix the `.dark` tokens;
  - replace `bg-foreground` / `text-background` inversions with semantic `surface-inverse` / `on-inverse` tokens;
  - every screen must pass contrast checks in both themes.
- **Note:** `next-themes` is dormant (last release 2025-03), but it is the shadcn-documented approach. Re-evaluate if React/Next updates break it.

### D-004 — Newsletter deferred

2026-10-10 · Accepted · Product owner (“later”)

- **Decision:** do not ship the current non-functional newsletter form. Remove it from the footer until the newsletter is wanted.
- **Later:** rebuild it on the lead-capture module (same action/adapter pattern).

### D-005 — Lead delivery: provider-agnostic adapter, Resend as default

2026-10-10 · Accepted (provider confirmable later) · Claude, delegated by product owner

- **Decision:**
  - quote requests go through a Server Action with zod validation and a honeypot; rate limiting happens at the edge (amended by D-012);
  - delivery goes through a `deliverLead()` adapter;
  - default provider is Resend (common on Vercel); it can be swapped for Postmark, SES or a CRM without touching the form.
- **Rule:** if the provider is not configured, the form shows an honest error with the phone and email fallback. It never shows a fake success.

### D-006 — Branching model for the modernization

2026-10-10 · Accepted · Product owner

- **Integration branch:** `modernize/integration`, created from `main`.
- **Phase branches:** one per roadmap phase (`modernize/m1-security`, `modernize/m1b-tooling`, …), each cut from the latest `modernize/integration`.
- **Audit cadence** (revised 2026-10-10 at the owner's request, for speed):
  - every commit: scope check, fast checks (typecheck, lint, unit) and a self-review;
  - once per phase, before the PR: the full e2e suite, an independent review of the whole phase diff, and a manual screenshot review.

  The procedure is in `AGENTS.md`.
- **Scope rule:** any task the product owner asks for while a phase is in progress belongs to **that phase branch** (as its own commit). Do not open a separate branch or PR for small in-phase requests.
- **Pull requests:** each phase branch gets a PR **targeting `modernize/integration`** (merge commit, not squash). The product owner opens and merges these PRs; the assistant prepares the branch, the PR description and the verification evidence, then waits. The next phase starts from the updated integration branch.
- **Final review:** PR #1 (`modernize/integration` → `main`) stays open as the cumulative review and is merged by the product owner when every phase is done.
- _History:_ M0 and M0b were merged into the integration branch locally before this PR flow was set up. They arrive in `main` through PR #1.
- **Baseline tag:** the original state is tagged `baseline-2026-10-10`.
- **Main:** the product owner reviews the integration branch and merges it into `main` themselves. Nothing is pushed or merged to `main` by an assistant.
- **Naming note:** git cannot have a branch named `modernize` alongside `modernize/*`, which is why the integration branch is `modernize/integration`.

### D-007 — Tooling: Biome, plus a minimal ESLint for two official plugins

2026-10-10 · Accepted · Claude, delegated by product owner

- **Decision:**
  - Biome (pinned exactly) replaces Prettier, prettier-plugin-tailwindcss, eslint-config-next, eslint-config-prettier and eslint-plugin-import, for formatting, linting, import sorting and Tailwind class sorting.
  - A minimal **ESLint 10** config keeps only `eslint-plugin-react-hooks` v7 (the React team's React Compiler rules) and `@next/eslint-plugin-next` (core-web-vitals).
- **Why:**
  - In a trial on this repo, Biome's formatting was byte-identical to Prettier, and it ran about 30× faster.
  - It parses Tailwind v4 CSS.
  - It has far broader accessibility linting (about 33 rules vs 6 warnings).
  - It gets the project off ESLint 9, which reached end of life on 2026-08-06; ESLint 10 is blocked only by eslint-config-next's bundled plugins.
  - The React Compiler rules exist in Biome only as a nursery rule, and this app compiles with the React Compiler, so those rules stay in ESLint.
- **Costs:**
  - A one-time Tailwind class re-sort (Biome's order is not Tailwind's official order).
  - Markdown and YAML are no longer format-checked: Biome does not format them, and `ignoreUnknown` skips them.
  - Requires `.gitattributes` `eol=lf`.
- **Implemented in M1b (2026-10-10):**
  - **Pins:** Biome 2.5.14, ESLint 10.11.0, typescript-eslint 8.70.1, eslint-plugin-react-hooks 7.1.1, @next/eslint-plugin-next 16.3.8.
  - **Import sorting:** `organizeImports` is an error in `lint`/CI and is applied by `lint:fix`.
  - **Editor-agnostic:** no editor settings are committed. Configuration lives in `biome.json`, `eslint.config.mjs` and `.gitattributes`, and every editor's Biome/ESLint integration reads those files.
  - **Blame:** the bulk commits are listed in `.git-blame-ignore-revs`.
- **Drop ESLint when:** Biome's `useReactCompiler` leaves nursery.

### D-008 — Project context lives in the repo

2026-10-10 · Accepted · Product owner

- **Decision:** decisions go in this file. Conventions go in [ENGINEERING_STANDARDS](ENGINEERING_STANDARDS.md). Agent instructions go in `/AGENTS.md`, the cross-tool standard, as the **single** instructions file. Claude Code (v2.1.277+) reads `AGENTS.md` directly when no `CLAUDE.md` exists, so the repo has no `CLAUDE.md` (removed 2026-10-10 at the owner's request). Fallback for older Claude Code, or for sessions that can't read `AGENTS.md`: a one-line `CLAUDE.md` containing `@AGENTS.md`. Note that a personal `CLAUDE.local.md` also stops `AGENTS.md` from being read. Source: https://code.claude.com/docs/en/memory.md#agentsmd
- **Rule:** assistants must not rely on private memory for project decisions.

### D-009 — Agent skills are vendored in the repo

2026-10-10 · Accepted · Product owner

- **Decision:** curated third-party skills are installed at project level in `.claude/skills/` with `npx skills add … --copy`. `skills-lock.json` records the source and content hash of each.
- **Sources:**
  - jakubkrehel/skills (UI/UX);
  - a selected subset of mattpocock/skills (engineering workflow);
  - the official shadcn-ui/ui `shadcn` skill;
  - anthropics/skills `frontend-design`.
- **Rule:** every skill is security-reviewed before it is committed. They run with full agent permissions.
- **Review result (2026-10-10):**
  - 31 candidates were read file by file. No malware or prompt injection was found.
  - **25 installed:** 13 jakubkrehel; `shadcn`; `frontend-design`; mattpocock code-review, codebase-design, diagnosing-bugs, domain-modeling, improve-codebase-architecture, pr, prototype, research, tdd, writing-for-agents.
  - **Excluded:** `implement-spec` and `implement` (create branches or worktrees and commit without asking); `triage` (checks out and runs code from external PRs); `to-spec` and `to-tickets` (publish to external trackers); `grill-with-docs` (depends on a skill not included).
  - Conflicts with project rules are neutralised by the "Skill overrides" section in `AGENTS.md`.
- **Updating:** `npx skills update -p`, then review the diff like code.

### D-010 — Dependency release-age policy

2026-10-10 · Accepted · Claude

- **Decision:** non-security upgrades use versions published at least **14 days** earlier. Security patches are exempt.
- **Coupled packages upgrade together:**
  - next + eslint plugin;
  - react + react-dom + types;
  - tailwindcss + @tailwindcss/postcss + tailwind-merge.
- **Majors:** each gets its own PR, with the migration guide linked.

### D-011 — Stay on Radix, migrate to the unified `radix-ui` package

2026-10-10 · Accepted · Claude

- **Decision:** shadcn now defaults new projects to Base UI, but Radix is not deprecated and existing projects need not migrate.
  - Migrate the 4 `@radix-ui/react-*` packages to unified `radix-ui` with `shadcn migrate radix`.
  - Start on 1.6.7. Move to 1.7.x after it soaks: 1.7.0 was published 2026-10-05 and re-lands a Slot change for React Server Components that had been reverted once.

### D-012 — Lead capture: spam protection, delivery driver and env handling

2026-10-10 · Accepted · Claude (owner actions listed)

- **Decision:**
  - The form has a honeypot field (`hp_ref`, named so autofill ignores it) plus server-side zod validation.
  - **No in-code rate limiter:** in-memory limits don't work across Vercel instances.
  - Abuse is limited at the edge instead (owner actions below), and the `to` address is fixed, so the form can't be used as an open relay.
- **Owner actions (Vercel / Resend dashboards):**
  1. Set the Production env vars `RESEND_API_KEY`, `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` (with a verified sending domain).
  2. Add a Vercel Firewall rate-limit rule for POST requests carrying the `Next-Action` header, e.g. a few per minute per IP; check your plan includes it.
  3. Set a Resend usage alert.
- **Delivery driver:**
  - `LEAD_DELIVERY=console` logs leads instead of emailing them. It's used for local dev and e2e tests, and refused on Vercel production.
  - On Vercel *preview* deployments it's allowed, so preview submissions are logged (including personal data) rather than emailed. Previews sit behind Vercel deployment protection.
  - **Self-hosting:** never set `LEAD_DELIVERY=console` in production.
- **Env handling:**
  - Server secrets are read inside `deliver.ts` (guarded by `server-only`, which Next aliases internally, so there's no extra dependency), with an injectable env for tests.
  - `lib/env.ts` stays limited to public/site config.

### D-013 — Visual screenshot tests removed

2026-10-10 · Accepted · Product owner

- **Decision:** remove the Playwright `toHaveScreenshot` baselines and `test:visual` scripts. The owner deleted the PNGs in d9caf82; the spec and scripts followed.
- **Why:**
  - the baselines were platform-specific (Windows only, never run in CI);
  - they added about 9 MB of binary history per UI change;
  - they kept being invalidated by in-progress UI work.
- **Instead:** the e2e and axe suites guard behaviour and accessibility, and UI changes get a manual screenshot review at 390, 768 and 1440 px before each phase PR.

### D-014 — Final fixes phase: implementation choices

2026-10-10 · Proposed (pending owner review of the phase PR) · Claude

- **shadcn components re-synced with upstream.** `components/ui` was replaced with today's official new-york-v4 registry versions (unified `radix-ui` imports). The only local customisation is a full-strength focus ring (`ring-ring` instead of `ring-ring/50`, A3). Accordion and Carousel were added from the same registry.
- **Navigation:**
  - native `#anchor` links with CSS smooth scrolling and `scroll-padding-top`;
  - an IntersectionObserver hook for the active link (`aria-current`);
  - one CSS-sticky header instead of a static header plus a fixed duplicate.
  This replaces react-scroll.
- **Testimonials:** an Embla carousel with **no autoplay**, which satisfies WCAG 2.2.2 without a pause control. It replaces Swiper.
- **Stats:** a small motion count-up; the final values render on the server and when motion is reduced. It replaces react-countup.
- **Dark mode (D-003):**
  - semantic `--inverse` / `--on-inverse` tokens for always-dark surfaces (header, footer, stats, mobile menu);
  - a single light/dark toggle button in the header, defaulting to light (the owner asked for no "system" option);
  - focus rings use brand yellow on the inverse surfaces, so they are visible in both themes;
  - axe reports 0 violations in both themes, and the e2e a11y test scans both.
- **Images:** the hero and portfolio sources were re-encoded with sharp (`scripts/optimize-images.mjs`); the hero went from 7.6 MB to 363 KB. The hero now uses a preloaded `next/image` instead of a CSS background.
- **Fonts:** DM Sans as a variable font; Barlow limited to weights 400–800.
- **Removed:** react-scroll, @types/react-scroll, react-countup, swiper, sonner, the four `@radix-ui/react-*` packages, and unused assets.
- **Deferred (not done in this phase):**
  - next 16.4 / React 19.3 (wait for 16.4.1+);
  - motion 13/14, and `LazyMotion`;
  - dropping ESLint (when Biome's `useReactCompiler` is stable);
  - About section still starts at opacity 0 (motion) without JS; `not-found` is still a client component;
  - Services tabs keyboard orientation (arrow keys follow the horizontal default);
  - zod-validated content modules, removal of unused `sidebar-*`/`chart-*` tokens, linting `components/ui`;
  - package name (`construction-1`) and LICENSE (owner decision);
  - privacy page and real content (owner).
