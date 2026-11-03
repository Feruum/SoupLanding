import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import type { Messages } from '../catalogue'
import { localePath } from '../locales'
import english from './content.en.json'
import { PixelToolIcon } from './PixelToolIcon'
import type { PixelTool } from './PixelToolIcon'
import './ecosystem.css'

export { PixelToolIcon, PixelModelIcon } from './PixelToolIcon'
export type { PixelTool, PixelModel, PixelResolution } from './PixelToolIcon'
export type EcosystemMessages = typeof english
type CopyKey = keyof EcosystemMessages


type Tool = {
  id: PixelTool
  name: string
  href: string
  copy: CopyKey
  tags?: { name: string; href: string; icon?: PixelTool }[]
}

// Scope and capabilities checked against Soup's published integration list and
// the matching data, serving/export, backend and quantization references.
const GROUPS: { title: CopyKey; tools: Tool[] }[] = [
  {
    title: 'ecosysDeployTitle',
    tools: [
      {
        id: 'ollama',
        name: 'Ollama',
        href: 'https://ollama.com/',
        copy: 'ecosysOllama',
      },
      {
        id: 'vllm',
        name: 'vLLM',
        href: 'https://docs.vllm.ai/',
        copy: 'ecosysVllm',
      },
      {
        id: 'sglang',
        name: 'SGLang',
        href: 'https://docs.sglang.ai/',
        copy: 'ecosysSglang',
      },
      {
        id: 'llamacpp',
        name: 'llama.cpp',
        href: 'https://github.com/ggml-org/llama.cpp',
        copy: 'ecosysLlamacpp',
      },
    ],
  },
  {
    title: 'ecosysTrainingTitle',
    tools: [
      {
        id: 'unsloth',
        name: 'Unsloth',
        href: 'https://unsloth.ai/',
        copy: 'ecosysUnsloth',
      },
      {
        id: 'mlx',
        name: 'Apple MLX',
        href: 'https://ml-explore.github.io/mlx/',
        copy: 'ecosysMlx',
      },
      {
        id: 'deepspeed',
        name: 'DeepSpeed',
        href: 'https://www.deepspeed.ai/',
        copy: 'ecosysDeepspeed',
      },
      {
        id: 'flashattention',
        name: 'FlashAttention',
        href: 'https://github.com/Dao-AILab/flash-attention',
        copy: 'ecosysFlashattention',
      },
    ],
  },
  {
    title: 'ecosysToolsTitle',
    tools: [
      {
        id: 'huggingface',
        name: 'Hugging Face',
        href: 'https://huggingface.co/',
        copy: 'ecosysHuggingface',
      },
      {
        id: 'openai',
        name: 'OpenAI API',
        href: 'https://platform.openai.com/docs/api-reference',
        copy: 'ecosysOpenai',
      },
      {
        id: 'weightsandbiases',
        name: 'Weights & Biases',
        href: 'https://wandb.ai/',
        copy: 'ecosysWandb',
        tags: [
          { name: 'MLflow', href: 'https://mlflow.org/', icon: 'mlflow' },
          { name: 'SwanLab', href: 'https://swanlab.cn/en', icon: 'swanlab' },
          {
            name: 'Trackio',
            href: 'https://huggingface.co/docs/trackio/index',
            icon: 'trackio',
          },
        ],
      },
      {
        id: 'tensorboard',
        name: 'TensorBoard',
        href: 'https://www.tensorflow.org/tensorboard',
        copy: 'ecosysTensorboard',
      },
    ],
  },
  {
    title: 'ecosysQuantTitle',
    tools: [
      {
        id: 'gguf',
        name: 'GGUF',
        href: 'https://github.com/ggml-org/ggml/blob/master/docs/gguf.md',
        copy: 'ecosysGguf',
        tags: [
          {
            name: 'UD',
            href: 'https://docs.unsloth.ai/basics/unsloth-dynamic-2.0-ggufs',
          },
          { name: 'IQ', href: 'https://github.com/ggml-org/llama.cpp' },
          { name: 'ARM', href: 'https://github.com/ggml-org/llama.cpp' },
        ],
      },
      {
        id: 'onnx',
        name: 'ONNX',
        href: 'https://onnxruntime.ai/',
        copy: 'ecosysOnnx',
      },
      {
        id: 'tensorrt',
        name: 'NVIDIA TensorRT',
        href: 'https://developer.nvidia.com/tensorrt',
        copy: 'ecosysTensorrt',
      },
      {
        id: 'hqq',
        name: 'HQQ / AQLM',
        href: 'https://github.com/mobiusml/hqq',
        copy: 'ecosysHqq',
        tags: [
          {
            name: 'AQLM',
            href: 'https://github.com/Vahe1994/AQLM',
            icon: 'aqlm',
          },
          { name: 'EETQ', href: 'https://github.com/NetEase-FuXi/EETQ' },
          {
            name: 'MXFP4',
            href: 'https://github.com/MakazhanAlpamys/Soup/blob/main/docs/performance-and-quantization.md',
          },
          {
            name: 'FP8',
            href: 'https://github.com/MakazhanAlpamys/Soup/blob/main/docs/performance-and-quantization.md',
          },
          {
            name: 'NVFP4',
            href: 'https://github.com/MakazhanAlpamys/Soup/blob/main/docs/performance-and-quantization.md',
          },
        ],
      },
    ],
  },
]

