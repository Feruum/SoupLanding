# Soup qoshqar muyiz ornament

The hero's moving stamps and the optional terminal section band share a new
65 × 33 bitmap of **қошқар мүйіз** (qoshqar muyiz, paired ram horns). The shape
has two mirrored open curls, a central pointed stem, and outward tapered tails.
It replaces the earlier square spiral-and-diamond construction, which read as
a heart or block at the hero's scale.

## Reference and authorship

The cultural reference was inspected on October 31, 2026:

- [Kagan Media / Muse of Nomad: «Қошқар мүйіз: символ силы и изобилия»](https://kaganmedia.org/Nomad/qosqar-muiiz-simvol-sily-i-izobiliya-5409).
- [Article's paired-horn illustration](https://kaganmedia.org/images/2025/02/04/-860x571.70454545455-museofnomad-1738662084-0-15-41-24.jpeg).

The reference establishes the traditional paired-horn structure and its use in
Kazakh decorative art. The project asset is an original simplified Bézier
redrawing of that traditional motif, not a downloaded stock illustration or a
claim of an exact museum reproduction. No reference photograph is shipped.

## Editable source and regeneration

- `src/soup/ornament/qoshqar-muyiz.svg`: editable 130 × 66 vector; one horn path
  is mirrored around the center axis.
- `src/soup/ornament/build-glyph.mjs`: samples the vector's alpha at 65 × 33,
  thresholds coverage at 128/255, and enforces exact bilateral symmetry.
- `src/soup/ornament/bitmap.ts`: generated binary rows used by `OYU_GLYPH`.
- `src/soup/ornament/OrnamentBand.tsx`: decorative terminal half-block rendition
  of those same rows; no image border. `ornament-band.css` supplies a restrained
  16px horizontal drift and disables it for reduced motion.

Run `node src/soup/ornament/build-glyph.mjs` after editing the SVG, then format
the generated TypeScript with the project's formatter.

## Visual evidence

- `qoshqar-muyiz-source.png`: the editable vector rendered on Soup black.
- `qoshqar-muyiz-bitmap.png`: enlarged crisp bitmap in Soup terracotta.
- `qoshqar-muyiz-stamp-sizes.png`: the bitmap at 65 × 33, 130 × 66, and 260 × 132.

The small preview was visually inspected: each spiral retains an open counter,
the two horns remain separated above the stem, and the silhouette stays wider
than it is tall. The hero retains its inherited motion, glow, charge and stamp
engine; only the stamp glyph changes. Final field sampling size is controlled
by that engine and should preserve enough cells for both curl openings.
