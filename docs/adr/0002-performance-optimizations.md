# Performance optimizations — hypotheses pending field+lab measurement

Date: 2026-09-03
Status: memo — static inspection only (no runnable trace yet per `references/MEASUREMENT.md`)
Source: `src/layouts/Base.astro:3`, `src/styles/global.css:13`, `src/pages/index.astro:12`, `src/components/Hero.tsx:48`, `src/components/ProjectBrowser.tsx:145`, `src/lib/lenis.ts:5` + `dist/` build 2026-09-03 (`16M`, `pnpm build`)

> All findings are **hypotheses** until the measurement workflow runs. See `docs/agents` skill: run `pnpm dev` (port 4321) then a mobile lab trace (DevTools `performance_start_trace` + `performance_analyze_insight` for `LCPBreakdown`, `LCPDiscovery`, `DocumentLatency`, `RenderBlocking`, `ThirdParties`) plus a Lighthouse lab run, and query CrUX for the deployed origin. No field data exists for `localhost`. Record median of 3 cold-cache navigations with viewport/CPU/network declared before editing.

## Budgets (initial guardrails, to calibrate after measurement)

| Resource | Budget | Current (gz) on disk | Notes |
|----------|--------|----------------------|-------|
| Total page weight | < 1.5 MB | ~1.45 MB gz for `_astro` chunks alone; `devicon.svg 2.6MB gz` pushes total >> budget | `dist/_astro/devicon.Dg8iWy0i.svg:6.7MB raw / 2.6MB gz` + `devicon.{eot,woff,ttf}:1.5MB raw each` |
| JS (compressed) | < 300 KB | `client 56KB + chunk-FOHPRMQF (motion) 141KB + lenis chunk ~6KB + Hero 1.3KB` ≈ 204KB initial; plus lazy `MarkdownRenderer 103KB` + `cytoscape 136KB` etc. when ProjectBrowser hydrates | `motion` chunk is ~47% of budget alone |
| CSS (compressed) | < 100 KB | `index.DeivKaqQ.css:26KB gz` | Within budget but contains devicon font refs |
| Fonts | < 100 KB | `inter-latin 48KB + inter-latin-ext 85KB + space-grotesk-latin 22KB + ... ≈ 268KB raw` (~70KB gz for latin only) | `@fontsource-variable` imports all subsets |
| Third-party | < 200 KB | `raw.githubusercontent.com` README fetches (unbounded markdown + images) | `ProjectBrowser.tsx:145` prefetches all READMEs |

## 6 optimizations (prioritized by budget breach)

### 1. Remove `devicon` — largest weight offender
* **Where:** `src/layouts/Base.astro:3` imports `devicon/devicon.min.css`; consumed only by `src/components/SkillCard.tsx:34` (`<i class="${icon}">` over `src/content.ts:8` 15 skills).
* **Hypothesis:** Single asset `devicon.Dg8iWy0i.svg:6.7MB/2.6MB gz` + 1.5MB font files dominate transfer, compete for bandwidth, block render. Will appear as `RenderBlocking` + network contention.
* **Change:** Delete `Base.astro:3` and `devicon` dep; replace with `lucide-react` (already in deps) or inline SVGs / `@iconify` subset. Expected saving ~2.6MB gz + eliminate 3 font files.
* **Verify:** `pnpm build && ls -lh dist/_astro/devicon*` → absent; `gzip -c dist/_astro/index.css | wc -c` drops; Lighthouse "Reduce unused CSS/Fonts" clears.

### 2. Font subset + `font-display: swap` + selective preload
* **Where:** `src/styles/global.css:13-14` `@import "@fontsource-variable/inter"` / `space-grotesk"` pulls every unicode subset; no `font-display`; no preload in `src/layouts/Base.astro:16`.
* **Hypothesis:** Above-fold LCP text (`src/components/Hero.tsx:51` `text-display`) font-blocked (FOIT). Trace `LCPBreakdown` / `LCPDiscovery` will show font discovery delay.
* **Change:** Import only `latin` subset (`@fontsource-variable/inter/latin.css` etc.), set `font-display: swap`, preload only critical latin woff2 (`inter-latin-wght-normal.Dx4kXJAl.woff2:48KB`, `space-grotesk-latin-wght-normal.BhU9QXUp.woff2:22KB`) with `<link rel="preload" as="font" crossorigin>` — only if trace confirms late discovery per skill (each preload competes for bandwidth).
* **Verify:** Trace `LCPBreakdown`; Lighthouse "Ensure text remains visible during webfont load" passes.

