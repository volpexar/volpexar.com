import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveSeo} from '@/sanity/lib/seo'
import {handleError} from '@/app/client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })

  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.metadataBase ? new URL(settings.metadataBase) : undefined
  } catch {
    // ignore
  }

  // Site-wide defaults. Individual routes override these per field; see
  // `resolveSeo` in sanity/lib/seo.ts.
  return {
    metadataBase,
    ...resolveSeo(null, settings?.seo),
  }
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} bg-white text-black`}>
      <body>
        {/* The page builder renders every visible section, so the layout adds no
            chrome of its own: no header, no footer, no wrapper spacing. */}
        <main className="min-h-screen">{children}</main>

        {/* Editing infrastructure below. None of it renders anything for visitors:
            the toasts and Visual Editing overlay only appear in draft mode, and
            <SanityLive> makes sanityFetch calls live, so it must always render. */}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <SpeedInsights />
      </body>
    </html>
  )
}
