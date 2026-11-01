import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'

import {richTextBlock} from '../fields/richText'
import {uniqueName} from '../validation/uniqueName'

/**
 * Service document.  One service Volpexar offers, e.g. branding or web design.
 *
 * Services have no URL of their own yet: they are shown by sections that
 * reference them, and referenced by projects.  They have no order of their own:
 * a section lists them in the order it references them.
 */

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The service as it is shown on the site, e.g. Branding or Web Design.',
      validation: (Rule) => uniqueName(Rule, 'service', 'service'),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      description: 'One or two sentences, shown on cards and in lists of services.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [richTextBlock()],
      description: 'The full description, for wherever the service is shown in detail.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'summary',
    },
  },
})
