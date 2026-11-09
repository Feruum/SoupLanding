import { useState } from 'react'
import type { Messages } from './catalogue'
import { localePath, soupLocales } from './locales'
import { SoupThemePicker } from './themes/SoupThemePicker'
import { leaderboardStrings } from './leaderboard/strings'
import { PixelIcon } from './PixelIcon'

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
  const destination = (code: string) => `${localePath(code)}${path}`
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
            <img src="/soup/logo-pixel.svg" alt="" width="34" height="34" />
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
              <PixelIcon name="github" size={20} />
            </a>
            <label className="language-control">
              <PixelIcon name="globe" size={16} />
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
                <PixelIcon name="arrowUpRight" />
              </span>
            </a>
            <button
              className="menu-button"
              aria-label={open ? m.close : m.menu}
              aria-expanded={open}
              aria-controls="main-navigation"
              onClick={() => setOpen(!open)}
            >
              <PixelIcon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
