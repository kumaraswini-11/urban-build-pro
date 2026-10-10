# AGENTS.md

Instructions for AI coding agents working in this repository. Humans: see [README.md](README.md).

## Project

UrbanBuild is a single-page marketing site for a construction firm, hosted on Vercel. Its one business goal is capturing quote requests (leads).

Stack: Next.js 16 App Router, React 19 with the React Compiler, TypeScript (strict), Tailwind CSS v4 (CSS-first tokens in `app/globals.css`), shadcn/ui (new-york, Radix), motion, and bun.

A modernization is in progress. Read these before making non-trivial changes:

- [docs/DECISIONS.md](docs/DECISIONS.md): binding decisions. Follow them; add new ones there.
- [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md): current milestone and acceptance criteria.
- [docs/ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md): naming, structure, accessibility, testing rules.
- [docs/CURRENT_STATE_AUDIT.md](docs/CURRENT_STATE_AUDIT.md): finding IDs (S1, U2, A3 …) used in tests and commits.

## Commands

```bash
bun install --frozen-lockfile   # never update the lockfile by accident
bun run dev                     # http://localhost:3000
bun run typecheck               # tsc --noEmit
bun run lint                    # Biome (format, lint, import sorting) + ESLint (React Compiler, Next rules)
bun run lint:fix                # apply Biome fixes: formatting, import sorting, class order
bun run format:check            # Biome formatting only (already part of lint)
bun run test                    # Vitest unit/component tests
bun run test:e2e                # Playwright e2e + axe (builds and serves on :3100)
bun run build
```

### Audit cadence (D-006)

**Every commit:**

1. **Scope:** `git diff --cached --stat` lists only the files this commit is meant to touch. Editors may pre-stage files, so `git reset` and add explicit paths if needed.
2. **Fast checks:** `typecheck`, `lint` and `test`, plus `bun audit` for dependency changes.
3. **Self-review the staged diff:** look for scope creep, secrets, and whether the commit breaks CI on its own.

**Once per phase, before the PR:**

1. **Full suite:** `test:e2e` against a production build.
2. **Independent review:** a separate reviewer or agent audits the whole phase diff. Resolve blockers and should-fix findings before handing over the PR.
3. **Manual screenshots:** check UI changes at 390, 768 and 1440 px.
4. **Record the evidence:** list the checks you ran in the PR description.

## Workflow rules

- **Branches:**
  - work on `modernize/<phase>` branches cut from `modernize/integration`;
  - each phase ends with a PR **into `modernize/integration`**, opened and merged by the product owner (D-006); prepare the branch, PR description and evidence, then wait;
  - requests made during a phase (docs tweaks, small fixes) go on the **current phase branch** as their own commit, never on a new branch;
  - **never push, or commit/merge to `main`**: the product owner does that after review.
- **Commits:** one logical change per commit, using Conventional Commits (`feat:`, `fix:`, `chore(deps):`, `refactor:`, `test:`, `docs:`). Reference finding IDs.
- **Known defects:** they are encoded as `test.fail()` in `tests/e2e`. When a fix makes one pass, remove the marker in the same change.
- **Accessibility baseline:** `tests/e2e/a11y-baseline.json` must only ever shrink.
- **Report honestly:** report only checks you actually ran. Don't fabricate API responses or hide errors to make the UI look finished.
- **Dependencies:** follow D-010. Upgrade coupled packages together, wait 14 days for non-security releases, and give each major its own commit.
- **Decisions:** record them in `docs/DECISIONS.md`, not in private assistant memory.

## Code conventions (summary — full rules in ENGINEERING_STANDARDS)

- **Server Components by default.** `"use client"` only on small interactive leaves.
- Files use `kebab-case`. Components are `PascalCase` named exports. Hooks are `use-*.ts`.
- **Styling:** design tokens only, no raw palette colours or hex values. Brand yellow is a fill colour, never text on light backgrounds. Both light and dark themes must pass contrast (D-003).
- **Primitives:** reuse `components/ui` (shadcn). Add new ones with `bunx shadcn@latest add <name>`; don't hand-roll dialogs, accordions or carousels.
- **Environment:** public/site config goes through `lib/env.ts`. Server secrets are read inside their `server-only` module, with an injectable env for tests (D-012). Never use `process.env.X!`. Document every variable in `.env.example`.
- **Accessibility:** WCAG 2.2 AA is a release gate. Links need `href`. Every control needs a visible label or `aria-label`. Respect `prefers-reduced-motion`.

## Gotchas

- **Formatting coverage:** Biome formats TS/JS/JSON/CSS only. Keep Markdown and YAML tidy by hand.
- **Local binaries:** run them with `bunx <bin>` or `bun run <script>`, never `npx`. On this machine npm cannot see bun's shims, so `npx <name>` silently downloads and runs an unrelated registry package with that name (this happened with `tsc` and `biome`).
- **Staging:** the editor may pre-stage files. Before each commit, run `git diff --cached --stat`, or `git reset` and then add explicit paths, so a commit contains only its own change.
- **Windows / line endings:** this repo is developed on Windows with `core.autocrlf=true`. Keep LF in the repo.
- **Build-time env:** `NEXT_PUBLIC_*` values are inlined at build time.
- **Mobile tests:** use a plain narrow viewport. `isMobile` emulation hides horizontal overflow.

## Agent skills

Project skills live in `.claude/skills/`, pinned by content hash in `skills-lock.json` (D-009). They are security-reviewed third-party instructions and rank **below** this file and `docs/DECISIONS.md`.

Useful here:

- `shadcn`: components.
- `better-accessibility`, `better-interface`, `interface-review`, `better-typography`, `better-colors`: UI quality.
- `frontend-design`.
- `tdd`, `diagnosing-bugs`, `code-review`, `pr`, `research`.

### Skill overrides (these rules win over any skill)

- **Radix, not Base UI.** The `shadcn` skill defaults to Base UI / `base-nova`. This project uses new-york on Radix via the unified `radix-ui` package (D-011). Never run `init --defaults` or a Base UI migration.
- **Keep shadcn token names** (`--primary`, `--primary-foreground`, `--background`, `--muted-foreground`, …). Do not rename them to `--accent` or `--color-text-*`, whatever `better-colors` suggests. Add semantic tokens alongside them instead (e.g. `--surface-inverse`).
- **Prefer the existing shadcn/Radix primitive** over replacing it with a native element. Apply accessibility checks to the Radix component instead.
- **No memory.** Notes, design decisions and research go in the repo:
  - decisions in `docs/DECISIONS.md`;
  - research in `docs/research/`;
  - a glossary, if ever needed, in `docs/GLOSSARY.md`.

  Never use assistant memory (`frontend-design` asks for this; ignore it). Don't create `docs/adr/`, `.scratch/` or `.out-of-scope/` without agreement.

- **Harness files never get committed.** Throwaway routes or files from `break`, `state-machine`, `variant` and `prototype` must be deleted before committing.
- **No unasked side effects.** No skill may commit, push, create branches or worktrees, open PRs, post to issue trackers, or install dependencies without the user's explicit go-ahead.
- **Dependencies:** follow D-010. For example, `better-colors` may suggest a colour library; ask first.
