# Engineering Standards — UrbanBuild

These standards apply to all new and refactored code. Where the current code differs, follow these standards when touching it; don't mass-rewrite only for style. See [TARGET_ARCHITECTURE](TARGET_ARCHITECTURE.md) for the structure these standards assume.

## 1. Folder structure and boundaries

| Folder                    | Contains                                                                                          | May import from                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `app/`                    | Routes, layouts, metadata routes, `globals.css`                                                   | everything below                                         |
| `features/<name>/`        | A vertical slice with behaviour (e.g. `lead-capture`): server actions, schema, client form, tests | `components`, `content`, `lib`, `hooks`                  |
| `components/ui/`          | shadcn primitives (generated, then owned)                                                         | `lib/utils` only                                         |
| `components/brand/`       | Brand atoms: logo, pretitle, cta-button, social-links                                             | `ui`, `lib`, `content`                                   |
| `components/layout/`      | Site chrome: site-header, site-footer, topbar, section wrapper                                    | `ui`, `brand`, `interactive`, `content`, `lib`           |
| `components/sections/`    | Page sections, **Server Components**                                                              | `ui`, `brand`, `layout`, `interactive`, `content`, `lib` |
| `components/interactive/` | Small `"use client"` islands                                                                      | `ui`, `brand`, `hooks`, `lib`                            |
| `content/`                | Typed and validated copy and data                                                                 | `lib` (schemas), nothing from `components`               |
| `lib/`                    | Framework-agnostic helpers: `env`, `seo`, `section-ids`, `utils`                                  | nothing app-specific                                     |
| `hooks/`                  | Client hooks (`use-*.ts`)                                                                         | `lib`                                                    |
| `tests/`                  | e2e, a11y and visual Playwright specs                                                             | —                                                        |

Rules:

- No circular imports. Sections never import other sections.
- Always use the `@/` alias for cross-folder imports. Use relative imports only inside one feature folder.
- Server-only modules (`actions.ts`, `deliver.ts`, `lib/env.ts` server part) import `server-only` and never reach a client file.

## 2. Naming conventions

| Thing                 | Convention                                                                         | Example                                                        |
| --------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Files and folders     | `kebab-case`                                                                       | `quote-form.tsx`, `section-ids.ts`                             |
| React components      | `PascalCase` **named** exports (no default export except Next route files)         | `export function QuoteForm()`                                  |
| Next route files      | Next's names with default export                                                   | `page.tsx`, `layout.tsx`, `not-found.tsx`                      |
| Hooks                 | `use-*.ts` file, `useCamelCase` export                                             | `use-active-section.ts` → `useActiveSection`                   |
| Server actions        | verb + noun, `async`                                                               | `submitQuote`, `subscribeNewsletter`                           |
| zod schemas / types   | `camelCaseSchema` + inferred `PascalCase` type                                     | `quoteSchema`, `type QuoteInput = z.infer<typeof quoteSchema>` |
| Content exports       | `camelCase` nouns                                                                  | `services`, `projects`, `faqs`, `siteConfig`                   |
| True constants        | `SCREAMING_SNAKE_CASE` only for primitive config                                   | `HEADER_HEIGHT_PX`                                             |
| Props types           | `<Component>Props`, declared next to the component                                 | `CtaButtonProps`                                               |
| Booleans              | `is` / `has` / `should` prefix                                                     | `isOpen`, `hasError`                                           |
| Event handlers        | `handle*` internally, `on*` as props                                               | `onOpenChange={handleOpenChange}`                              |
| CSS custom properties | `--kebab-case`, semantic not visual                                                | `--surface-inverse`, not `--black`                             |
| Test files            | `*.test.ts(x)` for Vitest next to the code; `*.spec.ts` for Playwright in `tests/` | `schema.test.ts`, `navigation.spec.ts`                         |

## 3. Components

