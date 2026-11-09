import { useEffect, useRef, useState } from 'react'
import { PixelIcon } from '../PixelIcon'
import { ProcessArt } from './ProcessArt'
import type { ProcessKind } from './ProcessArt'
import { bindProcessVisibility } from './process-visibility'
import { createProcessTimeline } from './process-timeline'
import './process-scene.css'

export function ProcessScene({
  kind,
  paused = false,
  instant = false,
  compact = false,
  playLabel,
  pauseLabel,
  onPausedChange,
}: {
  kind: ProcessKind
  paused?: boolean
  instant?: boolean
  compact?: boolean
  playLabel: string
  pauseLabel: string
  onPausedChange?: (paused: boolean) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const [localPaused, setLocalPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timeline = useRef<ReturnType<typeof createProcessTimeline>>(null)
  const stopped = paused || localPaused
  useEffect(() => {
    if (root.current) return bindProcessVisibility(root.current, setVisible)
  }, [])
  useEffect(() => {
    const media = root.current?.ownerDocument.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )
    if (!media) return
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const element = root.current
    if (!element) return
    const reduced = element.ownerDocument.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    // Reduced motion and keyboard jumps get the finished frame, not the clip.
    if (reducedMotion || reduced) return
    const tl = createProcessTimeline(
      kind,
      element,
      element.querySelector('.pp-progress > i'),
    )
    timeline.current = tl
    if (instant) tl.seek('done')
    return () => {
      tl.revert()
      timeline.current = null
    }
  }, [kind, instant, reducedMotion])
  useEffect(() => {
    const tl = timeline.current
    if (!tl) return
    if (visible && !stopped && !instant) tl.play()
    else tl.pause()
  }, [visible, stopped, instant, kind, reducedMotion])
  return (
    <div
      ref={root}
      className={`pixel-process ${compact ? 'pp-compact' : ''}`}
      data-process-kind={kind}
      data-process-paused={stopped || undefined}
      data-process-static={instant || reducedMotion || undefined}
    >
      <ProcessArt kind={kind} compact={compact} />
      {kind === 'train' && (
        <div className="pp-train-flow" aria-hidden="true">
          <code className="pp-flow-bits pp-motion">01011001</code>
          <span>-&gt;</span>
          <code>LoRA / ΔW</code>
          <span>-&gt;</span>
          <code>./output</code>
        </div>
      )}
      <div className="pp-transport">
        <span className="pp-progress" aria-hidden="true">
          <i key={kind} />
        </span>
        <button
          type="button"
          aria-label={stopped ? playLabel : pauseLabel}
          aria-pressed={stopped}
          title={stopped ? playLabel : pauseLabel}
          onClick={() =>
            onPausedChange
              ? onPausedChange(!stopped)
              : setLocalPaused(!localPaused)
          }
          disabled={paused && !onPausedChange}
        >
          <PixelIcon name={stopped ? 'play' : 'pause'} size={14} />
        </button>
      </div>
    </div>
  )
}
