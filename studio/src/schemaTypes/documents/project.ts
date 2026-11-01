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
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'The URL path for this project. For example, a slug of "rebranding" is served at /proyectos/rebranding.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Every service involved in this project.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'When the work was delivered. Used to sort projects, newest first.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      description: 'Represents the project wherever it is listed.',
      options: {
        hotspot: true,
      },
      fields: [altText()],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'A short description, shown on cards and in the projects hub.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
      description: "All visible content on this project's page, section by section.",
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client.name',
      date: 'date',
      media: 'coverImage',
    },
    prepare({title, client, date, media}) {
      return {
        title: title || 'Untitled project',
        subtitle: [client, date?.slice(0, 4)].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
