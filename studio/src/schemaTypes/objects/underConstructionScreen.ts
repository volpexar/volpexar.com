import {defineField, defineType} from 'sanity'
import {ComposeSparklesIcon, ImageIcon, LockIcon} from '@sanity/icons'

/**
 * Under Construction Screen schema object.  A full-screen placeholder section used
 * while a site (or a single page) is still being built.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const underConstructionScreen = defineType({
  name: 'underConstructionScreen',
  title: 'Under Construction Screen',
  type: 'object',
  icon: LockIcon,
  groups: [
    {
      name: 'contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'media',
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The main headline, e.g. "Under Construction".',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContentTextOnly',
      description: 'Supporting text shown beneath the heading.',
      group: 'contents',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'The logo variant to display on this screen.',
      options: {
        hotspot: true,
      },
      group: 'media',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO.',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}}
              if (parent?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'socialMediaLinks',
      title: 'Social media links',
      type: 'array',
      description:
        'Optional calls to action linking to the client’s social media profiles, shown in the order listed here. Drag to reorder.',
      group: 'contents',
      of: [{type: 'socialMediaLink'}],
      validation: (Rule) =>
        Rule.custom((links?: {profile?: {_ref?: string}}[]) => {
          if (!links) return true

          // The same profile twice would render two identical calls to action.
          const refs = links.map((link) => link?.profile?._ref).filter(Boolean)
          const duplicated = refs.some((ref, index) => refs.indexOf(ref) !== index)

          return duplicated ? 'Each social media profile can only be listed once.' : true
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
        title: title || 'Untitled Under Construction Screen',
        subtitle: 'Under Construction Screen',
        media: media || LockIcon,
      }
    },
  },
})
