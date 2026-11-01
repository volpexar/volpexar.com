import {defineArrayMember, defineType} from 'sanity'

/**
 * Page builder: the visible content of any routable document, section by section.
 *
 * Shared by every type that renders as a page (`page`, `project`), so a block
 * registered here is available everywhere at once.  Each block must also be
 * registered in the frontend's BlockRenderer, or it renders as a fallback box.
 */

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [defineArrayMember({type: 'underConstructionScreen'})],
  options: {
    insertMenu: {
      // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/studio/array-type#efb1fe03459d
      views: [
        {
          name: 'grid',
          previewImageUrl: (schemaTypeName) =>
            `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
        },
      ],
    },
  },
})
