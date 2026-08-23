import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

/**
 * Site-wide SEO defaults.  Mirrors the per-document `seo` object, but its core
 * fields are required: these are the values every other document falls back to
 * when it leaves the matching field empty.
 */

export const siteSeo = defineType({
  name: 'siteSeo',
  title: 'Default SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Default title',
      type: 'string',
      description:
        'Used for any page that does not define its own SEO title. Also acts as the site name appended to page titles.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(60).warning('Titles longer than 60 characters may be truncated.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
      description: 'Used for any page that does not define its own meta description.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated.'),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social sharing image',
      type: 'image',
      description:
        'Used for any page that does not define its own. Recommended size: 1200x630.',
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
        'The site-wide default. Individual pages can override this, or inherit it.',
      initialValue: 'index',
      options: {
        list: [
          {title: 'Allow indexing', value: 'index'},
          {title: 'Hide entire site from search engines', value: 'noIndex'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
