import type { CSSProperties } from 'react'
import { PixelIcon } from '../PixelIcon'
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
        <i key={index} style={{ width: `${40 + ((index * 20) % 60)}%` }} />
      ))}
    </div>
  )
}

/** Bounded, square status cells shared by the decorative workspace scenes. */
function PixelMeter({ filled = 5 }: { filled?: number }) {
  return (
    <span className="zero-pixel-meter">
      {Array.from({ length: 7 }, (_, index) => (
        <i key={index} className={index < filled ? 'is-filled' : ''} />
      ))}
    </span>
  )
}

/** Six pixel tool windows converge along rails into a single workspace. */
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
              <i>
                <PixelIcon name="arrowUpRight" size={12} />
              </i>
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
                <div className="zero-tool-gpus">
                  <span>
                    GPU 0 <PixelMeter filled={5} />
                  </span>
                  <span>
                    GPU 1 <PixelMeter filled={3} />
                  </span>
                </div>
              ) : (
                <MiniLines count={index === 4 ? 4 : 5} />
              )}
            </div>
            <span className="zero-tool-outlet" />
          </div>
        ))}
      </div>
      <div className="zero-assembly-rails">
        <svg
          viewBox="0 0 100 330"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          <path d="M0 52H24V164H100M0 164H100M0 276H44V164" />
          <path
            className="zero-rail-pulse"
            d="M0 52H24V164H100M0 164H100M0 276H44V164"
            pathLength="100"
          />
          <g className="zero-rail-junctions">
            <rect x="20" y="48" width="8" height="8" />
            <rect x="20" y="160" width="8" height="8" />
            <rect x="40" y="160" width="8" height="8" />
            <rect x="40" y="272" width="8" height="8" />
            <rect x="76" y="160" width="8" height="8" />
          </g>
        </svg>
        <span>
          <PixelIcon name="arrowRight" size={20} />
        </span>
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
                    <i>
                      <PixelIcon name="check" size={10} />
                    </i>
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
              <PixelMeter />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Each station keeps its own content within a shared square-cell visual grammar. */
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
              <span>
                <PixelIcon name={index ? 'arrowUpRight' : 'file'} size={14} />
              </span>
            </header>
            <MiniLines count={6} />
            <div className="zero-prompt-result">
              {'{ }'}
              <i>
                <PixelIcon name="check" size={14} />
              </i>
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
        <div className="zero-context-rail">
          <PixelIcon name="arrowRight" size={20} />
        </div>
        <div className="zero-context-result">
          <span>
            <PixelIcon name="data" size={24} />
          </span>
          <MiniLines count={3} />
          <code>[0:128]</code>
        </div>
      </div>
    )
  else if (station === 4)
    scene = (
      <div className="zero-tools-scene">
        <div className="zero-tool-request">
          LLM
          <span>
            <PixelIcon name="arrowDown" size={16} />
          </span>
        </div>
        <div className="zero-tool-calls">
          {['MCP', 'CLI', 'API'].map((tool, index) => (
            <div key={tool}>
              <span>0{index + 1}</span>
              <strong>{tool}</strong>
              <i>
                <PixelIcon name="code" size={18} />
              </i>
            </div>
          ))}
        </div>
        <div className="zero-tool-return">
          <PixelIcon name="arrowRight" size={14} />{' '}
          <code>{'{ "result": "…" }'}</code>
        </div>
      </div>
    )
  else if (station === 8)
    scene = (
      <div className="zero-monitor-scene">
        <header>
          GPU / 000<span>24:00</span>
        </header>
        <svg viewBox="0 0 300 130" shapeRendering="crispEdges">
          <path
            className="zero-monitor-grid"
            d="M0 26H300M0 52H300M0 78H300M0 104H300M50 0V130M100 0V130M150 0V130M200 0V130M250 0V130"
          />
          <path
            className="zero-monitor-line"
            d="M0 80H20V72H32V88H44V48H56V72H68V60H80V68H96V36H108V44H124V28H136V68H148V56H164V64H176V36H192V44H204V20H216V44H232V36H244V52H260V36H276V48H300"
          />
          <g className="zero-monitor-pixels">
            {[
              [32, 88],
              [56, 72],
              [108, 44],
              [136, 68],
              [176, 36],
              [216, 44],
              [260, 36],
            ].map(([x, y]) => (
              <rect key={x} x={x - 3} y={y - 3} width="6" height="6" />
            ))}
          </g>
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
          <span>
            <PixelIcon name="users" size={16} />
          </span>
          <span>
            <PixelIcon name="network" size={16} />
          </span>
          <span>
            <PixelIcon name="shield" size={16} />
          </span>
          <code>run #42</code>
        </header>
        {['soup.yaml', 'quality.jsonl', './output'].map((file, index) => (
          <div key={file}>
            <span>0{index + 1}</span>
            <code>{file}</code>
            <i>
              <PixelIcon name="check" size={12} />
            </i>
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
          llama-3.1-8b{' '}
          <span>
            <PixelIcon name="play" size={14} />
          </span>
        </header>
        <div className="zero-chat-prompt">
          <span>
            <PixelIcon name="chat" size={18} />
          </span>
          <MiniLines count={2} />
        </div>
        <div className="zero-token-output">
          {Array.from({ length: 30 }, (_, index) => (
            <i
              key={index}
              style={
                {
                  '--token-index': index,
                  width: `${12 + ((index * 12) % 36)}px`,
                } as CSSProperties
              }
            />
          ))}
          <span>▋</span>
        </div>
        <footer>
          {c.stationPlayground}
          <span>
            <PixelIcon name="arrowRight" size={14} />
          </span>
        </footer>
      </div>
    )
  return (
    <div
      className={`zero-station-scene zero-station-scene-${station} zero-scene-motion`}
      data-scene-paused={paused || undefined}
      data-scene-static={instant || undefined}
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
            <i>
              {index <= active ? (
                <PixelIcon
                  name={index < active ? 'check' : 'arrowRight'}
                  size={16}
                />
              ) : (
                '·'
              )}
            </i>
          </div>
        ))}
      </div>
      <div className="zero-pipeline-feedback">
        <span>
          <PixelIcon name="arrowRight" size={16} />
        </span>
        <i />
        <span>
          <PixelIcon name="arrowRight" size={16} />
        </span>
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
