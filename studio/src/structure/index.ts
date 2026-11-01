import {CogIcon, HomeIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {HOME_PAGE_ID} from '../schemaTypes/documents/page'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings']

const HOME_PAGE_IDS = [HOME_PAGE_ID, `drafts.${HOME_PAGE_ID}`]

// Each of these needs an `orderRankField` in its schema.
const ORDERABLE_TYPES = ['service', 'teamMember']

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('Website Content')
    .items([
      // The home page is a single `page` document pinned to a fixed ID, served at
      // the site root.  It has no slug, so it cannot also be reached at /<slug>.
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .icon(HomeIcon)
        .child(S.document().schemaType('page').documentId(HOME_PAGE_ID).title('Home Page')),
      ...S.documentTypeListItems()
        // Remove the "settings" content from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          const title = pluralize(listItem.getTitle() as string)
          // The home page is pinned above as its own singleton, so keep it out of
          // the regular "Pages" list rather than showing the same document twice.
          if (listItem.getId() === 'page') {
            return listItem.title(title).child(
              S.documentTypeList('page')
                .title(title)
                .filter('_type == $type && !(_id in $homePageIds)')
                .params({type: 'page', homePageIds: HOME_PAGE_IDS}),
            )
          }
          // These are listed in a manual, drag-and-drop order, which is the
          // default order wherever the site shows all of them.
          if (ORDERABLE_TYPES.includes(listItem.getId() as string)) {
            return orderableDocumentListDeskItem({
              type: listItem.getId() as string,
              title,
              icon: context.schema.get(listItem.getId() as string)?.icon,
              S,
              context,
            })
          }
          return listItem.title(title)
        }),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
