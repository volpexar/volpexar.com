import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

import {altText} from '../fields/altText'

/**
 * Site-wide SEO defaults.  Mirrors the per-document `seo` object, but its core
 * fields are required: these are the values every other document falls back to
 * when it leaves the matching field empty.
 */
export const siteSeo = defineType({
  name: 'siteSeo',
  title: 'SEO global',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título predeterminado',
      type: 'string',
      description:
        'Usado para cualquier página que no defina su propio título SEO. También se agrega al título de las páginas que sí lo definen.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(60).warning('Los títulos de más de 60 caracteres pueden ser truncados.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción meta predeterminada',
      type: 'text',
      rows: 3,
      description: 'Usada para cualquier página que no defina su propia descripción meta.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(160).warning('Las descripciones de más de 160 caracteres pueden ser truncadas.'),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen predeterminada para compartir en redes sociales (Open Graph)',
      type: 'image',
      description:
        'Usada para cualquier página que no defina su propia imagen para compartir. Tamaño recomendado: 1200x630 px.',
      options: {
        hotspot: true,
      },
      fields: [altText()],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visibility',
      title: 'Visibilidad para motores de búsqueda',
      type: 'string',
      description:
        'La configuración predeterminada para todo el sitio. Las páginas individuales pueden ocultarse de los motores de búsqueda si lo desean, pero no pueden hacerse visibles si la configuración global del sitio lo oculta todo.',
      initialValue: 'index',
      options: {
        list: [
          {title: 'Permitir indización', value: 'index'},
          {title: 'Ocultar todo el sitio de los motores de búsqueda', value: 'noIndex'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
