import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

import {uniqueName} from '../validation/uniqueName'

/**
 * Service document.  One service Volpexar offers, e.g. branding or web design.
 *
 * Services have no URL of their own yet: they are shown by sections that
 * reference them, and referenced by projects.  The order they are dragged into
 * in the Studio is the default order wherever all services are listed.
 */

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: PackageIcon,
  orderings: [orderRankOrdering],
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
      type: 'blockContentTextOnly',
      description: 'The full description, for wherever the service is shown in detail.',
    }),
    orderRankField({type: 'service'}),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'summary',
    },
  },
})
