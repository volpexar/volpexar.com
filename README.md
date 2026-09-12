# volpexar.com

The Volpexar website: a [Next.js](https://nextjs.org/) frontend with content managed
in a [Sanity](https://www.sanity.io/) Studio, kept in one repository as two npm
workspaces.

The site is currently an under-construction landing page. The page builder and
content model are in place, so further sections can be added without touching the
routing.

| Workspace | What it is | Local URL |
| --- | --- | --- |
| [`frontend/`](frontend) | Next.js 16 App Router app, deployed on Vercel | http://localhost:3000 |
| [`studio/`](studio) | Sanity Studio v5, where content is edited | http://localhost:3333 |

Each workspace has its own README with the detail specific to it.

## Requirements

- Node 20 or newer (developed on Node 22, npm 11)
- Access to the Sanity project `wvcv9992`

## Getting started

```shell
git clone https://github.com/volpexar/volpexar.com.git
cd volpexar.com
npm install
```

Create the two environment files from their examples and fill in the values:

```shell
cp frontend/.env.example frontend/.env.local
cp studio/.env.example studio/.env
```

Both are gitignored. `SANITY_API_READ_TOKEN` is a secret — get one from
[sanity.io/manage](https://www.sanity.io/manage) and never commit it.

Then start both servers from the repository root:

```shell
npm run dev
```

Sign in to the Studio with an account that has access to the Sanity project.

## Scripts

All run from the repository root.

| Command | Does |
| --- | --- |
| `npm run dev` | Runs both servers in parallel |
| `npm run dev:next` | Frontend only |
| `npm run dev:studio` | Studio only |
| `npm run type-check` | `tsc --noEmit` across both workspaces |
| `npm run lint` | ESLint over the frontend |
| `npm run format` | Prettier over the repository |

There is no test suite and no CI, so `type-check` and a local build are what catch
mistakes before they ship.

## How the two halves connect

Content is edited in the Studio and read by the frontend over Sanity's API. Types
flow in the same direction and are generated, not written by hand:

```
studio/src/schemaTypes  →  sanity.schema.json  →  frontend/sanity.types.ts
```

That generation runs automatically before `dev` and `build`. Two consequences worth
knowing:

- A schema error stops the dev server from starting at all, rather than surfacing as
  a type error.
- `frontend/sanity.types.ts` is generated. Edit the schema or the GROQ queries in
  `frontend/sanity/lib/queries.ts` and regenerate; changes made directly to it are
  overwritten.

To regenerate manually:

```shell
npm run sanity:typegen --workspace=frontend
```

## Deployment

The two halves deploy separately.

**Frontend** — deployed by Vercel from this repository, with the root directory set
to `frontend`. Environment variables live in the Vercel project settings.

**Studio** — deployed on demand:

```shell
npm run deploy --workspace=studio
```

A schema change is not live for editors until the Studio is redeployed, even if the
frontend has already shipped.

## Contributing

- Branch off `main`, named `<issue-number>-<slug>` (e.g. `1-remove-demonstration-code`).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are
  checked by commitlint in a git hook. **A scope is required**, and it is normally the
  issue number: `feat(1): add contact section`.
- History is linear — rebase rather than merge.

## Resources

- [Sanity documentation](https://www.sanity.io/docs)
- [Next.js documentation](https://nextjs.org/docs)
