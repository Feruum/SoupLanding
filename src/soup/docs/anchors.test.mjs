import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const directory = new URL('./pages/', import.meta.url)
const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json'))

test('all imported article element IDs are unique and TOC targets are unique', () => {
  for (const file of files) {
    const doc = JSON.parse(fs.readFileSync(new URL(file, directory), 'utf8'))
    const ids = doc.blocks
      .filter((block) => block.kind === 'html')
      .flatMap((block) =>
        [...block.html.matchAll(/\bid="([^"]*)"/g)].map((match) => match[1]),
      )
    assert.equal(
      new Set(ids).size,
      ids.length,
      `${doc.slug} has duplicate element IDs`,
    )
    assert.equal(
      new Set(doc.headings.map((heading) => heading.id)).size,
      doc.headings.length,
      `${doc.slug} has duplicate TOC targets`,
    )
    for (const heading of doc.headings)
      assert.ok(
        ids.includes(heading.id),
        `${doc.slug} TOC target ${heading.id} is missing`,
      )
  }
})

test('adapter check preserves check anchors and gives audit headings distinct anchors', () => {
  const doc = JSON.parse(
    fs.readFileSync(new URL('adapter-check.json', directory), 'utf8'),
  )
  assert.deepEqual(
    doc.headings
      .filter((heading) => heading.title === 'Exit codes')
      .map((heading) => heading.id),
    ['exit-codes', 'exit-codes-2'],
  )
  assert.deepEqual(
    doc.headings
      .filter((heading) => heading.title === '--json')
      .map((heading) => heading.id),
    ['json', 'json-2'],
  )
})
