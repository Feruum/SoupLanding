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

// Every corner is on a square unit grid. These are actual staircases,
// including the small weight cells; crispEdges is only a rendering hint.
const SLAB =
  'M-8 0H8V4H20V8H32V12H44V16H56V20H68V24H80V28H92V32H104V40H92V44H80V48H68V52H56V56H44V60H32V64H20V68H8V72H-8V68H-20V64H-32V60H-44V56H-56V52H-68V48H-80V44H-92V40H-104V32H-92V28H-80V24H-68V20H-56V16H-44V12H-32V8H-20V4H-8Z'
const WEIGHT = 'M-3 0H3V2H7V6H3V8H-3V6H-7V2H-3Z'
const CHECK = 'M0 8H4V12H8V8H12V4H16V0H20'

function panelPath(width: number, height: number, corner = 4) {
  return `M${corner} 0H${width - corner}V${corner}H${width}V${height - corner}H${width - corner}V${height}H${corner}V${height - corner}H0V${corner}H${corner}Z`
}

function ChipPins({ size = 76 }: { size?: number }) {
  return (
    <g className="pp-chip-pins">
      {[12, 28, 44, 60].map((offset) => (
        <g key={offset}>
          <rect x={offset} y="-8" width="8" height="12" />
          <rect x={offset} y={size - 4} width="8" height="12" />
          <rect x="-8" y={offset} width="12" height="8" />
          <rect x={size - 4} y={offset} width="12" height="8" />
        </g>
      ))}
    </g>
  )
}

