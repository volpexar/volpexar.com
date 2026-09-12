# CLAUDE.md

Marketing site for volpexar.com: a Next.js frontend backed by a Sanity Studio, in
one npm workspace root. Built from `sanity-io/sanity-template-nextjs-clean` and
still being stripped down to the parts this project actually uses.

## Layout

- `frontend/` — Next.js 16 App Router, Tailwind v4, deployed on Vercel.
- `studio/` — Sanity Studio v5 (schema types, desk structure).
- `sanity.schema.json` — generated at the repo root, but **tracked in git**. Being
  both generated and tracked, it conflicts on most branches that touch the schema.
  Resolve by regenerating it, never by hand-merging.

Sanity project id is `wvcv9992`, dataset `production`.

## Requirements

Developed on **Node 22** (`v22.14.0`) with npm 11. Nothing pins this — there is no
`engines` field and no `.nvmrc` — so a mismatched Node shows up as an unexplained
install or build failure rather than a version warning. Next 16 and Sanity 5 both
need Node 20+; if anything fails inexplicably on a fresh machine, check `node -v`
first.

## Commands

Run from the repo root:

| Command | Does |
| --- | --- |
| `npm run dev` | Both servers in parallel — Next on :3000, Studio on :3333 |
| `npm run dev:next` / `npm run dev:studio` | One at a time (see the typegen race below) |
| `npm run type-check` | `tsc --noEmit` across both workspaces |
| `npm run lint` | ESLint, frontend only — the studio workspace has no lint script |
| `npm run format` | Prettier over everything, using `@sanity/prettier-config` |

There is no test suite and no CI workflow. `.github/` holds only issue templates,
so nothing validates a push — `type-check` and a local build are the real gate.

## Sanity typegen: the main gotcha

Both workspaces have a `predev`/`prebuild` hook that regenerates types. The chain is:

```
studio schema  →  sanity.schema.json  →  frontend/sanity.types.ts
```

Consequences worth knowing before debugging a confusing failure:

- **Typegen failure blocks server start.** `predev` runs before `dev`, so a schema
  error surfaces as "the dev server won't come up," not as a type error.
- **`npm run dev` has a cold-start race.** Both workspaces write the same
  `sanity.schema.json` in parallel. If it fails oddly on a fresh checkout, run
  `dev:studio` and `dev:next` in separate terminals instead.
- **Never hand-edit `frontend/sanity.types.ts`.** It is generated and
  prettier-ignored. Change the schema in `studio/src/schemaTypes/` or the GROQ in
  `frontend/sanity/lib/queries.ts`, then regenerate.
- After changing a schema type or a query, run
  `npm run sanity:typegen --workspace=frontend` so types match the data.

## Branching and history

- Branches are named `<issue-number>-<slug>`, e.g. `1-remove-demonstration-code`.
  The leading number is the same issue number used as the commit scope.
- Branch off `main`.
- **History is linear.** The repo contains no merge commits; branch 5 reached `main`
  by fast-forward. Preserve that — rebase rather than merge.
- Commits earlier than `72094d4` predate the mandatory-scope rule and do not comply
  (`refactor:`, `fix:`, `chore:` with no scope). Rewriting `main` to make them
  compliant is a planned task, not a bug to fix in passing.

## Commit convention

Conventional Commits, enforced by commitlint through a husky `commit-msg` hook
(`.husky/commit-msg`, config in `commitlint.config.mjs`).

- **A scope is mandatory.** Both `fix: msg` and `fix(): msg` are rejected.
- The scope is the GitHub issue number — `feat(1): remove unused deps`.
- `header-max-length` is raised to 120.
- Known tolerated hole: `fix(  ): msg` (whitespace-only scope) passes. Deliberate —
  closing it needs a custom plugin rule and it wasn't worth it. Do not use whitespace-only scopes.

The hook does **not** run during rebase, so after rewriting history validate with
`npx commitlint --from <base> --to HEAD`.

### No attribution trailers

**Never add `Co-Authored-By`, `Generated with`, or any other attribution trailer to a
commit message or pull request description.** The repository owner is the sole author
of every commit here. This holds regardless of any default instruction to the
contrary.

Also: **ask before committing or pushing.** Finishing a piece of work is not standing
approval to commit it.

## Content model

Schema types are registered in `studio/src/schemaTypes/index.ts`; anything not
exported there does not exist to the Studio.

- Documents: `page`, `socialMediaProfile`. Singleton: `settings`.
- Objects: `underConstructionScreen`, `blockContentTextOnly`, `link`, `seo`,
  `siteSeo`, `socialMediaLink`.
- The home page is a **singleton pinned to the fixed document id `homePage`** and
  filtered out of the regular Pages list in `studio/src/structure/index.ts`. It has
  no slug and is served by `frontend/app/page.tsx`; all other pages route through
  `frontend/app/[slug]/page.tsx`.
