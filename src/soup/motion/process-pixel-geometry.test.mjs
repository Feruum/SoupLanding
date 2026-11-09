import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { loadTsxFixture } from '../../../scripts/load-tsx-fixture.mjs'

const { ProcessArt } = loadTsxFixture(
  new URL('./ProcessArt.tsx', import.meta.url),
)

test('five training slabs and all 180 weight cells have actual square-grid staircase edges', () => {
  const html = renderToStaticMarkup(
    createElement(ProcessArt, { kind: 'train' }),
  )
  const paths = Array.from(html.matchAll(/<path class="([^"]+)" d="([^"]+)"/g))
  const tops = paths.filter(([, classes]) => classes === 'pp-layer-top')
  const weights = paths.filter(([, classes]) =>
    /^pp-weight(?: |$)/.test(classes),
  )
  assert.equal(tops.length, 5)
  assert.equal(weights.length, 180)
  for (const [, , path] of [...tops, ...weights]) {
    // A crispEdges hint cannot turn a diagonal vector into pixel geometry.
    assert.ok(!/[LCQAST]/i.test(path), `diagonal or curved command: ${path}`)
    assert.ok(
      (path.match(/[HV]/gi) || []).length >= 8,
      'visibly stepped perimeter',
    )
    for (const coordinate of path.match(/-?\d+(?:\.\d+)?/g) || []) {
      assert.equal(
        Math.abs(Number(coordinate)) % 1,
        0,
        'corners stay on the square unit grid',
      )
    }
  }
})
