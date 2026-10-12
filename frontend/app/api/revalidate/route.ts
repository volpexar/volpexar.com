import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

/**
 * Sanity calls this route from a webhook whenever published content changes, so that
 * a publish reaches the site even when nobody has it open. <SanityLive> already
 * revalidates by tag, but only from a browser that is on the site at that moment.
 *
 * A webhook carries a document, not the sync tags the pages are cached under, so
 * this invalidates every page rather than only the affected ones. Each page is
 * regenerated on its next visit, not here.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  // Checked per request rather than at import time: only the deployment the webhook
  // targets needs the secret, and a missing one must not break the others.
  if (!secret) {
    return NextResponse.json({message: 'Missing SANITY_REVALIDATE_SECRET'}, {status: 500})
  }

  // parseBody waits for the Content Lake to settle before returning, so a page
  // regenerated straight after this cannot cache the content from before the change.
  const {isValidSignature, body} = await parseBody<{_id?: string; _type?: string}>(req, secret)

  if (!isValidSignature) {
    return NextResponse.json({message: 'Invalid signature'}, {status: 401})
  }

  revalidatePath('/', 'layout')

  return NextResponse.json({revalidated: true, _id: body?._id, _type: body?._type})
}
