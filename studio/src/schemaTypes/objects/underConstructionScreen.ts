import {defineField, defineType} from 'sanity'
import {ComposeSparklesIcon, ImageIcon, LockIcon} from '@sanity/icons'

import {altText} from '../fields/altText'

/**
 * Under Construction Screen schema object.  A full-screen placeholder section used
 * while a site (or a single page) is still being built.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const underConstructionScreen = defineType({
  name: 'underConstructionScreen',
  title: 'Pantalla de sitio en construcción',
  type: 'object',
  icon: LockIcon,
  groups: [
    {
      name: 'contents',
      title: 'Contenido',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'media',
      title: 'Gráficos',
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Encabezado',
      type: 'string',
      description: 'El título principal, por ejemplo, "En construcción".',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'body',
      title: 'Texto de apoyo',
      type: 'blockContentTextOnly',
      description: 'Texto de apoyo mostrado debajo del encabezado.',
      group: 'contents',
    }),
    defineField({
      name: 'logo',
      title: 'Logotipo',
      type: 'image',
      description: 'El logotipo que se muestra en esta pantalla.',
      options: {
        hotspot: true,
      },
      group: 'media',
      fields: [altText()],
    }),
    defineField({
      name: 'socialMediaLinks',
      title: 'Enlaces a redes sociales',
      type: 'array',
      description:
        'Llamadas a la acción opcionales que enlazan a los perfiles de redes sociales del cliente, mostradas en el orden listado. Arrastrá para reordenarlas.',
      group: 'contents',
      of: [{type: 'socialMediaLink'}],
      validation: (Rule) =>
        Rule.custom((links?: {profile?: {_ref?: string}}[]) => {
          if (!links) return true

          // The same profile twice would render two identical calls to action.
          const refs = links.map((link) => link?.profile?._ref).filter(Boolean)
          const duplicated = refs.some((ref, index) => refs.indexOf(ref) !== index)

          return duplicated ? 'Cada perfil de redes sociales solo puede ser listado una vez.' : true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'logo',
    },
    prepare({title, media}) {
      return {
        title: title || '(Sin título)',
        subtitle: 'Pantalla de sitio en construcción',
        media: media || LockIcon,
      }
    },
  },
})
