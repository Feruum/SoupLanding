# Approved pixel graphics implementation — 2026-11-09

User approved the three imagegen previews and requested matching pixel icons plus a literal-soup Easter egg. Keep existing content, routes, localization and animation behavior.

## Direction and ownership

The approved references are `pixel-approval-v1/01-workflow.png`, `02-capabilities.png`, and `03-training.png`. The supplied hiring graphic is an additional style reference for crisp stepped silhouettes, warm highlights and recognizable objects. Use live geometry for interactive graphics rather than flattening scenes into the preview PNGs.

- [x] Workflow: extend `src/soup/motion/ProcessArt.tsx` and `process-scene.css`. Retain every GSAP target class and process count, data-to-export sequence, transport controls, visibility pause and reduced-motion finished frame. Replace smooth diagonals with grid cells; use warm solid surfaces and file/chip silhouettes.
- [x] Data and evaluation: extend the current owners in `public/soup/hydra/document-cloud.js`, `src/soup/HydraAnimations.tsx`, and `hydra-animations.css`. Keep scroll-driven document-to-graph interpolation, hit testing, theme awareness, pointer-following evaluation light and teardown. Render blocky documents and square graph nodes, stepped/dithered light and segmented particles without blur.
- [x] Zero: extend `src/soup/zero/ZeroScenes.tsx` and `zero-scenes.css`. Preserve station navigation, all states, six-to-one assembly and existing animation lifecycles; use a consistent pixel presentation for tool windows, graphs and indicators.
- [x] Interface: compose reusable integer-grid icons in `src/soup/PixelIcon.tsx`, extending existing `PixelToolIcon` use. Integrate in header/footer, copy/arrow controls, methods, workbench, recipes and community. Existing source-derived brand pixel paths remain the identity owner.
- [x] Soup Easter egg: add a small pixel bowl with three animated steam trails beside the footer brand. Keep it decorative and localized-copy-free, with hover response and a static reduced-motion state. Reuse the same React/SVG and CSS presentation mechanism; no new dependency.

## Mechanism choices

All choices extend existing React/SVG, canvas, GSAP and CSS owners. No chart library, new UI state system or raster overlay is introduced. Pixel paths are bounded integer-grid geometry, text remains selectable or accessible as before, and theme colors continue to come from existing tokens. All decorative graphics are aria-hidden; interactive controls retain their translated labels and focus behavior.

## Validation

- [x] Run current `npm test` and `npm run typecheck` as regression checks; add focused geometry/behavior tests only for substantial new deterministic behavior.
- [x] Run scoped ESLint/Prettier checks and the project's production `npm run build`.
- [x] Use installed agent-browser on local Astro server to inspect `/`, `/zero/`, one translated landing page and a light theme at desktop and mobile widths.
- [x] Exercise workflow tabs and play/pause, Zero station selection, pointer interactions and reduced-motion emulation. Check console errors and horizontal overflow. Save screenshots in `docs/soup/qa/`.
- [x] Review implementation against all three references, report local evidence separately from deployment. User has authorized implementation, not deployment.
