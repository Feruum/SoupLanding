import { useEffect, useRef } from 'react'

const COUNT = 620
const GLYPHS = ['·', ':', '+', '×', '#', '░', '▒', '▓']
const seed = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function position(index: number, shape: number): [number, number, number] {
  // Six coherent rectangular layers form an open model core, rather than a globe.
  const layer = Math.floor(index / 104)
  const local = index % 104
  const column = local % 13
  const row = Math.floor(local / 13)
  const offset = (shape % 3) * 0.02
  return [
    (column / 12 - 0.5) * 1.25,
    (row / 7 - 0.5) * 0.95,
    (layer - 2.5) * (0.16 + offset),
  ]
}

type PixelFieldProps = {
  scene?: number
  className?: string
  label?: string
  paused?: boolean
}

/** Original ASCII geometry. No images, WebGL dependencies or per-frame React state. */
export function ZeroPixelField({
  scene = 0,
  className = '',
  label,
  paused = false,
}: PixelFieldProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef(scene)
  const pausedRef = useRef(paused)
  const redraw = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    sceneRef.current = scene
    pausedRef.current = paused
    redraw.current?.()
  }, [scene, paused])

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches
    let visible = false
    let frame = 0
    let width = 0
    let height = 0
    let ratio = 1
    let elapsed = 0
    let previous = 0
    let lastDraw = 0
    let disposed = false
    let pointerX = 0
    let pointerY = 0
    let turnX = 0
    let turnY = 0
    const particles = Array.from({ length: COUNT }, (_, index) => ({
      current: position(index, sceneRef.current),
      glyph: GLYPHS[Math.floor(seed(index, 4) * GLYPHS.length)],
      brightness: seed(index, 5),
    }))
    const styles = getComputedStyle(element)
    let foreground = styles.getPropertyValue('--fg').trim() || '#ededed'
    let accent = styles.getPropertyValue('--accent-light').trim() || '#e07b4f'

    const draw = (time: number) => {
      frame = 0
      if (disposed || !visible || document.hidden) return
      const moving = !reduced && !pausedRef.current
      if (moving && previous)
        elapsed += Math.min(40, Math.max(0, time - previous))
      previous = time
      if (moving && time - lastDraw < 1000 / 30) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastDraw = time
      turnX += (pointerY * 0.15 - turnX) * 0.06
      turnY += (pointerX * 0.2 - turnY) * 0.06
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      const rotation = reduced ? 0.7 : elapsed / 16000 + 0.7 + turnY
      const tilt = reduced
        ? 0.32
        : 0.32 + Math.sin(elapsed / 12000) * 0.12 + turnX
      const scale = Math.min(width * 0.4, height * 0.48)
      const points = particles
        .map((particle, index) => {
          const target = position(index, sceneRef.current)
          for (let axis = 0; axis < 3; axis++) {
            particle.current[axis] +=
              (target[axis] - particle.current[axis]) *
              (reduced || pausedRef.current ? 1 : 0.055)
          }
          const [x, y, z] = particle.current
          const rx = x * Math.cos(rotation) - z * Math.sin(rotation)
          const rz = x * Math.sin(rotation) + z * Math.cos(rotation)
          const ry = y * Math.cos(tilt) - rz * Math.sin(tilt)
          const depth = y * Math.sin(tilt) + rz * Math.cos(tilt)
          const perspective = 2.6 / (2.6 - depth)
          return {
            x: width / 2 + rx * scale * perspective,
            y: height / 2 + ry * scale * perspective,
            depth,
            particle,
            index,
          }
        })
        .sort((a, b) => a.depth - b.depth)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `${width < 450 ? 8 : 10}px "JetBrains Mono Variable", monospace`
      const scanner = reduced
        ? height * 0.48
        : (Math.sin(elapsed / 3200) * 0.5 + 0.5) * height
      for (const point of points) {
        const lit = Math.abs(point.y - scanner) < 13
        context.globalAlpha = Math.max(
          0.13,
          Math.min(1, (point.depth + 1.3) / 2.4),
        )
        context.fillStyle =
          lit || point.particle.brightness > 0.85 ? accent : foreground
        if (point.particle.brightness > 0.94) {
          context.fillRect(Math.round(point.x), Math.round(point.y), 3, 3)
        } else
          context.fillText(
            point.particle.glyph,
            Math.round(point.x),
            Math.round(point.y),
          )
      }
      context.globalAlpha = 0.12
      context.strokeStyle = accent
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(width * 0.13, Math.round(scanner) + 0.5)
      context.lineTo(width * 0.87, Math.round(scanner) + 0.5)
      context.stroke()
      context.globalAlpha = 1
      if (moving) frame = requestAnimationFrame(draw)
    }
    const start = () => {
      if (!frame && !disposed && visible && !document.hidden) {
        previous = 0
        frame = requestAnimationFrame(draw)
      }
    }
    const resize = () => {
      const bounds = element.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      start()
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
    }
    const visibility = () => (document.hidden ? stop() : start())
    const palette = () => {
      const next = getComputedStyle(element)
      foreground = next.getPropertyValue('--fg').trim() || '#ededed'
      accent = next.getPropertyValue('--accent-light').trim() || '#e07b4f'
      stop()
      start()
    }
    const preference = () => {
      reduced = media.matches
      stop()
      start()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '60px' },
    )
    const sizeObserver = new ResizeObserver(resize)
    const pointer = (event: PointerEvent) => {
      if (reduced || event.pointerType === 'touch') return
      const bounds = element.getBoundingClientRect()
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5
    }
    const leave = () => {
      pointerX = 0
      pointerY = 0
    }
    observer.observe(element)
    sizeObserver.observe(element)
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('omarchy-theme', palette)
    element.addEventListener('pointermove', pointer)
    element.addEventListener('pointerleave', leave)
    redraw.current = () => {
      stop()
      start()
    }
    resize()
    return () => {
      disposed = true
      stop()
      observer.disconnect()
      sizeObserver.disconnect()
      media.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('omarchy-theme', palette)
      element.removeEventListener('pointermove', pointer)
      element.removeEventListener('pointerleave', leave)
      redraw.current = undefined
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      className={`zero-pixel-field ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
