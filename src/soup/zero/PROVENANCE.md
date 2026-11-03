# Soup Zero source and implementation notes

Source reviewed on October 31, 2026: [Soup Zero](https://trysoup.dev/zero), together with the linked [installation](https://trysoup.dev/docs/getting-started), [training](https://trysoup.dev/docs/training), [evaluation gate](https://trysoup.dev/docs/eval-gate), and [serving](https://trysoup.dev/docs/serving) documentation.

The page includes every meaningful product section from the live Zero page: the ownership proposition and concept workbench; the three pain points around limited interfaces, fragmented tools and private data; all ten lifecycle stations; the no-code, copilot and terminal entry points; the data-to-production feedback loop; the evidence-backed release verdict; and the live CLI installation path. Shared navigation and footer belong to the site shell.

The product state remains explicit throughout: Soup Zero is an upcoming desktop workbench; only the fine-tuning, evaluation and serving engines are presented as available now through the open-source Soup CLI. Preview controls change the illustration. They do not run training, execute commands, connect to a model, upload data or simulate a successful real job. The no-code action reveals the corresponding terminal commands rather than claiming to train. Curves, pixel meters, run IDs and SHIP are marked as illustrative.

The install command and the three terminal examples are preserved exactly from the live Zero page:

```sh
pip install "soup-cli[train]"
soup train --config soup.yaml
soup eval custom --model ./output --tasks quality.jsonl
soup ship --base Qwen/Qwen2.5-3B --adapter ./output --task-eval quality.jsonl --config soup.yaml
```

The planned no-code preview retains the example Llama model, support-ticket dataset, 4-bit quantization, LoRA rank 16, automatic batch sizing, learning rate 2e-4 and two epochs. The source's estimated training duration was omitted because it is illustrative and hardware dependent. The preview does not publish invented benchmark scores or a claimed model improvement.

The motion systems use different visual forms rather than repeating spherical particle scenes:

- The hero alone uses `ZeroPixelField.tsx`, an original Canvas 2D ASCII renderer with 620 deterministic characters projected onto six coherent rectangular model layers. It uses no globe or sphere geometry. Pointer parallax, depth ordering and a scan line describe a model core. The loop is capped at 30 frames per second, with device pixel ratio capped at 2; it stops offscreen, when the document is hidden, or on explicit pause. Reduced motion renders a static frame. It follows the shared palette picker.
- Fragmentation is a flat composition of six actual tool/file windows (terminal, notebook, configuration, SSH, prompts and eval scripts). Staggered arrivals and small rail pulses connect them to one clean Soup Zero workspace. Zero does not import or render `DocumentCloud`; the original Hydra effect remains exclusive to the main site where it is appropriate.
- Every station has a distinct flat preview: token streaming, dataset rows, prompt comparison, document retrieval, tool calls, model-layer updates, an evaluation ledger, serving packets, monitoring or team review. No station renders the hero particle engine.
- The lower lifecycle visual is a legible five-stage pipeline, moving feedback rail and artifact ledger. It does not reuse either the hero renderer or fragmentation composition.

All new motion CSS is scoped to Zero. Intersection observers pause CSS illustrations offscreen; document visibility and the shared pause control stop them; reduced motion produces still compositions. Mobile layouts stack the six tool windows above the unified workspace and retain the pipeline as readable rows.

All new editorial strings live in flat `content.en.json`. `SoupZero` takes the shared `m` catalogue for existing command-copy feedback, `language` for local links and an optional `content` catalogue. Without translated content, its content wrapper declares English explicitly. The parent site maps these content keys into the shared 52-language catalogue; this module owns no routes, shared headers, footers or global styles. All CSS selectors are scoped to `.soup-zero` and animation names use the `zero-` prefix.

Verification: the full TypeScript check and scoped ESLint pass. Eight tests cover flat-scene variety, six-tool convergence, pipeline selection and source-engine lifecycle behaviour, including finite mobile/desktop projection, offscreen cancellation, reduced motion, explicit pause, hidden-document cancellation and unmount cleanup. The parent task owns integrated desktop/mobile visual and interaction QA. These unit tests establish renderer lifecycle behaviour, not real-device performance.
