import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { SOUP_GLYPH, OYU_GLYPH } from '../src/soup/glyphs.ts'

test('all 52 Soup catalogues contain the complete page', () => {
  assert.match(
    execFileSync(process.execPath, ['scripts/verify-soup.mjs'], {
      encoding: 'utf8',
    }),
    /52 complete locales/,
  )
})
test('both terminal glyphs are rectangular, nonempty and fit the original field engine', () => {
  for (const glyph of [SOUP_GLYPH, OYU_GLYPH]) {
    assert.equal(glyph.rows.length, glyph.height)
    assert.ok(glyph.rows.some((row) => row.includes('1')))
    assert.ok(glyph.rows.some((row) => row.includes('0')))
    for (const row of glyph.rows) {
      assert.equal(row.length, glyph.width)
      assert.match(row, /^[01]+$/)
    }
  }
})
test('oyu silhouette is mirrored and differs from a wordmark', () => {
  assert.notDeepEqual(OYU_GLYPH.rows, SOUP_GLYPH.rows)
  for (const row of OYU_GLYPH.rows)
    assert.equal(row, [...row].reverse().join(''))
})
test('original terminal WASM and localized Hydra modules are available locally', () => {
  for (const file of [
    'public/ttfx/0.3.2/ttfx.js',
    'public/ttfx/effects/all.wasm',
    'public/soup/hydra/document-cloud.js',
  ])
    assert.ok(fs.statSync(file).size > 500)
})
