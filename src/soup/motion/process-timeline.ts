import { gsap } from 'gsap'
import type { ProcessKind } from './ProcessArt'

type Q = (selector: string) => Element[]
type Build = (tl: gsap.core.Timeline, q: Q) => void

const EASE = 'power3.inOut'
const OUT = 'power2.out'

// A check mark draws itself; paths that use it carry pathLength="1".
const draw = (tl: gsap.core.Timeline, targets: Element[], at: gsap.Position) =>
  tl.fromTo(
    targets,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.3, ease: OUT },
    at,
  )
// A short bright segment travelling along a pathLength="100" route.
const travel = (
  tl: gsap.core.Timeline,
  targets: Element[],
  at: gsap.Position,
  duration = 0.5,
) =>
  tl
    .set(targets, { opacity: 1, strokeDashoffset: 14 }, at)
    .to(targets, { strokeDashoffset: -86, duration, ease: 'none' }, at)
    .set(targets, { opacity: 0 })

/** Records go through dedupe one by one; the duplicate falls into the bin. */
const data: Build = (tl, q) => {
  const records = q('.pp-record'),
    clean = q('.pp-clean'),
    [packet] = q('.pp-packet'),
    [drop] = q('.pp-drop'),
    [scan] = q('.pp-scan'),
    [chip] = q('.pp-dedupe .pp-chip-outline'),
    [bin] = q('.pp-bin')
  tl.set(clean, { opacity: 0.9, x: 0 })
    .set(records, { opacity: 1, x: 0 })
    .set([packet, drop], { opacity: 0, x: 0, y: 0 })
    .set(scan, { opacity: 0, y: 0 })
  let row = 0
  records.forEach((record, i) => {
    const at = 0.3 + i * 0.75
    tl.to(record, { x: 4, duration: 0.2, ease: OUT }, at)
      .set(packet, { opacity: 1, x: 0 }, at + 0.1)
      .to(packet, { x: 86, duration: 0.3, ease: 'power1.in' }, at + 0.1)
      .set(packet, { opacity: 0 }, at + 0.4)
      .fromTo(
        scan,
        { opacity: 1, y: 0 },
        { y: 73, duration: 0.3, ease: 'none' },
        at + 0.4,
      )
      .set(scan, { opacity: 0 }, at + 0.7)
      .to(record, { x: 0, opacity: 0.9, duration: 0.25 }, at + 0.4)
    if (i === 2) {
      // Same content as 02: it never reaches data.jsonl.
      tl.to(
        chip,
        { stroke: '#ff5c4d', duration: 0.2, yoyo: true, repeat: 1 },
        at + 0.45,
      )
        .set(drop, { opacity: 1, x: 0, y: 0 }, at + 0.6)
        .to(drop, { y: 36, duration: 0.2, ease: 'power1.in' }, at + 0.6)
        .to(drop, { x: 68, duration: 0.25, ease: 'power1.out' }, at + 0.8)
        .to(bin, { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 }, at + 1.0)
        .to(record, { opacity: 0.65, duration: 0.2 }, at + 0.6)
    } else {
      tl.to(
        clean[row++],
        { opacity: 1, x: 0, duration: 0.35, ease: OUT },
        at + 0.6,
      )
    }
  })
  tl.addLabel('done', '+=0.2')
    .to({}, { duration: 1.4 })
    .to(clean, { opacity: 0.9, duration: 0.35 })
    .to(drop, { opacity: 0, duration: 0.35 }, '<')
    .to(records, { opacity: 1, duration: 0.35 }, '<')
}

/** The advisor reads the data, considers each method and settles on SFT. */
const method: Build = (tl, q) => {
  const branches = q('.pp-branch'),
    [signal] = q('.pp-signal'),
    [selected] = q('.pp-selected'),
    check = q('.pp-selected .pp-check'),
    [chip] = q('.pp-advise')
  tl.set(branches, { opacity: 0.65, x: 0 }).set(check, {
    strokeDasharray: 1,
    strokeDashoffset: 1,
  })
  travel(tl, [signal], 0.2, 0.5)
  tl.to(chip, { opacity: 0.85, duration: 0.25, yoyo: true, repeat: 1 }, 0.5)
  branches.forEach((branch, i) =>
    tl
      .to(branch, { opacity: 1, x: 0, duration: 0.2, ease: OUT }, 1.1 + i * 0.3)
      .to(branch, { opacity: 0.65, duration: 0.2 }, 1.35 + i * 0.3),
  )
  tl.to(selected, { opacity: 1, x: 0, duration: 0.35, ease: OUT }, 2.5)
  draw(tl, check, 2.75)
  tl.addLabel('done')
    .to({}, { duration: 1.6 })
    .to(selected, { opacity: 0.65, duration: 0.35 })
}

