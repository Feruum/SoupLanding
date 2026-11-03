import type { CSSProperties } from 'react'

export type ProcessKind =
  'data' | 'method' | 'config' | 'train' | 'eval' | 'export'
export const PROCESS_KINDS: readonly ProcessKind[] = [
  'data',
  'method',
  'config',
  'train',
  'eval',
  'export',
]
const indexStyle = (index: number) => ({ '--pp-i': index }) as CSSProperties

function File({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="pp-surface" d="M0 0H58L78 20V92H0ZM58 0V20H78" />
      {[0, 1, 2, 3].map((i) => (
        <path
          className="pp-rule"
          key={i}
          d={`M14 ${38 + i * 9}H${i % 2 ? 53 : 64}`}
        />
      ))}
      <text x="39" y="115" textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function DataArt() {
  return (
    <g data-process-art="data">
      <text x="38" y="35">
        train.jsonl
      </text>
      <path className="pp-rule" d="M178 133H273M355 133H446M314 169V220H380" />
      <g className="pp-bin">
        <path className="pp-rule" d="M372 209V229H396V209" />
        <text x="402" y="226" className="pp-tiny">
          dup
        </text>
      </g>
      <rect
        className="pp-hot pp-packet"
        x="178"
        y="129"
        width="10"
        height="8"
      />
      <rect
        className="pp-hot pp-packet pp-drop"
        x="309"
        y="176"
        width="10"
        height="8"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(38 ${57 + i * 31})`}>
          <g
            className={`pp-record pp-motion ${i === 2 ? 'pp-duplicate' : ''}`}
            style={indexStyle(i)}
          >
            <rect className="pp-surface" width="137" height="23" />
            <rect className="pp-hot" x="8" y="8" width="7" height="7" />
            <path className="pp-rule" d={`M25 8H${83 + i * 7}M25 15H116`} />
            <text x="-16" y="15" className="pp-tiny">
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        </g>
      ))}
      <g className="pp-dedupe" transform="translate(276 95)">
        <path className="pp-chip-outline" d="M0 0H76V76H0Z" />
        <path className="pp-hot-stroke" d="M20 25H56M20 38H56M20 51H42" />
        <g className="pp-scan pp-motion">
          <rect className="pp-hot" x="-10" y="0" width="96" height="3" />
        </g>
        <text x="38" y="103" textAnchor="middle">
          dedupe
        </text>
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(447 ${71 + i * 31})`}>
          <g className="pp-clean pp-motion" style={indexStyle(i)}>
            <rect className="pp-surface" width="142" height="23" />
            <path className="pp-hot-stroke" d="M10 11L14 15 21 7" />
            <path className="pp-rule" d="M32 8H119M32 15H98" />
          </g>
        </g>
      ))}
      <text x="447" y="225">
        data.jsonl
      </text>
    </g>
  )
}

function MethodArt() {
  return (
    <g data-process-art="method">
      <File x={42} y={91} label="data.jsonl" />
      <path
        className="pp-rule"
        d="M120 133H239M315 133H382V53H451M382 106H451M382 159H451M382 133V212H451"
      />
      <g className="pp-advise" transform="translate(239 95)">
        <rect className="pp-chip-outline" width="76" height="76" />
        <text className="pp-bright" x="38" y="42" textAnchor="middle">
          advise
        </text>
      </g>
      <path
        className="pp-signal pp-motion"
        pathLength="100"
        d="M120 133H382V53H451"
      />
      {['SFT', 'DPO', 'GRPO', 'RAG'].map((method, i) => (
        <g key={method} transform={`translate(452 ${32 + i * 53})`}>
          <g
            className={`pp-branch pp-motion ${i === 0 ? 'pp-selected' : ''}`}
            style={indexStyle(i)}
          >
            <rect className="pp-surface" width="127" height="41" />
            <text x="19" y="25">
              {method}
            </text>
            {i === 0 && (
              <path
                className="pp-hot-stroke pp-check"
                pathLength="1"
                d="M95 20L101 26 111 14"
              />
            )}
          </g>
        </g>
      ))}
    </g>
  )
}

function ConfigArt() {
  return (
    <g data-process-art="config">
      <path
        className="pp-rule"
        d="M198 68H285V132H386M198 115H386M198 162H285V132M198 209H285V132"
      />
      {['base', 'data', 'lora', 'training'].map((key, i) => (
        <g key={key} transform={`translate(43 ${47 + i * 47})`}>
          <g className="pp-config-tile pp-motion" style={indexStyle(i)}>
            <rect className="pp-surface" width="154" height="32" />
            <text x="14" y="21">
              {key}
            </text>
            <rect className="pp-hot" x="131" y="12" width="7" height="7" />
          </g>
        </g>
      ))}
      <g transform="translate(386 40)">
        <path
          className="pp-chip-outline"
          d="M0 0H169L193 24V194H0ZM169 0V24H193"
        />
        <text x="18" y="32" className="pp-bright">
          soup.yaml
        </text>
        {['base:', 'data:', 'lora:', 'training:'].map((key, i) => (
          <g key={key} className="pp-yaml-row pp-motion" style={indexStyle(i)}>
            <text x="19" y={65 + i * 30}>
              {key}
            </text>
            <path className="pp-rule" d={`M34 ${76 + i * 30}H${143 - i * 8}`} />
          </g>
        ))}
      </g>
      <g className="pp-config-lock pp-motion">
        <rect className="pp-hot" x="274" y="121" width="23" height="23" />
        <path
          className="pp-inverse"
          pathLength="1"
          d="M280 132L285 137 292 127"
        />
      </g>
    </g>
  )
}

