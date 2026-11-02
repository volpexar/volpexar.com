import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'

import {uniqueName} from '../validation/uniqueName'

/**
 * Service document. One service Volpexar offers.
 *
 * A service is a tag for project entries, it has a name and nothing else.
 * 
 * Copy text describing a service belongs to the page that shows it, written by editors in that page's 
 * sections, not to the service itself.
 */
export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'El nombre del servicio que Volpexar ofrece. No puede repetirse.',
      validation: (Rule) => uniqueName(Rule, 'service', 'service'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