/** Four stationary sections feed the lock as soup.yaml brightens line by line. */
const config: Build = (tl, q) => {
  const tiles = q('.pp-config-tile'),
    rows = q('.pp-yaml-row'),
    [lock] = q('.pp-config-lock'),
    check = q('.pp-config-lock .pp-inverse')
  tl.set(tiles, { opacity: 1, x: 0 })
    .set(rows, { opacity: 0.9, x: 0 })
    .set(lock, { opacity: 0.65, scale: 1, transformOrigin: '50% 50%' })
    .set(check, { strokeDasharray: 1, strokeDashoffset: 1 })
  tiles.forEach((tile, i) => {
    const at = 0.3 + i * 0.5
    tl.to(tile, { x: 4, opacity: 0.9, duration: 0.2, ease: OUT }, at)
      .to(tile, { x: 0, opacity: 1, duration: 0.2, ease: OUT }, at + 0.2)
      .to(
        lock,
        { opacity: 1, scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 },
        at + 0.2,
      )
      .to(rows[i], { opacity: 1, duration: 0.3, ease: OUT }, at + 0.2)
  })
  tl.to(lock, { opacity: 1, duration: 0.2 }, 2.45)
  draw(tl, check, 2.5)
  tl.addLabel('done')
    .to({}, { duration: 1.6 })
    .to(lock, { opacity: 0.65, duration: 0.35 })
    .to(rows, { opacity: 0.9, duration: 0.35 }, '<')
}

/** Tokens enter, activations climb the stack, gradients run back, the adapter is saved. */
const train: Build = (tl, q) => {
  const tokens = q('.pp-token'),
    activations = q('.pp-layer-activation'),
    adapters = q('.pp-adapter'),
    [backward] = q('.pp-backward'),
    [checkpoint] = q('.pp-checkpoint'),
    check = q('.pp-checkpoint .pp-check'),
    [bits] = q('.pp-flow-bits')
  // Rendered bottom layer first, so the forward pass follows document order.
  tl.set(tokens, { opacity: 1, x: 0 })
    .set(activations, { opacity: 0 })
    .set(adapters, { opacity: 0.65 })
    .set(checkpoint, { opacity: 0.8, x: 0 })
    .set(check, { strokeDasharray: 1, strokeDashoffset: 1 })
  if (bits)
    tl.fromTo(
      bits,
      { x: 0, opacity: 0.65 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'steps(4)' },
      0,
    )
  for (const epoch of [0, 2.3]) {
    tl.fromTo(
      tokens,
      { x: 0, opacity: 1 },
      { x: 170, opacity: 0, duration: 0.5, ease: 'power1.in', stagger: 0.1 },
      epoch + 0.2,
    )
    activations.forEach((layer, i) =>
      tl
        .to(layer, { opacity: 1, duration: 0.2 }, epoch + 0.7 + i * 0.16)
        .to(layer, { opacity: 0, duration: 0.3 }, epoch + 0.95 + i * 0.16),
    )
    travel(tl, [backward], epoch + 1.5, 0.5)
    tl.to(
      adapters,
      {
        opacity: 1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        stagger: { each: 0.004, from: 'end' },
      },
      epoch + 1.6,
    ).set(tokens, { x: 0, opacity: 1 }, epoch + 2.2)
  }
  tl.to(checkpoint, { opacity: 1, x: 0, duration: 0.4, ease: OUT }, 4.4)
  draw(tl, check, 4.7)
  tl.addLabel('done')
    .to({}, { duration: 1.4 })
    .to(checkpoint, { opacity: 0.8, duration: 0.3 })
  if (bits) tl.to(bits, { opacity: 0.65, duration: 0.3 }, '<')
}

