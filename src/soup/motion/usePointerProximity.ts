import { useEffect } from 'react'
import type { RefObject } from 'react'

export const PROXIMITY_RADIUS = 150
const PULL = 4

/** Closeness 0..1 and a pull of up to PULL px toward the pointer. */
export function proximity(dx: number, dy: number, radius = PROXIMITY_RADIUS) {
  const distance = Math.hypot(dx, dy)
  const near = Math.max(0, 1 - distance / radius)
  const scale = distance ? (near * PULL) / distance : 0
  return { near, x: dx * scale, y: dy * scale }
}

// Icons lean toward a fine pointer as it approaches. Writes three custom
// properties per target; CSS decides what they do and drops them for reduced motion.
export function usePointerProximity(
  root: RefObject<HTMLElement | null>,
  selector: string,
) {
  useEffect(() => {
    const element = root.current
    if (
      !element ||
      !matchMedia('(hover: hover) and (pointer: fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    let frame = 0
    let pointer: { x: number; y: number } | null = null
    const lit = new Set<HTMLElement>()
    const clear = (target: HTMLElement) => {
      target.style.removeProperty('--near')
      target.style.removeProperty('--near-x')
      target.style.removeProperty('--near-y')
      lit.delete(target)
    }
    const update = () => {
      frame = 0
      if (!pointer) return lit.forEach(clear)
      for (const target of element.querySelectorAll<HTMLElement>(selector)) {
        const box = target.getBoundingClientRect()
        const { near, x, y } = proximity(
          pointer.x - (box.left + box.width / 2),
          pointer.y - (box.top + box.height / 2),
        )
        if (!near) {
          if (lit.has(target)) clear(target)
          continue
        }
        target.style.setProperty('--near', near.toFixed(3))
        target.style.setProperty('--near-x', `${x.toFixed(2)}px`)
        target.style.setProperty('--near-y', `${y.toFixed(2)}px`)
        lit.add(target)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const leave = () => {
      pointer = null
      schedule()
    }
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', leave)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', schedule)
      lit.forEach(clear)
    }
  }, [root, selector])
}
