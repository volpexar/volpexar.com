import {defineField, defineType} from 'sanity'
import {HashIcon} from '@sanity/icons'

import {uniqueName} from '../validation/uniqueName'

/**
 * Social Media Profile document. One per platform the client is present on.
 *
 * Profiles are defined once here and referenced wherever they are displayed, so
 * a handle or link only ever has to be updated in one place.  Icons are not
 * stored here: a section decides how to present a profile, because the right
 * icon depends on the design it appears in.
 */
export const socialMediaProfile = defineType({
  name: 'socialMediaProfile',
  title: 'Perfil de redes sociales',
  type: 'document',
  icon: HashIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'La plataforma en la que está este perfil, por ejemplo, Instagram, Facebook o WhatsApp. Debe ser único.',
      validation: (Rule) => uniqueName(Rule, 'socialMediaProfile', 'profile'),
    }),
    defineField({
      name: 'handle',
      title: 'Identificador',
      type: 'string',
      description:
        'Lo que identifica al cliente en esa plataforma, tal como debe mostrarse: un nombre de usuario como @volpexar, o un número de teléfono como +54 9 221 123-4567.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description:
        'Donde va el enlace, por ejemplo, https://instagram.com/volpexar o https://wa.me/5492211234567.',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'handle',
    },
  },
})
