# Soup landing

Soup-branded landing page built on the original Omarchy terminal animation and section primitives, with two source-derived HydraDB animations and 52 interface languages, including Kazakh.

## Run locally

Requires Node 24 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3113/. English is at `/`, Russian at `/ru/`, Kazakh at `/kk/`; use the header or full footer to switch languages. Language switching preserves the current page.

Documentation: `/docs/` with 131 complete local articles, full-text keyword search, page contents, and 667 copyable code blocks. Article bodies preserve the original English source and are marked accordingly; the surrounding controls are localized. Soup Zero is at `/zero/`; the hire page for Madi Talgat is at `/hire/` (contacts and CV path in `src/soup/hire/SoupHire.tsx`). Black/white mode switches from the header with a pixel curtain transition (instant for reduced motion).

```sh
npm test
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1 --port 3115
```

Production output is `dist/client`. The build checks all 52 catalogues and generated pages, including metadata, text direction, local article links and anchors. All 7,020 localized routes are generated statically.

## Deploy with Vercel CLI

Production: https://souplanding-omega.vercel.app/.

`vercel.json` selects Astro, runs the complete verified build, and publishes `dist/client`. Fingerprinted Astro assets receive immutable caching. `.vercelignore` excludes local logs, QA screenshots, environment files and unused Omarchy assets.

```sh
vercel link --project souplanding --scope ferumms-projects
vercel deploy --prod --scope ferumms-projects
```

The local `.vercel` project binding is ignored by Git. Deployments use Vercel's generated domain; connecting a custom domain is a separate step.

## Source

- `src/soup/`: translated landing, Zero workspace concept, documentation reader, two themes, original-style sections, Kazakh ornament, footer and isolated Hydra animation wrappers.
- `public/soup/`: original Soup logo, integration logos, social image and local Hydra source.
- `src/components/HeroPixelField.tsx`: original Omarchy field, extended with an optional oyu stamp bitmap.
- `src/parked/`: preserved original Omarchy routes and unused assets, excluded from the published pages.
- `docs/soup/`: implementation notes, animation provenance, retained ImageGen explorations and original upstream README.

See [implementation notes](docs/soup/implementation.md) and [Hydra source provenance](docs/soup/hydra-provenance.md) for behavior and verification details.
