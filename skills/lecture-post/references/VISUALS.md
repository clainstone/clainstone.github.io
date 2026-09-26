# Animations and figures

You are free to add every animation, diagram or image that makes the post
clearer and more pleasant to read. Each one shows the mathematics of the
lecture and nothing else.

## When a visual earns its place

A visual is worth building when it shows something the formulas make hard to
see:

1. A sequence of functions that converges in one mode and not in another, or
   an approximation by simple functions.
2. A set built by a limiting construction, a covering, a partition of the
   domain against a partition of the range.
3. A norm ball, a projection, an orthogonal decomposition.
4. Trajectories of a Markov chain, a random walk or a Poisson process.
5. A distribution evolving under the transition matrix towards a stationary
   distribution, or failing to because of periodicity.
6. Hitting times, return times, recurrence and transience.

Draw the objects of the lecture with the lecture's parameters. A lecture that
is pure algebra may have no visual. Most lectures need one to three. Never add
decoration, stock photos or pictures taken from elsewhere.

## Three kinds

**An animation or an interactive figure.** A Svelte component in the post
folder, built on the toolkit's `Canvas.svelte` and `Slider.svelte`, or on d3
drawing into an `svg`. Mount it in the MDX with `client:visible`.

**A static diagram.** A Svelte component in the post folder that renders an
inline `svg`, with colours from the page variables `var(--anim-ink)`,
`var(--anim-muted)`, `var(--anim-rule)` and `var(--anim-accent)`, and text in
the page font. Mount it without a `client:` directive, so the page ships no
JavaScript for it.

**A bitmap.** Only when a vector drawing cannot do the job, for example a dense
simulation rendered as a heat map. Generate it at twice its displayed width,
import it in the MDX and show it with the toolkit's `Figure.astro`, with `alt`
and `caption`. Never bake text into a bitmap: this container has no system
fonts, so labels go into the caption.

## Building an animation

```svelte
<script>
  // What the reader sees, in one sentence.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  let n = $state(1);

  function draw(ctx, t, { w, h, p, narrow }) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = p.accent;
    ctx.font = p.font;
    // ...
  }
</script>

<Canvas {draw} ratio={2} label="The functions f_n for the chosen n" deps={[n]}>
  <Slider label="n" min={1} max={64} step={1} bind:value={n} />
</Canvas>
```

In the MDX, on its own paragraph:

```mdx
import Ramps from './Ramps.svelte';

<Ramps client:visible />
```

Rules:

1. **Colours and type come from the page.** Use only `p.ink`, `p.muted`,
   `p.rule`, `p.accent`, `withAlpha(p.accent, a)`, `p.font` and `p.smallFont`.
   No colour is written by hand.
2. **The toolkit owns the loop.** `draw` receives the time `t` in seconds, the
   size and the palette. Do not call `requestAnimationFrame`. The loop already
   handles pixel density, resizing, pausing off screen and reduced motion.
3. **Controls.** A slider for each parameter the lecture varies. Extra buttons
   go in a `buttons` snippet, as in
   `content/posts/understanding-deep-learning/why-depth/Depth.svelte`.
4. **Randomness is seeded.** Use a small seeded generator such as mulberry32,
   so every reader sees the same first frame. Offer a "New sample" button when
   resampling shows something.
5. **Labels use the lecture's notation.** A canvas cannot run KaTeX, so write
   labels with Unicode: fₙ, x², λ, π, ∞, ∫.
6. **Size.** Between 60 and 180 lines per component. Put simulation logic in a
   plain `.js` file beside it.
7. **Cost.** A frame should take a few milliseconds. Use three.js only for a
   genuinely three-dimensional object.
8. **Accessibility.** The `label` of the canvas describes what is drawn in one
   sentence.
9. **Words around it.** The paragraph before or after the visual says what is
   drawn and what the controls change, without opinion.

Libraries installed in the site: `d3`, `three` and `p5`, the last imported by
module as in
`content/posts/algorithms-and-parallel-computing/work-and-span/WorkSpan.svelte`.

Working examples:

1. `content/posts/real-and-functional-analysis/lecture-1-cardinality-topology-and-measurable-spaces/Diagonal.svelte`:
   canvas and a button, Cantor's diagonal set drawn as a table.
2. `content/posts/real-and-functional-analysis/lecture-1-cardinality-topology-and-measurable-spaces/OpenBall.svelte`:
   canvas, an open ball moving inside an open set.
3. `content/posts/real-and-functional-analysis/lecture-1-cardinality-topology-and-measurable-spaces/Compact.svelte`:
   canvas and a button, a finite subfamily extracted from an open cover, with a
   seeded generator in `random.js`.
4. `content/posts/stochastic-dynamical-models/a-matrix-you-keep-multiplying/Chain.svelte`:
   d3 and svg, a walker on a chain and the rows of the matrix powers.

The stochastic example shows the mechanics only. Its prose is not a model for a
lecture post: it contains first-person remarks that a lecture post never has.
10. **Twice at once.** The figure also mounts, live and scaled to 0.75, in
    the preview of every "Figure n" mention: ids from `$props.id()`, no
    state at module level, sizes from the layout, never from
    `getBoundingClientRect`.

## Size of the text in a visual

Labels read at 16 to 19 px on the page at 1280 px, a little smaller than the
19 px text. In an SVG the size on the page is the `font-size` times the scale
of the `viewBox` (displayed width over viewBox width): a 520-unit viewBox shown
at 570 px scales by 1.1, so 17 units give about 18.5 px. Canvases get it from
the toolkit: `p.font` is 17 px and `p.smallFont` 16 px. Write subscripts and
superscripts in SVG with a `<tspan dy>` and a smaller `font-size`, not with
Unicode subscript characters, which the site's fonts do not have.
`check_post.mjs` warns about any SVG label outside 15.5 to 20 px.

## Checking a visual

`scripts/check_post.mjs` builds the site, opens the post at 1280 px,
scrolls it so that every `client:visible` component mounts, and records console
errors and horizontal overflow. Look at the screenshot: every label of a
visual must read at 1280 px. The site is desktop only.

The headless browser in this container needs the font configuration under
`~/.local/chrome-libs`. The script sets it. Without it, text measures zero
width and every page looks broken.
