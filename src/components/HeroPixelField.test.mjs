import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { measurePixelFieldGeometry } from '../lib/pixel-field-geometry.ts'

const compiled = ts.transpileModule(
  fs.readFileSync(new URL('./HeroPixelField.tsx', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText

function eventTarget(extra = {}) {
  const listeners = new Map()
  return {
    ...extra,
    listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name).add(callback)
    },
    removeEventListener(name, callback) {
      listeners.get(name)?.delete(callback)
    },
    dispatch(name, event = {}) {
      for (const callback of listeners.get(name) || []) callback(event)
    },
  }
}

function mount({ reduced = false, width = 320, hidden = false } = {}) {
  const effects = []
  const frames = new Map()
  const intersections = []
  const resizes = []
  let nextFrame = 0
  let refIndex = 0
  let draws = 0
  const context = new Proxy(
    {
      fillRect(x, y, w, h) {
        for (const value of [x, y, w, h]) assert.ok(Number.isFinite(value))
        if (x === 0 && y === 0 && w === canvas.width && h === canvas.height)
          draws++
      },
    },
    { get: (object, key) => (key in object ? object[key] : () => {}) },
  )
  const host = {
    getBoundingClientRect: () => ({
      width,
      height: 160,
      left: 0,
      top: 0,
      right: width,
      bottom: 160,
    }),
    closest: () => ({ style: {} }),
    parentElement: { querySelectorAll: () => [] },
  }
  const canvas = {
    parentElement: host,
    style: {},
    getContext: () => context,
  }
  const media = eventTarget({ matches: reduced })
  const document = eventTarget({
    hidden,
    documentElement: { hasAttribute: () => false },
    querySelector: () => null,
    querySelectorAll: () => [],
  })
  const window = eventTarget({
    devicePixelRatio: 1,
    matchMedia: (query) =>
      query.includes('reduced-motion') ? media : { matches: false },
    dispatchEvent() {},
  })
  const sandbox = {
    exports: {},
    require(name) {
      if (name === 'react')
        return {
          useEffect: (effect) => effects.push(effect),
          useRef: (value) => ({ current: refIndex++ === 1 ? canvas : value }),
        }
      if (name === 'react/jsx-runtime') return { jsx: (_, props) => props }
      if (name === '@/lib/theme')
        return { THEME_EVENT: 'theme', PICKER_STATE_EVENT: 'picker' }
      if (name === '@/lib/pixel-grid')
        return { GRID_EVENT: 'grid', GRID_CLEAR_EVENT: 'clear' }
      if (name === '@/data/wordmark-bitmap')
        return {
          WORDMARK_ROWS: ['11', '11'],
          WORDMARK_WIDTH: 2,
          WORDMARK_HEIGHT: 2,
        }
      if (name === '@/lib/pixel-field-geometry')
        return { measurePixelFieldGeometry }
      if (name === '@/lib/etch')
        return { ETCH_EVENT: 'etch', effectFromLocation: () => 'default' }
      if (name === '@/lib/music')
        return {
          BANDS: 8,
          loadMusic: () => Promise.resolve(),
          music: { sample: () => ({ bands: new Float32Array(8), beat: 0 }) },
        }
      throw Error(`Unexpected import: ${name}`)
    },
    window,
    document,
    performance: { now: () => nextFrame * 40 },
    CustomEvent: class {},
    getComputedStyle: () => ({ getPropertyValue: () => '#111111' }),
    requestAnimationFrame(callback) {
      frames.set(++nextFrame, callback)
      return nextFrame
    },
    cancelAnimationFrame: (frame) => frames.delete(frame),
    IntersectionObserver: class {
      constructor(callback) {
        intersections.push(callback)
      }
      observe() {}
      disconnect() {}
    },
    ResizeObserver: class {
      constructor(callback) {
        resizes.push(callback)
      }
      observe() {}
      disconnect() {}
    },
  }
  vm.runInNewContext(compiled, sandbox)
  sandbox.exports.HeroPixelField({})
  const cleanups = effects.map((effect) => effect())
  return {
    frames,
    media,
    document,
    get draws() {
      return draws
    },
    advance() {
      const pending = [...frames.values()]
      frames.clear()
      for (const callback of pending) callback(nextFrame * 40 + 100)
    },
    preference(value) {
      media.matches = value
      media.dispatch('change')
    },
    visibility(value) {
      document.hidden = value
      document.dispatch('visibilitychange')
    },
    intersection(value) {
      intersections[0]([{ isIntersecting: value }])
    },
    resize(value) {
      width = value
      resizes[0]()
    },
    unmount() {
      cleanups.forEach((cleanup) => cleanup?.())
    },
  }
}

test('live reduced-motion changes paint a static hero and stop its animation loop', () => {
  const view = mount()
  view.advance()
  assert.ok(view.draws > 0)
  const movingDraws = view.draws
  view.preference(true)
  assert.equal(view.frames.size, 0)
  assert.equal(view.draws, movingDraws + 1)
  const staticDraws = view.draws
  view.advance()
  assert.equal(view.draws, staticDraws)
  view.preference(false)
  assert.equal(view.frames.size, 1)
  view.advance()
  assert.ok(view.draws > staticDraws)
  view.unmount()
  assert.equal(view.frames.size, 0)
})

test('hidden and offscreen heroes resume only after both visibility gates reopen', () => {
  const view = mount()
  view.visibility(true)
  assert.equal(view.frames.size, 0)
  view.intersection(false)
  view.visibility(false)
  assert.equal(view.frames.size, 0)
  view.preference(true)
  view.preference(false)
  assert.equal(view.frames.size, 0)
  view.intersection(true)
  assert.equal(view.frames.size, 1)
  view.unmount()
  assert.equal(view.media.listeners.get('change')?.size, 0)
  assert.equal(view.document.listeners.get('visibilitychange')?.size, 0)
})

test('an invalid canvas measurement blocks viewport and preference restarts until resize recovers', () => {
  const view = mount({ width: 0 })
  view.intersection(true)
  assert.equal(view.frames.size, 0)
  view.preference(true)
  view.preference(false)
  assert.equal(view.frames.size, 0)
  view.resize(320)
  assert.equal(view.frames.size, 1)
  view.advance()
  assert.ok(view.draws > 0)
  view.resize(0)
  assert.equal(view.frames.size, 0)
  view.resize(320)
  assert.equal(view.frames.size, 1)
  view.unmount()
})

test('initial reduced motion stays static and hidden documents schedule no frames', () => {
  const reduced = mount({ reduced: true })
  assert.ok(reduced.draws > 0)
  assert.equal(reduced.frames.size, 0)
  reduced.unmount()
  const hidden = mount({ hidden: true })
  assert.equal(hidden.frames.size, 0)
  hidden.visibility(false)
  assert.equal(hidden.frames.size, 1)
  hidden.unmount()
})
