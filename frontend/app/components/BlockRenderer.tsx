import UnderConstructionScreen from '@/app/components/UnderConstructionScreen'
import {dataAttr} from '@/sanity/lib/utils'
import type {
  PageBuilderSection,
  PageBuilderSectionComponent,
  PageBuilderSectionComponents,
  PageBuilderSectionType,
} from '@/sanity/lib/types'

/**
 * The canonical component for every page builder section type.
 *
 * This object is exhaustively typed: adding a section type to the Studio schema
 * and regenerating types makes this fail to compile until a component is
 * registered for it, and each component's `block` prop must match the key it is
 * registered under.
 */
const sectionComponents: PageBuilderSectionComponents = {
  underConstructionScreen: UnderConstructionScreen,
}

type BlockRendererProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

/**
 * Used by the <PageBuilder>, this renders the component registered for the
 * block's `_type`, passing it the block's own data as typed props.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockRendererProps) {
  const type = block._type as PageBuilderSectionType
  const Section = sectionComponents[type] as
    | PageBuilderSectionComponent<PageBuilderSectionType>
    | undefined

  // A section type present in the data but not in the registry: this can happen
  // when the Studio schema is ahead of the frontend.
  if (!Section) {
    return (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    )
  }

  return (
    <div
      data-sanity={dataAttr({
        id: pageId,
        type: pageType,
        path: `pageBuilder[_key=="${block._key}"]`,
      }).toString()}
    >
      <Section block={block} index={index} pageId={pageId} pageType={pageType} />
    </div>
  )
}
