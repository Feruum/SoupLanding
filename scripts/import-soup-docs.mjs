import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

// Public-source import. Preserve prose, commands and anchors; replace the remote UI.
const origin = 'https://trysoup.dev'
const output = new URL('../src/soup/docs/', import.meta.url)
const cache = path.join(os.tmpdir(), 'soup-docs-source')
await fs.mkdir(cache, { recursive: true })
await fs.mkdir(new URL('pages/', output), { recursive: true })
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
const plain = (s) =>
  decode(s.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ''))
async function download(url, name) {
  const cached = path.join(cache, name)
  if (!process.argv.includes('--refresh')) {
    try {
      return await fs.readFile(cached, 'utf8')
    } catch {
      /* First import. */
    }
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
      const body = await response.text()
      await fs.writeFile(cached, body)
      return body
    } catch (error) {
      if (attempt === 2) throw error
    }
  }
}
const start = await download(
  `${origin}/docs/getting-started`,
  'getting-started.html',
)
const sitemap = await download(`${origin}/sitemap.xml`, 'sitemap.xml')
const slugs = [
  ...new Set(
    [
      ...sitemap.matchAll(
        /<loc>https:\/\/trysoup\.dev\/docs\/([^<#?]+)<\/loc>/g,
      ),
    ].map((m) => m[1]),
  ),
].sort()
if (slugs.length < 100)
  throw new Error('Unexpectedly incomplete documentation sitemap')
const known = new Set(slugs)
const localHref = (href) => {
  const url = new URL(decode(href), origin)
  if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) {
    if (href.startsWith('#')) return href
    throw new Error(`Unsafe documentation URL: ${href}`)
  }
  if (href.startsWith('#')) return href
  if (
    url.origin === origin &&
    (url.pathname === '/docs' ||
      known.has(url.pathname.replace(/^\/docs\//, '')))
  )
    return `__DOCS_BASE__${url.pathname.slice(5)}${url.search}${url.hash}`
  return url.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}
const allowed = new Set(
  'h1 h2 h3 h4 h5 h6 p strong em b i a code blockquote ul ol li div nav span br hr table thead tbody tfoot tr th td img figure figcaption details summary sup sub s del kbd dl dt dd video source'.split(
    ' ',
  ),
)
const tags = new Set()
function sanitize(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, (tag) => {
      const match = tag.match(/^<(\/?)([a-z][a-z0-9]*)\b/i)
      if (!match) throw new Error(`Unrecognized HTML: ${tag}`)
      const name = match[2].toLowerCase()
      tags.add(name)
      if (!allowed.has(name))
        throw new Error(`Unreviewed documentation element: ${name}`)
      if (match[1]) return `</${name}>`
      const attrs = []
      for (const attr of tag.matchAll(
        /\b(id|href|src|alt|title|colspan|rowspan|width|height|start|poster|type)="([^"]*)"/g,
      )) {
        let value = attr[2]
        if (attr[1] === 'href') value = localHref(value)
        if (attr[1] === 'src' || attr[1] === 'poster') {
          const url = new URL(decode(value), origin)
          if (url.protocol !== 'https:')
            throw new Error(`Unsafe media URL: ${value}`)
          value = url.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        }
        attrs.push(`${attr[1]}="${value}"`)
      }
      if (name === 'h1' && !attrs.some((a) => a.startsWith('id=')))
        attrs.push('id="docs-top"')
      if (name === 'img') attrs.push('loading="lazy"')
      if (name === 'video') attrs.push('controls')
      return `<${name}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`
    })
}
const sidebar = start.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/)[1]
const navigation = [
  ...sidebar.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4><ul[^>]*>([\s\S]*?)<\/ul>/g),
].map((m) => ({
  title: plain(m[1]),
  links: [
    ...m[2].matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g),
  ].map((a) => ({
    slug: a[1].replace('/docs/', ''),
    title: plain(a[2].match(/<span[^>]*>([\s\S]*?)<\/span>/)[1]),
    version: plain(a[2].replace(/<span[^>]*>[\s\S]*?<\/span>/, '')).trim(),
  })),
}))
const renamedIds = []
function uniqueArticleIds(html, slug) {
  // Reserve every original ID, so an existing foo-2 keeps its inbound links.
  const reserved = new Set(
    [...html.matchAll(/\sid="([^"]*)"/g)].map((match) => decode(match[1])),
  )
  const seen = new Set()
  return html.replace(
    /(\sid=")([^"]*)(")/g,
    (match, before, encoded, after) => {
      const original = decode(encoded)
      if (!seen.has(original)) {
        seen.add(original)
        return match
      }
      let suffix = 2
      while (
        reserved.has(`${original}-${suffix}`) ||
        seen.has(`${original}-${suffix}`)
      )
        suffix++
      const id = `${original}-${suffix}`
      seen.add(id)
      renamedIds.push({ slug, from: original, to: id })
      return `${before}${encoded}-${suffix}${after}`
    },
  )
}
function extract(source, slug) {
  const rawArticle = source.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1]
  if (!rawArticle) throw new Error(`No article in ${slug}`)
  const article = uniqueArticleIds(
    rawArticle.replace(/<h1\b([^>]*)>/, (match, attributes) =>
      /\sid=/.test(attributes) ? match : `<h1${attributes} id="docs-top">`,
    ),
    slug,
  )
  const title = plain(article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || slug)
  const description = decode(
    source.match(/<meta name="description" content="([^"]*)"/)?.[1] || '',
  )
  const headings = [
    ...article.matchAll(/<h([2-6])\b[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g),
  ].map((m) => ({ level: Number(m[1]), id: m[2], title: plain(m[3]) }))
  const blocks = []
  const code =
    /<div class="group relative [^"]*">(?:<div[^>]*>(.*?)<\/div>)?<button[^>]*>Copy<\/button><pre[^>]*><code>([\s\S]*?)<\/code><\/pre><\/div>/g
  let cursor = 0
  for (const match of article.matchAll(code)) {
    if (match.index > cursor)
      blocks.push({
        kind: 'html',
        html: sanitize(article.slice(cursor, match.index)),
      })
    blocks.push({
      kind: 'code',
      language: plain(match[1] || 'terminal'),
      code: plain(match[2]),
    })
    cursor = match.index + match[0].length
  }
  if (cursor < article.length)
    blocks.push({ kind: 'html', html: sanitize(article.slice(cursor)) })
  const codeCount = (article.match(/<pre\b/g) || []).length
  if (codeCount !== blocks.filter((b) => b.kind === 'code').length)
    throw new Error(`Unextracted code in ${slug}: ${codeCount}`)
  return {
    slug,
    title,
    description,
    source: `${origin}/docs/${slug}`,
    retrieved: new Date().toISOString().slice(0, 10),
    sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
    headings,
    blocks,
  }
}
const documents = []
let next = 0
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (next < slugs.length) {
      const slug = slugs[next++]
      const source =
        slug === 'getting-started'
          ? start
          : await download(`${origin}/docs/${slug}`, `${slug}.html`)
      const doc = extract(source, slug)
      await fs.writeFile(
        new URL(`pages/${slug}.json`, output),
        `${JSON.stringify(doc, null, 2)}\n`,
      )
      documents.push({
        slug,
        title: doc.title,
        description: doc.description,
        headings: doc.headings.length,
        codeBlocks: doc.blocks.filter((b) => b.kind === 'code').length,
        sourceSha256: doc.sourceSha256,
      })
      if (documents.length % 10 === 0)
        console.log(
          `Imported ${documents.length}/${slugs.length} documentation pages`,
        )
    }
  }),
)
documents.sort((a, b) => a.slug.localeCompare(b.slug))
// An inverted index supports body/command searches without shipping article bodies.
const searchIndex = Object.create(null)
const allPages = new Map()
for (const [index, item] of documents.entries()) {
  const doc = JSON.parse(
    await fs.readFile(new URL(`pages/${item.slug}.json`, output), 'utf8'),
  )
  allPages.set(item.slug, doc)
  const text = `${doc.title} ${doc.slug} ${doc.description} ${doc.blocks.map((block) => (block.kind === 'code' ? block.code : plain(block.html))).join(' ')}`
  const words = new Set(
    text
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLocaleLowerCase('en')
      .match(/[\p{L}\p{N}]+/gu) || [],
  )
  for (const word of words) (searchIndex[word] ??= []).push(index)
}
const ids = new Map(
  [...allPages].map(([slug, doc]) => {
    const articleIds = doc.blocks
      .filter((block) => block.kind === 'html')
      .flatMap((block) =>
        [...block.html.matchAll(/\bid="([^"]*)"/g)].map((match) =>
          decode(match[1]),
        ),
      )
    const unique = new Set(articleIds)
    if (unique.size !== articleIds.length)
      throw new Error(`Duplicate element IDs remain in ${slug}`)
    if (
      new Set(doc.headings.map((heading) => heading.id)).size !==
      doc.headings.length
    )
      throw new Error(`Duplicate TOC targets remain in ${slug}`)
    for (const heading of doc.headings)
      if (!unique.has(decode(heading.id)))
        throw new Error(`Missing TOC target ${slug}#${heading.id}`)
    return [slug, unique]
  }),
)
let localLinks = 0
let anchorLinks = 0
for (const [slug, doc] of allPages) {
  for (const block of doc.blocks.filter((item) => item.kind === 'html')) {
    for (const match of block.html.matchAll(/\bhref="([^"]*)"/g)) {
      const href = decode(match[1])
      if (!href.startsWith('__DOCS_BASE__') && !href.startsWith('#')) continue
      localLinks++
      const [route, fragment = ''] = href.split('#')
      const target = href.startsWith('#')
        ? slug
        : route.replace('__DOCS_BASE__', '').replace(/^\//, '').split('?')[0]
      if (!target) continue // The local documentation index.
      if (!allPages.has(target))
        throw new Error(
          `Missing documentation route ${target}, linked from ${slug}`,
        )
      if (fragment) {
        anchorLinks++
        if (!ids.get(target).has(decodeURIComponent(fragment)))
          throw new Error(
            `Missing anchor ${target}#${fragment}, linked from ${slug}`,
          )
      }
    }
  }
}
await fs.writeFile(
  new URL('search-index.json', output),
  `${JSON.stringify(searchIndex)}\n`,
)
await fs.writeFile(
  new URL('manifest.json', output),
  `${JSON.stringify({ source: `${origin}/sitemap.xml`, retrieved: new Date().toISOString().slice(0, 10), navigation, documents }, null, 2)}\n`,
)
console.log(
  JSON.stringify({
    pages: documents.length,
    codeBlocks: documents.reduce((n, d) => n + d.codeBlocks, 0),
    headings: documents.reduce((n, d) => n + d.headings + 1, 0),
    localLinks,
    anchorLinks,
    duplicateIdsRenamed: renamedIds,
    elements: [...tags].sort(),
  }),
)
