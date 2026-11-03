type FieldRect = { width: number; height: number; left: number; top: number }
type GlyphSize = { width: number; height: number }

/** Keep transient layout measurements from creating unbounded render buffers. */
export const MAX_FIELD_CELLS = 1_000_000
const MAX_FIELD_AXIS = 4096
const MAX_CANVAS_AXIS = 32767
const validRect = (rect: FieldRect) =>
  [rect.width, rect.height, rect.left, rect.top].every(Number.isFinite) &&
  rect.width >= 1 &&
  rect.height >= 1

export function measurePixelFieldGeometry(
  box: FieldRect,
  slot: FieldRect | null | undefined,
  glyph: GlyphSize,
  pixelRatio: number,
) {
  if (
    !validRect(box) ||
    !Number.isSafeInteger(glyph.width) ||
    !Number.isSafeInteger(glyph.height) ||
    glyph.width < 1 ||
    glyph.height < 1
  )
    return null
  const dpr =
    Number.isFinite(pixelRatio) && pixelRatio > 0 ? Math.min(pixelRatio, 2) : 1
  const width = Math.round(box.width * dpr)
  const height = Math.round(box.height * dpr)
  if (
    width < 1 ||
    height < 1 ||
    width > MAX_CANVAS_AXIS ||
    height > MAX_CANVAS_AXIS
  )
    return null

  // A hidden or transitioning SVG can exist while its rect is zero. Treat it
  // as absent; the resize observer will realign to its exact rect once valid.
  const slotBox = slot && validRect(slot) ? slot : null
  // Preserve the original .88 * (width - 48), capped at 896, at normal widths.
  // Tiny hosts need a positive fallback even when the inset consumes them.
  const slotWidth =
    (slotBox?.width ??
      Math.min(0.88 * Math.max(box.width - 48, box.width * 0.5), 896)) * dpr
  const wmX = slotBox
    ? (slotBox.left - box.left) * dpr
    : (width - slotWidth) / 2
  const wmY = slotBox ? (slotBox.top - box.top) * dpr : 0
  const wmCW = slotWidth / glyph.width
  const wmCH = slotBox ? (slotBox.height * dpr) / glyph.height : wmCW
  if (![wmX, wmY, wmCW, wmCH].every(Number.isFinite) || wmCW <= 0 || wmCH <= 0)
    return null
  const cMin = -Math.ceil(wmX / wmCW) - 1
  const rMin = -Math.ceil(wmY / wmCH) - 1
  const cols = Math.ceil((width - wmX) / wmCW) - cMin + 1
  const rows = Math.ceil((height - wmY) / wmCH) - rMin + 1
  if (
    ![cMin, rMin, cols, rows].every(Number.isSafeInteger) ||
    cols < 1 ||
    rows < 1 ||
    cols > MAX_FIELD_AXIS ||
    rows > MAX_FIELD_AXIS ||
    cols * rows > MAX_FIELD_CELLS
  )
    return null
  return {
    dpr,
    width,
    height,
    wmX,
    wmY,
    wmCW,
    wmCH,
    cMin,
    rMin,
    cols,
    rows,
    slotLeft: slotBox?.left ?? 0,
    slotTop: slotBox?.top ?? 0,
  }
}
