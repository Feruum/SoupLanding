import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(
  fs.readFileSync(path.join(root, 'src/i18n/locales.json'), 'utf8'),
)
const codes = [...Object.keys(registry), 'kk']
const english = JSON.parse(
  fs.readFileSync(path.join(root, 'src/soup/messages/en.json'), 'utf8'),
)
const keys = Object.keys(english).sort()
for (const code of codes) {
  const messages = JSON.parse(
    fs.readFileSync(path.join(root, `src/soup/messages/${code}.json`), 'utf8'),
  )
  assert.deepEqual(
    Object.keys(messages).sort(),
    keys,
    `${code}: catalogue keys`,
  )
  for (const [key, value] of Object.entries(messages)) {
    assert.equal(typeof value, 'string', `${code}.${key}: string required`)
    assert.ok(
      value.trim() && !value.includes('\uFFFD'),
      `${code}.${key}: empty or invalid encoding`,
    )
  }
  if (process.argv.includes('--built')) {
    const route = code === 'en' ? '' : code
    const html = fs.readFileSync(
      path.join(root, 'dist/client', route, 'index.html'),
      'utf8',
    )
    assert.ok(html.includes(`lang="${code}"`), `${code}: wrong language`)
    assert.ok(
      html.includes(messages.heroTitle),
      `${code}: missing localized title`,
    )
    assert.ok(
      !/Omarchy|omarchy\.org|HydraDB/.test(html),
      `${code}: legacy brand in HTML`,
    )
    const head = html.split('</head>')[0]
    assert.equal(
      (head.match(/hreflang=/g) ?? []).length,
      53,
      `${code}: alternate locales`,
    )
    assert.ok(html.includes('id="footer"'), `${code}: full footer missing`)
    const ids = new Set(
      [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
    )
    for (const match of html.matchAll(/href="#([^"]+)"/g))
      assert.ok(ids.has(match[1]), `${code}: broken #${match[1]}`)
    const hire = fs.readFileSync(
      path.join(root, 'dist/client', route, 'hire', 'index.html'),
      'utf8',
    )
    assert.ok(
      hire.includes(`lang="${code}"`) && hire.includes(messages.hirePageRole),
      `${code}: hire page not localized`,
    )
    const dir = ['ar', 'fa', 'ur', 'he'].includes(code) ? 'rtl' : 'ltr'
    assert.ok(html.includes(`dir="${dir}"`), `${code}: wrong direction`)
  }
}
assert.equal(codes.length, 52)
console.log(
  `Soup: ${codes.length} complete locales × ${keys.length} strings${process.argv.includes('--built') ? '; all static pages, direction, metadata and anchors verified' : ''}.`,
)
