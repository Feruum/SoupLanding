# Hydra animation provenance

The two visual effects are adapted from the actual client source of [HydraDB](https://hydradb.com/), fetched on October 31, 2026. The live HTML identifies its publication as October 29, 2026, 19:35 UTC. Both run locally; they do not load HydraDB pages, analytics, remote scripts, fonts, or images.

## Document cloud

Original source: [Framer homepage chunk](https://framerusercontent.com/sites/3yN5MFa5n4dVVbpo6HCguq/FGzRLxNJqbNRdNj4Zh8VWOqr-ertk0B0Y05lyYholmM.C1slPcGr.mjs), component `Ui` and its `Wi`, `Gi`, `Ki`, `qi` data. It is the live section headed “The knowledge graph for AI,” containing “Recall everything.”

Local implementation: `public/soup/hydra/document-cloud.js`, mounted by `DocumentCloud` in `src/soup/HydraAnimations.tsx`.

Retained directly from the original implementation:

- All 786 graph node coordinates and degrees, all 510 graph edges, the deterministic seed and document sizes.
- The scroll-driven scan divider, document-to-node interpolation, orange motion streaks and edge reveal timing.
- Graph node hover highlighting, connection emphasis, density and the Canvas 2D drawing routines.
- Pixel ratio cap and adaptive rendering resolution.

Integration changes:

- Removed Framer and React runtime bindings and the surrounding marketing copy, metric panels and remote imagery.
- Replaced the Hydra divider mark with a small Soup slash mark. Source sample names were replaced by neutral numeric node IDs; source entity categories are not displayed.
- The desktop canvas remains side by side. The mobile geometry is stacked and independently sized because the original derives its layout from its adjacent text. The canvas defaults to 500px high on desktop and 540px on small screens.
- Runtime source loading uses an absolute same-origin URL to avoid Vite public-directory import rewriting. Import failures render `public/soup/hydra/document-cloud-static.svg`, generated from the same 786 source node coordinates and 510 edges, without an unhandled rejection.
- Reduced motion draws a static completed graph and only redraws on resize. Intersection and document visibility observers pause active rendering. Dynamic preference changes remount the source renderer.

Fidelity limit: the current live implementation is a scroll-driven **2D canvas** of scattered document scraps transforming into a graph. It is not a rotating 3D document swarm. The source does not contain a video, WebGL scene, or 3D document resources for this section. This adaptation preserves that verified live effect; it does not claim to reproduce a different historical screenshot.

## Evaluation strip

Original source: the same [Framer homepage chunk](https://framerusercontent.com/sites/3yN5MFa5n4dVVbpo6HCguq/FGzRLxNJqbNRdNj4Zh8VWOqr-ertk0B0Y05lyYholmM.C1slPcGr.mjs), component `Ri` and its `Vi` stylesheet. It is the current live “SOTA for agent applications” section.

Local implementation: `EvaluationAnimation` in `src/soup/HydraAnimations.tsx`, with source effect styles in `src/soup/hydra-animations.css`.

Retained: the five-cell strip; 6px dot field and 90px pointer mask; orange edge filament; light cone, bloom and wall illumination; pointer-following light location with the original 0.14 interpolation; 240ms edge reveal and original easing; touch press/release timing.

Changed: Hydra benchmark claims and destinations are removed. Cells show a neutral 01–05 sequence, with optional translated `labels`. Fonts inherit the host product. The strip becomes two columns on narrow containers. The cells have no navigation action. Reduced motion uses a static edge; offscreen and hidden-document work is cancelled. Decorative text can be hidden from assistive technology or described with the optional translated `ariaLabel`.

## Archive investigation

The [provided repository](https://github.com/artificial-hedge/artificialhedgesite) was inspected through its recursive Git tree and [archived homepage](https://github.com/artificial-hedge/artificialhedgesite/blob/main/src/source/home.html). That HTML identifies its publication as October 3, 2026, 07:45 UTC and uses different section content (“State of the art on longMemEval’s”). Its older video files were not substituted for the two current live source effects. The source origin links above are recorded for attribution; no unverified licensing statement is made.

## Verification

- TypeScript `tsc --noEmit` and scoped ESLint pass.
- `node --check public/soup/hydra/document-cloud.js` passes.
- A direct engine smoke harness mounted, rendered, resized and unmounted the actual source renderer at 1000×500 and 380×540, with normal and reduced motion. All four cases drew successfully and had zero queued animation frames after cleanup.
- Visual comparison and interaction checks in the integrated page are performed by the parent task; the engine harness does not establish pixel-level browser fidelity or real-device frame rates.
