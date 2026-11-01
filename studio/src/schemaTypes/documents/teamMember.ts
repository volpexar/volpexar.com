import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

import {altText} from '../fields/altText'
import {richTextBlock} from '../fields/richText'

/**
 * Team Member document.  A person at Volpexar.
 *
 * Shown by sections that reference team members, and intended as the author of
 * future blog posts.  They have no order of their own: a section that shows
 * team members lists them in the order it references them.
 */

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Their position at Volpexar, e.g. Creative Director.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [altText()],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [richTextBlock()],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
