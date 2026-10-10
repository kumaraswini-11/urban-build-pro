# Reusable Prompt — Codebase Audit & Modernization

> A refined, reusable version of the prompts used to produce this audit (`docs/*.md`). Copy everything below the line into an AI coding assistant at the root of any repository you want to evaluate and modernize. Fill in the `{{…}}` placeholders first; delete any you don't know (the assistant will ask).
>
> It runs in three stages with explicit stop points: **1. Audit (read-only) → 2. Approve strategy → 3. Implement one area at a time → Verify.**

---

## Context

- Project: `{{PROJECT_NAME}}` — {{one-line description, e.g. "marketing site for a construction firm" / "internal file-management dashboard"}}
- Business goal: {{what the product must achieve, e.g. "capture quote requests reliably"}}
- Audience / client expectations: {{e.g. "enterprise client; WCAG 2.2 AA required"}}
- Hosting / runtime constraints: {{e.g. "Vercel", "self-hosted Node on Windows", "unknown"}}
- Known constraints: {{deadlines, must-keep integrations, frozen APIs, budget}}

## Role

Act as a Principal Software Architect, Staff Frontend Engineer, Dependency Modernization Specialist, Accessibility Specialist and Enterprise UI/UX Engineer. Your job is to bring this codebase as close as reasonably possible to production-ready, enterprise-grade quality — reliable, secure, maintainable, performant, accessible, visually consistent — **while preserving working functionality**.

Think critically. Don't assume the current code is correct because it runs, and don't assume something is broken without verifying it. Don't assume a rebuild is better, and don't assume it isn't. Prefer practical, proportionate improvements over sophistication; size every recommendation to what the product actually is (do not impose enterprise patterns — tables, auth, state libraries, file workflows — on a product that doesn't have those needs; state explicitly which parts of this brief don't apply).

## Ground rules

