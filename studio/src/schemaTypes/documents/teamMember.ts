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
  title: 'Miembro del equipo',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'El nombre de la persona. Tal como debe mostrarse en el sitio.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      description: 'Su posición en Volpexar, por ejemplo, Director Creativo.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      description: 'Una foto de la persona. Tal como debe mostrarse en el sitio.',
      options: {
        hotspot: true,
      },
      fields: [altText()],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      description: 'Una breve descripción de la persona. Tal como debe mostrarse en el sitio.',
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
