export type SearchIndex = Record<string, number[]>

export function searchWords(query: string): string[] {
  return [
    ...new Set(
      query
        .normalize('NFKD')
        .replace(/\p{M}/gu, '')
        .toLocaleLowerCase('en')
        .match(/[\p{L}\p{N}]+/gu) || [],
    ),
  ]
}

/** Match all query words; accept prefixes so partially typed commands work. */
export function searchDocuments(
  index: SearchIndex,
  query: string,
): Set<number> | null {
  const words = searchWords(query)
  if (!words.length) return null
  let matches: Set<number> | null = null
  for (const word of words) {
    const pages = new Set<number>()
    for (const [term, documents] of Object.entries(index)) {
      if (term.startsWith(word))
        for (const document of documents) pages.add(document)
    }
    matches =
      matches === null
        ? pages
        : new Set([...matches].filter((page: number) => pages.has(page)))
    if (!matches.size) break
  }
  return matches
}
