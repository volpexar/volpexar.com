# volpexar.com — Studio

The Sanity Studio for volpexar.com: where the site's content is written, reviewed and
published. See the [repository README](../README.md) for setup; this file covers the
Studio itself.

Sanity Studio v5, connected to project `wvcv9992`.

The project has two datasets: `production`, which the live site serves, and
`development`, the sandbox. A local Studio edits `development`; the hosted Studio
edits `production` — see [Environment](#environment) below and
[CLAUDE.md](../CLAUDE.md) for the full split.

## Running

From the repository root:

```shell
npm run dev:studio   # Studio alone, on http://localhost:3333
npm run dev          # Studio and the frontend together
```

Requires the env files described below. Sign in with an account that has access to
the Sanity project.

## Environment

Three gitignored files, all created by copying `.env.example`. Which ones load
depends on the command, and the Studio CLI decides that — not your shell:

| File | Loaded by | Holds |
| --- | --- | --- |
| `.env` | every command | `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_STUDIO_HOST` |
| `.env.development` | `sanity dev` | `development` dataset, preview `http://localhost:3000` |
| `.env.production` | `sanity build`, `sanity deploy` | `production` dataset, preview `https://volpexar.com` |

The mode file wins over `.env`, and a shell variable wins over both.

This split is what keeps a deploy from ever shipping a Studio pointed at the sandbox:
`sanity deploy` cannot read `.env.development`, whatever the current shell says.

**Preview URL follows the Studio, not the dataset.** Presentation previews the
frontend you are running, so a local Studio previews `localhost:3000` even when
pointed at production data:

```shell
SANITY_STUDIO_DATASET=production npm run dev:studio
```

That is the way to inspect live content against local frontend code. Note it is
read-write — you are editing the live site's content.

## Content model

Schema types live in `src/schemaTypes/` and are registered in
`src/schemaTypes/index.ts`. **A type that is not exported there does not exist to the
Studio**, however complete its file looks.

### Documents

- **`page`** — every page on the site. Holds SEO metadata and a `pageBuilder` array of
  content blocks.
- **`socialMediaProfile`** — a social media account (name, handle, URL), referenced
  rather than retyped wherever it is linked.

### Singleton

- **`settings`** — site-wide settings, including the SEO defaults that individual
  pages fall back to. Edited at a fixed document, not created repeatedly.

### Objects

`underConstructionScreen` (the one page builder block), `blockContentTextOnly`,
`link`, `seo`, `siteSeo`, `socialMediaLink`.

## Studio structure

`src/structure/index.ts` controls the desk, and deliberately differs from the default
listing:

- **Home Page** is pinned as its own entry at the top. It is a single `page` document
  with the fixed id `homePage`, served at the site root and having no slug.
- That same document is filtered out of the regular **Pages** list, so it does not
  appear twice.
- **Site Settings** is pinned as a singleton, editing one fixed document.
- `settings` and `assist.instruction.context` are hidden from the automatic type
  listing, since both are edited elsewhere or managed by a plugin.

## Plugins

| Plugin | What it does |
| --- | --- |
| `presentationTool` | Live preview: renders the frontend in an iframe with click-to-edit |
| `structureTool` | The custom desk structure above |
| `unsplashImageAsset` | Adds an Unsplash tab to the image picker for free-licensed images |
| `assist` | Sanity AI Assist — AI-drafted field content and automatic image alt text |
| `visionTool` | A GROQ playground for testing queries against the dataset |

### Presentation tool

Preview is configured in `sanity.config.ts` against `SANITY_STUDIO_PREVIEW_URL`
(defaults to `http://localhost:3000`). Two resolvers keep it working:

- `mainDocuments` maps a URL back to the document that renders it. The home page needs
  its own entry matching `_id == "homePage"`, because it has no slug to match on.
- `resolveHref()` maps a document forward to its URL.

**A new routable document type must be added to both**, or Presentation cannot connect
the page to its content.

## Changing the schema

The frontend's TypeScript types are generated from this schema, so the two cannot
drift:

```
src/schemaTypes  →  ../sanity.schema.json  →  ../frontend/sanity.types.ts
```

This runs automatically before `dev` and `build`. After changing a type, regenerate so
the frontend sees it:

```shell
npm run sanity:typegen
```

A schema error blocks the Studio from starting, rather than appearing as a type error
later.

Note that `../sanity.schema.json` is generated but tracked in git, so it can conflict
on branches that touch the schema. Resolve by regenerating it, never by hand-editing.

## Deploying

```shell
npm run deploy       # or: npm run deploy --workspace=studio
```

This deploys the hosted Studio, separately from the frontend. **A schema change is not
live for editors until this is run**, even if the frontend has already shipped. The
hosted Studio is a compiled bundle, so it keeps showing the schema it was built with —
including document types that no longer exist in the code.

It builds in production mode, so it takes its dataset and preview URL from
`.env.production` and edits live content. Requires `SANITY_API_READ_TOKEN` in the
Vercel production environment, or Presentation shows published content only.
