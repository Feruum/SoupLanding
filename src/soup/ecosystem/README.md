# Soup ecosystem component

`SoupEcosystem({ m, language })` replaces the previous static integration grid.
Merge `content.en.json` into the main catalogue before translating its flat
`ecosys*` keys. The component reads translated keys from `m`; the bundled copy
is a development fallback for catalogues that have not yet been merged.

`PixelToolIcon({ tool, size?, resolution?, className?, label? })` is also exported
for other parts of the page. `PixelModelIcon({ model, ...sameProps })` identifies
Llama, Qwen, Gemma, Mistral, Phi, DeepSeek, Whisper and Hugging Face. Resolution
selects a 24, 32 or 40 pixel sampling grid independently of display size. The
monochrome pixels inherit `currentColor`; multicolor original marks retain
quantized colors so internal counters and details remain legible. The delivered
SVG paths contain integer-aligned cells, with no font or icon dependency.
Individual copies live at `/soup/pixel-tools/<tool>.svg`.

Run `node src/soup/ecosystem/generate-pixel-tools.mjs` to regenerate the paths,
public icons, integrity manifest and source-to-pixel contact sheets. Every mark
is sampled from an actual saved source logo. There are no manually drawn logo
approximations, initials or substitute glyphs. The source vectors and bitmaps
are preserved under `public/soup/pixel-tools/sources/`; `source-manifest.json`
records the source URL, publisher, SHA-256 hash and exact preprocessing for each
selected asset. `sources/retrieval.json` records the complete acquisition.

Model sources include Meta's own website icon; the Qwen website icon; the
official Google Gemma organization mark; and original Microsoft, Mistral and
DeepSeek vectors from the official Unsloth repository. Whisper uses OpenAI's
original knot. Tools use Soup's published logo assets or original vendor
website/repository assets, including Unsloth's sloth, DeepSpeed's network,
SGLang's official square mark and the trace providers' actual logos. Source
marks retain their respective ownership; this directory records their origin.

QA artifacts:

- `qa/model-logos-before-after.png`: original source geometry beside each of the
  three pixel grids for all eight models.
- `qa/tool-logos-before-after.png`: the corresponding tool source comparison.
- `pixel-before.png`: the previous icon sheet, retained to review the replacement.

Run `node --test src/soup/ecosystem/pixel-logos.test.mjs` to verify source hashes,
model identities, integer cell geometry, bounds, theme inheritance, public SVG
parity and absence of fractional alpha. The same test checks that recipes and
model clusters use logo components instead of letter badges.

Capabilities and command spellings checked against the first-party sources on
2026-10-31:

- [Soup integration list](https://trysoup.dev/): the four groups and sixteen tools.
- [Data engineering](https://github.com/MakazhanAlpamys/Soup/blob/main/docs/data.md#production-trace-ecosystem-soup-ingest): six source IDs, exact exported filenames, offline local import, and Langfuse's separate live pull.
- [Serving and export](https://github.com/MakazhanAlpamys/Soup/blob/main/docs/serving-and-export.md): serving backends and export targets.
- [Backends and operations](https://github.com/MakazhanAlpamys/Soup/blob/main/docs/backends-and-ops.md): MLX, Unsloth and experiment trackers.
- [Performance and quantization](https://github.com/MakazhanAlpamys/Soup/blob/main/docs/performance-and-quantization.md): attention, distributed training and quantization formats.

The marquee uses a compositor transform at constant speed. It pauses while
hovered or focused, has a manual pause button, and becomes a manually scrollable
single sequence for reduced motion. The decorative moving links are excluded
from the accessibility tree and keyboard order; the same links are available
in the stable directory below. Trace selectors support arrow keys,
Home and End; copy feedback is announced through a status region.
