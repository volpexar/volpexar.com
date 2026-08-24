import {page} from './documents/page'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {underConstructionScreen} from './objects/underConstructionScreen'
import {seo} from './objects/seo'
import {siteSeo} from './objects/siteSeo'
import {socialMediaProfile} from './documents/socialMediaProfile'
import {socialMediaLink} from './objects/socialMediaLink'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  socialMediaProfile,
  // Objects
  blockContentTextOnly,
  underConstructionScreen,
  link,
  seo,
  siteSeo,
  socialMediaLink,
]
