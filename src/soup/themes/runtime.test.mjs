import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'

test('Soup defaults independently of old Omarchy preferences and rejects invalid themes', async () => {
  const { readSoupTheme, SOUP_THEMES } = await import('./runtime.ts')
  assert.deepEqual(SOUP_THEMES, [
    { id: 'soup', name: 'Black' },
    { id: 'white', name: 'White' },
  ])
  assert.equal(readSoupTheme({ getItem: () => null }), 'soup')
  assert.equal(readSoupTheme({ getItem: () => 'not-a-theme' }), 'soup')
  assert.equal(readSoupTheme({ getItem: () => 'nord' }), 'soup')
  assert.equal(readSoupTheme({ getItem: () => 'white' }), 'white')
  assert.equal(
    readSoupTheme({
      getItem: () => {
        throw new Error('blocked')
      },
    }),
    'soup',
  )
})

test('head initialization restores only the Soup preference and survives unavailable storage', async () => {
  const { themeInitScript } = await import('./runtime.ts')
  for (const saved of ['white', 'soup', null, 'invalid', 'nord']) {
    const dataset = {}
    vm.runInNewContext(themeInitScript, {
      localStorage: {
        getItem(key) {
          assert.equal(key, 'soup-site-theme')
          return saved
        },
      },
      document: { documentElement: { dataset } },
    })
    assert.equal(
      dataset.theme,
      ['white', 'soup'].includes(saved) ? saved : 'soup',
    )
  }
  const dataset = {}
  vm.runInNewContext(themeInitScript, {
    localStorage: {
      getItem() {
        throw new Error('blocked')
      },
    },
    document: { documentElement: { dataset } },
  })
  assert.equal(dataset.theme, 'soup')
})

test('applying a palette persists its ID and notifies the original canvas even if storage is blocked', async (t) => {
  const { applySoupTheme, transitionSoupTheme } = await import('./runtime.ts')
  const globals = ['document', 'window', 'localStorage', 'getComputedStyle']
  const original = globals.map((key) =>
    Object.getOwnPropertyDescriptor(globalThis, key),
  )
  t.after(() =>
    globals.forEach((key, index) => {
      if (original[index])
        Object.defineProperty(globalThis, key, original[index])
      else delete globalThis[key]
    }),
  )
  const dataset = {}
  const events = []
  let color
  Object.defineProperties(globalThis, {
    document: {
      configurable: true,
      value: {
        documentElement: { dataset },
        querySelector: () => ({
          setAttribute: (name, value) => {
            color = [name, value]
          },
        }),
      },
    },
    window: {
      configurable: true,
      value: { dispatchEvent: (event) => events.push(event.type) },
    },
    localStorage: {
      configurable: true,
      value: {
        setItem: () => {
          throw Error('blocked')
        },
      },
    },
    getComputedStyle: {
      configurable: true,
      value: () => ({ getPropertyValue: () => '#ffffff' }),
    },
  })
  applySoupTheme('white')
  assert.equal(dataset.theme, 'white')
  assert.deepEqual(events, ['omarchy-theme'])
  assert.deepEqual(color, ['content', '#ffffff'])
  applySoupTheme('invalid')
  assert.equal(dataset.theme, 'white')
  assert.equal(events.length, 1)

  // Unsupported browsers still switch synchronously and never need transition styles.
  await transitionSoupTheme('soup', { x: 200, y: 30 })
  assert.equal(dataset.theme, 'soup')
  document.startViewTransition = () => {
    throw Error('must not run with reduced motion')
  }
  window.matchMedia = () => ({ matches: true })
  await transitionSoupTheme('white', { x: 200, y: 30 })
  assert.equal(dataset.theme, 'white')

  // Capable browsers apply inside the capture callback and clean their CSS state.
  window.matchMedia = () => ({ matches: false })
  const properties = new Map()
  const attributes = new Map()
  document.documentElement.style = {
    setProperty: (key, value) => properties.set(key, value),
    removeProperty: (key) => properties.delete(key),
  }
  document.documentElement.setAttribute = (key, value) =>
    attributes.set(key, value)
  document.documentElement.removeAttribute = (key) => attributes.delete(key)
  let captured
  let finish
  document.startViewTransition = (callback) => {
    captured = callback
    return {
      finished: new Promise((resolve) => {
        finish = resolve
      }),
    }
  }
  const pending = transitionSoupTheme('soup', { x: 201.4, y: 32.9 })
  assert.equal(dataset.theme, 'white')
  assert.equal(properties.get('--soup-theme-x'), '201px')
  assert.equal(attributes.has('data-soup-theme-transition'), true)
  captured()
  assert.equal(dataset.theme, 'soup')
  finish()
  await pending
  assert.equal(properties.size, 0)
  assert.equal(attributes.size, 0)
})