- **Server by default.** Add `"use client"` only to the smallest leaf that needs state, effects, browser APIs or event handlers. Pass server-rendered content into client islands as `children`.
- **Single responsibility.** A section composes; it does not hold interaction logic. Extract any logic into a hook or an island.
- **Props are minimal and typed.** Prefer composition (`children`, `asChild`) over boolean prop explosions. Variants go through `cva`.
- **Reuse before creating.** Check `components/ui` and `components/brand` first. Don't re-implement a primitive (dialog, accordion, tabs, carousel). Generate it with `bunx shadcn@latest add <name>`, then restyle it.
- **Generated `ui/` files are owned code:** they are formatted and tested. They are excluded from linting so they stay close to upstream shadcn; review changes to them by hand. Customise them through variants, not one-off `className` overrides repeated across call sites.
- **Keys:** stable ids or slugs, not array indexes, for any list that can change.
- **No dead code.** No commented-out JSX, unused props or unused files.
- **No hard-coded copy in sections.** Text comes from `content/`. Microcopy (button labels, form messages) lives with its component or in `content/site.ts`.

## 4. Styling and design tokens

- Use **tokens only**: `bg-primary`, `text-foreground`, `bg-surface-inverse`. No raw palette classes (`bg-white`, `bg-slate-50`, `text-white`) and no hex or OKLCH values in components.
- **Typography:** use the `@utility` scale (`display`, `h1`–`h4`, `eyebrow`, `lead`, `body`, `caption`). No ad hoc `text-[13px]` or `tracking-[2px]`. Letter-spacing values come from tokens.
- **Spacing:** use the Tailwind scale. Section vertical rhythm uses a shared `section` utility or wrapper.
- **Radius** is `0` by design: use `rounded-none` / tokens and never mix in `rounded-md` / `rounded-sm` ad hoc.
- **Brand yellow** is a fill colour behind dark text. It is **never text on a light background** (contrast about 1.6:1).
- **Inverse surfaces** use `surface-inverse` / `on-inverse` tokens, not `bg-foreground text-background` inversions.
- Use `cn()` for conditional classes. Classes are ordered by Biome `useSortedClasses` (D-007).

## 5. Accessibility (WCAG 2.2 AA — release gate)

- **Semantics first:**
  - landmarks: `header`, `nav[aria-label]`, `main#content`, `footer`, with the chrome outside `<main>`;
  - one `h1`, then sequential heading levels;
  - native elements before ARIA.
- **Keyboard:**
  - every interactive element is reachable and operable;
  - links must have `href`;
  - provide a skip link;
  - no keyboard traps except in modal dialogs (Radix handles focus trap and return).
- **Focus:**
  - a visible `focus-visible` ring with ≥ 3:1 contrast against adjacent colours (use the `--focus-ring` token);
  - never `outline-none` without a replacement;
  - `scroll-padding-top` keeps focused items clear of the sticky header.
- **Forms:**
  - a visible `<Label>` for every control (placeholders are hints only);
  - errors use `aria-invalid` and `aria-describedby`;
  - status messages go in a `role="status"` / `aria-live="polite"` region;
  - correct `type` and `autocomplete`.
- **Names:** icon-only buttons and links need `aria-label`. Decorative icons get `aria-hidden`. Meaningful images get descriptive `alt`; decorative images get `alt=""`.
- **Contrast:** text ≥ 4.5:1 (≥ 3:1 for large text); UI components and focus indicators ≥ 3:1.
- **Targets:** ≥ 24×24 CSS px (2.5.8). Aim for 44×44 for primary touch actions.
- **Motion:** respect `prefers-reduced-motion` (MotionConfig `reducedMotion="user"`, CSS `motion-safe:`). Auto-advancing content needs a pause control (2.2.2).
- **Reflow:** no horizontal scrolling at 320 CSS px (1.4.10).
- **Verification:** axe in Playwright (0 serious or critical), a keyboard Tab walk in e2e for the header and forms, and a manual screen-reader smoke test before release.

## 6. Motion and microinteractions

- Motion must **explain** something (state change, hierarchy, feedback). It is never required for content to be visible.
- Durations: 150–250 ms for UI feedback, ≤ 500 ms for reveals. Use `ease-out` for enter and `ease-in` for exit. Keep travel distance at 8–24 px or less.
- Server HTML must show final content. Animate `transform` / `opacity` from a visible state, or use CSS reveals with `@media (prefers-reduced-motion: no-preference)`.
- Use `LazyMotion` + `m` components. No new animation libraries without an ADR.
- Hover effects must have focus and touch equivalents (`group-focus-within`, visible-by-default on touch).

