# Soup landing

The current landing keeps Omarchy's original terminal field engine, section headings, responsive card rails and international typography. Soup-specific page content lives in `src/soup/`; original Omarchy routes and unused public assets are preserved in `src/parked/` and excluded from the published site.

## Hero

`SoupHeroField` supplies a SOUP wordmark and `OYU_GLYPH` to the original `HeroPixelField`. The flying sprite, held-pointer charge, growing dithered stamps and dispersal remain original. The optional `stampGlyph` prop changes the stamped bitmap from the Omarchy square to a mirrored Kazakh qoshqar muyiz. Its wide 65×33 shape has two open curl counters and uses a 33-cell stamp span to stay legible. A validated lattice helper handles transient zero-sized SVG measurements safely. Desktop and mobile heroes fill the available viewport height without enlarging the wordmark.

The footer follows the original SiteFooter structure: pixel backdrop, wordmark, four navigation columns, all languages grouped by script, active language, and the legal/contact baseline. It uses Soup links and the same oyu stamps.

## Content and languages

52 complete static homepages: English at `/`, the 51 others at `/{locale}/`, including Kazakh at `/kk/`. Each catalogue has 264 strings; technical syntax and proper names remain literal. Language-switcher navigation preserves the current page and hash. Script group labels are generated server-side so differences in browser ICU cannot cause hydration mismatches. Documentation is now fully local: 131 original English articles, 667 exact copyable code blocks, source links, sidebar/full-text search and in-page contents. Each locale provides translated controls around the English source article, explicitly marked lang=en. All 131 articles are available under every locale.

CLI and YAML examples are illustrative rather than executing real training. Examples were checked against the current [Soup CLI reference](https://trysoup.dev/docs/cli-reference), [training guide](https://github.com/MakazhanAlpamys/Soup/blob/main/docs/training.md), and current homepage. Layer streaming remains marked BETA. Soup Zero remains coming soon. Its separate `/zero/` page contains an interactive concept preview: one ASCII model core, six windows assembling into one workspace, ten distinct flat station scenes and a lifecycle/evidence diagram. The Hydra document cloud is exclusive to the homepage. No synthetic benchmark score, testimonial or performance claim is presented.

See `hydra-provenance.md` for exact source and adaptation details of both HydraDB effects.

## Themes and integrations

The header has exactly two themes: black and white. A 650ms stepped pixel curtain reveals the new theme; reduced motion or browsers without View Transitions apply it immediately. Preference is stored locally. Both themes retain Soup’s terracotta identity.

The ecosystem includes a moving, pausable pixel-logo carousel, six trace-source tabs with exact ingest commands, and four complete integration groups. All 38 icons are sampled from saved original logos rather than placeholder letters. Source vectors, hashes and 24/32/40px grids are retained with provenance.

## Local development

Node 24 or newer is required. `npm ci`, `npm run dev` (port 3113), `npm run build`, `npm run preview`, `npm test`, and `npm run typecheck` are the supported commands. On hosts where Astro automatically backgrounds an agent server, set `ASTRO_DEV_BACKGROUND=1` to retain foreground logs.

`npm run build` produces `dist/client` and produces 6,969 static pages including 404. Verification checks every route exists, all 52 homepages/metadata and the full source article link graph, with 338 built page bodies covering all English articles and all four page families in every locale. `npm test` validates catalogue completeness, glyph geometry and local animation assets. The site has not been deployed to the production domain.

## ImageGen exploration

Built-in ImageGen generated `hero-concept.png` as an early reference. The user's subsequent direction explicitly rejected the side-ornament treatment in favor of the original moving Omarchy stamp. The production hero therefore uses the original engine and a code-native bitmap; it never displays the generated mockup as a background. Prompts are retained in `imagegen-prompts.md`.
