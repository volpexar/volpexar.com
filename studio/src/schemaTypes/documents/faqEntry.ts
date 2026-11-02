import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

import {richTextBlock} from '../fields/richText'
import {uniqueKeywords} from '../validation/uniqueKeywords'

/**
 * FAQ Entry document. One frequently asked question and its answer.
 *
 * The answer is deliberately limited to inline formatting, links and lists: no
 * headings or images, so every answer stays short.
 *
 * Keywords are never rendered. They exist only to be searched, alongside the
 * question and the answer's text, by the frontend's fuzzy search.
 */

export const faqEntry = defineType({
  name: 'faqEntry',
  title: 'Pregunta frecuente',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'array',
      of: [
        richTextBlock({
          lists: ['bullet', 'number'],
          decorators: ['strong', 'em', 'code'],
          annotations: ['link'],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Palabras clave de búsqueda',
      type: 'array',
      description:
        'Palabras extra que las personas podrían buscar y que no están en la pregunta o respuesta, por ejemplo, sinónimos. Nunca se muestran en el sitio.',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
        // Rank a keyword match in the Studio's own search above a match in the
        // answer, since keywords are chosen deliberately to find this entry.
        search: {weight: 5},
      },
      validation: (Rule) => Rule.custom(uniqueKeywords),
    }),
  ],
  preview: {
    select: {
      title: 'question',
    },
  },
})