const MARQUEE = [
  'huggingface',
  'ollama',
  'vllm',
  'deepspeed',
  'unsloth',
  'onnx',
  'tensorrt',
  'weightsandbiases',
  'sglang',
  'flashattention',
  'mlx',
  'llamacpp',
  'openai',
  'tensorboard',
  'gguf',
  'hqq',
].map((id) =>
  GROUPS.flatMap((group) => group.tools).find((tool) => tool.id === id)!,
)

const TRACE_SOURCES: {
  id: PixelTool
  source: string
  name: string
  file: string
  href: string
}[] = [
  {
    id: 'langfuse',
    source: 'langfuse',
    name: 'Langfuse',
    file: './langfuse-export.jsonl',
    href: 'https://langfuse.com/',
  },
  {
    id: 'langsmith',
    source: 'langsmith',
    name: 'LangSmith',
    file: './langsmith-runs.jsonl',
    href: 'https://www.langchain.com/langsmith',
  },
  {
    id: 'helicone',
    source: 'helicone',
    name: 'Helicone',
    file: './helicone-requests.jsonl',
    href: 'https://www.helicone.ai/',
  },
  {
    id: 'openpipe',
    source: 'openpipe',
    name: 'OpenPipe',
    file: './openpipe-export.jsonl',
    href: 'https://openpipe.ai/',
  },
  {
    id: 'opentelemetry',
    source: 'otel',
    name: 'OpenTelemetry',
    file: './otel-spans.jsonl',
    href: 'https://opentelemetry.io/',
  },
  {
    id: 'openai-stored',
    source: 'openai-stored',
    name: 'OpenAI Stored Completions',
    file: './oai-stored-completions.jsonl',
    href: 'https://platform.openai.com/docs/api-reference/chat/list',
  },
]

