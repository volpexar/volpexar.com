import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

/**
 * SEO schema object.  Per-document search engine and social sharing metadata.
 *
 * Every field is optional: anything left empty falls back to the matching field
 * on the site-wide defaults in Site Settings (see the `siteSeo` object).
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'Shown as the browser tab label and the headline in search results. The site name is appended automatically.',
      validation: (Rule) =>
        Rule.max(60).warning(
          'Titles longer than 60 characters may be truncated in search results.',
        ),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'The summary shown beneath the title in search results. Falls back to the site-wide description if left empty.',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Descriptions longer than 160 characters may be truncated in search results.',
        ),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image',
      type: 'image',
      description:
        'Displayed when this page is shared on social media. Falls back to the site-wide image if left empty. Recommended size: 1200x630.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO.',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}}
              if (parent?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'visibility',
      title: 'Search engine visibility',
      type: 'string',
      description:
        'A page can hide itself from search engines, but cannot make itself visible when the site-wide setting hides everything.',
      initialValue: 'inherit',
      options: {
        list: [
          {title: 'Use site settings', value: 'inherit'},
          {title: 'Hide from search engines', value: 'noIndex'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
