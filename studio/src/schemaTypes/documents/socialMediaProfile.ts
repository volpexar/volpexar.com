import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * Social Media Profile document.  One per platform the client is present on.
 *
 * Profiles are defined once here and referenced wherever they are displayed, so
 * a handle or link only ever has to be updated in one place.  Icons are not
 * stored here: a section decides how to present a profile, because the right
 * icon depends on the design it appears in.
 */

export const socialMediaProfile = defineType({
  name: 'socialMediaProfile',
  title: 'Social Media Profile',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The platform this profile is on, e.g. Instagram, Facebook or WhatsApp.',
      validation: (Rule) =>
        Rule.required().custom(async (name, context) => {
          if (!name) return true

          const {getClient, document} = context
          const client = getClient({apiVersion: '2024-01-01'})

          // A document and its draft share an identity, so exclude both forms of
          // the current document when looking for an existing name.
          const id = document?._id.replace(/^drafts\./, '') || ''
          const duplicate = await client.fetch<string | null>(
            `*[_type == "socialMediaProfile" && lower(name) == lower($name) && !(_id in [$id, $draftId])][0].name`,
            {name, id, draftId: `drafts.${id}`},
          )

          return duplicate ? `A profile named "${duplicate}" already exists.` : true
        }),
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
      description:
        'What identifies the client on that platform, as it should be shown: a username like @volpexar, or a phone number like +54 9 221 123-4567.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description:
        'Where the link goes, e.g. https://instagram.com/volpexar or https://wa.me/5492211234567.',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'handle',
    },
  },
})
