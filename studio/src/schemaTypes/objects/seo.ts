import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

import {altText} from '../fields/altText'

/**
 * SEO schema object.  Per-document search engine and social sharing metadata.
 *
 * Every field is optional: anything left empty falls back to the matching field
 * on the site-wide defaults in Site Settings (see the `siteSeo` object).
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Título SEO',
      type: 'string',
      description:
        'Mostrado en la pestaña del navegador y como título en los resultados de búsqueda. El nombre del sitio se agrega automáticamente. Se usa el valor del sitio si se deja vacío.',
      validation: (Rule) =>
        Rule.max(60).warning(
          'Los títulos de más de 60 caracteres pueden ser truncados en los resultados de búsqueda.',
        ),
    }),
    defineField({
      name: 'description',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
      description:
        'La descripción que se muestra bajo el título en los resultados de búsqueda. Se usa el valor del sitio si se deja vacío.',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Las descripciones de más de 160 caracteres pueden ser truncadas en los resultados de búsqueda.',
        ),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales (Open Graph)',
      type: 'image',
      description:
        'La imagen que se muestra cuando se comparte esta página en redes sociales. Se usa el valor del sitio si se deja vacío. Tamaño recomendado: 1200x630 px.',
      options: {
        hotspot: true,
      },
      fields: [altText()],
    }),
    defineField({
      name: 'visibility',
      title: 'Visibilidad para motores de búsqueda',
      type: 'string',
      description:
        'Una página puede ocultarse de los motores de búsqueda, pero no puede hacerse visible cuando la configuración global del sitio lo oculta todo.',
      initialValue: 'inherit',
      options: {
        list: [
          {title: 'Usar configuración global del sitio', value: 'inherit'},
          {title: 'Ocultar de los motores de búsqueda', value: 'noIndex'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
