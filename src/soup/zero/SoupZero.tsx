import { useEffect, useRef, useState } from 'react'
import type { Messages } from '../catalogue'
import { localePath } from '../locales'
import { useScrollMotion } from '../motion/useScrollMotion'
import { ZERO_SCROLL_GROUPS } from '../motion/scroll-motion'
import {
  ZeroFragmentAssembly,
  ZeroStationScene,
  ZeroPipelineScene,
} from './ZeroScenes'
import { ZeroPixelField } from './ZeroPixelField'
import english from './content.en.json'
import './zero.css'

export type ZeroContent = typeof english
export const ZERO_INSTALL = 'pip install "soup-cli[train]"'
export const ZERO_COMMANDS = [
  'soup train --config soup.yaml',
  'soup eval custom --model ./output --tasks quality.jsonl',
  'soup ship --base Qwen/Qwen2.5-3B --adapter ./output --task-eval quality.jsonl --config soup.yaml',
] as const

type Station = {
  title: keyof ZeroContent
  body: keyof ZeroContent
  live?: string
  glyph: string
}
const STATIONS: Station[] = [
  { title: 'stationPlayground', body: 'stationPlaygroundBody', glyph: '▷' },
  { title: 'stationData', body: 'stationDataBody', glyph: '▦' },
  { title: 'stationPrompts', body: 'stationPromptsBody', glyph: '⌘' },
  { title: 'stationRag', body: 'stationRagBody', glyph: '⌗' },
  { title: 'stationAgents', body: 'stationAgentsBody', glyph: '↳' },
  {
    title: 'stationTrain',
    body: 'stationTrainBody',
    live: 'training',
    glyph: '≋',
  },
  {
    title: 'stationEvals',
    body: 'stationEvalsBody',
    live: 'eval-gate',
    glyph: '✓',
  },
  {
    title: 'stationDeploy',
    body: 'stationDeployBody',
    live: 'serving',
    glyph: '↗',
  },
  { title: 'stationMonitor', body: 'stationMonitorBody', glyph: '⌁' },
  { title: 'stationTeam', body: 'stationTeamBody', glyph: '⊞' },
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function Install({ m }: { m: Messages }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(ZERO_INSTALL)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    timer.current = setTimeout(() => setStatus('idle'), 2400)
  }
  return (
    <div className="zero-install-wrap">
      <div className="zero-install" dir="ltr">
        <span aria-hidden="true">$</span>
        <code>{ZERO_INSTALL}</code>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={m.copy}
          title={m.copy}
        >
          {status === 'copied' ? '✓' : '⧉'}
        </button>
      </div>
      <span className="zero-copy-status" role="status">
        {status === 'copied'
          ? m.copied
          : status === 'failed'
            ? m.copyFailed
            : ''}
      </span>
    </div>
  )
}

