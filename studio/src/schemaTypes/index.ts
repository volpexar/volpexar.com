import {page} from './documents/page'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {pageBuilder} from './objects/pageBuilder'
import {underConstructionScreen} from './objects/underConstructionScreen'
import {seo} from './objects/seo'
import {siteSeo} from './objects/siteSeo'
import {socialMediaProfile} from './documents/socialMediaProfile'
import {socialMediaLink} from './objects/socialMediaLink'
import {service} from './documents/service'
import {client} from './documents/client'
import {project} from './documents/project'
import {testimonial} from './documents/testimonial'
import {teamMember} from './documents/teamMember'
import {faqEntry} from './documents/faqEntry'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  project,
  service,
  client,
  testimonial,
  teamMember,
  faqEntry,
  socialMediaProfile,
  // Objects
  blockContentTextOnly,
  pageBuilder,
  underConstructionScreen,
  link,
  seo,
  siteSeo,
  socialMediaLink,
]
