import { useCallback, useState } from 'react'
import { HeroPixelField } from '../components/HeroPixelField'
import { SOUP_GLYPH, OYU_GLYPH } from './glyphs'

export function SoupHeroField() {
  const [painted, setPainted] = useState(false)
  const onPainted = useCallback(() => setPainted(true), [])
  return (
    <>
      <div className="soup-hero-field" aria-hidden="true">
        <HeroPixelField
          glyph={SOUP_GLYPH}
          stampGlyph={OYU_GLYPH}
          onPainted={onPainted}
        />
      </div>
      <svg
        className={`soup-wordmark${painted ? ' painted' : ''}`}
        data-hero-wordmark
        viewBox={`0 0 ${SOUP_GLYPH.width} ${SOUP_GLYPH.height}`}
        aria-label="Soup"
        role="img"
        shapeRendering="crispEdges"
      >
        {SOUP_GLYPH.rows.map((row, y) =>
          row
            .split('')
            .map((v, x) =>
              v === '1' ? (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  fill={y < 6 ? '#f7d4c4' : y < 12 ? '#e07b4f' : '#77331e'}
                />
              ) : null,
            ),
        )}
      </svg>
    </>
  )
}