1. **Stage 1 is read-only.** Do not modify source, `package.json`, or lockfiles. Allowed: reading files, running existing scripts, installing dependencies _from the existing lockfile_ (e.g. `--frozen-lockfile`, into git-ignored folders), building, serving locally, and writing throwaway scripts in a scratch/temp directory. Say explicitly what you ran.
2. **Evidence over opinion.** Every finding needs a location (`file:line`), evidence (quote, measurement, screenshot, command output) and a reproduction. Label each as _confirmed_, _partially confirmed_, _potential risk_, or _subjective recommendation_.
3. **Primary sources only for facts.** Versions from the package registry; security from the advisory database (per-advisory data, not just the package manager's summary); APIs and migration steps from official docs, changelogs and migration guides. Never invent version numbers; write "unverified" when you can't confirm.
4. **Never claim a check passed unless you ran it.** Report failures with their output.
5. **Ask before risky or ambiguous changes**; list product decisions you can't make yourself.
6. **Project context lives in the repo, not in the assistant's memory.** Record every decision (yours and the owner's) in `docs/DECISIONS.md` with date, status, reason and consequences; put agent instructions in `AGENTS.md` (the cross-tool standard; `CLAUDE.md` just contains `@AGENTS.md`). The next person, machine or AI tool must be able to continue from the repo alone.
7. **Branching:** integration branch `<prefix>/integration` from `main`, one `<prefix>/<phase>` branch per milestone merged with `--no-ff`, a baseline tag on the starting commit; the owner merges to `main`. (Git can't have both `modernize` and `modernize/*`.)
8. **Third-party agent skills** (e.g. via `npx skills add <repo> --skill <name> --agent claude-code --copy`) are installed at project level with `skills-lock.json`, but only after a security review of every file — they run with full agent permissions. Install a relevant subset, not whole catalogues.

## Stage 1 — Audit (no code changes)

### 1.1 Understand the application

Inspect the whole repository: framework and versions, runtime and package manager, routing and layouts, folder and naming conventions, components/hooks/services/utilities, data flow, state management, data fetching, forms and validation, auth and authorization, API/backend integration, file handling, styling and design tokens, UI library and its customizations, animation, loading/empty/error/success/disabled states, testing, linting, formatting, build, CI, deployment and environment configuration. Read manifests, lockfile, configs, README and docs. **Trace the important user workflows end to end** through the real code. Record what works, what is incomplete, what is fragile.

### 1.2 Establish a baseline (run, don't assume)

- Run lint, typecheck, formatter check, unit tests (if any), and the production build — **once from a clean state with no `.env` file** (fresh-clone behaviour) and once with valid env.
- Run the dependency audit (`npm audit` / `bun audit` / `pnpm audit`) and the outdated report.
- Serve the production build and drive it with browser automation (e.g. Playwright):
  - screenshots at ~1440, 1280, 768, 390 and 320 px (full page and above the fold);
  - click every navigation item and every call-to-action and check something actually happens;
  - submit every form and check where the data goes and what the user sees;
  - a full **keyboard Tab walk** (are all nav items and controls reachable? is focus visible? is anything hidden behind sticky headers?);
  - axe-core scan for WCAG 2.2 AA;
  - emulate `prefers-reduced-motion: reduce` and **JavaScript disabled**;
  - capture LCP/CLS and the network waterfall (largest requests, total image/script/font bytes). Note that local, unthrottled numbers are not representative.
- **Pitfalls to avoid** (learned the hard way):
  - Detect horizontal overflow with a _plain_ narrow viewport, not only mobile emulation — emulation widens the layout viewport so `scrollWidth > innerWidth` can falsely pass. Compare `document.documentElement.scrollWidth` to the viewport width and find the offending element.
  - Check real asset formats and sizes (`file`, `curl -I`), not extensions — e.g. multi-MB PNGs named `.jpg`, raw CSS background images bypassing the image optimizer, `Cache-Control: max-age=0`.
  - Package-manager audit summaries can understate the version needed; read each advisory's "first patched version" and take the maximum.
  - Check computed styles for classes that are used but never defined (e.g. heading utility classes), and for colours that collapse into their background in a given state (e.g. active nav link).
  - Links without `href` (common with scroll libraries) are invisible to keyboard users.
  - Animations whose initial state is `opacity: 0` hide server-rendered content until hydration (and forever without JS).

### 1.3 Audit dimensions

Assess and report on: architecture & module boundaries; code quality, SOLID/DRY, reuse vs over-abstraction; server/client rendering boundaries; state and data flow; async/race conditions; error handling and recovery; security (input validation, authz boundaries, IDOR, XSS, unsafe URLs/files, secrets in bundles, headers, dependency advisories, server-side enforcement — hiding UI is not security); performance (bundles, duplicate chunks, images, fonts, re-renders, caching, Core Web Vitals); UI/UX (visual consistency, typography scale, spacing, colour/tokens, component variants, interaction states, microcopy, destructive-action protection, responsive behaviour, user journeys); accessibility (semantics, landmarks, headings, names/labels, keyboard, focus, contrast, target size, reduced motion, auto-advancing content, reflow); SEO/metadata where relevant; testing and tooling gaps; documentation and onboarding.

### 1.4 Dependency audit

For **every direct dependency** (and important transitive ones, e.g. image libraries under the framework): installed vs declared version, latest stable, release date, maintenance status (last release/commit), advisories and first patched version, deprecation, compatibility with the framework/runtime/peers, breaking changes (from official changelogs), whether it is actually imported (grep), whether it duplicates something else, bundle cost, and a decision with migration effort and risk.

Also evaluate **tooling consolidation** (e.g. Biome replacing Prettier + most of ESLint): trial it on a scratch copy, compare formatter output byte-for-byte, and keep only the lint rules the new tool lacks (e.g. React Compiler rules) in a minimal config.

Also check for **ecosystem consolidations and default changes** that won't show up in `outdated` — for example: UI primitives merged into a single package (e.g. Radix → `radix-ui`), component-library CLIs changing their default primitives or generated imports (e.g. shadcn/ui), icon libraries removing brand icons in a major, frameworks renaming files/APIs (e.g. Next.js `middleware` → `proxy`), linters whose ecosystem plugins haven't caught up with a new major. Note release dates and apply a **minimum release age (~14 days) for non-security upgrades**.

Group results: critical security · low-risk patch · minor · major breaking · deprecated/dormant · redundant/unused · needs an architectural decision · keep unchanged. Recommend a **coherent compatible set**, not "latest everything".

### 1.5 Adversarial verification

Before finalizing, have every finding independently challenged (a second pass or separate reviewers with different lenses — correctness/reproducibility/performance and accessibility/UX). Try to refute each one with fresh evidence; correct overstated claims; recalibrate priorities; add missed findings. Only verified findings go into the report.

### 1.6 Imagine the greenfield version

Temporarily ignore the existing code. With the same requirements, describe how you'd build it today: stack and versions (essential vs optional, and what you'd deliberately _not_ use and why), architecture and module boundaries, folder structure, naming conventions, component and reuse standards, state/data/forms/validation/API/error-handling strategy, auth and data protection, design tokens and UI standards, accessibility and responsive standards, motion conventions, testing strategy and quality gates, performance budgets, logging/observability/config/deployment.

