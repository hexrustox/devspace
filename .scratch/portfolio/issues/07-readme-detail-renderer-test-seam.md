# 07: Readme Detail renderer & the test seam

**What to build:** The codebase's one test seam, fully working and fully tested: a renderer that takes a readme URL and markdown, fetches the readme, rewrites relative image/link paths against the repository's raw base URL (making repo-relative screenshots render), and outputs dark-themed HTML with GFM, raw HTML, and highlighted code — plus loading and error states and mobile containment. Tested with fixture readmes asserting rendered output only.

**Blocked by:** 01 (Scaffold, theme tokens & Content Source).

**Status:** ready-for-agent

- [ ] Given markdown + readme URL, renders styled dark-theme HTML via the markdown pipeline (GFM, raw-HTML passthrough, syntax highlighting)
- [ ] Relative image/link paths resolve against the repo raw base URL; screenshots display
- [ ] Already-absolute URLs are left untouched
- [ ] Distinct loading state and error state (error links to the repository)
- [ ] Images are max-width contained; wide tables scroll horizontally on mobile
- [ ] Vitest + React Testing Library suite covers fixtures: relative images, raw-HTML `<img>`, GFM tables/task lists, fenced code, absolute URLs, fetch failure (mocked)
- [ ] Tests assert rendered output, never component internals or class names
- [ ] Grayscale prose styling — no accent color in rendered readme content
