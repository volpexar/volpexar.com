import type {Metadata} from 'next'

import PageBuilderPage from '@/app/components/PageBuilder'
import {PageOnboarding} from '@/app/components/Onboarding'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {resolveSeo} from '@/sanity/lib/seo'
import {GetPageQueryResult} from '@/sanity.types'

/**
 * The site root renders the `page` document pinned to the fixed `homePage` ID.
 * That document has no slug, so it is served here and nowhere else.
 */

export async function generateMetadata(): Promise<Metadata> {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: homePageQuery, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  return resolveSeo(page?.seo, settings?.seo)
}

export default async function Page() {
  const {data: page} = await sanityFetch({query: homePageQuery})

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return <PageBuilderPage page={page as GetPageQueryResult} />
}
