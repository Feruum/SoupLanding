import { OYU_ROWS } from './bitmap.ts'
import './ornament-band.css'

// One terminal character carries two bitmap rows; spaces preserve the curls.
const terminalMark = Array.from(
  { length: Math.ceil(OYU_ROWS.length / 2) },
  (_, row) =>
    [...OYU_ROWS[row * 2]]
      .map((top, column) => {
        const bottom = OYU_ROWS[row * 2 + 1]?.[column] ?? '0'
        return top === '1'
          ? bottom === '1'
            ? '█'
            : '▀'
          : bottom === '1'
            ? '▄'
            : ' '
      })
      .join(''),
).join('\n')

/** A quiet typographic section divider; the hero uses the same bitmap. */
export function OrnamentBand({ className = '' }: { className?: string }) {
  return (
    <div className={`oyu-band ${className}`} aria-hidden="true">
      <div className="oyu-band-track">
        {Array.from({ length: 12 }, (_, index) => (
          <pre key={index}>{terminalMark}</pre>
        ))}
      </div>
    </div>
  )
}
