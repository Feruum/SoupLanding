import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import './hydra-animations.css'

type AnimationProps = { className?: string; ariaLabel?: string }
type CloudModule = {
  mountDocumentCloud: (
    canvas: HTMLCanvasElement,
    stage: HTMLDivElement,
    label: HTMLDivElement,
  ) => (() => void) | undefined
}

/** Hydra's original scroll-driven document-to-graph canvas, served locally. */
export function DocumentCloud({ className = '', ariaLabel }: AnimationProps) {
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let generation = 0
    let unmount: (() => void) | undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = async () => {
      const requestedGeneration = ++generation
      unmount?.()
      try {
        const modulePath = new URL(
          '/soup/hydra/document-cloud.js',
          window.location.origin,
        ).href
        const source = (await import(
          /* @vite-ignore */ modulePath
        )) as CloudModule
        if (
          !cancelled &&
          requestedGeneration === generation &&
          canvas.current &&
          stage.current &&
          label.current
        ) {
          unmount = source.mountDocumentCloud(
            canvas.current,
            stage.current,
            label.current,
          )
          setLoadFailed(false)
        }
      } catch {
        if (!cancelled && requestedGeneration === generation)
          setLoadFailed(true)
      }
    }
    void start()
    motion.addEventListener('change', start)
    return () => {
      cancelled = true
      motion.removeEventListener('change', start)
      unmount?.()
    }
  }, [])

  return (
    <div ref={stage} className={`hydra-document-cloud ${className}`}>
      <canvas
        ref={canvas}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
      />
      {loadFailed && (
        <img
          className="hydra-document-fallback"
          src="/soup/hydra/document-cloud-static.svg"
          alt=""
          aria-hidden="true"
        />
      )}
      <div ref={label} className="hydra-node-label" aria-hidden="true" />
    </div>
  )
}

type LightState = { current: number; target: number; frame: number }

/** Hydra's SOTA strip: pointer-following filament, light cone, walls and dots. */
export function EvaluationAnimation({
  className = '',
  ariaLabel,
  labels,
}: AnimationProps & { labels?: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const states = useRef(new Map<HTMLDivElement, LightState>())
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  const enabled = useRef(true)
  const reduced = useRef(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const activeStates = states.current
    const activeTimers = timers.current
    const stop = () => {
      activeStates.forEach((state, cell) => {
        cancelAnimationFrame(state.frame)
        cell.removeAttribute('data-hot')
      })
      activeStates.clear()
      activeTimers.forEach(clearTimeout)
      activeTimers.clear()
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => {
      reduced.current = media.matches
      element.toggleAttribute('data-reduced', media.matches)
      if (media.matches) stop()
    }
    updateMotion()
    media.addEventListener('change', updateMotion)
    const observer = new IntersectionObserver(([entry]) => {
      enabled.current = entry.isIntersecting && !document.hidden
      if (!enabled.current) stop()
    })
    observer.observe(element)
    const visibility = () => {
      enabled.current = !document.hidden
      if (document.hidden) stop()
    }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      stop()
      observer.disconnect()
      media.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || reduced.current) return
    const cell = event.currentTarget
    const bounds = cell.getBoundingClientRect()
    cell.setAttribute('data-hot', '')
    cell.style.setProperty('--x', `${event.clientX - bounds.left}px`)
    cell.style.setProperty('--y', `${event.clientY - bounds.top}px`)
    const target = Math.min(
      0.7,
      Math.max(0.3, (event.clientX - bounds.left) / bounds.width),
    )
    let state = states.current.get(cell)
    if (!state) {
      state = { current: target, target, frame: 0 }
      states.current.set(cell, state)
      cell.style.setProperty('--ln', target.toFixed(4))
    }
    state.target = target
    if (state.frame) return
    const light = state
    const move = () => {
      light.current += (light.target - light.current) * 0.14
      cell.style.setProperty('--ln', light.current.toFixed(4))
      light.frame =
        Math.abs(light.target - light.current) > 0.001
          ? requestAnimationFrame(move)
          : 0
    }
    light.frame = requestAnimationFrame(move)
  }

  const leave = (cell: HTMLDivElement) => {
    cell.removeAttribute('data-hot')
    const state = states.current.get(cell)
    if (state) cancelAnimationFrame(state.frame)
    states.current.delete(cell)
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      if (!states.current.has(cell)) cell.style.setProperty('--ln', '.5')
    }, 400)
    timers.current.add(timer)
  }

  return (
    <div
      ref={root}
      className={`hydra-evaluation hbr ${className}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <div className="hbr-grid">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className="hbr-cell"
            key={index}
            onPointerEnter={(event) =>
              event.pointerType !== 'touch' && track(event)
            }
            onPointerMove={(event) =>
              event.pointerType !== 'touch' && track(event)
            }
            onPointerLeave={(event) =>
              event.pointerType !== 'touch' && leave(event.currentTarget)
            }
            onPointerDown={(event) =>
              event.pointerType === 'touch' && track(event)
            }
            onPointerUp={(event) => {
              if (event.pointerType !== 'touch') return
              const cell = event.currentTarget
              const timer = setTimeout(() => {
                timers.current.delete(timer)
                leave(cell)
              }, 450)
              timers.current.add(timer)
            }}
            onPointerCancel={(event) => leave(event.currentTarget)}
          >
            <span className="hbr-lamp">
              <span className="hbr-src">
                <span className="hbr-cone" />
                <span className="hbr-bloom" />
              </span>
            </span>
            <span className="hbr-edge" />
            <span className="hbr-wall hbr-l" />
            <span className="hbr-wall hbr-r" />
            <span className="hbr-num">
              0{index + 1}
              <span className="hbr-u">/</span>
            </span>
            <span className="hbr-foot">
              <span className="hbr-lab">{labels?.[index]}</span>
              <svg className="hbr-arr" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 9 9 3M4 3h5v5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
