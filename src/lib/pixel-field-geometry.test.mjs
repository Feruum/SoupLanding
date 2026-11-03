import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  measurePixelFieldGeometry,
  MAX_FIELD_CELLS,
} from './pixel-field-geometry.ts'

const host = (width, height) => ({ width, height, left: 20, top: 70 })
const glyph = { width: 68, height: 18 }
const measure = (box, slot, dpr = 2) =>
  measurePixelFieldGeometry(box, slot, glyph, dpr)
const safe = (geometry) => {
  assert.ok(geometry)
  for (const value of Object.values(geometry)) assert.ok(Number.isFinite(value))
  assert.ok(geometry.wmCW > 0 && geometry.wmCH > 0)
  assert.ok(geometry.cols * geometry.rows <= MAX_FIELD_CELLS)
  assert.doesNotThrow(() => new Float32Array(geometry.cols * geometry.rows))
}

test('valid desktop and mobile wordmark slots keep exact alignment and fractional cells', () => {
  for (const [box, slot] of [
    [host(1440, 824), { width: 600, height: 160, left: 440, top: 150 }],
    [host(390, 779), { width: 292, height: 78, left: 69, top: 180 }],
  ]) {
    const geometry = measure(box, slot)
    safe(geometry)
    assert.equal(geometry.wmX, (slot.left - box.left) * 2)
    assert.equal(geometry.wmY, (slot.top - box.top) * 2)
    assert.equal(geometry.wmCW, (slot.width * 2) / glyph.width)
    assert.equal(geometry.wmCH, (slot.height * 2) / glyph.height)
  }
})

test('zero and nonfinite transient slot rectangles fall back safely across viewport resizing', () => {
  for (const box of [
    host(390, 779),
    host(1440, 824),
    host(48, 200),
    host(30, 200),
  ]) {
    const fallback = measure(box, null)
    safe(fallback)
    for (const slot of [
      { width: 0, height: 0, left: 0, top: 0 },
      { width: 600, height: 0, left: 100, top: 100 },
      { width: NaN, height: 100, left: 100, top: 100 },
      { width: 300, height: Infinity, left: 100, top: 100 },
      { width: 300, height: 100, left: Infinity, top: 100 },
    ])
      assert.deepEqual(measure(box, slot), fallback)
  }
})

test('unusable hosts and excessive lattices are rejected before buffer allocation', () => {
  for (const box of [
    host(0, 600),
    host(NaN, 600),
    host(390, Infinity),
    host(1e100, 600),
  ])
    assert.equal(measure(box, null), null)
  assert.equal(
    measure(host(1440, 824), { width: 1, height: 1, left: 100, top: 100 }),
    null,
  )
  safe(measure(host(390, 779), null, Infinity))
  safe(measure(host(1440, 824), null, -1))
})
