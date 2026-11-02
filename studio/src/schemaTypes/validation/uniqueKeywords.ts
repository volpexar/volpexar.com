/** How keywords are compared: trimmed, whitespace collapsed, case ignored. */
const comparable = (keyword: string) => keyword.trim().replace(/\s+/g, ' ').toLowerCase()

/**
 * Rejects keywords that are the same once compared loosely, e.g. "Precio" and
 * "precio ".  Usage: `validation: (Rule) => Rule.custom(uniqueKeywords)`.
 */
export const uniqueKeywords = (keywords: string[] | undefined) => {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const keyword of keywords ?? []) {
    const key = comparable(keyword)
    if (seen.has(key)) duplicates.add(keyword.trim())
    seen.add(key)
  }
  return duplicates.size ? `Palabras clave duplicadas: ${[...duplicates].join(', ')}` : true
}
