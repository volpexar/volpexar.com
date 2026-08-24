import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * One social media call to action: which profile to link to, and the icon to
 * represent it with.
 *
 * The profile is a reference, so handles and URLs stay defined in one place.
 * The icon lives here rather than on the profile because the right icon depends
 * on the design of the section it appears in.
 */

export const socialMediaLink = defineType({
  name: 'socialMediaLink',
  title: 'Social media link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'profile',
      title: 'Profile',
      type: 'reference',
      to: [{type: 'socialMediaProfile'}],
      description: 'The social media profile this links to.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'The icon shown for this profile. An SVG works best.',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description:
            'Leave empty when the profile name is already shown next to the icon, so screen readers do not read it twice.',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'profile.name',
      subtitle: 'profile.handle',
      media: 'icon',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'No profile selected',
        subtitle,
        media,
      }
    },
  },
})
