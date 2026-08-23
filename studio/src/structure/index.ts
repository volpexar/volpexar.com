import {CogIcon, HomeIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

import {HOME_PAGE_ID} from '../schemaTypes/documents/page'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'assist.instruction.context']

const HOME_PAGE_IDS = [HOME_PAGE_ID, `drafts.${HOME_PAGE_ID}`]

export const structure: StructureResolver = (S: StructureBuilder) =>
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
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
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
          return listItem.title(title)
        }),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
