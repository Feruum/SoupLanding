import test from 'node:test'
import assert from 'node:assert/strict'
import { initScrollMotion } from './scroll-motion.ts'

class Events {
  listeners = new Map()
  addEventListener(name, fn) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set())
    this.listeners.get(name).add(fn)
  }
  removeEventListener(name, fn) {
    this.listeners.get(name)?.delete(fn)
  }
  emit(name, event = {}) {
    for (const fn of this.listeners.get(name) ?? []) fn(event)
  }
  get size() {
    return [...this.listeners.values()].reduce((n, set) => n + set.size, 0)
  }
}
class Element {
  nodeType = 1
  attributes = new Map()
  animations = []
  constructor(top, parent = null) {
    this.top = top
    this.parent = parent
  }
  getBoundingClientRect() {
    return { top: this.top, width: 400, height: 200 }
  }
  setAttribute(key, value) {
    this.attributes.set(key, value)
  }
  removeAttribute(key) {
    this.attributes.delete(key)
  }
  contains(node) {
    return node === this || Boolean(node.parent && this.contains(node.parent))
  }
  animate(frames, options) {
    if (this.fail) throw Error('animation unavailable')
    const animation = {
      frames,
      options,
      onfinish: null,
      cancelled: false,
      cancel() {
        this.cancelled = true
      },
    }
    this.animations.push(animation)
    return animation
  }
}
function setup({ reduced = false, hash = '' } = {}) {
  const doc = new Events(),
    view = new Events(),
    media = new Events()
  media.matches = reduced
  view.matchMedia = () => media
  view.innerHeight = 800
  view.location = { hash }
  const observers = []
  view.IntersectionObserver = class {
    elements = new Set()
    constructor(callback) {
      this.callback = callback
      observers.push(this)
    }
    observe(el) {
      this.elements.add(el)
    }
    unobserve(el) {
      this.elements.delete(el)
    }
    disconnect() {
      this.elements.clear()
    }
    enter(el) {
      this.callback([{ target: el, isIntersecting: true }])
    }
  }
  doc.defaultView = view
  doc.hidden = false
  const root = new Element(0)
  root.ownerDocument = doc
  const groups = new Map()
  root.querySelectorAll = (selector) => groups.get(selector) ?? []
  const add = (selector, top, parent) => {
    const el = new Element(top, parent)
    if (!groups.has(selector)) groups.set(selector, [])
    groups.get(selector).push(el)
    return el
  }
  return { root, doc, view, media, add, observers }
}
const phase = (el) => el.attributes.get('data-soup-reveal')

test('visible content stays readable; below-fold content animates only on first intersection', () => {
  const f = setup(),
    visible = f.add('.copy', 100),
    below = f.add('.copy', 1000)
  const cleanup = initScrollMotion(f.root, [{ selector: '.copy' }])
  assert.equal(phase(visible), 'done')
  assert.equal(visible.animations.length, 0)
  assert.equal(phase(below), 'pending')
  f.observers[0].enter(below)
  assert.equal(phase(below), 'running')
  below.animations[0].onfinish()
  f.observers[0].enter(below)
  assert.equal(below.animations.length, 1)
  assert.equal(phase(below), 'done')
  cleanup()
})

test('reduced motion, deep links and unavailable animation APIs never hide content', () => {
  for (const options of [
    { reduced: true },
    { hash: '#methods' },
    { unsupported: true },
  ]) {
    const f = setup(options),
      el = f.add('.copy', 1200)
    if (options.unsupported) f.root.animate = undefined
    initScrollMotion(f.root, [{ selector: '.copy' }])()
    assert.equal(el.attributes.size, 0)
    assert.equal(el.animations.length, 0)
    assert.equal(f.doc.size, 0)
  }
})

