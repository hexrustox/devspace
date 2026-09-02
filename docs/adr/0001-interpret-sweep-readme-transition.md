# Interpret-sweep README transition

The Projects section shows each Project's GitHub README raw before it is rendered: a beam sweeps the pane, revealing rendered content over a tinted source layer (and reversing to un-render onto the next Project's raw source when switching). Raw markdown and rendered output share no element structure, so morphing is impossible — instead the raw layer always holds the destination Project's source and a single registered `--wipe` custom property drives both a `clip-path` on the rendered layer and the beam, making a forward sweep over raw the only path to rendered. Raw source is styled (fences and headings tinted), never shown as broken; switching projects, retries, and interrupts all re-enter through the raw stage, and `prefers-reduced-motion` collapses the sweep to a crossfade.

## Considered Options

- Plain crossfade — rejected: discards the "renderer at work" moment the section is built around
- Reflow stagger (raw lines out, rendered blocks in) — rejected: reads as generic motion design, not as interpretation
- Cursor parse (block cursor consumes source while rendered blocks append) — rejected: per-chunk timing over a full README is either too slow or degrades into the sweep

## Consequences

- The pane's height is fixed and its scroller sits inside the glass layer; `backdrop-filter` stays off the scroll path
- The browser renders both layers during a sweep; the raw layer is `aria-hidden` and the rendered layer remains the accessible panel throughout
- The glass sheet sits on the page's plain background (no ambient field), reading via its translucent fill, border, and inset highlight