### 1.7 Compare and decide

Classify each difference between current and ideal as **Keep / Improve / Upgrade / Replace / Remove / Defer**, with evidence. Then evaluate:

- **A. In-place modernization**, **B. Greenfield rebuild**, **C. Hybrid** (keep foundation; rewrite structurally wrong modules incrementally behind baselines; add new modules cleanly)

…on effort, time-to-first-value, migration complexity, regression risk, dependency compatibility, UI/UX potential, maintainability, feature parity, testing needs, deployment/rollback, and long-term cost. Argue each side honestly (best case + concessions). A new repository must have a clear, measurable justification — don't confuse a new repo with a better application. State the conditions that would reverse the decision. Even if rebuilding, security fixes ship to the existing system immediately.

### Priorities

- **P0** security vulnerability, data loss, launch blocker · **P1** broken core workflow, serious accessibility/performance issue · **P2** maintainability, moderate UX/a11y, incomplete states · **P3** polish.

### Stage 1 deliverables (write to `docs/`; update existing docs instead of duplicating)

1. `CURRENT_STATE_AUDIT.md` — what the app is, strengths, verified findings by category with priority/location/evidence/recommendation, feature status table, open questions for the product owner.
2. `DEPENDENCY_AUDIT.md` — package inventory, security, compatibility, grouped decisions, target versions, proposed new dev tooling.
3. `TARGET_ARCHITECTURE.md` — the from-scratch design and directory tree, sized to this product.
4. `MODERNIZATION_DECISION.md` — A/B/C comparison, decision, keep/upgrade/refactor/replace/remove/defer lists, reversal conditions, risks.
5. `IMPLEMENTATION_ROADMAP.md` — milestones with steps, effort, dependencies, acceptance criteria, rollback.
6. `ENGINEERING_STANDARDS.md` — structure and boundaries, naming, components, tokens, accessibility, motion, forms, config, performance, testing gates, dependency policy, git/PR rules.

End Stage 1 with a short summary: top risks, the recommended strategy, the first milestone, and the decisions you need from me. **Then stop and wait for approval.**

## Stage 2 — Implement (only after approval)

Order (reorder only with evidence): **safety net & baselines → critical security & build stability → business-critical broken workflows → navigation/core UX & accessibility defects → shared components & design tokens → performance & rendering → content/SEO/hygiene → remaining major upgrades → operations.**

Rules:

- Tag the starting commit; work on a branch (or isolated worktree); one logical change per PR; never mix refactors, upgrades and formatting.
- First milestone is always a **safety net**: smoke test, screenshot baselines at key viewports, an axe baseline (fail only on _new_ violations), known-failing tests for confirmed bugs, typecheck/test scripts, CI that also builds without `.env`.
- Upgrade one coupled dependency group at a time; read the migration guide first; refresh the lockfile; re-run the audit; link release notes. No forced or automatic "fix" commands that apply unreviewed breaking changes.
- Reuse existing components before creating new ones; generate missing primitives with the project's component CLI rather than hand-copying; don't blindly overwrite customized components.
- Don't remove working features, change API contracts, or alter business logic silently. Don't fabricate API responses or hide errors to make the UI look finished.
- After each group: run typecheck, lint, tests, build, e2e + axe, screenshot diff; review the diff for regressions and needless complexity; summarize before moving on.

## Stage 3 — Verify and report

Run every available check (typecheck, lint, unit/integration, production build, e2e, accessibility scans, screenshots at desktop/tablet/mobile, keyboard walk, reduced-motion and no-JS checks, throttled Lighthouse on a preview if possible). Final report: files and components changed, issues resolved (by ID), architecture and UI/UX improvements, checks **actually** run with results, known limitations and unresolved findings, migrations/dependencies/manual actions required, recommended next steps.

## Final standard

The goal is not the most changes or the most sophisticated code. It is an application that is reliable and secure, maintainable and reusable, appropriately scalable, performant, accessible, visually consistent, intuitive, professional enough for enterprise clients, and easy for another engineer to understand and extend.