/** The sweep runs over the tests, each passes, and the verdict ships. */
const evaluate: Build = (tl, q) => {
  const checks = q('.pp-test-check'),
    [sweep] = q('.pp-eval-sweep'),
    [verdict] = q('.pp-verdict'),
    verdictCheck = q('.pp-verdict .pp-check')
  tl.set(checks, { opacity: 0.45, scale: 1, transformOrigin: '50% 50%' })
    .set(sweep, { opacity: 0, y: 0 })
    .set(verdict, { opacity: 0.8, scale: 1, transformOrigin: '50% 50%' })
    .set(verdictCheck, { strokeDasharray: 1, strokeDashoffset: 1 })
    .to(sweep, { opacity: 0.85, duration: 0.2 }, 0.3)
    .to(sweep, { y: 175, duration: 1.8, ease: 'none' }, 0.3)
    .to(sweep, { opacity: 0, duration: 0.2 }, 2.0)
  checks.forEach((check, i) =>
    tl.to(
      check,
      { opacity: 1, scale: 1, duration: 0.25, ease: OUT },
      0.55 + Math.floor(i / 3) * 0.58 + (i % 3) * 0.08,
    ),
  )
  tl.to(verdict, { opacity: 1, scale: 1, duration: 0.4, ease: OUT }, 2.3)
  draw(tl, verdictCheck, 2.55)
  tl.addLabel('done')
    .to({}, { duration: 1.6 })
    .to(checks, { opacity: 0.45, duration: 0.35 })
    .to(verdict, { opacity: 0.8, duration: 0.35 }, '<')
}

/** A short packing cue leaves the weights and exported artifact in view. */
const exporter: Build = (tl, q) => {
  const blocks = q('.pp-compress rect'),
    [signal] = q('.pp-signal'),
    [file] = q('.pp-export-file'),
    check = q('.pp-export-file .pp-check'),
    [chip] = q('.pp-gguf')
  tl.set(blocks, { opacity: 1, x: 0, y: 0 })
    .set(file, { opacity: 0.8, x: 0 })
    .set(check, { strokeDasharray: 1, strokeDashoffset: 1 })
  blocks.forEach((block) => {
    const x = Number(block.getAttribute('x')),
      y = Number(block.getAttribute('y'))
    // Preserve the source lattice while each cell signals its packing step.
    const at = 0.2 + ((143 - x) / 143) * 0.9 + (y / 112) * 0.2
    tl.to(
      block,
      { x: 4, y: -4, opacity: 0.65, duration: 0.3, ease: OUT },
      at,
    ).to(block, { x: 0, y: 0, opacity: 1, duration: 0.3, ease: OUT }, at + 0.3)
  })
  tl.to(
    chip,
    {
      scale: 1.04,
      transformOrigin: '50% 50%',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    },
    1.2,
  )
  travel(tl, [signal], 1.8, 0.5)
  tl.to(file, { opacity: 1, x: 0, duration: 0.4, ease: OUT }, 2.2)
  draw(tl, check, 2.5)
  tl.addLabel('done')
    .to({}, { duration: 1.4 })
    .to(file, { opacity: 0.8, duration: 0.3 })
    .to(
      blocks,
      { opacity: 1, x: 0, y: 0, duration: 0.5, ease: EASE, stagger: 0.003 },
      '<',
    )
}

const BUILDERS: Record<ProcessKind, Build> = {
  data,
  method,
  config,
  train,
  eval: evaluate,
  export: exporter,
}

/** One repeating timeline per scene; the progress bar follows its playhead. */
export function createProcessTimeline(
  kind: ProcessKind,
  root: HTMLElement,
  progress: Element | null,
) {
  const q: Q = (selector) => Array.from(root.querySelectorAll(selector))
  const tl = gsap.timeline({ repeat: -1, paused: true })
  BUILDERS[kind](tl, q)
  if (progress)
    tl.fromTo(
      progress,
      { scaleX: 0.01 },
      { scaleX: 1, duration: tl.labels.done ?? tl.duration(), ease: 'none' },
      0,
    ).to(progress, { scaleX: 0.01, duration: 0.3 }, tl.duration() - 0.3)
  return tl
}