### 3. Defer Hero hydration and drop `filter: blur` on scroll
* **Where:** `src/pages/index.astro:12` `<Hero client:load />` + `src/components/Hero.tsx:1` `motion/react` → `chunk-FOHPRMQF.DHwB1DNv.js:662KB/141KB gz`; scroll handler `Hero.tsx:17-27` + `style={{opacity, scale, filter: blur}}` at `Hero.tsx:48`.
* **Hypothesis:** Eager island + 141KB motion payload inflates TBT/INP proxy; `filter: blur(10px)` on sticky hero repaints large layer on every scroll tick (layout thrash risk via `offsetHeight` read + `scrollProgress.set`).
* **Change:** Switch to `client:visible` or `client:idle` or make Hero static Astro with CSS-only parallax; keep only `opacity/transform` (GPU-composited), remove `blur`, batch reads/writes or throttle via `requestAnimationFrame`.
* **Verify:** Median of 3 lab runs: initial JS gz `<120KB gz` target, trace `TBT` / `RenderBlocking` drop, no blur layer in trace.

### 4. Throttle README prefetch and gate `raw.githubusercontent.com`
* **Where:** `src/components/ProjectBrowser.tsx:145-163` fetches every uncached `readmeUrl` on mount (`src/content.ts:106`); `src/components/MarkdownRenderer.tsx:28` resolves arbitrary external images.
* **Hypothesis:** Unbounded third-party transfer + TLS/DNS stall before LCP; appears as `ThirdParties` insight + inflated data cost.
* **Change:** Gate prefetch behind `seen` + `requestIdleCallback`, limit to 1 next tab, add `<link rel="preconnect" href="https://raw.githubusercontent.com" crossorigin>` in `Base.astro:16` only after trace shows stall; consider cache-control / ETag for READMEs.
* **Verify:** Network panel bytes, trace `ThirdParties`, no prefetch waterfalls before LCP.

### 5. Load Lenis lazily and respect `prefers-reduced-motion` before init
* **Where:** `src/components/Lenis.astro:5-6` + `src/lib/lenis.ts:5` `new Lenis({autoRaf:true})` runs RAF loop every frame.
* **Hypothesis:** Continuous RAF work adds long tasks / jank, especially with `Aurora.astro:57-73` large blurred blobs (`80-90rem`, `filter: blur(2px)`, `will-change: transform`, 28-36s animations).
* **Change:** Dynamic `import('lenis')` on `idle` and early return if `matchMedia("(prefers-reduced-motion: reduce)").matches`; keep Aurora already guarded at `Aurora.astro:128` but add `contain: paint` to blobs.
* **Verify:** Trace long tasks / main-thread blocking, FPS smoothness check via `playwright-cli --browser firefox` trace.

### 6. CSS coverage and README image guardrails (CLS/weight)
* **Where:** `src/styles/global.css:1` `@import "tailwindcss"` → `dist/_astro/index.DeivKaqQ.css:158KB/26KB gz`; `src/components/MarkdownRenderer.tsx:269` `<img loading="lazy">` without dimensions; long README pane `src/components/ProjectBrowser.tsx:283` no `content-visibility`.
* **Hypothesis:** Unused Tailwind utilities bloat CSS render-block; external markdown images without `width/height` cause CLS when `ProjectBrowser` swaps phases (`--wipe` clip-path).
* **Change:** Verify Tailwind v4 purge covers `src/**/*.{astro,tsx}` via `astro.config.mjs:10`; add `decoding="async"` + `width/height` or aspect-ratio wrapper for remote images, `content-visibility: auto` + `contain-intrinsic-size` for long readme bodies.
* **Verify:** DevTools Coverage, lab `CLS` (trace), Lighthouse "Reduce unused CSS" / "Cumulative Layout Shift".

## How to verify (repeatable)

```bash
# Lab — record conditions per MEASUREMENT.md
pnpm build
npx lighthouse http://localhost:4321 --preset=perf --throttling.cpuSlowdownMultiplier=4 --form-factor=mobile --output=json --output-path=.tmp/lh.json
# or: playwright-cli --browser firefox → performance_start_trace (reload, auto-stop) → performance_analyze_insight [LCPBreakdown, LCPDiscovery, DocumentLatency, RenderBlocking, ThirdParties]
# Repeat 3× cold cache, report median + range. Do not compare single local trace to CrUX p75.
```

Field check (when origin is deployed): `https://chromeuxreport.googleapis.com/v1/records:queryRecord` for `origin` scope, `formFactor: PHONE`, p75 vs thresholds. Treat missing CrUX as unavailable, not passing. Re-run lab after each fix above; field verification remains pending until 28-day window rolls.
