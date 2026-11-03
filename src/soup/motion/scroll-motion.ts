type Kind = 'copy' | 'panel' | 'graphic'
export type ScrollGroup = {
  selector: string
  kind?: Kind
  stagger?: number
  delay?: number
}

export const LANDING_SCROLL_GROUPS: readonly ScrollGroup[] = [
  {
    selector:
      '.os-wrap > [data-section-heading], .section-heading, .evaluation-heading, .se-heading > [data-section-heading]',
  },
  {
    selector:
      '.os-about-grid > .os-prose, .os-feature-grid > .os-prose, .feature-copy, .se-trace-copy',
  },
  {
    selector: '.os-about-config, .os-feature-visual, .document-art',
    kind: 'graphic',
    delay: 65,
  },
  {
    selector: '.os-install-package, .os-install-steps',
    kind: 'panel',
    stagger: 65,
  },
  {
    selector:
      '.os-method-browser, .workflow-layout, .migration-box, .hydra-evaluation, .se-trace-workbench',
    kind: 'panel',
  },
  { selector: '.os-recipe', stagger: 55 },
  { selector: '.os-model-cluster', stagger: 55 },
  { selector: '.os-community-card', stagger: 55 },
  { selector: '.se-tool-group', stagger: 55 },
  { selector: '.os-faq-list > details', stagger: 45 },
  { selector: '.zero-strip, .final-copy' },
]

export const ZERO_SCROLL_GROUPS: readonly ScrollGroup[] = [
  { selector: '.zero-section-intro' },
  {
    selector: '.zero-workspace, .zero-ownership, .zero-mode-panel',
    kind: 'panel',
  },
  { selector: '.zero-problems > *', stagger: 60 },
  { selector: '.zero-fragment-art, .zero-loop-field', kind: 'graphic' },
  { selector: '.zero-station-item', stagger: 45 },
  { selector: '.zero-verdict', delay: 65 },
  { selector: '.zero-final' },
]

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const PHASE = 'data-soup-reveal'
const KIND = 'data-soup-reveal-kind'

/** Native scrolling stays untouched. Each below-fold target enters once. */
export function initScrollMotion(
  root: HTMLElement,
  groups: readonly ScrollGroup[],
) {
  const doc = root.ownerDocument
  const view = doc.defaultView
  const noop = () => {}
  if (
    !view ||
    typeof view.IntersectionObserver !== 'function' ||
    typeof root.animate !== 'function'
  )
    return noop
  const media = view.matchMedia('(prefers-reduced-motion: reduce)')
  // A deep link is a navigation task, not an entrance sequence.
  if (media.matches || (view.location.hash && view.location.hash !== '#home'))
    return noop

  const selected = new Map<HTMLElement, { kind: Kind; delay: number }>()
  for (const group of groups) {
    root
      .querySelectorAll<HTMLElement>(group.selector)
      .forEach((element, index) => {
        if (!selected.has(element))
          selected.set(element, {
            kind: group.kind ?? 'copy',
            delay:
              (group.delay ?? 0) + Math.min(index * (group.stagger ?? 0), 165),
          })
      })
  }
  // Never animate both a container and its descendants.
  const targets = [...selected].filter(
    ([element]) =>
      ![...selected.keys()].some(
        (other) => other !== element && other.contains(element),
      ),
  )
  const pending = new Map<HTMLElement, { kind: Kind; delay: number }>()
  const active = new Map<HTMLElement, Animation>()
  let disposed = false

  function settle(element: HTMLElement) {
    const animation = active.get(element)
    if (animation) {
      animation.onfinish = null
      animation.cancel()
      active.delete(element)
    }
    pending.delete(element)
    observer.unobserve(element)
    element.setAttribute(PHASE, 'done')
  }
  function settleAll() {
    for (const element of new Set([...pending.keys(), ...active.keys()]))
      settle(element)
  }
  function enter(element: HTMLElement) {
    const settings = pending.get(element)
    if (!settings || disposed) return
    pending.delete(element)
    observer.unobserve(element)
    element.setAttribute(PHASE, 'running')
    const distance = settings.kind === 'copy' ? 12 : 18
    const start: Keyframe = {
      opacity: 0,
      transform: `translateY(${distance}px)`,
    }
    const end: Keyframe = { opacity: 1, transform: 'translateY(0px)' }
    if (settings.kind === 'graphic') {
      start.clipPath = 'inset(0 0 12% 0)'
      end.clipPath = 'inset(0 0 0% 0)'
    }
    try {
      const animation = element.animate([start, end], {
        duration:
          settings.kind === 'graphic'
            ? 560
            : settings.kind === 'panel'
              ? 520
              : 420,
        delay: settings.delay,
        easing: EASE_OUT,
        fill: 'backwards',
      })
      active.set(element, animation)
      animation.onfinish = () => {
        if (!disposed) settle(element)
      }
    } catch {
      // Failed enhancement must never hide content or its controls.
      settle(element)
    }
  }
  const observer = new view.IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) enter(entry.target as HTMLElement)
    },
    { rootMargin: '0px 0px -48px 0px', threshold: 0 },
  )

  // Batch layout reads before adding the enhancement attributes.
  const measurements = targets.map(([element, settings]) => ({
    element,
    settings,
    rect: element.getBoundingClientRect(),
  }))
  for (const { element, settings, rect } of measurements) {
    element.setAttribute(KIND, settings.kind)
    if (rect.width < 1 || rect.height < 1 || rect.top < view.innerHeight) {
      element.setAttribute(PHASE, 'done')
      continue
    }
    pending.set(element, settings)
    element.setAttribute(PHASE, 'pending')
    observer.observe(element)
  }

  const onKey = (event: KeyboardEvent) => {
    if (
      [
        'Tab',
        'ArrowDown',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
      ].includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f')
    )
      settleAll()
  }
  const onFocus = (event: FocusEvent) => {
    const target = event.target
    if (!target || !('nodeType' in target)) return
    for (const element of new Set([...pending.keys(), ...active.keys()]))
      if (element.contains(target as Node)) settle(element)
  }
  const onMotionChange = () => {
    if (media.matches) settleAll()
  }
  const onVisibility = () => {
    if (doc.hidden) for (const element of [...active.keys()]) settle(element)
  }
  doc.addEventListener('keydown', onKey)
  doc.addEventListener('focusin', onFocus)
  doc.addEventListener('visibilitychange', onVisibility)
  view.addEventListener('hashchange', settleAll)
  media.addEventListener('change', onMotionChange)

  return () => {
    disposed = true
    settleAll()
    observer.disconnect()
    doc.removeEventListener('keydown', onKey)
    doc.removeEventListener('focusin', onFocus)
    doc.removeEventListener('visibilitychange', onVisibility)
    view.removeEventListener('hashchange', settleAll)
    media.removeEventListener('change', onMotionChange)
    for (const [element] of targets) {
      element.removeAttribute(PHASE)
      element.removeAttribute(KIND)
    }
  }
}
