import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Messages } from './catalogue'
import { soupLocales, localePath } from './locales'
import { SoupHeroField } from './SoupHeroField'
import { SoupFooter } from './SoupFooter'
import { SoupHeader } from './SoupHeader'
import { SoupEcosystem } from './ecosystem/SoupEcosystem'
import { OrnamentBand } from './ornament/OrnamentBand'
import { SoupLocaleContext } from './SoupLocaleContext'
import { useScrollMotion } from './motion/useScrollMotion'
import { usePointerProximity } from './motion/usePointerProximity'
import { LANDING_SCROLL_GROUPS } from './motion/scroll-motion'
import { ProcessScene } from './motion/ProcessScene'
import { PROCESS_KINDS } from './motion/ProcessArt'
import type { FooterGroup } from './locales'
import { DocumentCloud, EvaluationAnimation } from './HydraAnimations'
import {
  SoupAbout,
  SoupInstall,
  SoupMethods,
  SoupWorkbench,
  SoupRecipes,
  SoupModelsCommunity,
} from './OmarchySections'

const INSTALL = 'pip install "soup-cli[train]"'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {diagonal ? '↗' : '→'}
    </span>
  )
}

function CopyCommand({
  command = INSTALL,
  m,
}: {
  command?: string
  m: Messages
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])
  async function copy() {
    clearTimeout(timeout.current)
    try {
      await navigator.clipboard.writeText(command)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    timeout.current = setTimeout(() => setStatus('idle'), 2500)
  }
  return (
    <div className="copy-wrap">
      <div className="install-command" dir="ltr">
        <span className="prompt">$</span>
        <code>{command}</code>
        <button onClick={() => void copy()} aria-label={m.copy} title={m.copy}>
          {status === 'copied' ? (
            '✓'
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="6"
                y="6"
                width="11"
                height="11"
                rx="1"
                stroke="currentColor"
              />
              <path d="M13 6V3H3v10h3" stroke="currentColor" />
            </svg>
          )}
        </button>
      </div>
      <span className="copy-feedback" role="status">
        {status === 'copied'
          ? m.copied
          : status === 'failed'
            ? m.copyFailed
            : ''}
      </span>
    </div>
  )
}

const steps: {
  label: keyof Messages
  description: keyof Messages
  command: string
  output: string
}[] = [
  {
    label: 'stepData',
    description: 'descData',
    command: 'soup data doctor data.jsonl',
    output: 'data.jsonl',
  },
  {
    label: 'stepMethod',
    description: 'descMethod',
    command: 'soup advise run data.jsonl',
    output: 'PROMPT_ENG / RAG / SFT / DPO / GRPO',
  },
  {
    label: 'stepConfig',
    description: 'descConfig',
    command: 'soup init --template chat',
    output: 'soup.yaml',
  },
  {
    label: 'stepTrain',
    description: 'descTrain',
    command: 'soup train --config soup.yaml',
    output: 'soup.yaml  →  ./outputs/adapter',
  },
  {
    label: 'stepEval',
    description: 'descEval',
    command:
      'soup ship --base Qwen/Qwen2.5-3B --adapter ./outputs/adapter --task-eval eval.jsonl',
    output: 'SHIP / DON’T SHIP',
  },
  {
    label: 'stepExport',
    description: 'descExport',
    command: 'soup export --model ./outputs/adapter --format gguf',
    output: './outputs/adapter  →  GGUF',
  },
]

const PROXIMITY_TARGETS =
  '.se-tool-primary > .soup-pixel-tool, .se-tool-tags .soup-pixel-tool, .se-source-tabs .soup-pixel-tool, .os-model-face > svg'

