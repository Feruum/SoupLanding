import { useState } from 'react'
import type { Messages } from './catalogue'
import { localePath, soupLocales } from './locales'
import { SoupThemePicker } from './themes/SoupThemePicker'
import { leaderboardStrings } from './leaderboard/strings'

export function SoupHeader({
  language,
  m,
  path = '',
}: {
  language: string
  m: Messages
  path?: string
}) {
  const [open, setOpen] = useState(false)
  const home = localePath(language)
  const destination = (code: string) =>
    `${localePath(code)}${path}`
  return (
    <>
      <a className="skip-link" href="#main">
        {m.skip}
      </a>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        <div className="nav-inner">
          <a className="brand" href={home} aria-label="Soup" dir="ltr">
            <img src="/soup/logo.svg" alt="" width="34" height="34" />
            <span>
              Soup<span className="brand-dot">.</span>
            </span>
          </a>
          <nav
            className={open ? 'main-nav open' : 'main-nav'}
            id="main-navigation"
            aria-label="Soup"
          >
            <a href={`${home}#workflow`} onClick={() => setOpen(false)}>
              {m.navWorkflow}
            </a>
            <a href={`${home}#capabilities`} onClick={() => setOpen(false)}>
              {m.navFeatures}
            </a>
            <a href={`${home}#ecosystem`} onClick={() => setOpen(false)}>
              {m.navEcosystem}
            </a>
            <a href={`${home}zero/`}>Soup Zero</a>
            <a href={`${home}leaderboard/`}>
              {leaderboardStrings(language).s.nav}
            </a>
            <a href={`${home}docs/getting-started/`}>{m.navDocs}</a>
          </nav>
          <div className="nav-actions">
            <SoupThemePicker m={m} />
            <a
              className="github-link"
              href="https://github.com/MakazhanAlpamys/Soup"
              aria-label="GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .8a11.3 11.3 0 0 0-3.57 22c.57.11.77-.25.77-.55v-2.1c-3.15.69-3.82-1.34-3.82-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.5-1.44.11-3 0 0 .95-.31 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.47 3.11-1.16 3.11-1.16.61 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.21.67.78.55A11.3 11.3 0 0 0 12 .8Z" />
              </svg>
            </a>
            <label className="language-control">
              <span aria-hidden="true">◎</span>
              <span className="sr-only">{m.language}</span>
              <select
                aria-label={m.language}
                value={language}
                onChange={(event) => {
                  window.location.href =
                    destination(event.target.value) + window.location.hash
                }}
              >
                {Object.entries(soupLocales).map(([code, locale]) => (
                  <option key={code} value={code} lang={code}>
                    {locale.name}
                  </option>
                ))}
              </select>
            </label>
            <a className="button nav-cta" href={`${home}docs/getting-started/`}>
              {m.navStart}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <button
              className="menu-button"
              aria-label={open ? m.close : m.menu}
              aria-expanded={open}
              aria-controls="main-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? '×' : '☰'}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
