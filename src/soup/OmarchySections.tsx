import { useContext, useId, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { CardRail } from '@/components/CardRail'
import { SectionHeading } from '@/components/SectionHeading'
import { PixelModelIcon } from './ecosystem/PixelToolIcon'
import type { Messages } from './catalogue'
import { SoupLocaleContext } from './SoupLocaleContext'
import { localePath } from './locales'
import './omarchy-sections.css'

// The section rhythm, install columns and responsive CardRail come from the
// original Omarchy homepage. Soup's diagrams and examples replace its media.
const SOURCE = 'https://github.com/MakazhanAlpamys/Soup'
type Props = { m: Messages }

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function DocLink({
  children,
  href,
  slug = '',
}: {
  children: ReactNode
  href?: string
  slug?: string
}) {
  const language = useContext(SoupLocaleContext)
  return (
    <a className="os-link" href={href ?? `${localePath(language)}docs/${slug}`}>
      {children}
      <Arrow />
    </a>
  )
}

function Window({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`os-window ${className}`}>
      <div className="os-window-bar">
        <code>{title}</code>
      </div>
      {children}
    </div>
  )
}

function Yaml({
  value,
  numbered = true,
}: {
  value: string
  numbered?: boolean
}) {
  return (
    <pre className={`os-code ${numbered ? 'os-code-numbered' : ''}`} dir="ltr">
      <code>
        {value.split('\n').map((line, index) => {
          const match = /^(\s*)([\w-]+:)(.*)$/.exec(line)
          return (
            <span className="os-code-line" key={index}>
              {numbered && (
                <span className="os-line-no" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              {match ? (
                <>
                  {match[1]}
                  <span className="os-syntax-key">{match[2]}</span>
                  <span className="os-syntax-value">{match[3]}</span>
                </>
              ) : (
                <span
                  className={
                    line.trim().startsWith('#') ? 'os-syntax-comment' : ''
                  }
                >
                  {line || ' '}
                </span>
              )}
            </span>
          )
        })}
      </code>
    </pre>
  )
}

function Shell({ lines }: { lines: string[] }) {
  return (
    <pre className="os-shell" dir="ltr">
      <code>
        {lines.map((line, index) => (
          <span key={index}>
            <b aria-hidden="true">$ </b>
            {line}
          </span>
        ))}
      </code>
    </pre>
  )
}

function Copy({ command, m }: { command: string; m: Messages }) {
  const [status, setStatus] = useState<'idle' | 'done' | 'failed'>('idle')
  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }
  return (
    <div className="os-copy-row">
      <code dir="ltr">{command}</code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={m.copy}
        title={m.copy}
      >
        {status === 'done' ? '✓' : '⧉'}
      </button>
      <span role="status" className="sr-only">
        {status === 'done' ? m.copied : status === 'failed' ? m.copyFailed : ''}
      </span>
    </div>
  )
}

export function SoupAbout({ m }: Props) {
  return (
    <section id="about" className="os-section os-about">
      <div className="os-wrap os-about-grid">
        <div className="os-prose">
          <SectionHeading title={m.aboutTitle} />
          <p>{m.aboutDescription}</p>
          <p>{m.aboutNote}</p>
          <DocLink>{m.navDocs}</DocLink>
          <div className="os-about-tags">
            <span>Apache-2.0</span>
            <span>Python</span>
            <span>CLI + MCP</span>
          </div>
        </div>
        <Window title="soup.yaml" className="os-about-config">
          <Yaml
            value={
              'base: meta-llama/Llama-3.1-8B-Instruct\ntask: sft\n\ndata:\n  train: ./data/train.jsonl\n  format: alpaca\n\ntraining:\n  epochs: 3\n  lr: 2e-5\n  quantization: 4bit\n  lora:\n    r: 64\n    alpha: 16\n\noutput: ./output'
            }
          />
          <div className="os-window-foot">
            <span>{m.terminalExample}</span>
            <span>YAML</span>
          </div>
        </Window>
      </div>
    </section>
  )
}

export function SoupInstall({ m }: Props) {
  return (
    <section id="install" className="os-section os-install">
      <div className="os-wrap">
        <SectionHeading
          title={m.installTitle}
          description={m.installDescription}
          action={<DocLink>{m.navDocs}</DocLink>}
        />
        <div className="os-install-grid">
          <div className="os-install-package">
            <div className="os-package-icon" aria-hidden="true">
              ⌁
            </div>
            <span className="os-kicker">Python / PyPI</span>
            <h3>{m.installStep1}</h3>
            <p>{m.heroNote}</p>
            <Copy command={'pip install "soup-cli[train]"'} m={m} />
            <div className="os-package-extras" dir="ltr">
              <code>[train]</code>
              <code>[mlx]</code>
              <code>[vision]</code>
              <code>[audio]</code>
              <code>[all]</code>
            </div>
            <DocLink href="https://pypi.org/project/soup-cli/">
              soup-cli
            </DocLink>
          </div>
          <div className="os-install-steps">
            {[
              {
                number: '02',
                title: m.installStep2,
                description: m.descConfig,
                command: 'soup init --template chat',
                file: 'soup.yaml',
              },
              {
                number: '03',
                title: m.installStep3,
                description: m.descTrain,
                command: 'soup train --config soup.yaml',
                file: './output',
              },
            ].map((step) => (
              <div className="os-install-step" key={step.number}>
                <span className="os-step-index">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <Copy command={step.command} m={m} />
                  <span className="os-file-output" dir="ltr">
                    ↳ {step.file}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const METHODS = [
  {
    name: 'SFT',
    task: 'sft',
    file: 'train.jsonl',
    format: 'alpaca',
    sample: '{"instruction": "2 + 2",\n "input": "",\n "output": "4"}',
    config: '',
  },
  {
    name: 'DPO',
    task: 'dpo',
    file: 'prefs.jsonl',
    format: 'dpo',
    sample: '{"prompt": "2 + 2 = ?",\n "chosen": "4",\n "rejected": "5"}',
    config: '',
  },
  {
    name: 'GRPO',
    task: 'grpo',
    file: 'reasoning.jsonl',
    format: 'auto',
    sample: '{"prompt": "2 + 2 = ?",\n "answer": "4"}',
    config: '\n  reward_fn: accuracy',
  },
] as const

export function SoupMethods({ m }: Props) {
  const [active, setActive] = useState(0)
  const id = useId()
  const method = METHODS[active]
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % METHODS.length
    else if (event.key === 'ArrowLeft')
      next = (index + METHODS.length - 1) % METHODS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = METHODS.length - 1
    else return
    event.preventDefault()
    setActive(next)
    document.getElementById(`${id}-method-${next}`)?.focus()
  }
  return (
    <section id="methods" className="os-section os-deep">
      <div className="os-wrap">
        <SectionHeading
          title={m.methodsTitle}
          description={m.methodsDescription}
          action={<DocLink>{m.navDocs}</DocLink>}
        />
        <div className="os-method-browser">
          <div className="os-method-toolbar">
            <div role="tablist" aria-label={m.methodsTitle}>
              {METHODS.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  id={`${id}-method-${index}`}
                  aria-selected={active === index}
                  aria-controls={`${id}-panel`}
                  tabIndex={active === index ? 0 : -1}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  onClick={() => setActive(index)}
                >
                  <span className="os-tab-light" />
                  {item.name}
                </button>
              ))}
            </div>
            <span className="os-method-path" dir="ltr">
              ~/soup / {method.task}
            </span>
          </div>
          <div
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-method-${active}`}
            className="os-method-columns"
          >
            <div className="os-method-data">
              <div className="os-pane-head">
                01 <span>{m.stepData}</span>
                <span>.jsonl</span>
              </div>
              <div className="os-dataset-icon" aria-hidden="true">
                <i />
                <i />
                <i />
                <b>{'{ }'}</b>
              </div>
              <code className="os-sample-file">{method.file}</code>
              <pre dir="ltr">{method.sample}</pre>
              <p>{m.descData}</p>
            </div>
            <div className="os-method-editor">
              <div className="os-pane-head">
                02 <span>{m.stepConfig}</span>
                <span>soup.yaml</span>
              </div>
              <Yaml
                value={`base: Qwen/Qwen2.5-3B\ntask: ${method.task}\n\ndata:\n  train: ./data/${method.file}\n  format: ${method.format}\n  max_length: 512\n\ntraining:\n  epochs: 3\n  lr: 2e-5${method.config}\n  quantization: 4bit\n  lora:\n    r: 16\n\noutput: ./output`}
              />
            </div>
            <div className="os-method-run">
              <div className="os-pane-head">
                03 <span>{m.stepTrain}</span>
                <span>CLI</span>
              </div>
              <Shell
                lines={[
                  'soup doctor --config soup.yaml',
                  'soup train --config soup.yaml',
                  'soup chat --model ./output',
                ]}
              />
              <div className="os-run-route" dir="ltr">
                <code>{method.file}</code>
                <span>↓</span>
                <code>soup.yaml</code>
                <span>↓</span>
                <strong>LoRA</strong>
                <span>↓</span>
                <code>./output</code>
              </div>
              <div className="os-run-backends">
                <span>PyTorch</span>
                <span>MLX</span>
                <span>Unsloth</span>
              </div>
            </div>
          </div>
          <div className="os-window-foot">
            <span>{m.terminalExample}</span>
            <span>SFT · DPO · GRPO · PPO · KTO · ORPO · SimPO · IPO · BCO</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function DataWorkbench() {
  return (
    <Window title="soup data" className="os-data-workbench">
      <Shell
        lines={[
          'soup data inspect ./data/train.jsonl',
          'soup data doctor ./data/train.jsonl',
        ]}
      />
      <div className="os-data-table" dir="ltr">
        <div>
          <code>train.jsonl</code>
          <span>Alpaca</span>
          <span>JSONL</span>
        </div>
        <div>
          <code>preferences.jsonl</code>
          <span>DPO</span>
          <span>JSONL</span>
        </div>
        <div>
          <code>traces.parquet</code>
          <span>ChatML</span>
          <span>Parquet</span>
        </div>
        <div>
          <code>documents.csv</code>
          <span>auto</span>
          <span>CSV</span>
        </div>
      </div>
    </Window>
  )
}

function TrainWorkbench({ m }: Props) {
  return (
    <Window title="soup train">
      <div className="os-hardware-top" dir="ltr">
        <div>
          <span>NVIDIA</span>
          <strong>CUDA</strong>
        </div>
        <div>
          <span>Apple Silicon</span>
          <strong>MLX</strong>
        </div>
        <div>
          <span>PyTorch</span>
          <strong>CPU</strong>
        </div>
      </div>
      <div className="os-memory-map" dir="ltr">
        <div className="os-memory-source">
          <code>RAM / NVMe</code>
          <div>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i}>L{String(i).padStart(2, '0')}</span>
            ))}
          </div>
        </div>
        <span className="os-memory-arrow">→</span>
        <div className="os-memory-gpu">
          <code>GPU</code>
          <div>
            <span>
              W<sub>frozen</sub>
            </span>
            <b>+</b>
            <span>LoRA</span>
          </div>
        </div>
      </div>
      <div className="os-training-chips">
        <code>LoRA</code>
        <code>QLoRA</code>
        <code>DeepSpeed</code>
        <code>FSDP</code>
        <code>4-bit</code>
      </div>
      <div className="os-window-foot">
        <span>{m.streamNote}</span>
      </div>
    </Window>
  )
}

function ShipWorkbench({ m }: Props) {
  return (
    <Window title="soup ship">
      <div className="os-release-flow" dir="ltr">
        <div>
          <span className="os-artifact">▤</span>
          <code>eval-suite.yaml</code>
        </div>
        <span>+</span>
        <div>
          <span className="os-artifact">◈</span>
          <code>./output</code>
        </div>
        <span>→</span>
        <div>
          <span className="os-artifact os-artifact-check">⌁</span>
          <code>soup ship</code>
        </div>
      </div>
      <div className="os-gate-list">
        {[m.evalFeature1, m.evalFeature2, m.evalFeature3].map((text, index) => (
          <div key={text}>
            <span>0{index + 1}</span>
            <p>{text}</p>
            <span aria-hidden="true">◇</span>
          </div>
        ))}
      </div>
      <div className="os-release-result" dir="ltr">
        <span>SHIP</span>
        <i />
        <span>DON’T SHIP</span>
      </div>
      <div className="os-window-foot">
        <span>{m.terminalExample}</span>
        <span>weights.safetensors + evidence.json</span>
      </div>
    </Window>
  )
}

function OperateWorkbench() {
  return (
    <Window title="soup / adapters">
      <div className="os-adapter-graph" dir="ltr">
        <div className="os-graph-node">
          <span>●</span>
          <code>base</code>
          <i />
        </div>
        <div className="os-graph-branches">
          <div>
            <span>●</span>
            <code>adapter / v1</code>
            <i />
          </div>
          <div>
            <span>●</span>
            <code>adapter / v2</code>
            <i />
          </div>
          <div>
            <span>●</span>
            <code>adapter / v3</code>
            <i />
          </div>
        </div>
        <div className="os-graph-node os-graph-merge">
          <span>◇</span>
          <code>diff · compare · merge</code>
        </div>
      </div>
      <div className="os-lockfile" dir="ltr">
        <code>soup.lock</code>
        <div>
          <span>base</span>
          <b>sha256: 93a…</b>
        </div>
        <div>
          <span>dataset</span>
          <b>sha256: 2b7…</b>
        </div>
        <div>
          <span>environment</span>
          <b>sha256: a4c…</b>
        </div>
      </div>
    </Window>
  )
}

function SecureWorkbench() {
  return (
    <Window title="soup / provenance">
      <div className="os-provenance" dir="ltr">
        <div>
          <code>model-bom.json</code>
          <code>provenance.json</code>
          <code>attestation.sig</code>
          <code>soup.lock</code>
        </div>
      </div>
      <div className="os-ci-flow" dir="ltr">
        <span>Git</span>
        <i />
        <span>CI</span>
        <i />
        <span>soup ship</span>
        <i />
        <span>model</span>
      </div>
    </Window>
  )
}

export function SoupWorkbench({ m }: Props) {
  const blocks = [
    {
      id: 'data-workbench',
      doc: 'data-moat-ii',
      title: m.dataDeepTitle,
      description: m.dataDeepDescription,
      visual: <DataWorkbench />,
      chips: [
        'JSONL',
        'JSON',
        'CSV',
        'Parquet',
        'Alpaca',
        'ShareGPT',
        'ChatML',
        'DPO',
      ],
      link: m.dataLink,
    },
    {
      id: 'training-workbench',
      doc: 'layer-streaming',
      title: m.trainDeepTitle,
      description: m.trainDeepDescription,
      visual: <TrainWorkbench m={m} />,
      chips: ['LoRA', 'DoRA', 'rsLoRA', 'PiSSA', 'QLoRA', 'Spectrum', 'LISA'],
      link: m.streamLink,
    },
    {
      id: 'release-workbench',
      doc: 'soup-ship',
      title: m.shipDeepTitle,
      description: m.shipDeepDescription,
      visual: <ShipWorkbench m={m} />,
      chips: ['GGUF', 'ONNX', 'TensorRT', 'Hugging Face', 'vLLM', 'Ollama'],
      link: m.evalLink,
    },
    {
      id: 'operate-workbench',
      doc: 'adapter-lifecycle',
      title: m.operateTitle,
      description: m.operateDescription,
      visual: <OperateWorkbench />,
      chips: [
        'diff',
        'merge',
        'bisect',
        'lockfile',
        'Weights & Biases',
        'MLflow',
      ],
      link: m.navDocs,
    },
    {
      id: 'secure-workbench',
      doc: 'governance',
      title: m.secureTitle,
      description: m.secureDescription,
      visual: <SecureWorkbench />,
      chips: ['BOM', 'SHA-256', 'CI', 'MCP', 'Apache-2.0'],
      link: m.navDocs,
    },
  ]
  return (
    <div id="workbench" className="os-workbench">
      {blocks.map((block, index) => (
        <section
          id={block.id}
          key={block.id}
          className={`os-section ${index % 2 ? 'os-deep' : ''}`}
        >
          <div
            className={`os-wrap os-feature-grid ${index % 2 ? 'os-feature-reverse' : ''}`}
          >
            <div className="os-prose">
              <SectionHeading title={block.title} />
              <p>{block.description}</p>
              <p className="os-capability-index">
                <code>{block.chips.join(' / ')}</code>
              </p>
              <DocLink slug={block.doc}>{block.link}</DocLink>
            </div>
            <div className="os-feature-visual">{block.visual}</div>
          </div>
        </section>
      ))}
    </div>
  )
}

const RECIPES = [
  {
    name: 'Llama · SFT',
    file: 'chat.yaml',
    command: 'soup init --template chat',
    code: 'base: meta-llama/Llama-3.1-8B-Instruct\ntask: sft\n\ndata:\n  train: ./data/chat.jsonl\n  format: alpaca\n\ntraining:\n  epochs: 3\n  quantization: 4bit\n  lora:\n    r: 64\n\noutput: ./output/chat',
    format: 'Alpaca / ChatML',
    model: 'llama' as const,
    color: '#97b7cf',
  },
  {
    name: 'Qwen · DPO',
    file: 'preferences.yaml',
    command: 'soup train --config preferences.yaml',
    code: 'base: Qwen/Qwen2.5-3B\ntask: dpo\n\ndata:\n  train: ./data/prefs.jsonl\n  format: dpo\n  max_length: 512\n\ntraining:\n  quantization: 4bit\n  lora:\n    r: 16\n\noutput: ./output/preferences',
    format: 'prompt / chosen / rejected',
    model: 'qwen' as const,
    color: '#b2a0d4',
  },
  {
    name: 'Qwen · VLM',
    file: 'vision.yaml',
    command: 'soup init --template vision',
    code: 'base: Qwen/Qwen2.5-VL-3B-Instruct\ntask: sft\nmodality: vision\n\ndata:\n  train: ./data/vision.jsonl\n  format: llava\n  image_dir: ./data/images\n\ntraining:\n  epochs: 3\n  lr: 1e-5\n  lora:\n    r: 16\n\noutput: ./output/vision',
    format: 'LLaVA / ShareGPT',
    model: 'qwen' as const,
    color: '#8db6a1',
  },
  {
    name: 'Whisper · ASR',
    file: 'audio.yaml',
    command: 'soup init --template audio',
    code: 'base: openai/whisper-tiny\ntask: asr\n\ndata:\n  train: ./data/audio.jsonl\n  format: asr\n  audio_dir: ./data/audio\n\ntraining:\n  epochs: 3\n  lr: 1e-4\n  batch_size: 2\n  asr_lora: true\n  quantization: none\n\noutput: ./output/audio',
    format: 'ASR / WAV / JSONL',
    model: 'whisper' as const,
    color: '#d4b282',
  },
]

export function SoupRecipes({ m }: Props) {
  return (
    <section id="recipes" className="os-section os-deep">
      <div className="os-wrap">
        <SectionHeading
          title={m.recipesTitle}
          description={m.recipesDescription}
          action={<DocLink>{m.navDocs}</DocLink>}
        />
        <CardRail className="os-recipe-rail sm:grid-cols-2 lg:grid-cols-2">
          {RECIPES.map((recipe) => (
            <article
              className="os-recipe"
              key={recipe.file}
              style={{ '--recipe-color': recipe.color } as CSSProperties}
            >
              <div className="os-recipe-identity">
                <span aria-hidden="true">
                  <PixelModelIcon model={recipe.model} size={28} />
                </span>
                <div>
                  <h3>{recipe.name}</h3>
                  <code>{recipe.file}</code>
                </div>
              </div>
              <div className="os-recipe-editor">
                <div className="os-recipe-file">
                  <span aria-hidden="true">≡</span>
                  {recipe.file}
                  <span>YAML</span>
                </div>
                <Yaml value={recipe.code} numbered={false} />
              </div>
              <div className="os-recipe-meta">
                <code>{recipe.format}</code>
                <span>{m.terminalExample}</span>
              </div>
              <div className="os-recipe-command" dir="ltr">
                <code>$ {recipe.command}</code>
              </div>
            </article>
          ))}
        </CardRail>
        <div className="os-recipes-bottom">
          <code dir="ltr">$ soup recipes list</code>
          <DocLink>{m.navDocs}</DocLink>
        </div>
      </div>
    </section>
  )
}

const MODEL_GROUPS = [
  [
    { name: 'Llama', model: 'llama' as const, color: '#9ab8d4' },
    { name: 'Gemma', model: 'gemma' as const, color: '#93bdb6' },
  ],
  [
    { name: 'Qwen', model: 'qwen' as const, color: '#b5a2da' },
    { name: 'DeepSeek', model: 'deepseek' as const, color: '#8aa9d3' },
  ],
  [
    { name: 'Mistral', model: 'mistral' as const, color: '#dbb087' },
    { name: 'Phi', model: 'phi' as const, color: '#95b9c2' },
  ],
  [
    { name: 'Whisper', model: 'whisper' as const, color: '#c2b58c' },
    { name: 'Hugging Face', model: 'huggingface' as const, color: '#d2ba82' },
  ],
]

function CommunityIcon({
  type,
}: {
  type: 'source' | 'chat' | 'paper' | 'tasters'
}) {
  const paths = {
    source: (
      <>
        <path d="m9 7-5 5 5 5m6-10 5 5-5 5m-2-14-2 18" />
      </>
    ),
    chat: (
      <>
        <path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
    paper: (
      <>
        <path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" />
      </>
    ),
    tasters: (
      <>
        <path d="M4 12h16a8 8 0 0 1-16 0ZM2 12h20M8 8c-3-3 3-3 0-6m8 6c-3-3 3-3 0-6M8 21h8" />
      </>
    ),
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  )
}

export function SoupModelsCommunity({ m }: Props) {
  const community = [
    {
      type: 'source' as const,
      brand: 'GitHub',
      title: m.communityGithub,
      href: SOURCE,
    },
    {
      type: 'chat' as const,
      brand: 'Discord',
      title: m.communityDiscord,
      href: 'https://discord.gg/dgd2pJcjwP',
    },
    {
      type: 'paper' as const,
      brand: 'Zenodo',
      title: m.communityPaper,
      href: 'https://doi.org/10.5281/zenodo.21918325',
    },
    {
      type: 'tasters' as const,
      brand: 'Soup Tasters',
      title: m.communityTasters,
      href: 'https://t.me/souptasters',
    },
  ]
  return (
    <>
      <section id="models" className="os-section">
        <div className="os-wrap">
          <SectionHeading
            title={m.modelsTitle}
            description={m.modelsDescription}
          />
          <div className="os-model-clusters">
            {MODEL_GROUPS.map((group, index) => (
              <div className="os-model-cluster" key={index}>
                <div className="os-model-faces">
                  {group.map((model) => (
                    <a
                      key={model.name}
                      className="os-model-face"
                      href="https://huggingface.co/models"
                      style={{ '--model-color': model.color } as CSSProperties}
                      aria-label={model.name}
                    >
                      <PixelModelIcon model={model.model} size={40} />
                    </a>
                  ))}
                </div>
                <p>{group.map((model) => model.name).join(' / ')}</p>
                <code>
                  {
                    [
                      'AutoModelForCausalLM',
                      'SFT · DPO · GRPO',
                      'LoRA · QLoRA',
                      'ASR · Transformers',
                    ][index]
                  }
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="community" className="os-section os-deep">
        <div className="os-wrap">
          <SectionHeading
            title={m.communityTitle}
            description={m.communityDescription}
          />
          <CardRail className="os-community-rail sm:grid-cols-2 lg:grid-cols-4">
            {community.map((item) => (
              <a
                className="os-community-card"
                key={item.brand}
                href={item.href}
              >
                <CommunityIcon type={item.type} />
                <h3>{item.brand}</h3>
                <p>{item.title}</p>
                <span className="os-community-arrow">
                  <Arrow />
                </span>
              </a>
            ))}
          </CardRail>
        </div>
      </section>
      <section id="faq" className="os-section">
        <div className="os-wrap os-faq-grid">
          <SectionHeading title={m.faqTitle} />
          <div className="os-faq-list">
            {[
              [m.faq1q, m.faq1a],
              [m.faq2q, m.faq2a],
              [m.faq3q, m.faq3a],
              [m.faq4q, m.faq4a],
            ].map(([question, answer], index) => (
              <details key={question}>
                <summary>
                  <span className="os-faq-number">0{index + 1}</span>
                  <span>{question}</span>
                  <span className="os-faq-toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
