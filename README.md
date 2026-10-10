# UrbanBuild

Marketing website for a construction and architecture firm: a single page with services, portfolio, testimonials, FAQ, and a quote-request form that emails leads to the team.

**Stack:** Next.js 16 (App Router) · React 19 + React Compiler · TypeScript · Tailwind CSS v4 · shadcn/ui on Radix · motion · bun. Hosted on Vercel.

## Getting started

```bash
bun install
cp .env.example .env     # NEXT_PUBLIC_SITE_URL is enough for local work
bun run dev              # http://localhost:3000
```

The site builds and runs with no `.env`. Without email settings, the quote form shows a "call or email us" message. To log submissions locally, set `LEAD_DELIVERY=console`.

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` / `bun run start` | Production build / serve |
| `bun run typecheck` | TypeScript (`tsc --noEmit`) |
| `bun run lint` / `bun run lint:fix` | Biome (format, lint, import and class sorting) + ESLint (React Compiler, Next.js rules) |
| `bun run test` | Vitest unit tests |
| `bun run test:e2e` | Playwright end-to-end and axe accessibility tests (builds and serves on :3100) |

## Environment variables

See [`.env.example`](.env.example):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes, on Vercel Production** | Canonical URL for metadata and the sitemap. The production build fails if it is missing or localhost. |
| `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` | For email delivery | Quote requests are sent through [Resend](https://resend.com). |
| `LEAD_DELIVERY` | No | `console` logs leads instead of emailing them (dev/tests only). |

## Project structure

```
app/                  routes, layout, metadata (robots, sitemap, OG image)
components/
  ui/                 shadcn/ui primitives (kept close to upstream)
  sections/           page sections
features/lead-capture quote form, Server Action, validation, email delivery
hooks/  lib/          shared hooks, env, section ids, constants
tests/e2e/            Playwright specs
docs/                 audit, decisions (DECISIONS.md), roadmap, engineering standards
```

## Contributing

Read [AGENTS.md](AGENTS.md) (for people and AI agents) and [docs/DECISIONS.md](docs/DECISIONS.md) before making changes.

## Before go-live

- Set `NEXT_PUBLIC_SITE_URL` and the Resend variables on Vercel Production.
- Add a Vercel Firewall rate-limit rule for form submissions and a Resend usage alert (D-012).
- Replace placeholder content: phone, address, social links, CEO signature, testimonials and project details.

<!-- ## 📚 References

- [OKLCH Color Picker](https://oklch.com/): For color reference.
- [How to Build a Construction Website Using Next.js, Tailwind CSS, Motion](https://www.youtube.com/watch?v=VgO5WxSY_64): Design Reference. -->