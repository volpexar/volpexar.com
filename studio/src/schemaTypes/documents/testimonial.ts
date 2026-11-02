import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

/**
 * Testimonial document. Represents feedback from a client, or from someone at one.
 *
 * The client only records whose testimonial this is and is never shown on the
 * site.  The author and author role are what is shown, so the role carries any
 * context the reader needs, e.g. Architect or Director at This Company.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Opinión de cliente',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Cita textual',
      type: 'text',
      description: 'La cita textual de lo que dijo el cliente, tal como debe mostrarse en el sitio.',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      description: 'El nombre de la persona que emitió la opinión, tal como debe mostrarse en el sitio.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Rol del autor',
      type: 'string',
      description:
        'Se muestra junto al nombre del autor, escrito tal como debe leerse: por ejemplo, "Arquitecta" si es freelancer, o "Director en Tal Empresa" si es empleado de una empresa.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'reference',
      to: [{type: 'client'}],
      description: 'A qué cliente corresponde esta opinión.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      author: 'author',
      authorRole: 'authorRole',
      logo: 'client.logo',
    },
    prepare({author, authorRole, logo}) {
      return {
        title: author?.trim() || '(Opinión de cliente sin autor)',
        subtitle: authorRole,
        // With no client logo, Sanity falls back to the type's icon.
        media: logo,
      }
    },
  },
})