function TrainArt() {
  return (
    <g data-process-art="train">
      <g className="pp-train-io">
        <text x="35" y="35">
          tokens →
        </text>
        <text x="478" y="35">
          LoRA / ΔW
        </text>
        <path
          className="pp-rule"
          d="M29 142H190L234 165M402 165L450 142H590M450 142V220H190V167"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${35 + i * 28} 130)`}>
            <g className="pp-token pp-motion" style={indexStyle(i)}>
              <rect className="pp-hot" width="22" height="24" />
              <text className="pp-token-code" x="4" y="16">
                {i % 2 ? '10' : '01'}
              </text>
            </g>
          </g>
        ))}
      </g>
      <g className="pp-weight-stack" transform="translate(-80 -36) scale(1.25)">
        {[4, 3, 2, 1, 0].map((layer) => (
          <g key={layer} transform={`translate(320 ${43 + layer * 28})`}>
            <g className="pp-weight-layer pp-motion" style={indexStyle(layer)}>
              <path
                className="pp-layer-side"
                d="M-104 31L0 65 104 31V42L0 76-104 42Z"
              />
              <path className="pp-layer-top" d="M0 0L104 31 0 65-104 31Z" />
              {Array.from({ length: 36 }, (_, pixel) => {
                const column = pixel % 6,
                  row = Math.floor(pixel / 6)
                return (
                  <path
                    key={pixel}
                    className={`pp-weight ${(pixel + layer * 2) % 4 === 0 ? 'pp-adapter' : ''}`}
                    d="M0 0L9 3 0 6-9 3Z"
                    transform={`translate(${(column - row) * 15} ${10 + (column + row) * 4.6})`}
                  />
                )
              })}
              <path
                className="pp-layer-activation pp-motion"
                d="M0 0L104 31 0 65-104 31Z"
                style={indexStyle(layer)}
              />
              <text className="pp-layer-label" x="116" y="40">
                L{String(layer).padStart(2, '0')}
              </text>
            </g>
          </g>
        ))}
      </g>
      <g className="pp-train-io">
        <path
          className="pp-backward pp-motion"
          pathLength="100"
          d="M450 142V220H190V167"
        />
        <g className="pp-checkpoint pp-motion">
          <rect className="pp-surface" x="520" y="111" width="95" height="59" />
          <path
            className="pp-hot-stroke pp-check"
            pathLength="1"
            d="M537 142L547 152 567 130"
          />
          <text x="568" y="192" textAnchor="middle">
            ./output
          </text>
        </g>
      </g>
    </g>
  )
}

function EvalArt() {
  return (
    <g data-process-art="eval">
      <File x={38} y={88} label="./output" />
      <path className="pp-rule" d="M117 132H214M414 132H485" />
      <text x="214" y="35">
        quality.jsonl
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <g
          key={i}
          transform={`translate(${214 + (i % 3) * 68} ${54 + Math.floor(i / 3) * 58})`}
        >
          <rect className="pp-surface" width="56" height="46" />
          <text x="6" y="12" className="pp-tiny">
            0{i + 1}
          </text>
          <g className="pp-test-check pp-motion" style={indexStyle(i)}>
            <path className="pp-hot-stroke" d="M20 24L26 30 37 17" />
          </g>
        </g>
      ))}
      <path className="pp-eval-sweep pp-motion" d="M204 47H419V49H204Z" />
      <g transform="translate(485 96)">
        <g className="pp-verdict pp-motion">
          <rect className="pp-chip-outline" width="112" height="74" />
          <path
            className="pp-hot-stroke pp-check"
            pathLength="1"
            d="M19 25L29 35 45 16"
          />
          <text x="18" y="58" className="pp-bright pp-verdict-text">
            SHIP
          </text>
        </g>
        <text x="56" y="100" textAnchor="middle">
          evidence.json
        </text>
      </g>
      <text x="214" y="247" className="pp-tiny">
        task_eval + regression_eval
      </text>
    </g>
  )
}

function ExportArt() {
  return (
    <g data-process-art="export">
      <text x="41" y="35">
        weights.safetensors
      </text>
      <g transform="translate(41 72)">
        <g className="pp-compress pp-motion">
          {Array.from({ length: 96 }, (_, i) => (
            <rect
              key={i}
              className={i % 5 === 0 ? 'pp-hot' : 'pp-weight'}
              x={(i % 12) * 13}
              y={Math.floor(i / 12) * 16}
              width="9"
              height="12"
            />
          ))}
        </g>
      </g>
      <path className="pp-rule" d="M204 134H283M359 134H476" />
      <path className="pp-signal pp-motion" pathLength="100" d="M204 134H476" />
      <g className="pp-gguf" transform="translate(283 96)">
        <rect className="pp-chip-outline" width="76" height="76" />
        <text x="38" y="43" textAnchor="middle" className="pp-bright">
          GGUF
        </text>
      </g>
      <g className="pp-export-file pp-motion">
        <File x={477} y={86} label="model.gguf" />
        <path
          className="pp-hot-stroke pp-check"
          pathLength="1"
          d="M493 117L500 124 513 108"
        />
      </g>
      <text x="283" y="226">
        GGUF / ONNX / HF
      </text>
    </g>
  )
}

/** Bounded vector geometry: each operation has a different cause-and-result sequence. */
export function ProcessArt({
  kind,
  compact = false,
}: {
  kind: ProcessKind
  compact?: boolean
}) {
  const Art = {
    data: DataArt,
    method: MethodArt,
    config: ConfigArt,
    train: TrainArt,
    eval: EvalArt,
    export: ExportArt,
  }[kind]
  return (
    <svg
      className="pp-art"
      viewBox={compact && kind === 'train' ? '130 0 390 265' : '0 0 640 270'}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="pp-registration"
        d="M12 32V12H32M608 12H628V32M12 238V258H32M608 258H628V238"
      />
      <Art />
    </svg>
  )
}
