import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const source = fs.readFileSync(
  new URL('./ZeroPixelField.tsx', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

function mount({ width = 900, reduced = false, paused = false } = {}) {
  const effects = []
  const observers = []
  const listeners = new Map()
  const frames = new Map()
  let frameId = 0
  let refIndex = 0
  let draws = 0
  let glyphs = 0
  const context = new Proxy(
    {
      clearRect() {
        draws++
      },
      fillText(_glyph, x, y) {
        assert.ok(Number.isFinite(x) && Number.isFinite(y))
        glyphs++
      },
    },
    {
      get(object, key) {
        return key in object ? object[key] : () => {}
      },
    },
  )
  const canvas = {
    getContext: () => context,
    getBoundingClientRect: () => ({ width, height: 400, left: 0, top: 0 }),
    addEventListener() {},
    removeEventListener() {},
  }
  const document = {
    hidden: false,
    addEventListener(name, callback) {
      listeners.set(name, callback)
    },
    removeEventListener(name) {
      listeners.delete(name)
    },
  }
  const sandbox = {
    exports: {},
    require(name) {
      if (name === 'react')
        return {
          useEffect(callback) {
            effects.push(callback)
          },
          useRef(value) {
            return { current: refIndex++ === 0 ? canvas : value }
          },
        }
      if (name === 'react/jsx-runtime')
        return {
          jsx(_type, props) {
            return props
          },
        }
      throw Error(`Unexpected import: ${name}`)
    },
    window: {
      devicePixelRatio: 2,
      addEventListener() {},
      removeEventListener() {},
      matchMedia: () => ({
        matches: reduced,
        addEventListener() {},
        removeEventListener() {},
      }),
    },
    document,
    getComputedStyle: () => ({ getPropertyValue: () => '#ededed' }),
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback)
      return frameId
    },
    cancelAnimationFrame(id) {
      frames.delete(id)
    },
    IntersectionObserver: class {
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {
        this.callback([{ isIntersecting: true }])
      }
      disconnect() {}
    },
    ResizeObserver: class {
      constructor(callback) {
        this.callback = callback
      }
      observe() {
        this.callback()
      }
      disconnect() {}
    },
  }
  vm.runInNewContext(compiled, sandbox)
  sandbox.exports.ZeroPixelField({ scene: 2, paused })
  const cleanups = effects.map((effect) => effect()).filter(Boolean)
  const advance = () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(frameId * 40 + 1000))
  }
  return {
    frames,
    observers,
    document,
    listeners,
    advance,
    get draws() {
      return draws
    },
    get glyphs() {
      return glyphs
    },
    unmount() {
      cleanups.forEach((cleanup) => cleanup())
    },
  }
}

for (const width of [380, 1200]) {
  test(`ASCII canvas draws finite mobile/desktop geometry at ${width}px and stops offscreen`, () => {
    const view = mount({ width })
    for (let frame = 0; frame < 6; frame++) view.advance()
    assert.ok(view.draws > 1)
    assert.ok(view.glyphs > 500)
    assert.ok(view.frames.size > 0)
    view.observers[0].callback([{ isIntersecting: false }])
    assert.equal(view.frames.size, 0)
    view.unmount()
  })
}

test('reduced motion renders one static frame and leaves no animation loop', () => {
  const view = mount({ reduced: true })
  view.advance()
  assert.equal(view.draws, 1)
  assert.equal(view.frames.size, 0)
  view.unmount()
})

test('explicit pause renders a static preview', () => {
  const view = mount({ paused: true })
  view.advance()
  assert.equal(view.draws, 1)
  assert.equal(view.frames.size, 0)
  view.unmount()
})

test('hidden documents and unmount cancel scheduled work', () => {
  const view = mount()
  view.advance()
  view.document.hidden = true
  view.listeners.get('visibilitychange')()
  assert.equal(view.frames.size, 0)
  view.document.hidden = false
  view.listeners.get('visibilitychange')()
  assert.equal(view.frames.size, 1)
  view.unmount()
  assert.equal(view.frames.size, 0)
  assert.equal(view.listeners.size, 0)
})
