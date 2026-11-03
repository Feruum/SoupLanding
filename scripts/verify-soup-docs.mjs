import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const manifest = JSON.parse(
  fs.readFileSync('src/soup/docs/manifest.json', 'utf8'),
)
const pages = new Map(
  manifest.documents.map(({ slug }) => [
    slug,
    JSON.parse(fs.readFileSync(`src/soup/docs/pages/${slug}.json`, 'utf8')),
  ]),
)
let commands = 0,
  links = 0
const ids = new Map(
  [...pages].map(([slug, doc]) => [
    slug,
    new Set(
      doc.blocks.flatMap((block) =>
        block.kind === 'html'
          ? [...block.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
          : [],
      ),
    ),
  ]),
)
for (const [slug, doc] of pages) {
  const allIds = doc.blocks.flatMap((block) =>
    block.kind === 'html'
      ? [...block.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
      : [],
  )
  assert.equal(
    new Set(allIds).size,
    allIds.length,
    `${slug}: duplicate element IDs`,
  )
  assert.ok(
    doc.title && doc.blocks.length && doc.sourceSha256.length === 64,
    `${slug}: source provenance`,
  )
  for (const block of doc.blocks) {
    if (block.kind === 'code') {
      commands++
      assert.ok(block.code.trim(), `${slug}: empty code`)
      continue
    }
    assert.ok(
      !/<script\b|\son\w+\s*=|javascript:/i.test(block.html),
      `${slug}: executable article content`,
    )
    for (const [, href] of block.html.matchAll(/href="([^"]+)"/g)) {
      if (!href.startsWith('__DOCS_BASE__/') && !href.startsWith('#')) continue
      links++
      const [target, anchor] = href.replace('__DOCS_BASE__/', '').split('#')
      const targetSlug = href.startsWith('#') ? slug : target.replace(/\/$/, '')
      if (!targetSlug) continue
      assert.ok(pages.has(targetSlug), `${slug}: missing ${href}`)
      if (anchor)
        assert.ok(
          ids.get(targetSlug).has(decodeURIComponent(anchor)),
          `${slug}: missing #${anchor} in ${targetSlug}`,
        )
    }
  }
}
assert.equal(pages.size, 131)
assert.equal(commands, 667)
if (process.argv.includes('--built')) {
  const locales = [
    ...Object.keys(
      JSON.parse(fs.readFileSync('src/i18n/locales.json', 'utf8')),
    ),
    'kk',
  ]
  const output = 'dist/client'
  const generatedFiles = new Set(
    fs
      .readdirSync(output, { recursive: true })
      .map((file) => file.replaceAll('\\', '/')),
  )
  const routes = new Set()
  for (const locale of locales) {
    const prefix = locale === 'en' ? '' : `${locale}/`
    for (const route of [
      '',
      'zero/',
      'hire/',
      'leaderboard/',
      'docs/',
      ...[...pages.keys()].map((slug) => `docs/${slug}/`),
    ])
      routes.add(`/${prefix}${route}`)
  }
  const checkedAssets = new Map()
  let checkedBodies = 0
  for (const route of routes) {
    const file = path.join(output, route, 'index.html')
    assert.ok(
      generatedFiles.has(`${route.slice(1)}index.html`),
      `Missing built route: ${route}`,
    )
    // The full article graph was checked above. Read every English article and
    // all four page families in each locale rather than the same body 52 times.
    if (
      route.includes('/docs/') &&
      !route.startsWith('/docs/') &&
      !route.endsWith('/docs/') &&
      !route.endsWith('/getting-started/')
    )
      continue
    checkedBodies++
    const html = fs.readFileSync(file, 'utf8')
    assert.ok(
      html.includes('id="main"') && html.includes('id="footer"'),
      `${route}: shared shell`,
    )
    if (route.includes('/docs/') && !route.endsWith('/docs/'))
      assert.ok(
        html.includes('lang="en" dir="ltr"'),
        `${route}: original article language`,
      )
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g)) {
      const normalized = href.endsWith('/') ? href : `${href}/`
      if (!routes.has(normalized) && !checkedAssets.has(href))
        checkedAssets.set(href, generatedFiles.has(href.slice(1)))
      assert.ok(
        routes.has(normalized) || checkedAssets.get(href),
        `${route}: missing local link ${href}`,
      )
    }
  }
  console.log(
    `Built site: ${routes.size} routes exist; ${checkedBodies} page bodies cover every English article and all four page families across 52 locales.`,
  )
}
console.log(
  `Documentation: ${pages.size} complete articles, ${commands} code blocks and ${links} local links verified.`,
)
