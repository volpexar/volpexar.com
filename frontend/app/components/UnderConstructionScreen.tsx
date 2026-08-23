import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import type {PageBuilderSectionProps} from '@/sanity/lib/types'

/**
 * A full-screen placeholder shown while a site or page is still being built:
 * an optional logo above a heading and a short body, centred in the viewport.
 */
export default function UnderConstructionScreen({
  block,
}: PageBuilderSectionProps<'underConstructionScreen'>) {
  const {heading, body, logo} = block

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      {logo?.asset?._ref && (
        <Image
          id={logo.asset._ref}
          alt={logo.alt || ''}
          width={320}
          crop={logo.crop}
          mode="contain"
          className="mb-10 h-auto w-auto max-w-[min(20rem,80vw)]"
        />
      )}

      <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight">{heading}</h1>

      {body && body.length > 0 && (
        <PortableText
          value={body as PortableTextBlock[]}
          className="mt-6 max-w-prose text-gray-600 prose-p:text-balance"
        />
      )}
    </section>
  )
}
