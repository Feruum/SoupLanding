export const SOUP_THEMES = [
  { id: 'soup', name: 'Black' },
  { id: 'white', name: 'White' },
]
export const SOUP_THEME_KEY = 'soup-site-theme'
const valid = (id: string | null): id is string =>
  SOUP_THEMES.some((theme) => theme.id === id)

export function readSoupTheme(storage?: Pick<Storage, 'getItem'>): string {
  try {
    const saved = (storage ?? localStorage).getItem(SOUP_THEME_KEY)
    if (valid(saved)) return saved
  } catch {
    // The default also works when the browser denies persistent storage.
  }
  return 'soup'
}

export function applySoupTheme(id: string) {
  if (!valid(id)) return
  document.documentElement.dataset.theme = id
  try {
    localStorage.setItem(SOUP_THEME_KEY, id)
  } catch {
    // Applying a palette does not depend on storage being available.
  }
  const background = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg')
    .trim()
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', background)
  window.dispatchEvent(
    new CustomEvent('omarchy-theme', { detail: { theme: id } }),
  )
}

/** Progressive enhancement: the new page spreads from the toggle as a pixel curtain. */
export async function transitionSoupTheme(
  id: string,
  origin: { x: number; y: number },
) {
  if (!valid(id)) return
  if (
    typeof document.startViewTransition !== 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    applySoupTheme(id)
    return
  }
  const style = document.documentElement.style
  document.documentElement.setAttribute('data-soup-theme-transition', '')
  style.setProperty('--soup-theme-x', `${Math.round(origin.x)}px`)
  style.setProperty('--soup-theme-y', `${Math.round(origin.y)}px`)
  try {
    const transition = document.startViewTransition(() => applySoupTheme(id))
    await transition.finished.catch(() => {})
  } catch {
    applySoupTheme(id)
  } finally {
    document.documentElement.removeAttribute('data-soup-theme-transition')
    style.removeProperty('--soup-theme-x')
    style.removeProperty('--soup-theme-y')
  }
}

/** Restore before first paint without invoking the original randomizer or favicon. */
export const themeInitScript = `(function(){var t='soup';try{var saved=localStorage.getItem('${SOUP_THEME_KEY}');if(${JSON.stringify(SOUP_THEMES.map((theme) => theme.id))}.indexOf(saved)!==-1)t=saved}catch(e){}document.documentElement.dataset.theme=t})()`
