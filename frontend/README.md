# volpexar.com — frontend

The Next.js app that renders volpexar.com from content stored in Sanity. See the
[repository README](../README.md) for setup; this file covers the frontend itself.

- Next.js 16, App Router, React 19
- Tailwind CSS v4
- Content read through `next-sanity`, with visual editing support
- Deployed on Vercel (root directory `frontend`)

## Running

From the repository root:

```shell
npm run dev:next     # this app alone, on http://localhost:3000
npm run dev          # this app and the Studio together
```

Requires `frontend/.env.local` (copy `.env.example`). `frontend/sanity/lib/api.ts`
asserts the required variables when it loads, so a missing one fails immediately and
by name.

Other scripts, from this directory: `npm run build`, `npm run lint`,
`npm run type-check`.

## Routing

Two routes render pages, both from the same `page` document type:

| Route | File | Content |
| --- | --- | --- |
| `/` | `app/page.tsx` | The single `page` document with the fixed id `homePage` |
| `/<slug>` | `app/[slug]/page.tsx` | Any other `page`, matched on its slug |

The home page is pinned to a fixed id and has no slug, so it cannot also be reached
at `/<slug>`. `app/sitemap.ts` generates the sitemap from the same content.

## Page builder

A `page` holds an ordered list of blocks, rendered by
`app/components/BlockRenderer.tsx`. That file maps each block's `_type` to a
component, and every block type must be registered there.

Currently one block type exists: `underConstructionScreen` — a full-screen section
with an optional logo, a heading, body text and social media links.

**Adding a block type** means doing three things:

1. Define the object schema in `studio/src/schemaTypes/objects/`, and register it in
   `studio/src/schemaTypes/index.ts`.
2. Add it to the page builder's array in `studio/src/schemaTypes/documents/page.ts`.
3. Write the component and add it to `sectionComponents` in `BlockRenderer.tsx`.

Skip step 3 and the block renders as a visible fallback box rather than throwing — so
a block appearing as an unstyled placeholder means it is missing from that map.

## Styling

Tailwind v4, configured entirely in CSS. **There is no `tailwind.config.ts`** — v4
ignores a JS config unless explicitly opted into, so theme changes belong in
`app/globals.css`, inside the `@theme` block.

Three fonts, loaded by `next/font` in `app/layout.tsx` and bound to Tailwind
utilities in `globals.css`:

| Utility | Font | Used for |
| --- | --- | --- |
| `font-sans` | Nunito Sans | Body and general text (the default) |
| `font-heading` | Lora | All headings, applied globally in `@layer base` |
| `font-mono` | Martian Mono | Monospaced text |

### Design tokens

Colours are two-tiered. **Primitives** name a colour (`--color-vermillion`);
**semantic tokens** name a role and are defined in terms of a primitive
(`--color-surface-brand`). Each token generates its Tailwind utilities
automatically — `--color-surface-brand` gives `bg-surface-brand`, `--color-on-brand`
gives `text-on-brand`.

Semantic tokens come in `surface-*` / `on-*` pairs: a background and the foreground
that is legible on it. Use a pair together and contrast stays correct without each
component reasoning about it.

| Pair | Use |
| --- | --- |
| `surface-default` / `on-default` | The page's normal background and text |
| `surface-brand` / `on-brand` | Vermillion brand surfaces |
| `surface-inverse` / `on-inverse` | A dark band on a light page — a footer, a callout |
| `surface-muted` / `on-muted` | Low-emphasis states — placeholders, disabled, scaffolding |

**Components should reference semantic tokens, not primitives**, so a palette change
is a one-line edit in `globals.css` rather than a sweep through every component. Add a
primitive only when the design introduces a genuinely new colour; add a semantic token
when it introduces a new *role*.

The current tokens are a working set inherited from the first designs, not a finished
system — the intention is to build the design system properly later. There is **no
theming and no dark mode**: one palette, no `dark:` variant, no theme switching.
`surface-inverse` is a dark section within that single palette, not a second theme.

## Sanity integration

`sanity/lib/` holds everything that talks to the content lake:

| File | Role |
| --- | --- |
| `api.ts` | Project id, dataset, API version, Studio URL — asserted at import |
| `client.ts` | The configured Sanity client |
| `live.ts` | Live content, for real-time updates and draft mode |
| `queries.ts` | All GROQ queries |
| `seo.ts` | Builds page metadata, with per-page values falling back to site settings |
| `token.ts` | Server-only read token; throws if it is missing |
| `utils.ts`, `types.ts` | Link resolution and page builder types |

`sanity.types.ts` is **generated** from the schema and the queries in `queries.ts`.
Do not edit it; change the source and regenerate with
`npm run sanity:typegen --workspace=frontend`.

## Draft mode and visual editing

Editors can preview unpublished content through the Studio's Presentation tool, which
loads this app in an iframe and enables Next.js draft mode via
`app/api/draft-mode/enable/route.ts`. `DraftModeToast.tsx` shows an in-page indicator
while draft mode is active.

This needs `SANITY_API_READ_TOKEN` set here, and `SANITY_STUDIO_PREVIEW_URL` in the
Studio pointing at this app. Preview showing only published content usually means the
token is missing rather than a caching problem.
