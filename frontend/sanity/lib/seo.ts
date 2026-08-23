import type {Metadata} from 'next'

import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * SEO values, as held by a single document or by the site-wide defaults in the
 * Settings singleton.
 *
 * Every field is optional at the type level.  On a document, an empty field means
 * "inherit the site-wide value"; the Studio schema is what requires the site-wide
 * ones to actually be filled in.
 */
export type SeoValues = {
  title?: string | null
  description?: string | null
  ogImage?: Parameters<typeof resolveOpenGraphImage>[0]
  /**
   * Document level is deliberately narrower than site level: a document may hide
   * itself, but may not un-hide itself when the site as a whole is hidden.
   */
  visibility?: 'inherit' | 'noIndex' | null
}

export type SiteSeoValues = Omit<SeoValues, 'visibility'> & {
  visibility?: 'index' | 'noIndex' | null
}

/**
 * Resolves a document's SEO metadata against the site-wide defaults.
 *
 * Inheritance is per-field, not per-object: a page that sets only a description
 * still inherits the site's social sharing image.
 *
 * Search engine visibility is the exception.  It does not fall back, it combines:
 * a page is hidden if either the page or the site says so, so hiding the whole
 * site cannot be undone by an individual page.
 *
 * Page titles render as "<document title> | <site title>".  When a document has
 * no title of its own it falls back to the site title alone, rather than
 * repeating it as "<site title> | <site title>".
 */
export function resolveSeo(
  documentSeo: SeoValues | null | undefined,
  siteSeo: SiteSeoValues | null | undefined,
): Metadata {
  const siteTitle = siteSeo?.title || undefined
  const documentTitle = documentSeo?.title || undefined

  const title = documentTitle
    ? siteTitle
      ? `${documentTitle} | ${siteTitle}`
      : documentTitle
    : siteTitle

  const description = documentSeo?.description || siteSeo?.description || undefined

  const ogImage = resolveOpenGraphImage(documentSeo?.ogImage ?? siteSeo?.ogImage)

  const isHidden = documentSeo?.visibility === 'noIndex' || siteSeo?.visibility === 'noIndex'

  const metadata: Metadata = {
    // The title is already fully composed here, so opt out of the layout's
    // "%s | ..." template rather than having the site name appended twice.
    title: title ? {absolute: title} : undefined,
    description,
    openGraph: ogImage ? {images: [ogImage]} : undefined,
  }

  if (isHidden) {
    metadata.robots = {index: false, follow: false}
  }

  return metadata
}
