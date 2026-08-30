# 01: Scaffold, theme tokens & Content Source

**What to build:** The project skeleton end-to-end: an Astro app with React islands, TypeScript strict, Tailwind v4, Motion, and Lenis installed; the dark grayscale palette and pinned type scale defined as theme tokens; Space Grotesk display and Inter body self-hosted; a typed Content Source holding placeholder site identity, skills, and projects; and a stub page that renders the site title from the Content Source, proving the content pipe. The Vitest + React Testing Library + jsdom test rig is configured and a smoke test passes.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] Build passes clean; dev server shows a dark page using the theme tokens
- [x] Palette tokens defined: base `#0A0A0B`, surface `#131316`, text `#EDEDEF`, muted `#8A8A93`
- [x] Pinned type scale (display / body / caption) exists; Space Grotesk + Inter load via fontsource
- [x] Content Source schema typed: site identity (name, title, email, socials), skills (name, icon, one-line blurb, Brand Gradient start/end hexes), projects (title, slug, blurb, tags, readme URL)
- [x] Placeholder content filled in and structured identically to real content
- [x] Stub page renders the site title from the Content Source (no hardcoded copy)
- [x] Vitest + React Testing Library + jsdom run via one command; smoke test green
- [x] Content Source shape enforced by types; malformed entries fail typecheck/build

## Comments

Implemented. Astro 7 + @astrojs/react 6 + React 19 + Tailwind v4 (Vite plugin) + Motion 13 + Lenis at repo root; `astro/tsconfigs/strict` with `jsx: react-jsx`. Theme tokens in `src/styles/global.css` `@theme` (palette, `--font-display`/`--font-body`, pinned `--text-display`/`--text-body`/`--text-caption` scale); fonts self-hosted via `@fontsource-variable/space-grotesk` + `@fontsource-variable/inter`. Content Source is `src/content.ts` — types (`SiteIdentity`, `Skill` with `BrandGradient` `` `#${string}` `` hexes, `ProjectEntry` with `https://${string}` readme URLs) + `satisfies`-annotated placeholder data. Stub `index.astro` renders `site.name`/`site.title` from the Content Source. Test rig: Vitest 4 + RTL + jest-dom in jsdom via `pnpm test`; smoke test renders a React component fed by the Content Source and asserts slug uniqueness. `pnpm build` = `astro check && astro build` so malformed content fails the build. Verified: `pnpm check` 0 errors, `pnpm test` 2/2, `pnpm build` clean, `dist/index.html` shows tokens + hashed font assets.
