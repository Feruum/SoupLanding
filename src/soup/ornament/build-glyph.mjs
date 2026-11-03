import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const directory = path.dirname(fileURLToPath(import.meta.url))
const source = await fs.readFile(path.join(directory, 'qoshqar-muyiz.svg'))
const width = 65
const height = 33
const pixels = await sharp(source)
  .resize(width, height)
  .ensureAlpha()
  .raw()
  .toBuffer()
const rows = Array.from({ length: height }, (_, y) =>
  Array.from({ length: width }, (_, x) =>
    pixels[(y * width + x) * 4 + 3] >= 128 ? '1' : '0',
  ).join(''),
)
// Rasterization is symmetric in theory; lock it exactly onto the odd lattice.
for (let y = 0; y < height; y++) {
  const row = [...rows[y]]
  for (let x = 0; x < Math.floor(width / 2); x++) row[width - 1 - x] = row[x]
  rows[y] = row.join('')
}
await fs.writeFile(
  path.join(directory, 'bitmap.ts'),
  `// Generated from qoshqar-muyiz.svg by build-glyph.mjs.\nexport const OYU_ROWS = ${JSON.stringify(rows, null, 2)} as const\n`,
)
const rectangles = rows
  .flatMap((row, y) =>
    [...row].flatMap((bit, x) =>
      bit === '1' ? [`<rect x="${x}" y="${y}" width="1" height="1"/>`] : [],
    ),
  )
  .join('')
const bitmap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="650" height="330" shape-rendering="crispEdges"><rect width="65" height="33" fill="#0a0a0a"/><g fill="#c0512d">${rectangles}</g></svg>`
await sharp(Buffer.from(bitmap))
  .png()
  .toFile(path.join(directory, 'qoshqar-muyiz-bitmap.png'))
await sharp(source)
  .resize(780, 396)
  .flatten({ background: '#0a0a0a' })
  .png()
  .toFile(path.join(directory, 'qoshqar-muyiz-source.png'))
const marks = [
  { x: 30, y: 100, width: 65, height: 33 },
  { x: 145, y: 84, width: 130, height: 66 },
  { x: 330, y: 50, width: 260, height: 132 },
]
const comparison = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="240" viewBox="0 0 650 240"><rect width="650" height="240" fill="#0a0a0a"/><g fill="#c0512d" shape-rendering="crispEdges">${marks.map((mark) => `<g transform="translate(${mark.x} ${mark.y}) scale(${mark.width / width} ${mark.height / height})">${rectangles}</g>`).join('')}</g><g fill="#96928f" font-family="monospace" font-size="12"><text x="30" y="215">65 × 33</text><text x="145" y="215">130 × 66</text><text x="330" y="215">260 × 132</text></g></svg>`
await sharp(Buffer.from(comparison))
  .png()
  .toFile(path.join(directory, 'qoshqar-muyiz-stamp-sizes.png'))
console.log(
  `Generated ${width}×${height} qoshqar muyiz glyph and three preview PNGs.`,
)
