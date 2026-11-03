import { localePath } from '../locales'
import english from './content.en.json'
import './hire.css'

export type HireContent = typeof english

// Fill these in to publish them: an empty value hides the matching button.
export const HIRE_NAME = 'Madi Talgat'
export const HIRE_CONTACT = 'https://t.me/ferum_m'
export const HIRE_CV = '/hire/Madi_Talgat_CV.pdf'

// Facts about this site, kept in step with README.md.
const STATS = [
  [52, 'statLanguages'],
  [7020, 'statRoutes'],
  [131, 'statDocs'],
] as const

// Taken from the CV in public/hire/.
type Entry = {
  name: string
  role: keyof HireContent
  period?: string
  body: keyof HireContent
  stack?: string
  url?: string
}
const EXPERIENCE: Entry[] = [
  {
    name: 'EpiQ',
    role: 'roleFullstack',
    period: '2025',
    body: 'epiqBody',
    url: 'https://epiq.top',
  },
  {
    name: 'NomadCodes',
    role: 'roleFrontend',
    period: '',
    body: 'nomadBody',
    stack: 'React · TypeScript · Ant Design',
  },
  {
    name: 'LexiSpark',
    role: 'roleCreator',
    body: 'lexiBody',
    stack: 'TypeScript · Bun · ElysiaJS · React · shadcn/ui',
    url: 'https://lexispark.app',
  },
  {
    name: 'Online Judge',
    role: 'roleIndependent',
    body: 'judgeBody',
    stack: 'React · TypeScript · NestJS · Judge0 · PostgreSQL · Docker',
  },
]

const MONOGRAM = [
  '11111010001',
  '00100011011',
  '00100010101',
  '00100010101',
  '00100010001',
  '00100010001',
  '00100010001',
]

function Monogram() {
  return (
    <svg
      className="hire-monogram"
      viewBox={`-1 -1 ${MONOGRAM[0].length + 2} ${MONOGRAM.length + 2}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {MONOGRAM.flatMap((row, y) =>
        [...row].map((bit, x) => (
          <rect
            key={`${x}-${y}`}
            x={x + 0.08}
            y={y + 0.08}
            width="0.84"
            height="0.84"
            className={bit === '1' ? 'is-on' : ''}
            style={{ animationDelay: `${(x + y) * 70}ms` }}
          />
        )),
      )}
    </svg>
  )
}

export function SoupHire({
  language,
  content,
}: {
  language: string
  content: HireContent
}) {
  const c = content
  const numbers = new Intl.NumberFormat(language)
  const actions = (
    <div className="hire-actions">
      {HIRE_CONTACT && (
        <a className="hire-primary" href={HIRE_CONTACT}>
          {c.contact} <span aria-hidden="true">↗</span>
        </a>
      )}
      {HIRE_CV && (
        <a className="hire-secondary" href={HIRE_CV} download>
          {c.cvDownload} <span aria-hidden="true">↓</span>
        </a>
      )}
    </div>
  )
  const pending = [!HIRE_CONTACT && c.contactSoon, !HIRE_CV && c.cvSoon].filter(
    Boolean,
  )
  return (
    <div className="soup-hire">
      <section className="hire-hero hire-container">
        <div className="hire-release">
          <span className="hire-status-dot" />
          <span>{c.eyebrow}</span>
        </div>
        <div className="hire-hero-grid">
          <div>
            <h1>
              <span>
                <bdi>{HIRE_NAME}</bdi>
              </span>
              <span className="hire-accent">{c.role}</span>
            </h1>
            <p className="hire-lede">{c.heroBody}</p>
            {actions}
            {pending.length > 0 && (
              <p className="hire-note">{pending.join(' ')}</p>
            )}
          </div>
          <div className="hire-art">
            <Monogram />
          </div>
        </div>
      </section>

      <section className="hire-section hire-container" id="hire-skills">
        <div className="hire-intro">
          <h2>{c.skillsTitle}</h2>
          <p>{c.skillsBody}</p>
        </div>
        <div className="hire-skills">
          {[
            [c.frontendTitle, c.frontendBody, '01'],
            [c.backendTitle, c.backendBody, '02'],
            [c.aiTitle, c.aiBody, '03'],
          ].map(([title, body, n]) => (
            <article key={n}>
              <span className="hire-index">{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hire-section hire-container" id="hire-experience">
        <div className="hire-intro">
          <h2>{c.expTitle}</h2>
          <p>{c.expBody}</p>
        </div>
        <ol className="hire-entries">
          {EXPERIENCE.map((entry) => (
            <li key={entry.name}>
              <div className="hire-entry-head">
                <h3>
                  <bdi>{entry.name}</bdi>
                </h3>
                <p>{c[entry.role]}</p>
                {entry.period !== undefined && (
                  <p className="hire-period">
                    {entry.period ? <bdi>{entry.period} – </bdi> : null}
                    {c.present}
                  </p>
                )}
              </div>
              <p className="hire-entry-body">{c[entry.body]}</p>
              <div className="hire-entry-meta">
                {entry.stack && <span dir="ltr">{entry.stack}</span>}
                {entry.url && (
                  <a href={entry.url} dir="ltr">
                    {entry.url.replace('https://', '')}{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="hire-facts">
          <div>
            <h3>{c.awardsTitle}</h3>
            <ul>
              <li>{c.award1}</li>
              <li>{c.award2}</li>
            </ul>
          </div>
          <div>
            <h3>{c.eduTitle}</h3>
            <ul>
              <li>
                <bdi>Astana IT University</bdi> · <bdi>2025 – 2028</bdi>
                <br />
                {c.eduBody}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hire-section hire-container" id="hire-work">
        <div className="hire-intro">
          <h2>{c.proofTitle}</h2>
          <p>{c.proofBody}</p>
        </div>
        <dl className="hire-stats">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <dt>{c[label]}</dt>
              <dd>{numbers.format(value)}</dd>
            </div>
          ))}
        </dl>
        <a className="hire-text-link" href={localePath(language)}>
          {c.proofLink} <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="hire-section hire-container" id="hire-contact">
        <div className="hire-cta">
          <h2>{c.ctaTitle}</h2>
          <p>{c.ctaBody}</p>
          {actions}
          {pending.length > 0 && (
            <p className="hire-note">{pending.join(' ')}</p>
          )}
        </div>
      </section>
    </div>
  )
}
