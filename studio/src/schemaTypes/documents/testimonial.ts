import {defineArrayMember, defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

/**
 * Testimonial document.  Feedback from someone at a client.
 *
 * It can be about the client's work with Volpexar in general, or about some of
 * the projects done for that client, so its projects must all belong to its client.
 */

type Reference = {_ref?: string}

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'The person at the client who gave this testimonial.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author role',
      type: 'string',
      description: "The author's position at the client, e.g. Owner or Marketing Manager.",
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description:
        "Leave empty if the testimonial is about the client's work with Volpexar in general. Only the client's own projects can be chosen.",
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
          options: {
            // Offer only the chosen client's projects.  With no client chosen yet,
            // the filter matches nothing rather than every project.
            filter: ({document}) => ({
              filter: 'client._ref == $client',
              params: {client: (document.client as Reference | undefined)?._ref ?? ''},
            }),
          },
        }),
      ],
      validation: (Rule) =>
        Rule.unique().custom(async (projects: Reference[] | undefined, context) => {
          const client = (context.document?.client as Reference | undefined)?._ref
          const ids = (projects ?? []).map((project) => project._ref).filter(Boolean)
          if (!client || ids.length === 0) return true

          // The picker only offers the client's projects, but changing the client
          // afterwards would leave earlier choices pointing at someone else's work.
          const foreign = await context
            .getClient({apiVersion: '2024-01-01'})
            .fetch<string[]>(`*[_id in $ids && client._ref != $client].title`, {ids, client})

          return foreign.length
            ? `Not projects for this client: ${foreign.join(', ')}. Remove them or change the client.`
            : true
        }),
    }),
  ],
  preview: {
    select: {
      author: 'author',
      client: 'client.name',
      quote: 'quote',
    },
    prepare({author, client, quote}) {
      return {
        title: [author, client].filter(Boolean).join(', ') || 'Untitled testimonial',
        subtitle: quote,
      }
    },
  },
})
