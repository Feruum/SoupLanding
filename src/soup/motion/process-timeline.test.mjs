import assert from 'node:assert/strict'
import test from 'node:test'
import { createProcessTimeline } from './process-timeline.ts'

// Plain numeric GSAP targets let us sample the real timeline, including resets,
// without depending on a browser's SVG/CSS rendering implementation.
function target(x = 0, y = 0) {
  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transformOrigin: '',
    stroke: '#dd7733',
    strokeDasharray: 1,
    strokeDashoffset: 0,
    getAttribute: (name) => String(name === 'x' ? x : y),
  }
}

function scene(kind, groups) {
  const timeline = createProcessTimeline(
    kind,
    {
      querySelectorAll: (selector) => groups[selector] || [],
    },
    null,
  )
  timeline.repeat(0)
  return timeline
}

function everyFrame(timeline, check) {
  try {
    const duration = timeline.duration()
    for (let time = 0; time <= duration + 0.025; time += 0.025) {
      timeline.time(Math.min(time, duration), true)
      check(time)
    }
  } finally {
    timeline.kill()
  }
}

const group = (count) => Array.from({ length: count }, () => target())
const readable = (items, minimum, label) =>
  items.forEach((item) =>
    assert.ok(
      item.opacity >= minimum - 0.0001,
      `${label} faded to ${item.opacity}`,
    ),
  )

test('data input labels and every output row remain readable through dedupe and reset', () => {
  const records = group(5),
    clean = group(4)
  everyFrame(
    scene('data', {
      '.pp-record': records,
      '.pp-clean': clean,
      '.pp-packet': group(1),
      '.pp-drop': group(1),
      '.pp-scan': group(1),
      '.pp-dedupe .pp-chip-outline': group(1),
      '.pp-bin': group(1),
    }),
    () => {
      readable(
        records.filter((_, i) => i !== 2),
        0.65,
        'source record',
      )
      readable([records[2]], 0.4, 'duplicate label')
      readable(clean, 0.5, 'output row')
    },
  )
})

test('config keeps all source tiles in place and yaml and lock readable throughout assembly', () => {
  const tiles = group(4),
    rows = group(4),
    lock = group(1)
  everyFrame(
    scene('config', {
      '.pp-config-tile': tiles,
      '.pp-yaml-row': rows,
      '.pp-config-lock': lock,
      '.pp-config-lock .pp-inverse': group(1),
    }),
    () => {
      readable(tiles, 0.85, 'config tile')
      tiles.forEach((tile) =>
        assert.ok(Math.abs(tile.x) <= 4, `tile travelled ${tile.x}`),
      )
      readable(rows, 0.65, 'yaml row')
      readable(lock, 0.65, 'config lock')
    },
  )
})

test('method alternatives and advisor remain readable while the selected branch brightens', () => {
  const branches = group(4),
    chip = group(1)
  everyFrame(
    scene('method', {
      '.pp-branch': branches,
      '.pp-selected': [branches[0]],
      '.pp-signal': group(1),
      '.pp-selected .pp-check': group(1),
      '.pp-advise': chip,
    }),
    () => {
      readable(branches, 0.65, 'method branch')
      readable(chip, 0.8, 'advisor')
    },
  )
})

test('training checkpoint is a persistent readable artifact throughout both passes', () => {
  const checkpoint = group(1)
  everyFrame(
    scene('train', {
      '.pp-token': group(4),
      '.pp-layer-activation': group(5),
      '.pp-adapter': group(5),
      '.pp-backward': group(1),
      '.pp-checkpoint': checkpoint,
      '.pp-checkpoint .pp-check': group(1),
      '.pp-flow-bits': group(1),
    }),
    () => {
      readable(checkpoint, 0.75, 'checkpoint')
      assert.equal(checkpoint[0].x, 0)
    },
  )
})

test('evaluation verdict remains readable while checks and the scan communicate progress', () => {
  const verdict = group(1)
  everyFrame(
    scene('eval', {
      '.pp-test-check': group(9),
      '.pp-eval-sweep': group(1),
      '.pp-verdict': verdict,
      '.pp-verdict .pp-check': group(1),
    }),
    () => readable(verdict, 0.75, 'evaluation verdict'),
  )
})

test('export file and source weight cells remain legible throughout packing and reset', () => {
  const file = group(1),
    blocks = [target(20, 20), target(100, 80)]
  everyFrame(
    scene('export', {
      '.pp-compress rect': blocks,
      '.pp-signal': group(1),
      '.pp-export-file': file,
      '.pp-export-file .pp-check': group(1),
      '.pp-gguf': group(1),
    }),
    () => {
      readable(file, 0.75, 'export file')
      assert.equal(file[0].x, 0)
      readable(blocks, 0.55, 'weight cell')
      blocks.forEach((block) =>
        assert.ok(Math.abs(block.x) <= 4 && Math.abs(block.y) <= 4),
      )
    },
  )
})
