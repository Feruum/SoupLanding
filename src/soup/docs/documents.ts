import manifest from './manifest.json'

export type DocHeading = { level: number; id: string; title: string }
export type DocBlock =
  | { kind: 'html'; html: string }
  | { kind: 'code'; language: string; code: string }
export type DocPage = {
  slug: string
  title: string
  description: string
  source: string
  retrieved: string
  sourceSha256: string
  headings: DocHeading[]
  blocks: DocBlock[]
}

export const docManifest = manifest
export const getDocSlugs = () => manifest.documents.map((doc) => doc.slug)
const pages = import.meta.glob<{ default: DocPage }>('./pages/*.json')

export async function loadDocument(slug: string): Promise<DocPage> {
  const load = pages[`./pages/${slug}.json`]
  if (!load || !manifest.documents.some((doc) => doc.slug === slug)) {
    throw new Error(`Unknown Soup documentation page: ${slug}`)
  }
  return (await load()).default
}

export const docsBase = (language = 'en') =>
  language === 'en' ? '/docs' : `/${language}/docs`
