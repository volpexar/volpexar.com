import {GetPageQueryResult} from '@/sanity.types'

export type PageBuilderSection = NonNullable<NonNullable<GetPageQueryResult>['pageBuilder']>[number]

/** The `_type` discriminator of every section the page builder can hold. */
export type PageBuilderSectionType = PageBuilderSection['_type']

export type ExtractPageBuilderType<T extends PageBuilderSectionType> = Extract<
  PageBuilderSection,
  {_type: T}
>

/**
 * The props every section component receives.
 *
 * `block` is narrowed to the one section type the component handles, so a
 * component written for `callToAction` cannot be registered against
 * `infoSection`: see `sectionComponents` in app/components/BlockRenderer.tsx.
 *
 * `pageId` and `pageType` are only needed to build data attributes for non-text
 * overlays in Presentation (Visual Editing).
 */
export type PageBuilderSectionProps<T extends PageBuilderSectionType> = {
  block: ExtractPageBuilderType<T>
  index: number
  pageId: string
  pageType: string
}

/** A React component that renders one kind of page builder section. */
export type PageBuilderSectionComponent<T extends PageBuilderSectionType> = React.ComponentType<
  PageBuilderSectionProps<T>
>

/**
 * The registry mapping every section type to its canonical component.
 *
 * Using a mapped type over the union — rather than an index signature — means
 * TypeScript checks three things at once: every section type has a component,
 * no unknown keys are added, and each component's `block` prop matches the key
 * it is registered under.
 */
export type PageBuilderSectionComponents = {
  [T in PageBuilderSectionType]: PageBuilderSectionComponent<T>
}

// Represents a Link after GROQ dereferencing (page/post become slug strings)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page' | 'post'
  href?: string
  page?: string | null
  post?: string | null
  openInNewTab?: boolean
}
