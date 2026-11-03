import { HeroPixelField } from '../components/HeroPixelField'
import { OYU_GLYPH, SOUP_GLYPH } from './glyphs'
import type { Messages } from './catalogue'
import { localePath } from './locales'
import type { FooterGroup } from './locales'
import { leaderboardStrings } from './leaderboard/strings'

export function SoupFooter({
  language,
  m,
  groups,
  path = '',
}: {
  language: string
  m: Messages
  groups: FooterGroup[]
  path?: string
}) {
  const home = localePath(language)
  const docs = `${home}docs`
  const github = 'https://github.com/MakazhanAlpamys/Soup'
  const columns = [
    {
      title: m.navFeatures,
      links: [
        [m.navWorkflow, `${home}#workflow`],
        [m.stepMethod, `${home}#methods`],
        [m.stepTrain, `${home}#training-workbench`],
        [m.stepEval, `${home}#release-workbench`],
        [m.stepConfig, `${home}#recipes`],
      ],
    },
    {
      title: m.navDocs,
      links: [
        [m.installStep1, `${docs}/getting-started`],
        [m.migrationLink, `${docs}/migration`],
        [m.footerPaper, `${docs}/paper`],
        ['CLI', `${docs}/cli-reference`],
        ['Soup Zero', `${home}zero/`],
        [leaderboardStrings(language).s.nav, `${home}leaderboard/`],
      ],
    },
    {
      title: m.footerCommunity,
      links: [
        ['Discord', 'https://discord.gg/dgd2pJcjwP'],
        ['Telegram', 'https://t.me/souptasters'],
        ['Soup Tasters', 'https://t.me/souptasters_bot'],
        ['GitHub Discussions', `${github}/discussions`],
        ['YouTube', 'https://youtube.com/@SoupCLI'],
      ],
    },
    {
      title: m.footerSource,
      links: [
        ['GitHub', github],
        ['PyPI', 'https://pypi.org/project/soup-cli/'],
        ['Apache-2.0', `${github}/blob/main/LICENSE`],
        ['MePlay, Inc.', 'https://trysoup.dev/about'],
      ],
    },
  ]
  return (
    <footer
      id="footer"
      className="soup-original-footer relative isolate overflow-hidden border-t border-border-subtle"
      style={{
        background: 'var(--t-field-bg)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="soup-footer-field" aria-hidden="true">
        <HeroPixelField variant="field" stampGlyph={OYU_GLYPH} />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex w-full shrink-0 flex-col sm:w-max lg:w-96 lg:self-start">
            <a
              href={`${home}#home`}
              aria-label="Soup"
              data-quiet
              className="soup-footer-brand"
            >
              <img
                src="/soup/logo.svg"
                alt=""
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
              />
              <svg
                viewBox={`0 0 ${SOUP_GLYPH.width} ${SOUP_GLYPH.height}`}
                role="img"
                aria-label="Soup"
                className="h-6 w-auto"
                shapeRendering="crispEdges"
              >
                {SOUP_GLYPH.rows.flatMap((row, y) =>
                  [...row].flatMap((bit, x) =>
                    bit === '1'
                      ? [
                          <rect
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            width="1"
                            height="1"
                            fill="currentColor"
                          />,
                        ]
                      : [],
                  ),
                )}
              </svg>
            </a>
            <p
              data-quiet
              className="mt-4 text-sm leading-relaxed text-text-muted"
            >
              <span className="block">{m.footerDescription}</span>
              <span className="mt-2 block">{m.heroNote}</span>
            </p>
            <div
              className="mt-4 flex flex-col gap-1 text-sm leading-relaxed text-text-muted"
              data-quiet
            >
              <a
                href="https://pypi.org/project/soup-cli/"
                className="soup-footer-link"
              >
                Python 3.11–3.13
              </a>
              <a href={github} className="soup-footer-link">
                CLI + MCP
              </a>
              <a href="https://trysoup.dev/about" className="soup-footer-link">
                MePlay, Inc.
              </a>
            </div>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 xl:gap-x-10">
            {columns.map((col) => (
              <nav key={col.title} data-quiet aria-label={col.title}>
                <h2 className="font-sans text-xs tracking-widest text-text-muted uppercase">
                  {col.title}
                </h2>
                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={href}>
                      <a href={href} className="soup-footer-link text-sm">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <nav
          aria-label={m.language}
          className="mt-12 flex flex-wrap gap-x-10 gap-y-5 text-sm"
        >
          {groups.map((group) => (
            <div
              key={group.script}
              data-quiet
              className={group.locales.length > 4 ? 'w-full' : 'min-w-0'}
            >
              <h2 className="font-sans text-[11px] text-text-muted">
                {group.label}
              </h2>
              <ul
                className={
                  group.locales.length > 4
                    ? 'mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'mt-2 flex flex-wrap gap-x-4 gap-y-1.5'
                }
              >
                {group.locales.map((locale) => (
                  <li key={locale.code} className="min-w-0">
                    <a
                      href={`${localePath(locale.code)}${path}`}
                      hrefLang={locale.code}
                      lang={locale.code}
                      dir="auto"
                      aria-current={
                        language === locale.code ? 'page' : undefined
                      }
                      className="soup-footer-link inline-block max-w-full break-words aria-[current=page]:text-brand aria-[current=page]:decoration-current"
                    >
                      {locale.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-12 flex flex-col gap-2 border-t border-border-subtle pt-6 text-[13px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p data-quiet>
            <a href={localePath(language)} className="soup-footer-link">
              Soup
            </a>{' '}
            © {new Date().getUTCFullYear()} · Apache-2.0
          </p>
          <p data-quiet>
            <a href="mailto:team@trysoup.dev" className="soup-footer-link">
              team@trysoup.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