function File({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="pp-file-shadow" d="M4 4H60V12H68V20H76V28H84V100H4Z" />
      <path
        className="pp-file-paper"
        d="M0 4H4V0H56V8H64V16H72V24H80V92H76V96H0Z"
      />
      <path className="pp-file-fold" d="M56 0V24H80V32H48V0Z" />
      <path className="pp-file-band" d="M0 80H80V92H76V96H0Z" />
      {[0, 1, 2, 3].map((i) => (
        <path
          className="pp-file-rule"
          key={i}
          d={`M12 ${40 + i * 10}H${i % 2 ? 48 : 64}`}
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
        <path className="pp-bin-shape" d="M372 209H396V229H372Z" />
        <path
          className="pp-bin-cross"
          d="M378 213H382V217H386V221H390M390 213H386V217H382V221H378"
        />
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
            <path className="pp-record-surface" d={panelPath(137, 23, 2)} />
            <path className="pp-paper-highlight" d="M2 2H135V4H2Z" />
            <path className="pp-record-edge" d="M2 21H135V23H2Z" />
            <rect
              className="pp-record-index-box"
              x="6"
              y="5"
              width="18"
              height="13"
            />
            <rect
              className="pp-record-mark"
              x="113"
              y="7"
              width="16"
              height="9"
            />
            <path
              className="pp-record-rule"
              d={`M31 8H${88 + i * 3}M31 15H77`}
            />
            <text x="15" y="15" textAnchor="middle" className="pp-record-index">
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        </g>
      ))}
      <g className="pp-dedupe" transform="translate(276 95)">
        <ChipPins />
        <path className="pp-chip-outline" d={panelPath(76, 76)} />
        <path className="pp-chip-shine" d="M8 8H68V12H12V64H8Z" />
        <path
          className="pp-chip-inset"
          d={panelPath(60, 36, 2)}
          transform="translate(8 20)"
        />
        <g className="pp-scan pp-motion">
          <rect className="pp-hot" x="-10" y="0" width="96" height="3" />
        </g>
        <text className="pp-chip-text" x="38" y="43" textAnchor="middle">
          dedupe
        </text>
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(447 ${71 + i * 31})`}>
          <g className="pp-clean pp-motion" style={indexStyle(i)}>
            <path className="pp-record-surface" d={panelPath(142, 23, 2)} />
            <path className="pp-paper-highlight" d="M2 2H140V4H2Z" />
            <path className="pp-record-edge" d="M2 21H140V23H2Z" />
            <path
              className="pp-record-check"
              d={CHECK}
              transform="translate(112 4)"
            />
            <path className="pp-record-rule" d="M10 8H97M10 15H76" />
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
        <ChipPins />
        <path className="pp-chip-outline" d={panelPath(76, 76)} />
        <path className="pp-chip-shine" d="M8 8H68V12H12V64H8Z" />
        <path
          className="pp-chip-inset"
          d={panelPath(60, 36, 2)}
          transform="translate(8 20)"
        />
        <text className="pp-chip-text" x="38" y="42" textAnchor="middle">
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
            <path className="pp-method-surface" d={panelPath(127, 41)} />
            <text x="19" y="25">
              {method}
            </text>
            {i === 0 && (
              <path
                className="pp-hot-stroke pp-check"
                pathLength="1"
                d={CHECK}
                transform="translate(92 13)"
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
            <path className="pp-method-surface" d={panelPath(154, 32)} />
            <text x="14" y="21">
              {key}
            </text>
            <rect className="pp-hot" x="131" y="12" width="7" height="7" />
          </g>
        </g>
      ))}
      <g transform="translate(386 55)">
        <path
          className="pp-file-paper"
          d="M0 2H2V0H111V8H119V16H127V24H135V158H133V160H0Z"
        />
        <path className="pp-file-fold" d="M111 0V24H135V30H105V0Z" />
        <path className="pp-paper-highlight" d="M2 2H105V4H2Z" />
        <path className="pp-file-band" d="M0 148H135V158H133V160H0Z" />
        <text x="14" y="28" className="pp-file-text">
          soup.yaml
        </text>
        {['base:', 'data:', 'lora:', 'training:'].map((key, i) => (
          <g key={key} className="pp-yaml-row pp-motion" style={indexStyle(i)}>
            <text className="pp-file-text" x="14" y={52 + i * 26}>
              {key}
            </text>
            <path
              className="pp-file-rule"
              d={`M25 ${62 + i * 26}H${112 - i * 6}`}
            />
          </g>
        ))}
      </g>
      <g className="pp-config-lock pp-motion">
        <rect className="pp-hot" x="274" y="121" width="23" height="23" />
        <path
          className="pp-inverse"
          pathLength="1"
          d={CHECK}
          transform="translate(277 126) scale(.7)"
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
          d="M29 142H178M462 142H524M462 142V266H178V178"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${35 + i * 28} 130)`}>
            <g className="pp-token pp-motion" style={indexStyle(i)}>
              <rect className="pp-hot" width="22" height="24" />
              <rect
                className="pp-token-inset"
                x="4"
                y="4"
                width="14"
                height="16"
              />
              <text className="pp-token-code" x="4" y="16">
                {i % 2 ? '10' : '01'}
              </text>
            </g>
          </g>
        ))}
      </g>
      <g className="pp-weight-stack" transform="translate(320 5)">
        {[4, 3, 2, 1, 0].map((layer) => (
          <g key={layer} transform={`translate(0 ${layer * 44})`}>
            <g
              className={`pp-weight-layer pp-motion pp-layer-${layer}`}
              style={indexStyle(layer)}
            >
              <path
                className="pp-layer-side"
                d={SLAB}
                transform="translate(0 8)"
              />
              <path className="pp-layer-top" d={SLAB} />
              {Array.from({ length: 36 }, (_, pixel) => {
                const column = pixel % 6,
                  row = Math.floor(pixel / 6)
                return (
                  <path
                    key={pixel}
                    className={`pp-weight ${(pixel + layer * 2) % 4 === 0 ? 'pp-adapter' : ''}`}
                    d={WEIGHT}
                    transform={`translate(${(column - row) * 16} ${8 + (column + row) * 5})`}
                  />
                )
              })}
              <path
                className="pp-layer-activation pp-motion"
                d={SLAB}
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
          d="M462 142V266H178V178"
        />
        <g className="pp-checkpoint pp-motion">
          <g transform="translate(524 102)">
            <path className="pp-file-paper" d="M0 4H4V0H48V8H56V16H64V68H0Z" />
            <path className="pp-file-fold" d="M48 0V16H64V24H40V0Z" />
            <path className="pp-file-band" d="M0 56H64V68H0Z" />
            <path className="pp-paper-highlight" d="M4 2H40V4H4Z" />
            <path
              className="pp-checkpoint-code"
              d="M10 30H50M10 40H30M10 50H22"
            />
          </g>
          <path
            className="pp-hot-stroke pp-check"
            pathLength="1"
            d={CHECK}
            transform="translate(564 142) scale(.65)"
          />
          <text x="556" y="192" textAnchor="middle">
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
          <path className="pp-test-surface" d={panelPath(56, 46)} />
          <text x="6" y="12" className="pp-tiny">
            0{i + 1}
          </text>
          <g className="pp-test-check pp-motion" style={indexStyle(i)}>
            <path
              className="pp-test-tick"
              d={CHECK}
              transform="translate(18 17)"
            />
          </g>
        </g>
      ))}
      <path className="pp-eval-sweep pp-motion" d="M204 47H419V49H204Z" />
      <g transform="translate(485 96)">
        <g className="pp-verdict pp-motion">
          <path className="pp-verdict-surface" d={panelPath(112, 74)} />
          <path className="pp-file-band" d="M0 62H112V70H108V74H4V70H0Z" />
          <path
            className="pp-hot-stroke pp-check"
            pathLength="1"
            d={CHECK}
            transform="translate(19 12) scale(1.3)"
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
              className={i % 5 === 0 ? 'pp-hot' : 'pp-weight pp-export-weight'}
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
        <ChipPins />
        <path className="pp-chip-outline" d={panelPath(76, 76)} />
        <path className="pp-chip-shine" d="M8 8H68V12H12V64H8Z" />
        <path
          className="pp-chip-inset"
          d={panelPath(60, 36, 2)}
          transform="translate(8 20)"
        />
        <text x="38" y="43" textAnchor="middle" className="pp-chip-text">
          GGUF
        </text>
      </g>
      <g className="pp-export-file pp-motion">
        <File x={477} y={86} label="model.gguf" />
        <path
          className="pp-hot-stroke pp-check"
          pathLength="1"
          d={CHECK}
          transform="translate(492 111)"
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
