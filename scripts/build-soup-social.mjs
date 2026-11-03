import sharp from 'sharp'
import fs from 'node:fs/promises'
import { SOUP_GLYPH, OYU_GLYPH } from '../src/soup/glyphs.ts'
const rects = (glyph, ox, oy, size, fill) =>
  glyph.rows
    .flatMap((row, y) =>
      [...row].flatMap((bit, x) =>
        bit === '1'
          ? [
              `<rect x="${ox + x * size}" y="${oy + y * size}" width="${size}" height="${size}" fill="${fill(y)}"/>`,
            ]
          : [],
      ),
    )
    .join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0a0a"/><rect x="24" y="24" width="1152" height="582" fill="none" stroke="#39251e"/>${rects(SOUP_GLYPH, 260, 200, 10, (y) => (y < 6 ? '#f7d4c4' : y < 12 ? '#e07b4f' : '#713c2b'))}${rects(OYU_GLYPH, 66, 60, 3, () => '#713c2b')}${rects(OYU_GLYPH, 940, 470, 3, () => '#713c2b')}<text x="600" y="475" fill="#b7a193" text-anchor="middle" font-size="22" font-family="monospace">trysoup.dev</text></svg>`
await fs.mkdir('public/soup', { recursive: true })
await sharp(Buffer.from(svg)).png().toFile('public/soup/social.png')
console.log('Soup social image: public/soup/social.png (1200 × 630)')
