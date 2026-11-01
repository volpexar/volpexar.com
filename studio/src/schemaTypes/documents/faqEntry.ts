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
  title: 'FAQ Entry',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
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
      title: 'Search keywords',
      type: 'array',
      description:
        'Extra words people might search for that are not in the question or answer, e.g. synonyms. Never shown on the site. Press Enter after each one.',
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
