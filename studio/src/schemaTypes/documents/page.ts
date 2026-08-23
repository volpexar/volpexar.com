import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * The home page is a single `page` document pinned to this ID.  It is served at
 * the site root and deliberately has no slug, so it can never also be reached at
 * /<slug>.  The frontend hardcodes the same ID in app/page.tsx.
 */
export const HOME_PAGE_ID = 'homePage'

// Drafts are stored with a `drafts.` prefix, so this cannot be a plain equality test.
const isHomePage = (id?: string) => id === HOME_PAGE_ID || id === `drafts.${HOME_PAGE_ID}`

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'Used only inside the Studio to identify this page. Never shown on the website.',
      // There is only ever one home page, and it has its own entry in the Studio,
      // so it needs no internal name to tell it apart from other pages.
      hidden: ({document}) => isHomePage(document?._id),
      validation: (Rule) =>
        Rule.custom((value: string | undefined, context) =>
          isHomePage(context.document?._id) || value ? true : 'Required',
        ),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'The URL path for this page, after the domain. For example, a slug of "about" is served at /about.',
      hidden: ({document}) => isHomePage(document?._id),
      validation: (Rule) =>
        Rule.custom((value: {current?: string} | undefined, context) =>
          isHomePage(context.document?._id) || value?.current ? true : 'Required',
        ),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      // An empty SEO title falls back to the site-wide title, which is what the
      // home page wants: it should render as just "Volpexar", not "Volpexar | Volpexar".
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      description: 'All visible content on this page, section by section.',
      of: [{type: 'callToAction'}, {type: 'infoSection'}, {type: 'underConstructionScreen'}],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/studio/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  // The document list shows the internal name, which is what editors use to find
  // a page.  The slug is shown alongside it to disambiguate similar names.
  preview: {
    select: {
      _id: '_id',
      title: 'name',
      slug: 'slug.current',
    },
    prepare({_id, title, slug}) {
      // The home page has neither an internal name nor a slug, so describe it by
      // what it is instead of falling back to "Untitled".
      if (isHomePage(_id)) {
        return {title: 'Home Page', subtitle: '/'}
      }
      return {
        title: title || 'Untitled page',
        subtitle: slug ? `/${slug}` : 'No slug set',
      }
    },
  },
})
