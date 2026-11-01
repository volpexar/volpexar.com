import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

import {altText} from '../fields/altText'

/**
 * Team Member document.  A person at Volpexar.
 *
 * Shown by sections that reference team members, and intended as the author of
 * future blog posts.  The order they are dragged into in the Studio is the
 * default order wherever the whole team is listed.
 */

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  orderings: [orderRankOrdering],
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
      type: 'blockContentTextOnly',
    }),
    orderRankField({type: 'teamMember'}),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
