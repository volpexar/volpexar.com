import {defineField, defineType} from 'sanity'
import {ComposeSparklesIcon, DocumentIcon, TagsIcon} from '@sanity/icons'

/**
 * The home page is a single `page` document pinned to this ID.  It is served at
 * the site root and deliberately has no slug, so it can never also be reached at
 * /<slug>.  The frontend hardcodes the same ID in app/page.tsx.
 */
export const HOME_PAGE_ID = 'homePage'

// Drafts are stored with a `drafts.` prefix, so this cannot be a plain equality test.
const isHomePage = (id?: string) => id === HOME_PAGE_ID || id === `drafts.${HOME_PAGE_ID}`

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'contents',
      title: 'Contenido',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'metadata',
      title: 'Metadatos',
      icon: TagsIcon,
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description:
        'Usado solamente en Sanity Studio para identificar la página.',
      // There is only ever one home page, and it has its own entry in the Studio,
      // so it needs no internal name to tell it apart from other pages.
      hidden: ({document}) => isHomePage(document?._id),
      validation: (Rule) =>
        Rule.custom((value: string | undefined, context) =>
          isHomePage(context.document?._id) || value ? true : 'Required',
        ),
      group: 'contents',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'El fragmento de URL que identifica a esta página, después del dominio. Por ejemplo, un slug "about" se sirve en la URL "volpexar.com/about".',
      hidden: ({document}) => isHomePage(document?._id),
      validation: (Rule) =>
        Rule.custom((value: {current?: string} | undefined, context) =>
          isHomePage(context.document?._id) || value?.current ? true : 'Required',
        ),
      options: {
        source: 'name',
        maxLength: 96,
      },
      group: 'contents',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Configuración de SEO para esta página.',
      // An empty SEO title falls back to the site-wide title, which is what the
      // home page wants: it should render as just "Volpexar", not "Volpexar | Volpexar".
      validation: (Rule) => Rule.required(),
      group: 'metadata',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Secciones',
      type: 'pageBuilder',
      description: 'Las secciones de contenido que componen esta página, en orden de aparición.',
      group: 'contents',
    }),
  ],
  // The document list shows the internal name, which is what editors use to find
  // a page.  The slug is shown alongside it to disambiguate similar names.
  preview: {
    select: {
      _id: '_id',
      title: 'name',
      slug: 'slug.current',
    },
    prepare({_id, title, slug}) {
      // The home page has neither an internal name nor a slug, so describe it by
      // what it is instead of falling back to "Untitled".
      if (isHomePage(_id)) {
        return {title: 'Página de inicio', subtitle: '/'}
      }
      return {
        title: title || '(Página sin nombre)',
        subtitle: slug ? `/${slug}` : undefined,
      }
    },
  },
})
