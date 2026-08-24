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
  const {heading, body, logo, socialMediaLinks} = block

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-surface-brand px-6 py-20 text-center text-on-brand">
      {logo?.asset?._ref && (
        <Image
          id={logo.asset._ref}
          alt={logo.alt || ''}
          width={320}
          crop={logo.crop}
          mode="contain"
          className="mb-16 h-auto w-auto max-w-[min(10rem,40vw)]"
        />
      )}

      <h1 className="text-[2rem]/[1.5] tracking-tight">{heading}</h1>

      {body && body.length > 0 && (
        <PortableText
          value={body as PortableTextBlock[]}
          /* `prose` brings its own colours, font size, line height and paragraph
             margins, so each is overridden here to match the design: 16px/1.5
             text, separated by 8px rather than prose's default 1.25em margins. */
          className="mt-6 max-w-prose text-[1rem]/[1.5] prose-p:m-0 prose-p:pb-4 prose-p:text-[1rem]/[1.5] prose-p:text-balance prose-headings:text-on-brand prose-p:text-on-brand prose-strong:text-on-brand prose-a:text-on-brand"
        />
      )}

      {socialMediaLinks && socialMediaLinks.length > 0 && (
        <nav aria-label="Social media" className="mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {socialMediaLinks.map(({_key, profile, icon}) => (
              <li key={_key}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* The icons are white artwork, so the background only tints on
                     hover rather than filling: a solid fill would hide them. */
                  className="inline-flex items-center gap-2 rounded-full border border-current/40 px-5 py-2.5 text-[1rem]/[1.5] transition-colors hover:bg-on-brand/20 focus-visible:bg-on-brand/20"
                >
                  {icon.asset?._ref && (
                    <Image
                      id={icon.asset._ref}
                      alt={icon.alt || ''}
                      width={24}
                      crop={icon.crop}
                      mode="contain"
                      className="h-6 w-6 shrink-0"
                    />
                  )}
                  {profile.name}
                  <span className="sr-only"> ({profile.handle})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  )
}
