import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

import {altText} from '../fields/altText'
import {uniqueName} from '../validation/uniqueName'

/**
 * Client document.  A business Volpexar has worked for.
 *
 * Every project names its client, so a client defined here is public: contracts
 * allow Volpexar to show its work for them in the portfolio.
 */

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The business name, as it should be shown on the site.',
      validation: (Rule) => uniqueName(Rule, 'client', 'client'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'An SVG or a PNG with a transparent background works best.',
      fields: [altText()],
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: "The client's own website, if they have one.",
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'website',
      media: 'logo',
    },
  },
})
