import {defineArrayMember, defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons'

import {altText} from '../fields/altText'

/**
 * Project document.  A piece of work done for a client, served at /proyectos/<slug>.
 *
 * A project is a page in its own right: its visible content is a page builder,
 * like any `page`.  The fields above the page builder describe the project for
 * the places that list it, such as the /proyectos hub, cards and filters.
 */

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  icon: ProjectsIcon,
  orderings: [
    {
      title: 'Fecha de inicio, más reciente primero',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      description: 'Usado solamente en Sanity Studio para identificar el proyecto.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'El fragmento de URL que identifica a este proyecto. Por ejemplo, un slug "mi-proyecto" se sirve en la URL "volpexar.com/proyectos/mi-proyecto".',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'reference',
      description: 'El cliente para el que se hizo este proyecto.',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Servicios',
      type: 'array',
      description: 'Cada servicio provisto por Volpexar en este proyecto.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      validation: (Rule) => Rule.required().unique(),
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha de inicio',
      type: 'date',
      description: 'Cuando empezó el proyecto.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de fin',
      type: 'date',
      description: 'Cuando terminó el proyecto. Dejar vacío si el proyecto sigue en curso.',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = (context.parent as {startDate?: string})?.startDate
          return endDate && startDate && endDate < startDate
            ? 'La fecha de fin no puede ser anterior a la de inicio.'
            : true
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      description: 'Representa el proyecto dondequiera que se liste.',
      options: {
        hotspot: true,
      },
      fields: [altText()],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      description: 'Un resumen breve del proyecto, usado en listados y tarjetas.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Configuración de SEO para la página de este proyecto.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Secciones',
      type: 'pageBuilder',
      description: "Las secciones de contenido que componen esta página, en orden de aparición.",
    }),
  ],
  preview: {
    select: {
      name: 'name',
      client: 'client.name',
      startDate: 'startDate',
      endDate: 'endDate',
      media: 'coverImage',
    },
    prepare({name, client, startDate, endDate, media}) {
      const startYear = startDate?.slice(0, 4)
      const endYear = endDate ? endDate.slice(0, 4) : 'en curso'
      const period = startYear && (startYear === endYear ? startYear : `${startYear} - ${endYear}`)
      return {
        title: `${client} · ${name || '(Proyecto sin nombre)'}`,
        subtitle: period,
        media,
      }
    },
  },
})
