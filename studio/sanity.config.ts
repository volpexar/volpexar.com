/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {esESLocale} from '@sanity/locale-es-es'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// The home page is the one `page` document pinned to this ID. It is served at the
// site root and has no slug, so its URL cannot be derived from one.
const HOME_PAGE_ID = 'homePage'

const isHomePage = (id?: string) => id === HOME_PAGE_ID || id === `drafts.${HOME_PAGE_ID}`

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Volpexar.com',

  projectId,
  dataset,

  // Content Releases are not part of the current plan. Both flags are needed: with only `releases`
  // off, the same tool stays visible as "Scheduled Drafts".
  releases: {enabled: false},
  scheduledDrafts: {enabled: false},

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      title: 'Previsualización',
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "page" && _id == "${HOME_PAGE_ID}"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'Este documento se usa en todas las páginas',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              _id: '_id',
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              // The home page has no slug, so its href cannot be derived from one.
              if (isHomePage(doc?._id)) {
                return {locations: [homeLocation]}
              }

              return {
                locations: [
                  {
                    title: doc?.name || '(Sin nombre)',
                    href: resolveHref('page', doc?.slug)!,
                  },
                ],
              }
            },
          }),
        },
      },
    }),
    structureTool({
      title: 'Contenido',
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    visionTool({
      title: 'Consultas'
    }),
    // Spanish UI for the Studio itself; schema titles are translated in the schema.
    esESLocale(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