export default function SoupLanding({
  language,
  messages: m,
  footerGroups,
}: {
  language: string
  messages: Messages
  footerGroups: FooterGroup[]
}) {
  const DOCS = `${localePath(language)}docs`
  const [activeStep, setActiveStep] = useState(0)
  const [workflowInstant, setWorkflowInstant] = useState(false)
  const [workflowOrientation, setWorkflowOrientation] = useState<
    'vertical' | 'horizontal'
  >('vertical')
  const [migration, setMigration] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  useScrollMotion(root, LANDING_SCROLL_GROUPS)
  usePointerProximity(root, PROXIMITY_TARGETS)
  useEffect(() => {
    const media = matchMedia('(max-width: 760px)')
    const update = () =>
      setWorkflowOrientation(media.matches ? 'horizontal' : 'vertical')
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  function keyboardTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    setWorkflowInstant(true)
    if (
      ![
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(event.key)
    )
      return
    event.preventDefault()
    const rtl = soupLocales[language].direction === 'rtl'
    const direction =
      event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowUp'
          ? -1
          : event.key === 'ArrowRight'
            ? rtl
              ? -1
              : 1
            : rtl
              ? 1
              : -1
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? 5
          : (index + direction + 6) % 6
    setActiveStep(next)
    const tabs =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      )
    tabs?.[next].focus()
  }

  const migrateCommands = [
    'soup migrate --from llamafactory config.yaml',
    'soup migrate --from axolotl config.yml',
    'soup migrate --from unsloth notebook.ipynb',
  ]
  return (
    <SoupLocaleContext.Provider value={language}>
      <div className="soup-site" ref={root}>
        <SoupHeader language={language} m={m} />

        <main id="main">
          <section className="hero" id="home" data-hero-sentinel>
            <SoupHeroField />
            <div className="hero-copy" data-hero-quiet>
              <h1>{m.heroTitle}</h1>
              <p>{m.heroDescription}</p>
              <CopyCommand m={m} />
              <div className="hero-buttons">
                <a className="button primary" href={`${DOCS}/getting-started`}>
                  {m.heroAction}
                  <Arrow diagonal />
                </a>
                <a className="text-link" href="#workflow">
                  {m.heroSecondary}
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="hero-note">{m.heroNote}</p>
            </div>
            <div className="hero-baseline" data-hero-quiet>
              <span className="origin-label">
                <span className="tiny-oyu" aria-hidden="true">
                  ◈
                </span>
                {m.madeIn}
              </span>
              <a href="#workflow">
                {m.scroll}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>

          <SoupAbout m={m} />
          <SoupInstall m={m} />
          <SoupMethods m={m} />
          <section className="section workflow-section" id="workflow">
            <div className="section-heading">
              <h2>{m.workflowTitle}</h2>
              <p className="section-description">{m.workflowDescription}</p>
            </div>
            <div className="workflow-layout">
              <div className="workflow-controls">
                <div
                  className="workflow-tabs"
                  role="tablist"
                  aria-label={m.navWorkflow}
                  aria-orientation={workflowOrientation}
                >
                  {steps.map((step, i) => (
                    <button
                      key={step.label}
                      role="tab"
                      id={`step-${i}`}
                      aria-selected={activeStep === i}
                      aria-controls="workflow-panel"
                      tabIndex={activeStep === i ? 0 : -1}
                      className={activeStep === i ? 'step active' : 'step'}
                      onClick={(event) => {
                        setWorkflowInstant(event.detail === 0)
                        setActiveStep(i)
                      }}
                      onKeyDown={(event) => keyboardTab(event, i)}
                    >
                      <span className="step-number">0{i + 1}</span>
                      <span>{m[step.label]}</span>
                      <Arrow />
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="workflow-panel"
                role="tabpanel"
                id="workflow-panel"
                aria-labelledby={`step-${activeStep}`}
                data-workflow-static={workflowInstant || undefined}
                tabIndex={0}
              >
                <div className="terminal-bar">
                  <span>soup / {String(activeStep + 1).padStart(2, '0')}</span>
                </div>
                <ProcessScene
                  kind={PROCESS_KINDS[activeStep]}
                  instant={workflowInstant}
                  playLabel={m.zeroPagePlayMotion}
                  pauseLabel={m.zeroPagePauseMotion}
                />
                <div className="terminal-body" dir="ltr">
                  <div className="terminal-meta">{m.terminalExample}</div>
                  <pre key={activeStep}>
                    <span className="prompt">$ </span>
                    {steps[activeStep].command}
                  </pre>
                  <div className="terminal-output">
                    <span aria-hidden="true">↳ </span>
                    {steps[activeStep].output}
                  </div>
                  <div className="terminal-cursor" aria-hidden="true">
                    ▌
                  </div>
                </div>
                <p className="terminal-description">
                  {m[steps[activeStep].description]}
                </p>
              </div>
            </div>
          </section>

          <section className="section capabilities" id="capabilities">
            <div className="feature-row">
              <div className="feature-copy">
                <h2>{m.dataTitle}</h2>
                <p>{m.dataDescription}</p>
                <ul>
                  {[m.dataFeature1, m.dataFeature2, m.dataFeature3].map(
                    (text) => (
                      <li key={text}>
                        <span aria-hidden="true">+</span>
                        {text}
                      </li>
                    ),
                  )}
                </ul>
                <a className="text-link accent" href={`${DOCS}/data-moat-ii`}>
                  {m.dataLink}
                  <Arrow diagonal />
                </a>
              </div>
              <div className="feature-art document-art">
                <div className="art-caption" dir="ltr">
                  <span>data.jsonl</span>
                  <span>→</span>
                  <span>soup data doctor</span>
                </div>
                <DocumentCloud ariaLabel={m.animationData} />
                <span className="art-corner top-left" />
                <span className="art-corner bottom-right" />
              </div>
            </div>
            <div className="evaluation-block">
              <div className="evaluation-heading">
                <div>
                  <h2>{m.evalTitle}</h2>
                </div>
                <p>{m.evalDescription}</p>
              </div>
              <EvaluationAnimation
                ariaLabel={m.animationEval}
                labels={[
                  m.stepData,
                  m.stepMethod,
                  m.stepTrain,
                  m.stepEval,
                  m.stepExport,
                ]}
              />
              <div className="evaluation-footer">
                <ul>
                  {[m.evalFeature1, m.evalFeature2, m.evalFeature3].map(
                    (text) => (
                      <li key={text}>
                        <span aria-hidden="true">↗</span>
                        {text}
                      </li>
                    ),
                  )}
                </ul>
                <a className="text-link accent" href={`${DOCS}/soup-ship`}>
                  {m.evalLink}
                  <Arrow diagonal />
                </a>
              </div>
            </div>
          </section>

          <OrnamentBand />
          <SoupWorkbench m={m} />
          <SoupRecipes m={m} />

          <section className="section migration-section" id="migration">
            <div className="section-heading">
              <h2>{m.migrationTitle}</h2>
              <p className="section-description">{m.migrationDescription}</p>
            </div>
            <div className="migration-box">
              <div
                className="migration-tabs"
                role="group"
                aria-label={m.migrationTitle}
              >
                {['LLaMA-Factory', 'Axolotl', 'Unsloth'].map((name, i) => (
                  <button
                    key={name}
                    aria-pressed={migration === i}
                    className={migration === i ? 'active' : ''}
                    onClick={() => setMigration(i)}
                  >
                    {name}
                    <Arrow />
                  </button>
                ))}
              </div>
              <div className="migration-command">
                <div className="migration-route" aria-hidden="true">
                  <span>
                    {['config.yaml', 'config.yml', 'notebook.ipynb'][migration]}
                  </span>
                  <span className="route-line" />
                  <span className="accent-text">soup.yaml</span>
                </div>
                <CopyCommand command={migrateCommands[migration]} m={m} />
                <a className="text-link" href={`${DOCS}/migration`}>
                  {m.migrationLink}
                  <Arrow diagonal />
                </a>
              </div>
            </div>
          </section>

          <OrnamentBand />
          <SoupEcosystem m={m} language={language} />
          <div className="section zero-strip">
            <div>
              <h3>{m.zeroTitle}</h3>
              <p>{m.zeroDescription}</p>
            </div>
            <a
              className="text-link accent"
              href={`${localePath(language)}zero/`}
            >
              {m.zeroLink}
              <Arrow diagonal />
            </a>
          </div>

          <SoupModelsCommunity m={m} />
          <section className="final-section" id="start">
            <div className="final-copy">
              <h2>{m.installStep1}</h2>
              <CopyCommand m={m} />
              <a className="button primary" href={`${DOCS}/getting-started`}>
                {m.navStart}
                <Arrow diagonal />
              </a>
            </div>
          </section>
        </main>

        <SoupFooter language={language} m={m} groups={footerGroups} />
      </div>
    </SoupLocaleContext.Provider>
  )
}
