import type {StringRule} from 'sanity'

/**
 * Requires a document's `name` field to be unique, case-insensitively, among
 * documents of the same type.  Usage: `validation: (Rule) => uniqueName(Rule, 'client')`.
 */
export const uniqueName = (Rule: StringRule, type: string, label = 'document') =>
  Rule.required().custom(async (name, context) => {
    if (!name) return true

    const {getClient, document} = context
    const client = getClient({apiVersion: '2024-01-01'})

    // A document and its draft share an identity, so exclude both forms of
    // the current document when looking for an existing name.
    const id = document?._id.replace(/^drafts\./, '') || ''
    const duplicate = await client.fetch<string | null>(
      `*[_type == $type && lower(name) == lower($name) && !(_id in [$id, $draftId])][0].name`,
      {type, name, id, draftId: `drafts.${id}`},
    )

    return duplicate ? `Ya existe un ${label} llamado "${duplicate}".` : true
  })
