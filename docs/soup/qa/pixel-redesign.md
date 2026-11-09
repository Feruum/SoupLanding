# Pixel redesign verification — 2026-11-09

The user approved the three generated references under `../pixel-approval-v1/` and authorized implementation, matching pixel icons, and a literal-soup Easter egg. Runtime evidence below is from the local site at http://127.0.0.1:3113/. No deployment was performed.

## Delivered

All six workflow illustrations use solid warm pixel silhouettes, files, chips and stepped model layers. Data documents morph into a coarser graph with representative square nodes and stepped connections. Evaluation preserves its quiet numbered strip and reveals subtle dithered light inside a bounded region to the right of the number and above the label. Zero retains its ten stations, six-window assembly, monitoring trace and lifecycle pipeline. Header, footer, copy controls, section arrows, workbench graphics and community icons share integer-grid glyphs; source-derived ecosystem/model logos retain their original identities. The footer contains a decorative bowl with three steam trails.

## Animation checks

| Surface | Local browser evidence |
| --- | --- |
| Six workflow scenes | Every kind advanced its progress transform; pause held it stable, resume advanced it again, and moving offscreen held it stable. All six selected states render without NaN geometry. |
| Hero and footer field | Live reduced-motion switch holds the hero canvas pixel hash stable; removing reduction resumes changing hashes. Shared lifecycle tests cover hidden documents, offscreen fields and invalid canvas dimensions. |
| Data cloud | Scroll moves documents into the coarse graph; canvas node hover reveals the original representative label (`#0541` observed). Canvas smoke covers resize, palette updates, reduced motion and complete RAF/listener cleanup. |
| Evaluation | Pointer lighting follows the cursor; keyboard focus sets the lit state. Dithered light is clipped to the text-safe right region in dark/light themes and at 390px without overflow. The rejected repeated lamp-shaped sprites were removed. |
| Ecosystem carousel | Its transform advances, remains stable under explicit pause and advances after resume. Focusing carousel links still pauses it for reading. |
| Zero stations | All ten selections render valid scenes. Data, Fine-tuning, Evals and Deploy advance live process timelines. Playground token animations and Monitoring sweep advance their animation clocks. Other stations retain their intended static diagrams. |
| Zero global pause | Monitoring's computed animation state becomes paused and returns to running. Zero hero canvas hashes change, hold stable during pause and resume changing afterward. |
| Zero assembly and pipeline | Six tool-window animations advance. All seven lifecycle selections retain exactly one active pipeline node; forward and feedback packet animations run while visible. |
| Soup bowl | Steam moves while visible, pauses offscreen, and has animation-name none under reduced motion. |
| Scroll and theme motion | Existing entrance, deep-link, focus, theme restoration and reduced-motion regression tests pass. Theme toggle and both palettes were inspected in the browser. |

## Bugs found and fixed during verification

1. Workflow GSAP timelines previously ignored a live reduced-motion change. The component now tears down to a finished frame and rebuilds only under its existing visibility, pause and keyboard-navigation gates.
2. Hero canvas previously captured reduced motion only on mount and could restart with invalid geometry or in hidden documents. Media, viewport, document visibility and measurement now share a bounded start/stop gate.
3. Carousel focus-within included its own play/pause button, preventing resume until the button lost focus. Focus pausing now applies to the carousel links region.
4. User rejected the repeated small lamp silhouettes in evaluation. Replaced them with an interaction-only, full-height dithered light field and restored the original compact numbered layout. No idle decorative objects remain in the strip.

## Automated results

- `bun run test`: 53 passing tests, zero failures. Includes four new hero lifecycle regressions, two process lifecycle regressions, six full-cycle timeline readability regressions and true staircase geometry coverage.
- TypeScript `tsc --noEmit`: passed.
- Scoped ESLint and Prettier: passed. `git diff --check`: passed.
- Final `bun run build`: passed, 7,073 pages built. All 52 catalogues, static-page checks and documentation checks passed.

Desktop checks used 1440 × 1000; mobile checks used 390 × 844. `/`, `/zero/`, and `/ru/` were inspected, including light theme and reduced motion. No horizontal page overflow or browser JavaScript errors were observed in those checked states. This is browser emulation, not a claim of testing on physical phones.

## Review artifacts

- [Refined training scene](pixel-v2-train-confirmed.png)
- [Refined data scene](pixel-v2-data.png)
- [Refined configuration scene](pixel-v2-config.png)
- [Soup footer](pixel-soup-footer.png)
- [Zero desktop](pixel-zero-desktop.png)
- [Zero mobile](pixel-zero-mobile.png)
- [Russian mobile workflow](pixel-workflow-mobile-ru.png)
- [Light theme](pixel-light-desktop.png)
- [Text-safe evaluation light](pixel-evaluation-refined.png)

## Follow-up visual correction

The user rejected flattened model plates, crude document proportions and text-overlapping evaluation particles. Training plates now have a 208×72 projection, 8-unit side depth and a regular 6×6 weight lattice. Input/output rows have fine borders and 2-unit corners; chip bodies have dark insets. The YAML document is 135×160 and every source tile stays anchored during assembly. Primary rails are 2px. Activation fills are limited to .08 and have no stroke. The checkpoint has internal code rows, remains readable, and the incoming rail ends at its edge. Labels inside dark diagram tiles use a light ink in both themes, avoiding black text on brown in the white theme.

Timeline tests sample actual GSAP targets every 25ms through full cycles and resets. Records and YAML rows now stay at .9 or above (rejected duplicate: .65); clean outputs remain visible, and checkpoint/export artifacts retain .8 baselines. Browser frames were reviewed during motion, including compact Zero and 390px layouts. Evaluation art bounds stay strictly to the right of each number and above each label in both desktop and mobile geometry checks.
