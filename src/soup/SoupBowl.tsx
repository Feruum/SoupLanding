import { useEffect, useRef } from 'react'

/** A small literal soup in the footer; steam sleeps whenever it is offscreen. */
export function SoupBowl() {
  const root = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const element = root.current
    if (!element) return
    let visible = true
    const sync = () =>
      element.toggleAttribute('data-steaming', visible && !document.hidden)
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            sync()
          })
    observer?.observe(element)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])
  return (
    <svg
      ref={root}
      className="soup-bowl"
      viewBox="0 0 36 30"
      width="108"
      height="90"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g className="soup-steam" fill="var(--t-field-crest)">
        <path className="soup-steam-trail" d="M10 2h2v2h-2v2h2v3h-2V7H8V4h2Z" />
        <path
          className="soup-steam-trail"
          d="M18 0h2v3h-2v2h2v4h-2V6h-2V3h2Z"
        />
        <path
          className="soup-steam-trail"
          d="M26 2h2v2h-2v2h2v3h-2V7h-2V4h2Z"
        />
      </g>
      <g className="soup-bowl-dish">
        <path fill="var(--t-field-dim)" d="M7 28h24v2H7Z" />
        <path
          fill="var(--t-field-mid)"
          d="M3 13h30v6h-2v3h-4v3h-5v3H14v-3H9v-3H5v-3H3Z"
        />
        <path fill="var(--accent)" d="M3 13h28v5h-2v3h-4v3H12v-3H7v-3H3Z" />
        <path fill="var(--accent-light)" d="M3 15h26v3h-2v3H11v-3H5v-1H3Z" />
        <path
          fill="var(--t-field-crest)"
          d="M3 10h28v2h3v3H1v-3h2ZM9 24h16v2H9Z"
        />
        <path fill="var(--accent)" d="M5 11h24v2H5Z" />
        <path
          fill="var(--t-field-crest)"
          d="M9 11h3v1H9Zm10 1h4v1h-4Zm6-1h2v1h-2Z"
        />
        <path fill="var(--t-field-mid)" d="M14 11h3v1h-3Z" />
        <path
          fill="var(--t-field-crest)"
          d="M5 16h2v3H5Zm2 3h2v2H7Z"
          opacity=".55"
        />
      </g>
    </svg>
  )
}
