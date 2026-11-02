import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

import {altText} from '../fields/altText'

/**
 * Client document. A business or person Volpexar has worked for.
 *
 * Names can repeat, since two clients can share one. The preview shows the document ID so editors can
 * tell them apart.
 */

export const client = defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'El nombre del cliente.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logotipo',
      type: 'image',
      description: 'El logotipo del cliente, si existe.',
      fields: [altText()],
    }),
    defineField({
      name: 'website',
      title: 'Sitio web',
      type: 'url',
      description: "El sitio web del cliente, si existe.",
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      id: '_id',
      media: 'logo',
    },
    prepare({title, id, media}) {
      return {
        title,
        // A draft's id carries a prefix; show the id the client is referenced by.
        subtitle: id?.replace(/^drafts\./, ''),
        media,
      }
    },
  },
})