## 7. Forms and server actions

- Validate on the server with zod (`safeParse`) and **always** re-validate there; client hints are optional.
- Actions return a typed result: `{ status: "idle" | "success" | "error", fieldErrors?, message? }`. They never throw to the UI for expected failures.
- Treat every action as an untrusted public endpoint:
  - validate input;
  - add a honeypot and a rate limit;
  - keep secrets out of client bundles;
  - log failures without logging PII.
- Disable the submit button while pending (`useActionState` `pending`) to prevent duplicate submissions.
- Keep the form usable without JavaScript (progressive enhancement).

## 8. Configuration and secrets

- Public/site config (e.g. `NEXT_PUBLIC_SITE_URL`) is read through `lib/env.ts`. Server secrets are read inside their `server-only` module, with an injectable env parameter for tests, e.g. `features/lead-capture/deliver.ts` (D-012). Never use `process.env.X!`.
- `NEXT_PUBLIC_*` is only for values that are safe to publish (they are inlined at build time).
- Every variable is documented in `.env.example` with a safe example value. Never commit a real `.env`.

## 9. Performance

- Images: `next/image` with correct `sizes`. Use `preload` / `fetchPriority="high"` only on the LCP image. Source assets should be at most 2× their largest rendered size, in a modern format, and named with the correct extension.
- Fonts: variable fonts without a weight list. Static fonts limited to the weights actually used.
- Keep client JS minimal: islands only, no heavy libraries for trivial effects (measure the bundle cost before adding a dependency).
- Budgets are in TARGET_ARCHITECTURE §5.7. A PR that regresses a budget needs a justification.

## 10. Testing and quality gates

| Layer         | Tool                                                                             | What is covered                                                                                                                |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Static        | `tsc --noEmit`, Biome (`biome ci`), minimal ESLint (React Compiler + Next rules) | every PR                                                                                                                       |
| Unit          | Vitest                                                                           | schemas, actions (with mocked delivery), hooks, utilities                                                                      |
| Component     | Vitest + RTL (jsdom)                                                             | interactive islands: mobile nav, accordion, carousel pause, quote form states                                                  |
| E2E           | Playwright                                                                       | navigation (every link reaches its section), lead submission (success, validation, no-JS), responsive overflow at 320/390, 404 |
| Accessibility | @axe-core/playwright                                                             | every section at 390 and 1440, 0 serious or critical                                                                           |
| Visual        | Manual review (screenshot tests removed, D-013)                                  | review UI changes at 390, 768 and 1440 before each phase PR                                                                    |
| Security      | `bun audit`                                                                      | fail on runtime high or critical                                                                                               |
| Build         | `next build` **without `.env`**                                                  | every PR                                                                                                                       |

- A bug fix comes with a regression test.
- Don't skip hooks or disable lint rules inline without a comment explaining why.
- Report only checks that were actually run.

## 11. Dependencies

- Before adding a package, ask:
  - can the platform (Next, React, CSS) or an existing dependency do it?
  - is it maintained (a release in the last 12 months)?
  - what is its gzip cost?
  - is it tree-shakable?
  - what is its license?
- Pin `next`, `react` and `react-dom` exactly. Use caret ranges for the rest, and the lockfile is always committed.
- Packages must have been out 14 days (security patches exempt). Coupled packages are upgraded together. Majors get their own PR, with the migration guide linked.
- Runtime packages go in `dependencies`; types and tooling go in `devDependencies`.

## 12. Git and PRs

- Branches: `feat/…`, `fix/…`, `chore/…`, `modernize/m<N>-…`.
- Commits follow Conventional Commits (`feat:`, `fix:`, `chore(deps):`, `refactor:`, `docs:`, `test:`).
- PR description: what and why, screenshots before and after for UI changes, the checks that were run, and the rollback note.
- Keep PRs small and single-purpose. Formatting-only changes go in separate commits.
- **Audit before every commit.** The procedure is in `AGENTS.md` → "Pre-commit audit": scope check, automated checks, a line-by-line diff review, and an independent review for non-trivial commits.
- Record significant decisions as ADRs in `docs/adr/NNNN-title.md`.
