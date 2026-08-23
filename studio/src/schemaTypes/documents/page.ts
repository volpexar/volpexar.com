import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'The URL path for this page, after the domain. For example, a slug of "about" is served at /about.',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      // Pages must always carry their own title, so that every page renders as
      // "<page title> | <site name>".  The remaining SEO fields stay optional and
      // fall back to the site-wide defaults in Site Settings.
      validation: (Rule) =>
        Rule.required().custom((value?: {title?: string}) =>
          value?.title ? true : {message: 'An SEO title is required.', paths: [['title']]},
        ),
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
      title: 'name',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Untitled page',
        subtitle: slug ? `/${slug}` : 'No slug set',
      }
    },
  },
})
