import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

// Exercise the component's real effects with a deterministic hook host. GSAP's
// clock is replaced at its boundary so teardown and playback are observable.
function mountScene(initial = {}, reduced = false) {
  const hooks = [],
    listeners = new Set(),
    timelines = []
  let cursor = 0,
    dirty = false,
    pending = [],
    visibility
  let props = {
    kind: 'train',
    playLabel: 'Play',
    pauseLabel: 'Pause',
    ...initial,
  }
  const media = {
    matches: reduced,
    addEventListener: (_name, fn) => listeners.add(fn),
    removeEventListener: (_name, fn) => listeners.delete(fn),
  }
  const element = {
    frame: 'static',
    ownerDocument: { defaultView: { matchMedia: () => media } },
    querySelector: () => ({}),
  }
  const react = {
    useRef(value) {
      const index = cursor++
      return (hooks[index] ??= { current: index === 0 ? element : value })
    },
    useState(value) {
      const index = cursor++
      const slot = (hooks[index] ??= { value })
      return [
        slot.value,
        (next) => {
          if (slot.value !== next) {
            slot.value = next
            dirty = true
          }
        },
      ]
    },
    useEffect(effect, deps) {
      const index = cursor++
      const slot = (hooks[index] ??= {})
      if (slot.deps && deps.every((value, i) => Object.is(value, slot.deps[i])))
        return
      slot.deps = deps
      pending.push(() => {
        slot.cleanup?.()
        slot.cleanup = effect()
      })
    },
  }
  const nativeRequire = createRequire(import.meta.url)
  const exports = {}
  const code = ts.transpileModule(
    fs.readFileSync(new URL('./ProcessScene.tsx', import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name === 'react') return react
      if (name === './ProcessArt') return { ProcessArt: () => null }
      if (name === '../PixelIcon') return { PixelIcon: () => null }
      if (name.endsWith('.css')) return {}
      if (name === './process-visibility')
        return {
          bindProcessVisibility(_element, onChange) {
            visibility = onChange
            onChange(true)
            return () => {
              visibility = undefined
            }
          },
        }
      if (name === './process-timeline')
        return {
          createProcessTimeline() {
            element.frame = 'animated'
            const timeline = {
              playing: false,
              reverted: false,
              play() {
                this.playing = true
              },
              pause() {
                this.playing = false
              },
              seek() {
                element.frame = 'finished'
                this.playing = false
              },
              revert() {
                element.frame = 'static'
                this.playing = false
                this.reverted = true
              },
            }
            timelines.push(timeline)
            return timeline
          },
        }
      return nativeRequire(name)
    },
  })
  const render = () => {
    let passes = 0
    do {
      assert.ok(++passes < 10, 'effects settle without a render loop')
      dirty = false
      cursor = 0
      pending = []
      exports.ProcessScene(props)
      for (const effect of pending) effect()
    } while (dirty)
  }
  render()
  return {
    element,
    timelines,
    listeners,
    get current() {
      return timelines.at(-1)
    },
    media(matches) {
      media.matches = matches
      for (const fn of [...listeners]) fn({ matches })
      render()
    },
    visible(value) {
      visibility?.(value)
      render()
    },
    update(next) {
      props = { ...props, ...next }
      render()
    },
    unmount() {
      for (const hook of hooks) hook.cleanup?.()
    },
  }
}

test('a live reduced-motion change reverts every workflow timeline and resumes only under playback gates', () => {
  for (const kind of ['data', 'method', 'config', 'train', 'eval', 'export']) {
    const f = mountScene({ kind })
    assert.equal(f.current.playing, true)
    const active = f.current
    f.media(true)
    assert.equal(active.playing, false, `${kind} stops immediately`)
    assert.equal(
      active.reverted,
      true,
      `${kind} removes animated inline styles`,
    )
    assert.equal(f.element.frame, 'static')
    f.visible(false)
    f.media(false)
    assert.notEqual(f.current, active)
    assert.equal(f.current.playing, false, 'offscreen timelines stay paused')
    f.visible(true)
    assert.equal(f.current.playing, true)
    f.update({ paused: true })
    f.media(true)
    f.media(false)
    assert.equal(
      f.current.playing,
      false,
      'user pause survives preference changes',
    )
    f.update({ paused: false, instant: true })
    f.media(true)
    f.media(false)
    assert.equal(f.current.playing, false, 'instant scenes never resume')
    f.unmount()
    assert.equal(f.listeners.size, 0)
    assert.ok(f.timelines.every((timeline) => timeline.reverted))
  }
})

test('initial reduced motion never builds a timeline and preference restoration can start it', () => {
  const f = mountScene({}, true)
  assert.equal(f.timelines.length, 0)
  f.media(false)
  assert.equal(f.timelines.length, 1)
  assert.equal(f.current.playing, true)
  f.unmount()
})
