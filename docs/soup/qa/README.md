# Local delivery verification — 31 October 2026

Local site: http://127.0.0.1:3113/ · Zero: /zero/ · Documentation: /docs/.

The production build completed successfully with 6,969 pages, including the 404 page. All 6,968 localized routes exist. Verification reads 338 built page bodies covering every English article and every page family in all 52 locales; it also checks all 52 homepage metadata, direction and language catalogues. The full source documentation graph contains 131 articles, 667 code blocks and 1,957 valid local links. Duplicate article anchors are resolved. Original article bodies remain English and are explicitly marked; surrounding controls, homepage and Zero content use 52 catalogues of 264 strings.

Thirty-nine tests pass. Full TypeScript and scoped ESLint pass. Tests include translation completeness, original logo provenance/pixel geometry, article anchors, theme persistence/fallbacks, finite canvas geometry, reduced motion, scene lifecycle and one-time scroll entrances.

Browser checks covered:

- Black/white toggle and the 650ms stepped page reveal; no theme gallery remains.
- Mobile 375px content width, 800px tablet and desktop layouts, including Kazakh characters and Arabic RTL.
- All five workbench rows: equal column widths and identical top coordinates on desktop.
- Exact CLI copy feedback, full-body sidebar search (`pipx`), language switching that preserves the current article, and the 52-language footer.
- Pixel logo carousel pause/resume and trace-source selection/command changes.
- Zero station and mode changes; six tool windows, distinct station scenes, one hero canvas and no document cloud in Zero.
- Viewport resize during theme changes and navigation after the canvas fix: a clean production browser tab reported no console errors.
- Scroll entrances on the homepage and Zero: native wheel scrolling starts each entrance once; revisiting a section leaves it visible. Keyboard navigation and deep links show content immediately. Desktop and mobile were checked in black and white themes, with no horizontal page overflow after transitions settle.

Scroll motion uses the existing layout and native Web Animations API. Copy moves 12px over 420ms; panels move 18px over 520ms; illustrations add a small clipped reveal over 560ms. The ease-out curve is `cubic-bezier(0.23, 1, 0.32, 1)`. Sibling stagger is capped at 165ms. Reduced motion, unsupported APIs and failed animations keep content visible; observers and effects are cleaned up on unmount. Hero effects and documentation reading remain unchanged.

Screenshots:

- [Hero](hero.jpg)
- [Aligned workbench](aligned-workbench.jpg)
- [White workbench](white-workbench.jpg)
- [Documentation](documentation.jpg)
- [Theme transition in progress](theme-wave.jpg)
- [Zero workspace assembly](zero-workspace-assembly.jpg)
- [Original-style footer](footer.jpg)
- [Scroll entrance result](scroll-motion.jpg)
- [Zero scroll entrance result](scroll-motion-zero.jpg)
- [Mobile scroll entrance in white theme](scroll-motion-mobile.jpg)

These screenshots document actual local browser rendering. No production deployment was performed.

## Explanatory process motion

The interactive homepage workflow now has six distinct vector sequences: data filtering, method routing, configuration assembly, forward/backward model passes, evaluation checks and model export. Zero uses the relevant data, training, evaluation and export scenes; its other stations retain their separate visual grammar. Existing hero and Hydra animations remain in place.

The 5.4-second explanatory sequences use bounded SVG geometry, CSS timelines, translated play/pause controls and no per-frame React state. Intersections and document visibility pause offscreen work. Keyboard selections, reduced motion, unsupported observation and server-only rendering keep the completed scene visible. Global Zero pause and the local transport share one state.

Desktop/mobile checks covered black and white themes, rapid scene switching, keyboard selection and pause/resume, without page overflow or console errors. Five additional tests cover visibility lifecycle, queued-callback cleanup, progressive enhancement, accessible controls and distinct valid diagrams.

## Brightness and scale refinement

Increased diagram contrast, pixel fill, line weights and label sizes. The desktop workflow allocates more width to the scene. Training layers are enlarged within the geometry; Zero uses a focused model viewport and keeps its input/output in an ASCII caption. Small homepage viewports also show a focused model with the same caption. Two batches of binary tokens travel through each 5.4-second cycle; active layers retain a bright readable baseline. The per-frame runtime and pause/reduced-motion behavior are unchanged.

Browser checks covered all six desktop operations, mobile workflow and Zero, both themes, explicit pause/resume, viewport restoration, and zero page overflow. There are 39 passing tests including the focused-view fallback and its transport control.
