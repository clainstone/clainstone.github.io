<script>
  // Theorem 4, an instance on an interval with μ = λ: a function f and the
  // functions f_n = min{f, c_n} for levels c_n that increase to the maximum of
  // f, a nondecreasing sequence with limit f. The region under f_n is shaded,
  // the earlier f_j are faint. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';

  const NMAX = 12;
  const OX = 60, UX = 580, OY = 250, UY = 290;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 0.16 + 0.57 * Math.exp(-(((x - 0.3) / 0.13) ** 2)) + 0.4 * Math.exp(-(((x - 0.73) / 0.1) ** 2));
  const level = (n) => 0.75 * (1 - 0.72 ** n);
  const fn = (n) => (x) => Math.min(f(x), level(n));
  const fLine = graph(f, 0, 1, sx, sy, 400);

  let n = $state(3);
  const earlier = $derived(Array.from({ length: n - 1 }, (_, i) => graph(fn(i + 1), 0, 1, sx, sy, 400)));
</script>

<figure class="anim monotone">
  <svg viewBox="0 0 690 280" role="img" aria-label="A positive function f with two peaks on an interval and, below it, the function f n, equal to f cut off at a level that rises with n, with the region under it shaded and the earlier functions faint">
    <path class="region" d={under(fn(n), 0, 1, sx, sy, 400)} />
    {#each earlier as pts}
      <polyline class="faint" points={pts} />
    {/each}
    <polyline class="fn" points={graph(fn(n), 0, 1, sx, sy, 400)} />
    <polyline class="curve" points={fLine} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <text class="it" x={sx(0.3) + 70} y={sy(f(0.3)) - 6}>f</text>
    <text class="it accent" x={sx(0.3)} y={sy(Math.min(level(n), f(0.3))) + 22}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .monotone { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .faint { fill: none; stroke: var(--anim-muted); stroke-opacity: 0.45; stroke-width: 1.2; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 3.2; stroke-linejoin: round; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
</style>
