# Animations and figures

How figures are set up, built, mounted and checked. What a figure shows is
decided by the post; this file decides how it is made.

## 1. Setup

1. The toolkit lives in `content/toolkit/` and is imported as `@toolkit/...`.
2. `global.css` sets five variables on `:root` from the design tokens:
   `--anim-ink`, `--anim-muted`, `--anim-rule`, `--anim-accent`, `--anim-font`.
   `toolkit.css` gives defaults and the layout of controls; `loop.js` reads the
   variables into a palette. A figure therefore draws in the page's colours
   and type in both themes without knowing either.
3. `astro-island { display: block }`, so an island takes the column width.
4. A figure's root element is `<figure class="anim ...">`, or
   `<div class="anim">` around a canvas (which `Canvas.svelte` already
   writes). The class gives the toolkit layout, styles the caption after it
   and lets the check capture the figure.
5. d3, three and p5 are installed. p5 is imported by module in instance mode
   (`p5/core`, `p5/shape`, ...); three only for a truly three-dimensional
   object.

## 2. Choosing the kind

| Kind | Build | Mount |
|---|---|---|
| Static diagram | Svelte or Astro component rendering an inline `svg` | no `client:` directive, ships no JavaScript |
| Interactive diagram | Svelte `svg` with `$state`, toolkit sliders, its own `.anim-controls` row | `client:visible` |
| Animation | `@toolkit/Canvas.svelte` with a `draw` function | `client:visible` |
| Bitmap or GIF | an image imported in the MDX, shown with `@toolkit/Figure.astro` | none |
| Video | `@toolkit/Video.astro`, silent loop | none |

A figure is interactive only when changing something (a parameter, a step,
an index, a quantifier) shows something. Otherwise it is static.

## 3. Mounting

```mdx
import Chain from './Chain.svelte';

<Chain client:visible />

**Figure 3.** What is drawn. What the controls change.
```

The import goes at the top of the MDX; the component stands alone in its
paragraph; the caption paragraph follows at once. A wide figure is wrapped:
`<div class="wide"><Chain client:visible /></div>`.

## 4. Toolkit API

**`Canvas.svelte`** props: `draw(ctx, t, { w, h, dt, p })`, `ratio` (width
over height, default 16/9), `label` (accessible description), `controls`
(Play and Pause button, default on), `autoplay`, `deps` (values whose change
redraws one frame while paused), children (sliders), a `buttons` snippet for
extra buttons. Exported: `redraw()`, `play()`, `pause()`, `isPlaying()`.

**Palette `p`**: `ink`, `muted`, `rule`, `accent`, `font` (labels, about 17 px
on a 19 px page), `smallFont` (about 16 px), `px`, `size`, `fontFamily`.
`withAlpha(colour, a)` from `@toolkit/loop.js` makes a transparent variant.

**`loop(canvas, draw, options)`** (used by `Canvas`): handles device pixel
ratio, resizing, pausing off screen, reduced motion (one frame, then waits
for Play), theme changes and late fonts (it repaints). It sizes the canvas
from its layout box, not from its rectangle on screen, so that a copy scaled
down in a preview draws the same picture.

**`Slider.svelte`**: `label`, `min`, `max`, `step`, `bind:value`,
`format(v)`, `oninput` (every move), `onchange` (end of drag).

**`Figure.astro`**: `src`, `alt`, `width`. **`Video.astro`**: `src`,
`poster`, `ratio`. Both also take `caption`: leave it unset, the caption is
the `**Figure n.**` paragraph that follows.

`narrowRatio` and `narrow` exist for narrow screens; a desktop-only site does
not use them.

## 5. Rules

1. **Colour.** Only the palette or `var(--anim-*)`, plus `var(--page)` to fill
   shapes that hide lines behind them. No colour written by hand.
2. **Type.** `font-family: var(--anim-font)`. Labels read at 16 to 19 px on
   the page at 1280 px. In SVG the size on the page is the `font-size` times
   the `viewBox` scale (displayed width over `viewBox` width).
3. **Notation.** Variables italic, digits and operators upright. Subscripts
   and superscripts in SVG with `<tspan dy>` and a smaller `font-size`, not
   Unicode subscript characters, which text fonts often lack. A canvas
   cannot run KaTeX: use Unicode letters and symbols.
4. **Halos.** A label crossed by a line gets
   `paint-order: stroke; stroke: var(--page); stroke-width: 4px`.
5. **Time.** The toolkit owns the loop: never call `requestAnimationFrame`.
   A simulation advances in fixed steps taken from `dt`, with a cap per
   frame, so that it behaves the same at any refresh rate.
6. **Randomness is seeded** (a small generator such as mulberry32 in a helper
   file), so every reader sees the same first frame. A "New sample" button
   when resampling shows something.
7. **Motion** respects `prefers-reduced-motion`; CSS animations too.
8. **Cost.** A frame takes a few milliseconds. Heavy logic goes in a plain
   `.js` file beside the component.
9. **Size.** A component of 60 to 180 lines; a small figure gets a
   `max-width` and is centred; nothing overflows the column.
10. **Accessibility.** A canvas has its `label`; an SVG has `role="img"` and
    an `aria-label` that says what is drawn; controls are real inputs and
    buttons.
11. **Correctness.** Data comes from the model the post describes. A static
    figure computes its geometry from that model and throws at build time
    when an invariant fails, so a wrong figure cannot be published.
12. **Bitmaps** carry no text: labels go in the caption. Generate them at
    twice their displayed width.
13. **No decoration.** Every mark on a figure means something in the post.
14. **Twice at once.** A figure is mounted a second time, live, in the
    preview of every mention of it, scaled to 0.75, while the page's copy may
    be running. Give SVG ids a per-instance prefix from `$props.id()`, keep
    no mutable state at module level, and take sizes from the layout
    (`clientWidth`, `getComputedStyle`), never from `getBoundingClientRect`
    or `window`.

## 6. Checking

1. A single component, without building:
   `node skills/website/scripts/compile_check.mjs <Name.svelte> <helper.js>`.
2. The page: `make check-site FIGURES=1`, then open the captures
   `.astro/site-check/<page>__figNN-light.png` and `-dark.png`. Look at every
   label, every control at its extremes, and both themes.
3. The caption says what is drawn and what the controls change, and nothing
   the figure does not show.
4. `make check-site` opens the preview of a figure on every post and fails
   when its islands do not mount or a canvas stays blank.
