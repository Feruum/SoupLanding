import { useCallback, useEffect, useRef, useState } from 'react'
import type { Messages } from '../catalogue'
import { readSoupTheme, transitionSoupTheme } from './runtime'
import './themes.css'

export { themeInitScript } from './runtime'

/** One switch between Soup's black palette and white. */
export function SoupThemePicker({ m }: { m: Messages }) {
  const [white, setWhite] = useState(false)
  const [busy, setBusy] = useState(false)
  const changing = useRef(false)
  const button = useRef<HTMLButtonElement>(null)
  const toggle = useCallback(async () => {
    if (changing.current) return
    changing.current = true
    setBusy(true)
    const next =
      document.documentElement.dataset.theme === 'white' ? 'soup' : 'white'
    const bounds = button.current?.getBoundingClientRect()
    try {
      await transitionSoupTheme(next, {
        x: bounds ? bounds.right : window.innerWidth,
        y: bounds ? bounds.top + bounds.height / 2 : 0,
      })
    } finally {
      changing.current = false
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    const sync = () =>
      setWhite(
        (document.documentElement.dataset.theme ?? readSoupTheme()) === 'white',
      )
    sync()
    const key = (event: KeyboardEvent) => {
      const target = event.target
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
      )
        return
      if (
        event.key.toLowerCase() === 't' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault()
        void toggle()
      }
    }
    window.addEventListener('omarchy-theme', sync)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('omarchy-theme', sync)
      window.removeEventListener('keydown', key)
    }
  }, [toggle])

  return (
    <button
      ref={button}
      type="button"
      className="soup-theme-trigger"
      aria-label={m.theme}
      aria-pressed={white}
      disabled={busy}
      title={`${m.theme}: ${white ? 'Black' : 'White'} (T)`}
      onClick={() => void toggle()}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none" />
      </svg>
    </button>
  )
}
