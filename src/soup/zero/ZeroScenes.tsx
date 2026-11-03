import type { CSSProperties } from 'react'
import { ProcessScene } from '../motion/ProcessScene'
import type { ProcessKind } from '../motion/ProcessArt'
import type { ZeroContent } from './SoupZero'
import './zero-scenes.css'

const tools = [
  'terminal',
  'notebook.ipynb',
  'config.yaml',
  'ssh gpu-box-02',
  'prompts.xlsx',
  'eval_scripts/',
]

function MiniLines({ count = 5 }: { count?: number }) {
  return (
    <div className="zero-mini-lines">
      {Array.from({ length: count }, (_, index) => (
        <i key={index} style={{ width: `${42 + ((index * 19) % 53)}%` }} />
      ))}
    </div>
  )
}

/** Six flat tool windows converge along rails into a single workspace. */
export function ZeroFragmentAssembly({ c }: { c: ZeroContent }) {
  return (
    <div className="zero-assembly zero-scene-motion" aria-hidden="true">
      <div className="zero-tool-windows">
        {tools.map((tool, index) => (
          <div
            className="zero-tool-window"
            key={tool}
            style={{ '--tool-index': index } as CSSProperties}
          >
            <div className="zero-tool-title">
              <span>{index === 0 ? c.terminal : tool}</span>
              <i>↗</i>
            </div>
            <div className="zero-tool-body">
              {index === 0 ? (
                <code>
                  $ soup train
                  <br />
                  --config soup.yaml<span className="zero-tool-cursor"> ▋</span>
                </code>
              ) : index === 2 ? (
                <code>
                  LoRA: r=16
                  <br />
                  lr: 2e-4
                  <br />
                  epochs: 2
                </code>
              ) : index === 3 ? (
                <code>
                  GPU 0 ▰▰▰▱
                  <br />
                  GPU 1 ▰▰▱▱
                </code>
              ) : (
                <MiniLines count={index === 4 ? 4 : 5} />
              )}
            </div>
            <span className="zero-tool-outlet" />
          </div>
        ))}
      </div>
      <div className="zero-assembly-rails">
        <svg viewBox="0 0 100 330" preserveAspectRatio="none">
          <path d="M0 52H24V165H100M0 165H100M0 278H44V165" />
          <path
            className="zero-rail-pulse"
            d="M0 52H24V165H100M0 165H100M0 278H44V165"
            pathLength="100"
          />
        </svg>
        <span>→</span>
      </div>
      <div className="zero-unified-window">
        <div className="zero-unified-title">
          <span className="zero-slash-mark">//</span>
          <span>Soup Zero</span>
          <span>●</span>
        </div>
        <div className="zero-unified-content">
          <div className="zero-unified-sidebar">
            {[
              c.stationData,
              c.stationTrain,
              c.stationEvals,
              c.stationDeploy,
            ].map((title, index) => (
              <span key={title} className={index === 1 ? 'is-active' : ''}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                {title}
              </span>
            ))}
          </div>
          <div className="zero-unified-main">
            <span className="zero-unified-file">soup.yaml</span>
            <MiniLines count={6} />
            <div className="zero-unified-rows">
              {['support-tickets.jsonl', './output', 'quality.jsonl'].map(
                (file) => (
                  <span key={file}>
                    <i>✓</i>
                    {file}
                  </span>
                ),
              )}
            </div>
            <div className="zero-unified-terminal">
              <code>
                $ soup train
                <br />
                --config soup.yaml
              </code>
              <span>▰▰▰▰▱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Each station has its own flat visual grammar; there are no particle scenes here. */
export function ZeroStationScene({
  station,
  c,
  paused = false,
  instant = false,
  onPausedChange,
}: {
  station: number
  c: ZeroContent
  paused?: boolean
  instant?: boolean
  onPausedChange?: (paused: boolean) => void
}) {
  const kind = (
    { 1: 'data', 5: 'train', 6: 'eval', 7: 'export' } as Record<
      number,
      ProcessKind
    >
  )[station]
  if (kind)
    return (
      <ProcessScene
        kind={kind}
        compact
        paused={paused}
        instant={instant}
        playLabel={c.playMotion}
        pauseLabel={c.pauseMotion}
        onPausedChange={onPausedChange}
      />
    )
  let scene
  if (station === 2)
    scene = (
      <div className="zero-prompt-scene">
        {['A', 'B'].map((version, index) => (
          <div className="zero-prompt-sheet" key={version}>
            <header>
              {version}
              <span>{index ? '↗' : '—'}</span>
            </header>
            <MiniLines count={6} />
            <div className="zero-prompt-result">
              {'{ }'}
              <i>✓</i>
            </div>
          </div>
        ))}
      </div>
    )
  else if (station === 3)
    scene = (
      <div className="zero-knowledge-scene">
        <div className="zero-document-stack">
          {['.md', '.pdf', '.jsonl'].map((file) => (
            <div key={file}>
              <span>{file}</span>
              <MiniLines count={4} />
            </div>
          ))}
        </div>
        <div className="zero-context-rail">→</div>
        <div className="zero-context-result">
          <span>⌕</span>
          <MiniLines count={3} />
          <code>[0:128]</code>
        </div>
      </div>
    )
  else if (station === 4)
    scene = (
      <div className="zero-tools-scene">
        <div className="zero-tool-request">
          LLM<span>↓</span>
        </div>
        <div className="zero-tool-calls">
          {['MCP', 'CLI', 'API'].map((tool, index) => (
            <div key={tool}>
              <span>0{index + 1}</span>
              <strong>{tool}</strong>
              <i>{'{ }'}</i>
            </div>
          ))}
        </div>
        <div className="zero-tool-return">
          ↳ <code>{'{ "result": "…" }'}</code>
        </div>
      </div>
    )
  else if (station === 8)
    scene = (
      <div className="zero-monitor-scene">
        <header>
          GPU / 000<span>24:00</span>
        </header>
        <svg viewBox="0 0 300 130">
          <path
            className="zero-monitor-grid"
            d="M0 26H300M0 52H300M0 78H300M0 104H300M50 0V130M100 0V130M150 0V130M200 0V130M250 0V130"
          />
          <path
            className="zero-monitor-line"
            d="M0 80H20L30 70 42 90 56 49 68 73 80 60 93 70 108 34 121 46 136 30 148 68 162 57 176 67 190 37 203 44 217 21 231 45 244 35 260 53 274 36 287 47H300"
          />
          <path className="zero-monitor-sweep" d="M0 0V130" />
        </svg>
        <footer>
          <span>0000</span>
          <span>2400</span>
        </footer>
      </div>
    )
  else if (station === 9)
    scene = (
      <div className="zero-team-scene">
        <header>
          <span>◧</span>
          <span>◨</span>
          <span>◩</span>
          <code>run #42</code>
        </header>
        {['soup.yaml', 'quality.jsonl', './output'].map((file, index) => (
          <div key={file}>
            <span>0{index + 1}</span>
            <code>{file}</code>
            <i>✓</i>
          </div>
        ))}
        <span className="zero-team-diff">
          + + + + <i>− −</i>
        </span>
      </div>
    )
  else
    scene = (
      <div className="zero-token-scene">
        <header>
          llama-3.1-8b <span>▷</span>
        </header>
        <div className="zero-chat-prompt">
          <span>↳</span>
          <MiniLines count={2} />
        </div>
        <div className="zero-token-output">
          {Array.from({ length: 30 }, (_, index) => (
            <i
              key={index}
              style={
                {
                  '--token-index': index,
                  width: `${12 + ((index * 13) % 30)}px`,
                } as CSSProperties
              }
            />
          ))}
          <span>▋</span>
        </div>
        <footer>
          {c.stationPlayground}
          <span>→</span>
        </footer>
      </div>
    )
  return (
    <div
      className={`zero-station-scene zero-station-scene-${station} zero-scene-motion`}
      aria-hidden="true"
    >
      {scene}
    </div>
  )
}

/** A legible release pipeline and its artifacts, rather than a second model globe. */
export function ZeroPipelineScene({
  step,
  c,
}: {
  step: number
  c: ZeroContent
}) {
  const active = [0, 0, 1, 2, 3, 4, 4][step]
  return (
    <div className="zero-pipeline-scene zero-scene-motion" aria-hidden="true">
      <div className="zero-pipeline-track">
        {[
          c.openModel,
          c.stationData,
          c.stationTrain,
          c.stationEvals,
          c.stationDeploy,
        ].map((title, index) => (
          <div
            className={`zero-pipeline-node ${index === active ? 'is-active' : ''}`}
            key={title}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{title}</strong>
              <code>
                {
                  [
                    'llama-3.1-8b',
                    'support-tickets.jsonl',
                    'soup.yaml',
                    'quality.jsonl',
                    './output',
                  ][index]
                }
              </code>
            </div>
            <i>{index < active ? '✓' : index === active ? '→' : '·'}</i>
          </div>
        ))}
      </div>
      <div className="zero-pipeline-feedback">
        <span>↰</span>
        <i />
        <span>↵</span>
      </div>
      <div className="zero-artifact-ledger">
        <span>{c.sampleEvidence}</span>
        <code>
          soup.yaml <i>+</i> quality.jsonl <i>+</i> ./output
        </code>
      </div>
    </div>
  )
}
