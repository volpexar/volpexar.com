import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Settings schema Singleton.
 */
export const settings = defineType({
  name: 'settings',
  title: 'Configuración del sitio web',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'siteSeo',
      description:
        'Site-wide fallbacks. Any page that leaves an SEO field empty inherits the value set here.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