test('keyboard navigation reveals pending content and cancels in-flight movement immediately', () => {
  const f = setup(),
    moving = f.add('.copy', 1000),
    next = f.add('.copy', 1500)
  const cleanup = initScrollMotion(f.root, [{ selector: '.copy' }])
  f.observers[0].enter(moving)
  f.doc.emit('keydown', { key: 'PageDown' })
  assert.equal(phase(next), 'done')
  assert.equal(phase(moving), 'done')
  assert.equal(moving.animations[0].cancelled, true)
  f.observers[0].enter(next)
  assert.equal(next.animations.length, 0)
  cleanup()
})

test('focused controls and hash navigation are never trapped behind an entrance', () => {
  const f = setup(),
    panel = f.add('.panel', 1000),
    next = f.add('.panel', 1400)
  const button = new Element(1050, panel)
  const cleanup = initScrollMotion(f.root, [
    { selector: '.panel', kind: 'panel' },
  ])
  f.doc.emit('focusin', { target: button })
  assert.equal(phase(panel), 'done')
  assert.equal(panel.animations.length, 0)
  f.view.emit('hashchange')
  assert.equal(phase(next), 'done')
  cleanup()
})

test('live reduced-motion changes and unmount restore a fully visible document', () => {
  const f = setup(),
    first = f.add('.copy', 1000),
    second = f.add('.copy', 1600)
  const cleanup = initScrollMotion(f.root, [{ selector: '.copy' }])
  f.observers[0].enter(first)
  f.media.matches = true
  f.media.emit('change')
  assert.equal(first.animations[0].cancelled, true)
  assert.equal(phase(second), 'done')
  cleanup()
  assert.equal(first.attributes.size + second.attributes.size, 0)
  assert.equal(f.doc.size + f.view.size + f.media.size, 0)
  assert.equal(f.observers[0].elements.size, 0)
})

test('hidden documents and animation failures cannot leave partially hidden panels', () => {
  const f = setup(),
    first = f.add('.copy', 1000),
    broken = f.add('.copy', 1400)
  broken.fail = true
  const cleanup = initScrollMotion(f.root, [{ selector: '.copy' }])
  f.observers[0].enter(first)
  f.doc.hidden = true
  f.doc.emit('visibilitychange')
  assert.equal(phase(first), 'done')
  f.observers[0].enter(broken)
  assert.equal(phase(broken), 'done')
  cleanup()
})

test('nested targets never move twice; stagger delays stay short without changing layout', () => {
  const f = setup(),
    outer = f.add('.panel', 1000)
  const inner = f.add('.cards', 1050, outer)
  const cards = Array.from({ length: 10 }, (_, i) =>
    f.add('.cards', 1400 + i * 200),
  )
  const cleanup = initScrollMotion(f.root, [
    { selector: '.panel', kind: 'graphic' },
    { selector: '.cards', stagger: 55 },
  ])
  assert.equal(inner.attributes.size, 0)
  for (const el of [outer, ...cards]) f.observers[0].enter(el)
  for (const card of cards) {
    const { options, frames } = card.animations[0]
    assert.ok(options.delay <= 165)
    assert.ok(options.delay + options.duration < 750)
    assert.ok(
      frames.every(
        (frame) =>
          !('width' in frame) && !('height' in frame) && !('margin' in frame),
      ),
    )
  }
  assert.ok('clipPath' in outer.animations[0].frames[0])
  cleanup()
})

test('pointer proximity fades out at the radius and caps the pull', async () => {
  const { proximity, PROXIMITY_RADIUS } =
    await import('./usePointerProximity.ts')
  assert.deepEqual(proximity(0, 0), { near: 1, x: 0, y: 0 })
  assert.equal(proximity(PROXIMITY_RADIUS, 0).near, 0)
  const half = proximity(PROXIMITY_RADIUS / 2, 0)
  assert.equal(half.near, 0.5)
  assert.equal(half.x, 2)
  assert.ok(Math.hypot(proximity(30, 40).x, proximity(30, 40).y) <= 4)
})
