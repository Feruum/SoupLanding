import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { bindProcessVisibility } from './process-visibility.ts'
import { loadTsxFixture } from '../../../scripts/load-tsx-fixture.mjs'

function fixture(supported = true) {
  const attributes = new Map(),
    listeners = new Map()
  let callback,
    disconnected = false
  const doc = {
    hidden: false,
    defaultView: {
      IntersectionObserver: supported
        ? class {
            constructor(fn) {
              callback = fn
            }
            observe() {}
            disconnect() {
              disconnected = true
            }
          }
        : undefined,
    },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  }
  const element = {
    ownerDocument: doc,
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: (key) => attributes.delete(key),
  }
  return {
    element,
    attributes,
    listeners,
    doc,
    get disconnected() {
      return disconnected
    },
    intersect(value) {
      callback([{ target: element, isIntersecting: value }])
    },
    visibility(value) {
      doc.hidden = value
      listeners.get('visibilitychange')?.()
    },
  }
}

test('process timelines only run while their own surface is visible and the document is active', () => {
  const f = fixture(),
    cleanup = bindProcessVisibility(f.element)
  assert.equal(f.attributes.get('data-process-visible'), 'false')
  f.intersect(true)
  assert.equal(f.attributes.get('data-process-visible'), 'true')
  f.visibility(true)
  assert.equal(f.attributes.get('data-process-visible'), 'false')
  f.visibility(false)
  assert.equal(f.attributes.get('data-process-visible'), 'true')
  f.intersect(false)
  f.visibility(true)
  f.visibility(false)
  assert.equal(f.attributes.get('data-process-visible'), 'false')
  cleanup()
})

test('unmount disconnects observation and queued callbacks cannot restart a removed timeline', () => {
  const f = fixture(),
    cleanup = bindProcessVisibility(f.element)
  f.intersect(true)
  cleanup()
  f.intersect(true)
  assert.equal(f.attributes.size, 0)
  assert.equal(f.listeners.size, 0)
  assert.equal(f.disconnected, true)
})

test('unsupported observation keeps the server-rendered completed scene', () => {
  const f = fixture(false)
  bindProcessVisibility(f.element)()
  assert.equal(f.attributes.size, 0)
})

const { ProcessScene } = loadTsxFixture(
  new URL('./ProcessScene.tsx', import.meta.url),
)
const render = (props) =>
  renderToStaticMarkup(
    createElement(ProcessScene, {
      kind: 'train',
      playLabel: 'Play',
      pauseLabel: 'Pause',
      ...props,
    }),
  )

test('scene fallback is visible before hydration and pause controls remain accessible', () => {
  const html = render({})
  assert.ok(!html.includes('data-process-ready'))
  assert.ok(
    html.includes('aria-label="Pause"') &&
      html.includes('aria-pressed="false"'),
  )
  assert.ok(!html.includes('<canvas'))
  const paused = render({ paused: true })
  assert.ok(
    paused.includes('aria-label="Play"') && paused.includes('disabled=""'),
  )
  assert.ok(render({ instant: true }).includes('data-process-static="true"'))
})

test('the focused Zero model retains its input/output context and an accessible pause control', () => {
  const html = render({ compact: true })
  assert.ok(html.includes('viewBox="130 0 390 265"'))
  assert.ok(
    html.includes('pp-train-flow') &&
      html.includes('01011001') &&
      html.includes('./output'),
  )
  assert.ok(html.includes('aria-label="Pause"'))
  assert.ok(
    render({ compact: true, kind: 'export' }).includes('viewBox="0 0 640 270"'),
  )
})

test('six operations render different bounded diagrams without duplicate SVG IDs or invalid geometry', () => {
  const scenes = ['data', 'method', 'config', 'train', 'eval', 'export'].map(
    (kind) => render({ kind }),
  )
  assert.equal(new Set(scenes).size, 6)
  for (const html of scenes) {
    assert.ok(!/NaN|Infinity|id="/.test(html))
    assert.ok(html.includes('viewBox="0 0 640 270"'))
    assert.ok(html.includes('aria-hidden="true"'))
  }
})
