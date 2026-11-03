import paths from './pixel-paths.json'

export type PixelTool = keyof typeof paths
export type PixelResolution = 24 | 32 | 40
export type PixelModel = 'llama' | 'qwen' | 'gemma' | 'mistral' | 'phi' | 'deepseek' | 'whisper' | 'huggingface'

/** Every edge sits on the icon's integer grid, including the rasterized marks. */
export function PixelToolIcon({
  tool,
  size = 32,
  className = '',
  label,
  resolution,
  monochrome = false,
}: {
  tool: PixelTool
  size?: number
  className?: string
  label?: string
  resolution?: PixelResolution
  monochrome?: boolean
}) {
  const icon = paths[tool]
  const grid = resolution ?? (icon.defaultResolution as PixelResolution)
  return (
    <svg
      className={`soup-pixel-tool ${className}`}
      viewBox={`0 0 ${grid} ${grid}`}
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    >
      {icon.variants[grid].map((layer, index) => <path key={index} fill={monochrome ? 'currentColor' : layer.fill} d={layer.d} />)}
    </svg>
  )
}

export function PixelModelIcon({model, ...props}: Omit<Parameters<typeof PixelToolIcon>[0], 'tool'> & {model: PixelModel}) {
  return <PixelToolIcon tool={model} {...props} />
}
