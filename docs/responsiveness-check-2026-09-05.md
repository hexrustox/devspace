# Responsiveness Check: http://localhost:4321/

**Date**: 2026-09-05
**Mode**: Standard
**Breakpoints tested**: 320, 375, 768, 1024, 1280, 1440, 1920, 2560 (plus probes at 340, 360, 420, 440, 480, 520, 560, 640, 720, 740, 760, 800, 880, 900, 940, 960 for transition detection)
**Browser tool**: playwright-cli (Firefox), single session, viewport height 900px

## Summary

| Width | Status | Issues |
|-------|--------|--------|
| 320px | Fail | 1 high (horizontal overflow, clipped hero text) |
| 375px | Warn | 2 medium (hero text touches edges; oversized skill cards) |
| 768px | Pass | — |
| 1024px | Pass | — |
| 1280px | Pass | — |
| 1440px | Pass | — |
| 1920px | Pass | — |
| 2560px | Pass | — |

**Overall**: 3 issues across 2 breakpoints. The page is solid from 375px up; the only real break is below ~340px where the 72px hero heading forces a 20px horizontal overflow with visibly clipped text.

## High Issues

### Hero heading forces horizontal overflow and clips text at 320px — High

**Width(s)**: 320px (overflow zone ≈ 320–339px; clean from ~340px up)
**Check**: Horizontal overflow + text overflow

At 320px the h1 (`font-display text-display`) renders at a fixed 72px / 72px line-height. The single word "Engineer" cannot fit in the available width and cannot wrap, so the h1 (and the whole hero content column) measures 340px wide against a 320px viewport — `document.scrollWidth` 340 vs `clientWidth` 320. The result is a 20px horizontal scrollbar and visibly clipped text:

- "Hello, I am" clips at the right edge of the viewport (screenshot: `.playwright-cli/respshots/320.png`)
- The intro paragraph ("...Linux CLI too[ls]") clips on both sides
- The CTA row ("View projects" / "Contact me") is cut off at the right edge

Note the hero section itself has `padding: 0` — all spacing comes from inner containers — so there is no safety margin absorbing the oversized word.

**Fix suggestion**: Scale the display size down at small widths, e.g. make the `text-display` token fluid with `clamp(2.75rem, 8vw, 4.5rem)`, or add an `xs` override (`text-5xl` below `sm`). Optionally add horizontal padding to the hero section as a guard.

## Medium Issues

### Hero text touches viewport edges at 375px — Medium

**Width(s)**: ~340–375px
**Check**: Whitespace balance

Even where there is no measurable overflow (375px: `scrollWidth` = 375), the h1 and intro paragraph run edge-to-edge with zero breathing room — "Hello, I am a" and the paragraph's first line sit flush against the viewport edge. It reads as cramped rather than intentional.

**Fix suggestion**: Give the hero content container `px-6` (matching the `skills`/`projects` sections) or reduce the display size at this range.

### Full-width aspect-square skill cards on mobile create excessive dead space — Medium

**Width(s)**: ~320–420px (1-column grid range)
**Check**: Whitespace balance / content stacking

Below the 1→2 column transition (~400px), the skills grid is a single column of `aspect-square` cards. Each card is ~327px tall to display a small icon and a label, so the skills section is **5,343px tall at 375px viewport** (≈6 screens of scrolling for 15 items). Cards are not broken — just very sparse.

**Fix suggestion**: Cap card height on small screens (e.g. drop `aspect-square` below `sm` in favour of a fixed row height like `h-40`, or switch to `aspect-[4/3]`).

## Low Issues

### Project title links are 40px tall — Low

**Width(s)**: all mobile widths (< 768px)
**Check**: Touch targets

The four project title links ("OctaDash", "Devspace", "Dotrift", "Nix Capsule") measure ~40px in height, just under the 44px touch-target guideline. All other interactive elements (hero CTAs, contact links) pass.

**Fix suggestion**: Add `py-2` or `min-h-11` to the project link rows.

## Transition Analysis

Navigation transition: **N/A** — the page has no `<header>`/`<nav>` and no hamburger; the hero CTAs are the only top-level navigation and are visible above the fold at every width tested.

| Transition | Observed At | Clean? | Notes |
|-----------|-------------|--------|-------|
| Skills grid: 1-col → 2-col | between 375–420px (~400px) | Yes | `auto-fill minmax()` track sizing; no overlap at any probe width |
| Skills grid: 2-col → 3-col | between 520–560px | Yes | — |
| Skills grid: 3-col → 4-col | between 720–740px (~730px) | Yes | — |
| Skills grid: 4-col → 5-col | between 880–900px (~890px) | Yes | Capped at 5 cols by `max-w-5xl` container |
| Hero overflow → fits | between 320–340px (~340px) | No | Overflow with clipped text on the low side of the transition |

All grid transitions are clean — the `repeat(auto-fill, minmax(...))` pattern reflows smoothly with no intermediate broken states.

## Per-Breakpoint Notes

Only breakpoints with findings included; 768–2560px are clean (no overflow, sensible whitespace, CTAs above fold).

### 320px — Fail

- **[High]** Horizontal overflow of 20px; hero h1 and paragraph clip at viewport edges; CTA row cut off on the right
- Nav: N/A (no nav bar); hero CTAs above fold
- Skills/projects stack to single column in correct order

### 375px — Warn

- **[Medium]** Hero text runs edge-to-edge, no side margin
- **[Medium]** 1-col aspect-square skill cards make the skills section ~5,343px tall
- **[Low]** Project links 40px tall (touch target)

## Recommendations

### Quick Fixes (CSS only)

- Fluid display size: `text-display` → `clamp()` or an `xs:` override so "Engineer" always fits (fixes the 320px overflow)
- Add `px-6` to the hero content container for side margins at all widths
- `min-h-11` on project title links

### Structural Changes

- Consider a non-square card ratio (or fixed height) for skill tiles on mobile to cut ~6 screens of scrolling in the skills section
