import {defineField} from 'sanity'

/**
 * Alternative text for an image field, required only once an image is chosen,
 * so an optional image can still be left empty.
 */
export const altText = () =>
  defineField({
    name: 'alt',
    title: 'Alternative text',
    description: 'Describes the image for screen readers and search engines.',
    type: 'string',
    validation: (Rule) =>
      Rule.custom((alt, context) => {
        const parent = context.parent as {asset?: {_ref?: string}}
        return parent?.asset?._ref && !alt ? 'Required' : true
      }),
  })
