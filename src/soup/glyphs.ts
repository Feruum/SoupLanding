import type { FieldGlyph } from '../components/HeroPixelField'
import { OYU_ROWS } from './ornament/bitmap.ts'

const letters = [
  [
    '0111110',
    '1100011',
    '1100000',
    '1110000',
    '0111110',
    '0000111',
    '0000011',
    '1100011',
    '0111110',
  ],
  [
    '0111110',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '0111110',
  ],
  [
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '0111110',
  ],
  [
    '1111110',
    '1100011',
    '1100011',
    '1100011',
    '1111110',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
  ],
]
const wordRows = Array.from({ length: 9 }, (_, row) =>
  letters
    .map((letter) =>
      letter[row]
        .split('')
        .map((bit) => bit.repeat(2))
        .join(''),
    )
    .join('0000'),
).flatMap((row) => [row, row])
export const SOUP_GLYPH: FieldGlyph = {
  rows: wordRows,
  width: wordRows[0].length,
  height: wordRows.length,
}

// Paired ram horns, open spiral counters and tapered outward tails.
// Editable source and deterministic rasterizer live in ./ornament/.
export const OYU_GLYPH: FieldGlyph = {
  width: 65,
  height: 33,
  rows: OYU_ROWS,
}
