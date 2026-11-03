import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { loadTsxFixture } from '../../../scripts/load-tsx-fixture.mjs'

const content = JSON.parse(
  fs.readFileSync(new URL('./content.en.json', import.meta.url), 'utf8'),
)
const { ZeroFragmentAssembly, ZeroStationScene, ZeroPipelineScene } =
  loadTsxFixture(new URL('./ZeroScenes.tsx', import.meta.url))

const render = (component, props) =>
  renderToStaticMarkup(createElement(component, { c: content, ...props }))

test('fragmentation has six flat tool windows and one unified workspace, with no canvas', () => {
  const html = render(ZeroFragmentAssembly)
  assert.equal((html.match(/class="zero-tool-window"/g) || []).length, 6)
  assert.equal((html.match(/class="zero-unified-window"/g) || []).length, 1)
  assert.ok(!html.includes('<canvas'))
  assert.ok(html.includes('config.yaml') && html.includes('notebook.ipynb'))
})

test('all ten stations render distinct flat scenes instead of repeating a particle field', () => {
  const scenes = Array.from({ length: 10 }, (_, station) =>
    render(ZeroStationScene, { station }),
  )
  assert.equal(new Set(scenes).size, 10)
  scenes.forEach((html) =>
    assert.ok(!html.includes('<canvas') && !html.includes('zero-pixel-field')),
  )
  assert.ok(scenes[1].includes('data-process-art="data"'))
  assert.ok(scenes[5].includes('pp-weight-stack'))
  assert.ok(scenes[7].includes('pp-export-file'))
})

test('each lifecycle selection keeps one active pipeline node and its evidence artifacts', () => {
  for (let step = 0; step < 7; step++) {
    const html = render(ZeroPipelineScene, { step })
    assert.equal((html.match(/zero-pipeline-node /g) || []).length, 5)
    assert.equal((html.match(/zero-pipeline-node is-active/g) || []).length, 1)
    assert.ok(
      html.includes('quality.jsonl') && html.includes('zero-artifact-ledger'),
    )
    assert.ok(!html.includes('<canvas'))
  }
})
