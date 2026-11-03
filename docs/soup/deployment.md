# Vercel deployment — 31 October 2026

Production: https://souplanding-omega.vercel.app/

Project: `ferumms-projects/souplanding`. Published using the installed Vercel CLI and `vercel deploy --prod --yes --scope ferumms-projects`. The CLI reports production status **Ready**. No custom domain was connected.

`vercel.json` configures Astro, the full verified build, the `dist/client` output, trailing slashes, and immutable caching for fingerprinted Astro assets. `.vercelignore` excludes environment files, local logs, QA screenshots, and unused original assets. The local project binding is ignored by Git.

Cloud verification completed successfully: 6,969 generated pages, all 6,968 localized routes, 338 checked built page bodies, 52 complete interface catalogues, 131 documentation articles, 667 code blocks and 1,957 local links. All 33 local tests pass.

Public HTTPS checks returned 200 for `/`, `/zero/`, `/docs/`, `/docs/getting-started/`, `/ru/`, `/kk/`, `/ar/` and `/kk/docs/getting-started/`. Compiled CSS returns 200 with immutable cache headers. An unknown route returns 404; `/docs` redirects to `/docs/` with 308.

Browser verification confirmed the production hero, the main CTA opening Getting Started, the article reader and the Zero scroll entrance. The browser reported no console errors. Screenshot: [production homepage](qa/vercel-production.jpg).

For subsequent deployments, use the plain upload command above. Archive packaging stalled with the installed Windows CLI version; ordinary upload completed after retrying a temporary DNS failure.

## Process animation update

The production alias was updated to deployment `souplanding-f55lprfg6-ferumms-projects.vercel.app` using Vercel CLI. Status: Ready. Cloud build and all locale/documentation verification completed again (6,969 pages). There are now 38 passing local tests, with TypeScript and scoped ESLint passing.

Public homepage and Zero responses contain the new process components. Browser verification on the production alias confirmed the animated model layers and pause/resume; the console was clean. Current screenshot: [training sequence](qa/process-training-production.jpg). Six distinct operations are available in the homepage workflow.

## Larger, brighter pixel scenes

Published the brightness/scale refinement to production via Vercel CLI: `souplanding-6jabv877v-ferumms-projects.vercel.app`, status Ready, alias unchanged. The cloud build generated and verified all 6,969 pages again. Local checks: 39 tests, TypeScript, scoped ESLint and formatting passed.

Production browser verification confirmed the new 5.4-second cycle, focused Zero model viewport, stronger pixel contrast, pause/resume and clean console. At the default desktop viewport, the focused model spans about 401 CSS pixels. Mobile checks showed 233px for the Zero model and 250px in the homepage workflow, without horizontal page overflow. Screenshot: [larger pixel scene](qa/process-vivid-production.jpg).
