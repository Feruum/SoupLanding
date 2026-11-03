/** Pause scene timelines while they are off screen or the tab is hidden. */
export function bindProcessVisibility(
  element: HTMLElement,
  onChange?: (visible: boolean) => void,
) {
  const doc = element.ownerDocument
  const view = doc.defaultView
  if (!view || typeof view.IntersectionObserver !== 'function') return () => {}
  let visible = false
  let disposed = false
  const update = () => {
    if (disposed) return
    element.setAttribute('data-process-visible', String(visible && !doc.hidden))
    onChange?.(visible && !doc.hidden)
  }
  const observer = new view.IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.target === element) visible = entry.isIntersecting
      update()
    },
    { threshold: 0 },
  )
  element.setAttribute('data-process-ready', '')
  update()
  observer.observe(element)
  doc.addEventListener('visibilitychange', update)
  return () => {
    disposed = true
    observer.disconnect()
    doc.removeEventListener('visibilitychange', update)
    element.removeAttribute('data-process-ready')
    element.removeAttribute('data-process-visible')
  }
}