export function SoupZero({
  m,
  language,
  content,
}: {
  m: Messages
  language: string
  content?: ZeroContent
}) {
  const c = content ?? english
  const docs = (slug: string) => `${localePath(language)}docs/${slug}`
  const [station, setStation] = useState(5)
  const [workspaceInstant, setWorkspaceInstant] = useState(false)
  const [mode, setMode] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loopStep, setLoopStep] = useState(3)
  const root = useRef<HTMLDivElement>(null)
  useScrollMotion(root, ZERO_SCROLL_GROUPS)
  const current = STATIONS[station]
  const loop = [
    c.openModel,
    c.stationPlayground,
    c.stationData,
    c.stationTrain,
    c.stationEvals,
    c.stationDeploy,
    c.stationMonitor,
  ]
  const modes = [c.modeNoCode, c.modeCopilot, c.modeCode]

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries)
        entry.target.toggleAttribute('data-zero-visible', entry.isIntersecting)
    })
    element
      .querySelectorAll(
        '.zero-workspace, .zero-ownership, .zero-mode-panel, .zero-fragment-art, .zero-loop-field',
      )
      .forEach((node) => observer.observe(node))
    const visibility = () =>
      element.toggleAttribute('data-zero-hidden', document.hidden)
    document.addEventListener('visibilitychange', visibility)
    visibility()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return (
    <div
      ref={root}
      className="soup-zero"
      data-motion-paused={paused || undefined}
      lang={content ? language : 'en'}
    >
      <section className="zero-hero zero-container">
        <div className="zero-release">
          <span className="zero-status-dot" />
          <span>{c.status}</span>
          <a href={docs('getting-started')}>
            {c.getStarted} <Arrow />
          </a>
        </div>
        <div className="zero-hero-grid">
          <div className="zero-hero-copy">
            <h1>
              {c.heroTitle.split('\n').map((line, index) => (
                <span key={line} className={index ? 'zero-accent' : ''}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="zero-lede">{c.heroBody}</p>
            <div className="zero-actions">
              <a className="zero-primary" href={docs('getting-started')}>
                {c.getStarted} <Arrow />
              </a>
              <a className="zero-text-link" href="#zero-live">
                {c.seeLive} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="zero-small zero-muted">{c.heroNote}</p>
          </div>
          <div className="zero-hero-art">
            <div className="zero-coordinates" aria-hidden="true">
              <span>{c.project}</span>
              <span>llama-3.1-8b</span>
            </div>
            <ZeroPixelField
              scene={2}
              label={c.animationLabel}
              paused={paused}
            />
            <span className="zero-art-word" aria-hidden="true">
              ZERO<span>_</span>
            </span>
            <div className="zero-art-bottom">
              <span aria-hidden="true">[ {c.artFooter} ]</span>
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? c.playMotion : c.pauseMotion}
                title={paused ? c.playMotion : c.pauseMotion}
              >
                {paused ? '▷' : 'Ⅱ'}
              </button>
            </div>
          </div>
        </div>
        <div
          id="zero-workspace"
          className="zero-workspace"
          data-workspace-static={workspaceInstant || undefined}
        >
          <div className="zero-window-bar">
            <span>
              Soup Zero <span className="zero-window-separator">/</span>{' '}
              llama-3.1-8b <span className="zero-window-separator">/</span>{' '}
              {c.project}
            </span>
            <span className="zero-preview-badge">{c.preview}</span>
          </div>
          <div className="zero-workspace-layout">
            <nav className="zero-station-rail" aria-label={c.workspace}>
              {STATIONS.map((item, index) => (
                <button
                  type="button"
                  key={item.title}
                  className={station === index ? 'is-active' : ''}
                  aria-pressed={station === index}
                  onClick={(event) => {
                    setWorkspaceInstant(event.detail === 0)
                    setStation(index)
                  }}
                >
                  <span aria-hidden="true">{item.glyph}</span>
                  <span>{c[item.title]}</span>
                  <i
                    className={item.live ? 'is-live' : ''}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </nav>
            <div className="zero-workspace-panel">
              <div className="zero-panel-heading">
                <div>
                  <h2>{c[current.title]}</h2>
                </div>
                <span className={`zero-state ${current.live ? 'is-live' : ''}`}>
                  {current.live ? c.live : c.development}
                </span>
              </div>
              <p className="zero-panel-description">{c[current.body]}</p>
              <div className="zero-live-scene">
                <div className="zero-run-visual">
                  <ZeroStationScene
                    station={station}
                    c={c}
                    paused={paused}
                    instant={workspaceInstant}
                    onPausedChange={setPaused}
                  />
                </div>
                <aside
                  className="zero-run-context"
                  aria-label={c.configPreview}
                >
                  <h3>{c.configPreview}</h3>
                  <dl>
                    <div>
                      <dt>{c.baseModel}</dt>
                      <dd>
                        <code>llama-3.1-8b</code>
                      </dd>
                    </div>
                    <div>
                      <dt>{c.dataset}</dt>
                      <dd>
                        <code>support-tickets.jsonl</code>
                      </dd>
                    </div>
                    <div>
                      <dt>{c.recipe}</dt>
                      <dd>{c.recipeValue}</dd>
                    </div>
                  </dl>
                  <p className="zero-context-settings">
                    <code>4-bit · LoRA r=16</code>
                  </p>
                  <p className="zero-context-note">{c.conceptOnly}</p>
                </aside>
              </div>
            </div>
          </div>
          <div className="zero-workspace-footer">
            <span>
              <code>soup.yaml</code>
            </span>
            <span>Apache-2.0</span>
          </div>
        </div>
        <p className="zero-preview-note">{c.previewNote}</p>
      </section>

      <nav className="zero-page-nav" aria-label={c.workspace}>
        <div className="zero-container">
          {[
            [c.navWhy, 'zero-why'],
            [c.navStations, 'zero-stations'],
            [c.navWays, 'zero-ways'],
            [c.navWorkflow, 'zero-workflow'],
          ].map(([title, id]) => (
            <a key={id} href={`#${id}`}>
              {title}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="zero-section zero-container" id="zero-why">
        <div className="zero-section-intro">
          <h2>{c.whyTitle}</h2>
          <p>{c.whyBody}</p>
        </div>
        <div className="zero-problems">
          {[
            [c.painSimpleTitle, c.painSimpleBody, '01'],
            [c.painComplexTitle, c.painComplexBody, '02'],
            [c.painPrivateTitle, c.painPrivateBody, '03'],
          ].map(([title, body, n]) => (
            <article key={n}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="zero-fragment-art">
          <div className="zero-art-labels">
            <span>{c.fragmented}</span>
            <span aria-hidden="true">→</span>
            <span>{c.connected}</span>
          </div>
          <ZeroFragmentAssembly c={c} />
          <div className="zero-fragment-caption">
            <span className="zero-slash-mark" aria-hidden="true">
              //
            </span>
            <p>{c.graphNote}</p>
          </div>
        </div>
      </section>

      <section
        className="zero-section zero-stations-section"
        id="zero-stations"
      >
        <div className="zero-container">
          <div className="zero-section-intro">
            <h2>{c.stationsTitle}</h2>
            <p>{c.stationsBody}</p>
          </div>
          <div className="zero-station-legend">
            <span>
              <i className="is-live" />
              {c.live}
            </span>
            <span>
              <i />
              {c.development}
            </span>
          </div>
          <div className="zero-stations-grid">
            {STATIONS.map((item) => (
              <article
                className={`zero-station-item ${item.live ? 'is-live' : ''}`}
                key={item.title}
              >
                <div>
                  <div className="zero-station-top">
                    <h3>{c[item.title]}</h3>
                    <span className="zero-state">
                      {item.live ? c.live : c.development}
                    </span>
                  </div>
                  <p>{c[item.body]}</p>
                  {item.live && (
                    <a href={docs(item.live)}>
                      {c.readDocs} <Arrow />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="zero-ownership">
            <div className="zero-gpu-pixels" aria-hidden="true">
              {Array.from({ length: 64 }, (_, index) => (
                <i
                  key={index}
                  className={
                    (index % 8 > 1 &&
                      index % 8 < 6 &&
                      index > 15 &&
                      index < 48) ||
                    index % 9 === 0
                      ? 'is-on'
                      : ''
                  }
                />
              ))}
            </div>
            <div>
              <h3>{c.ownershipTitle}</h3>
              <p>{c.ownershipBody}</p>
            </div>
            <span className="zero-ownership-corner" aria-hidden="true">
              ↗
            </span>
          </div>
        </div>
      </section>

      <section className="zero-section zero-container" id="zero-ways">
        <div className="zero-section-intro">
          <h2>{c.waysTitle}</h2>
          <p>{c.waysBody}</p>
        </div>
        <div className="zero-mode-tabs" role="tablist" aria-label={c.navWays}>
          {modes.map((title, index) => (
            <button
              key={title}
              role="tab"
              type="button"
              id={`zero-mode-${index}`}
              aria-selected={mode === index}
              aria-controls="zero-mode-panel"
              tabIndex={mode === index ? 0 : -1}
              onClick={() => setMode(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault()
                  const next = (mode + (event.key === 'ArrowRight' ? 1 : 2)) % 3
                  setMode(next)
                  document.getElementById(`zero-mode-${next}`)?.focus()
                } else if (event.key === 'Home' || event.key === 'End') {
                  event.preventDefault()
                  const next = event.key === 'Home' ? 0 : 2
                  setMode(next)
                  document.getElementById(`zero-mode-${next}`)?.focus()
                }
              }}
            >
              <span>0{index + 1}</span>
              {title}
              <span
                className={`zero-tab-status ${index === 2 ? 'is-live' : ''}`}
              >
                {index === 2 ? c.live : c.development}
              </span>
            </button>
          ))}
        </div>
        <div
          id="zero-mode-panel"
          role="tabpanel"
          aria-labelledby={`zero-mode-${mode}`}
          tabIndex={0}
          className="zero-mode-panel"
        >
          <div className="zero-mode-explainer">
            <h3>{modes[mode]}</h3>
            <p>{[c.noCodeBody, c.copilotBody, c.codeBody][mode]}</p>
            <span className={`zero-state ${mode === 2 ? 'is-live' : ''}`}>
              {mode === 2 ? c.live : c.development}
            </span>
          </div>
          <div className="zero-mode-demo">
            {mode === 0 ? (
              <div className="zero-no-code">
                <div className="zero-console-heading">
                  {c.stationTrain}
                  <span>{c.conceptOnly}</span>
                </div>
                {[
                  [c.baseModel, 'llama-3.1-8b'],
                  [c.dataset, 'support-tickets.jsonl'],
                  [c.recipe, c.recipeValue],
                ].map(([label, value]) => (
                  <div className="zero-form-row" key={label}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="zero-config-preview">
                  <p>{c.configPreview}</p>
                  <code>
                    4-bit · LoRA r=16
                    <br />
                    batch auto · lr 2e-4 · 2 epochs
                  </code>
                </div>
                <button
                  type="button"
                  className="zero-primary"
                  onClick={() => setMode(2)}
                >
                  {c.seeCommand}
                  <Arrow />
                </button>
              </div>
            ) : mode === 1 ? (
              <div className="zero-copilot">
                <div className="zero-console-heading">
                  {c.modeCopilot}
                  <span>{c.development}</span>
                </div>
                <div className="zero-user-message">
                  <span>↳</span>
                  <p>{c.copilotRequest}</p>
                </div>
                <div className="zero-assistant-message">
                  <span className="zero-slash-mark">//</span>
                  <p>{c.copilotReply}</p>
                </div>
                <p className="zero-tiny zero-muted">{c.conceptOnly}</p>
              </div>
            ) : (
              <div className="zero-code-demo">
                <div className="zero-console-heading">
                  {c.terminal}
                  <span>{c.live}</span>
                </div>
                <pre dir="ltr">
                  {ZERO_COMMANDS.map((command) => `$ ${command}`).join('\n\n')}
                </pre>
                <div className="zero-code-result">
                  <span>
                    SHIP
                    <span className="zero-blink" aria-hidden="true">
                      {' '}
                      ▋
                    </span>
                  </span>
                  <span>{c.verdictExample}</span>
                </div>
                <a className="zero-text-link" href={docs('getting-started')}>
                  {c.getStarted} <Arrow />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="zero-section zero-workflow-section"
        id="zero-workflow"
      >
        <div className="zero-container">
          <div className="zero-section-intro">
            <h2>{c.workflowTitle}</h2>
            <p>{c.workflowBody}</p>
          </div>
          <div className="zero-lifecycle" aria-label={c.navWorkflow}>
            {loop.map((title, index) => (
              <button
                type="button"
                key={title}
                className={loopStep === index ? 'is-active' : ''}
                aria-pressed={loopStep === index}
                onClick={() => setLoopStep(index)}
              >
                <span>0{index + 1}</span>
                <span>{title}</span>
                {index >= 3 && index <= 5 ? (
                  <small>{c.live}</small>
                ) : (
                  <small aria-hidden="true">·</small>
                )}
              </button>
            ))}
          </div>
          <div className="zero-feedback-line">
            <span aria-hidden="true">↰</span>
            {c.feedback}
            <span aria-hidden="true">↵</span>
          </div>
          <div className="zero-loop-details">
            <div className="zero-loop-field">
              <ZeroPipelineScene step={loopStep} c={c} />
              <div className="zero-loop-label">
                <span>
                  {String(loopStep + 1).padStart(2, '0')} / {loop[loopStep]}
                </span>
                <span aria-hidden="true">▣</span>
              </div>
            </div>
            <div className="zero-verdict">
              <div className="zero-verdict-top">
                <code>evidence.json</code>
                <code>soup ship</code>
              </div>
              <span className="zero-verdict-word" aria-hidden="true">
                SHIP<span>↗</span>
              </span>
              <p className="zero-tiny zero-muted">{c.verdictExample}</p>
              <h3>{c.verdictTitle}</h3>
              <p>{c.verdictBody}</p>
              <ul>
                {[c.proofTask, c.proofGeneral, c.proofGaming].map((proof) => (
                  <li key={proof}>
                    <span aria-hidden="true">✓</span>
                    {proof}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="zero-section zero-container zero-final"
        id="zero-live"
      >
        <h2>{c.ctaTitle}</h2>
        <p>{c.ctaBody}</p>
        <div className="zero-actions">
          <a className="zero-primary" href={docs('getting-started')}>
            {c.getStarted}
            <Arrow />
          </a>
          <a className="zero-text-link" href={localePath(language)}>
            {c.backHome}
            <Arrow />
          </a>
        </div>
        <Install m={m} />
        <div className="zero-final-meta">
          <span>Soup CLI / Apache-2.0</span>
          <a
            href="https://pypi.org/project/soup-cli/"
            target="_blank"
            rel="noreferrer"
          >
            PyPI <Arrow />
          </a>
          <a href="https://trysoup.dev/zero" target="_blank" rel="noreferrer">
            {c.sourceLink}
            <Arrow />
          </a>
        </div>
      </section>
    </div>
  )
}

export default SoupZero
