import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

// The shared projection for a page document, used both for pages addressed by
// slug and for the home page, which is addressed by its fixed document ID.
const pageFields = /* groq */ `
  _id,
  _type,
  slug,
  seo,
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button {
        ...,
        ${linkFields}
      }
    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "underConstructionScreen" => {
      ...,
      socialMediaLinks[]{
        ...,
        profile->{name, handle, url}
      }
    },
  },
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    ${pageFields}
  }
`)

// The home page is the one `page` document pinned to a fixed ID. It has no slug,
// so it is fetched by ID and is unreachable through the /[slug] route.
export const homePageQuery = defineQuery(`
  *[_type == 'page' && _id == 'homePage'][0]{
    ${pageFields}
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
