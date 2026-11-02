import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * One social media call to action: which profile to link to, and the icon to
 * represent it with.
 *
 * The profile is a reference, so handles and URLs stay defined in one place.
 * The icon lives here rather than on the profile because the right icon depends
 * on the design of the section it appears in.
 */
export const socialMediaLink = defineType({
  name: 'socialMediaLink',
  title: 'Enlace a red social',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'profile',
      title: 'Perfil de red social',
      type: 'reference',
      to: [{type: 'socialMediaProfile'}],
      description: 'El perfil de red social al que enlaza.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ícono',
      type: 'image',
      description: 'El ícono mostrado para este perfil.',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description:
            'Dejalo vacío cuando el nombre del perfil ya esté mostrado junto al ícono, para que los lectores de pantalla no lo lean dos veces.',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'profile.name',
      subtitle: 'profile.handle',
      media: 'icon',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || '(Sin perfil)',
        subtitle,
        media,
      }
    },
  },
})