function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 10 10 2M3 2h7v7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function SoupEcosystem({
  m,
  language,
}: {
  m: Messages
  language: string
}) {
  const SOUP_DOCS = `${localePath(language)}docs/`
  const TRACE_GUIDE = `${localePath(language)}docs/trace-ecosystem/#soup-ingest-universal-trace-importer`
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const id = useId()
  const extended = m as Messages & Partial<EcosystemMessages>
  const copy = (key: CopyKey) => extended[key] || english[key]
  const source = TRACE_SOURCES[selected]
  const command = `soup ingest --source ${source.source} --logs ${source.file} --output traces.jsonl`

  function chooseSource(index: number) {
    setSelected(index)
    setCopyFailed(false)
  }
  function onSourceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % TRACE_SOURCES.length
    else if (event.key === 'ArrowLeft')
      next = (index + TRACE_SOURCES.length - 1) % TRACE_SOURCES.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TRACE_SOURCES.length - 1
    else return
    event.preventDefault()
    chooseSource(next)
    document.getElementById(`${id}-source-${next}`)?.focus()
  }
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(command)
      setCopyFailed(false)
    } catch {
      setCopyFailed(true)
    }
  }

  return (
    <section className="soup-ecosystem" id="ecosystem" lang={language}>
      <div className="se-wrap se-heading">
        <SectionHeading
          title={m.ecosystemTitle}
          description={m.ecosystemDescription}
          action={
            <a href={SOUP_DOCS} className="se-doc-link">
              {m.navDocs}
              <ExternalArrow />
            </a>
          }
        />
      </div>

      <div className="se-marquee" data-paused={paused || undefined}>
        {/* The accessible, stable links are in the directory below. */}
        <div className="se-marquee-window" dir="ltr" aria-hidden="true">
          <div className="se-marquee-track">
            {[0, 1].map((repeat) => (
              <div
                className="se-marquee-sequence"
                key={repeat}
                aria-hidden={repeat === 1 ? true : undefined}
              >
                {MARQUEE.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    tabIndex={-1}
                    className="se-marquee-tool"
                  >
                    <PixelToolIcon tool={tool.id} size={40} />
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          className="se-motion-toggle"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          aria-label={copy(paused ? 'ecosysResume' : 'ecosysPause')}
          title={copy(paused ? 'ecosysResume' : 'ecosysPause')}
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            {paused ? (
              <path d="M4 2h2v2h2v2h2v2H8v2H6v2H4z" />
            ) : (
              <path d="M3 3h3v10H3zM10 3h3v10h-3z" />
            )}
          </svg>
        </button>
      </div>

      <div className="se-wrap se-content">
        <div className="se-traces">
          <div className="se-trace-copy">
            <span className="se-command-label" dir="ltr">
              soup ingest
            </span>
            <h3>{copy('ecosysTraceTitle')}</h3>
            <p>{copy('ecosysTraceDescription')}</p>
            <a href={TRACE_GUIDE} className="se-doc-link">
              {copy('ecosysTraceGuide')}
              <ExternalArrow />
            </a>
          </div>
          <div className="se-trace-workbench">
            <div
              className="se-source-tabs"
              role="tablist"
              aria-label={copy('ecosysSelectedSource')}
              dir="ltr"
            >
              {TRACE_SOURCES.map((provider, index) => (
                <button
                  id={`${id}-source-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === selected}
                  aria-controls={`${id}-trace-command`}
                  tabIndex={index === selected ? 0 : -1}
                  key={provider.source}
                  onClick={() => chooseSource(index)}
                  onKeyDown={(event) => onSourceKeyDown(event, index)}
                >
                  <PixelToolIcon tool={provider.id} size={25} />
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
            <div
              className="se-trace-panel"
              id={`${id}-trace-command`}
              role="tabpanel"
              aria-labelledby={`${id}-source-${selected}`}
            >
              <div className="se-trace-route" dir="ltr">
                <div>
                  <PixelToolIcon tool={source.id} size={32} />
                  <span>{copy('ecosysExportFile')}</span>
                </div>
                <span className="se-route-connector" aria-hidden="true" />
                <div>
                  <span className="se-json-mark" aria-hidden="true">
                    {'{ }'}
                  </span>
                  <span>{copy('ecosysNormalizedFile')}</span>
                </div>
              </div>
              <div className="se-ingest-command" dir="ltr">
                <pre>
                  <code>
                    <span aria-hidden="true">$ </span>
                    {command}
                  </code>
                </pre>
                <button
                  type="button"
                  onClick={() => void copyCommand()}
                  aria-label={m.copy}
                  title={m.copy}
                >
                  {copied === command ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6h8v8H6zM3 10H2V2h8v1"
                        stroke="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="se-trace-foot">
                <p>{copy('ecosysTraceNote')}</p>
                <a href={source.href}>
                  {source.name}
                  <ExternalArrow />
                </a>
              </div>
              <span className="sr-only" role="status">
                {copyFailed ? m.copyFailed : copied === command ? m.copied : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="se-tool-groups">
          {GROUPS.map((group, index) => (
            <div className="se-tool-group" key={group.title}>
              <h3>
                <span aria-hidden="true">0{index + 1}</span>
                {copy(group.title)}
              </h3>
              <ul>
                {group.tools.map((tool) => (
                  <li key={tool.id}>
                    <a href={tool.href} className="se-tool-primary">
                      <PixelToolIcon tool={tool.id} size={36} />
                      <div>
                        <h4>{tool.name}</h4>
                        <p>{copy(tool.copy)}</p>
                      </div>
                      <ExternalArrow />
                    </a>
                    {tool.tags && (
                      <div className="se-tool-tags">
                        {tool.tags.map((tag) => (
                          <a key={tag.name} href={tag.href}>
                            {tag.icon && (
                              <PixelToolIcon tool={tag.icon} size={17} />
                            )}
                            {tag.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="se-bottom-note">
          <p>{copy('ecosysSupportNote')}</p>
          <a href={SOUP_DOCS} className="se-doc-link">
            {m.navDocs}
            <ExternalArrow />
          </a>
        </div>
      </div>
    </section>
  )
}
