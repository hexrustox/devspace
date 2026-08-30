## Tech stack

- Astro 7 (`output: "static"`), React 19 islands, Tailwind CSS v4 via `@tailwindcss/vite`, TypeScript strict (`astro/tsconfigs/strict`, JSX `react-jsx`)
- Tests: Vitest 4 + Testing Library + jsdom; jest-dom matchers auto-loaded via `src/test/setup.ts`
- pnpm only: `devEngines` pins pnpm `^11.22.0` with `onFail: "error"` — npm/yarn hard-fail

## Commands

- `pnpm dev` — dev server on port 4321
- `pnpm check` — typecheck gate: `astro check && tsc --noEmit`. No eslint/prettier/biome in this repo; `check` is the lint+type step (and `pnpm build` runs it too)
- `pnpm test` — vitest run; single file: `pnpm exec vitest run src/smoke.test.tsx`, single test: add `-t "<name>"`
- If typecheck fails on missing `.astro/types.d.ts`, run `pnpm exec astro sync` (it's generated, not committed)

## Architecture

- Single-page portfolio: `src/pages/index.astro`, layout `src/layouts/Base.astro`
- `src/content.ts` is the Content Source — all site content (identity, skills, projects) lives there; editing content never touches components
- Theme tokens (colors, fonts, type scale) live in the `@theme` block of `src/styles/global.css`; use the generated Tailwind utilities (e.g. `font-display`, `text-text`)
- Read `CONTEXT.md` before naming domain concepts and `docs/adr/` before touching the readme-fetch flow (ADR 0001: readmes fetched at runtime from the Content Source)

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default canonical triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Uses a single-context layout. See `docs/agents/domain.md`.

### Browser automation

Uses `playwright-cli` for browser automation and page checks. Always pass `--browser firefox` — Chrome is not installed.

When verifying pages with playwright-cli, never start the server yourself:
- If `pnpm dev` is not already running (port 4321), ask the user to start it — never run it yourself
- Never run `pnpm preview`; assume `pnpm dev` output matches the visuals