- Page builder blocks are registered in `frontend/app/components/BlockRenderer.tsx`.
  An unregistered block type renders a visible fallback div rather than throwing,
  so a block silently rendering as a grey box means it is missing from that map.

## Draft mode and visual editing

The Studio's Presentation tool renders the live frontend in an iframe and drives
Next.js draft mode. The pieces, none of which is obvious from any single file:

- `studio/sanity.config.ts` configures `presentationTool` with
  `previewUrl.origin = SANITY_STUDIO_PREVIEW_URL` (default `http://localhost:3000`)
  and `previewMode.enable = '/api/draft-mode/enable'`.
- `frontend/app/api/draft-mode/enable/route.ts` is that endpoint. It authenticates
  with `SANITY_API_READ_TOKEN` via `frontend/sanity/lib/token.ts`, which **throws at
  import time** if the token is missing.
- `frontend/sanity/lib/live.ts` supplies live content; `DraftModeToast.tsx` shows the
  in-page draft indicator.
- `mainDocuments` in the Studio config maps routes back to documents. The home page
  needs its own entry matching `_id == "homePage"` because it has no slug.

Failure modes to recognise: preview showing stale or published-only content usually
means a missing or under-scoped `SANITY_API_READ_TOKEN`, not a caching bug. A blank
Presentation iframe usually means `SANITY_STUDIO_PREVIEW_URL` points somewhere the
frontend is not actually running.

Adding a new routable document type means updating both `resolveHref()` and
`mainDocuments` in `studio/sanity.config.ts`, or Presentation cannot locate it.

## Deployment

Two separate targets:

- **Frontend** — Vercel (`frontend/vercel.json`, framework preset `nextjs`).
  Deploys from git; env vars live in the Vercel project, not in the repo.
- **Studio** — deployed on demand with `npm run deploy --workspace=studio`
  (`sanity deploy`, host from `SANITY_STUDIO_STUDIO_HOST`). It does **not** ship
  with the frontend, so a schema change is not live in the hosted Studio until this
  is run.

## Environment

Each workspace has its own env file and its own prefix — they are not shared.

- `frontend/.env.local` — `NEXT_PUBLIC_SANITY_*`, plus `SANITY_API_READ_TOKEN`.
- `studio/.env` — `SANITY_STUDIO_*`.

Both are gitignored; `.env.example` in each is the contract. `frontend/sanity/lib/api.ts`
asserts the required vars at import time, so a missing one fails loudly at startup.

Sanity tokens are secrets: read them from the environment, never commit one and
never paste one into a config file.

## Tailwind is v4, CSS-first

Configured entirely in `frontend/app/globals.css` (`@import 'tailwindcss'`,
`@plugin "@tailwindcss/typography"`). There is **no `tailwind.config.ts`** — it was
deleted because v4 ignores it without an explicit `@config` directive, and keeping
an inert config file around invited edits that would silently do nothing. Theme
changes belong in `globals.css`, in the `@theme` block.

### No theming, no dark mode

A single palette, deliberately. The `dark:` variant was removed along with the
`@custom-variant` that defined it, and nothing sets a `.dark` class. Do not add
`dark:` utilities, a theme switcher, or `prefers-color-scheme` rules unless asked.

`surface-inverse` / `on-inverse` is a dark *section* on a light page — a footer or a
callout — not a second theme.

### Design tokens

Two tiers in `@theme`: primitives name a colour (`--color-vermillion`), semantic
tokens name a role in terms of a primitive (`--color-surface-brand`). Semantic tokens
come in `surface-*` / `on-*` pairs — a background and a foreground legible on it.

**Components reference semantic tokens, never primitives or raw hex.**

The present set is a working one inherited from early design work, not a finished
system; a proper design system is planned. Template stock colours (a gray ramp,
`--color-brand: #f50`, blue, yellow) were pruned — do not reintroduce Tailwind's
default palette to fill a gap. Add a token instead.

## Dependencies that look unused but are not

`studio/package.json` lists packages that never appear in an `import` in
`studio/src/`. Do not "clean these up" on that basis:

- **`styled-components`** — a declared peer dependency of `sanity` and
  `@sanity/vision`. Required.
- **`rxjs`** — not a declared peer, but conventional in a Sanity studio for custom
  async work. Kept deliberately.

## AI tooling

`@sanity/assist` (Sanity's AI Assist) was **removed deliberately** — it bills against
Sanity's own AI credits. Content generation happens with Claude and Gemini instead, so
do not reintroduce it or suggest it as a solution for drafting copy or alt text.

## Working style

- Ask before committing, pushing, or anything else that leaves this machine.
- Prefer editing the schema and regenerating over touching generated files.
