<script>
  // Remark 3, an instance on an interval: a function g (dashed), a function
  // f_n with f_n ≤ g, and the region between their graphs, whose height at
  // each point is h_n = g − f_n.
  import { graph, between } from './plot.js';

  const OX = 60, UX = 580, OY = 222, UY = 290;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const g = (x) => 0.56 + 0.1 * Math.sin(2 * Math.PI * 1.1 * x + 0.6);
  const fn = (x) => 0.24 + 0.14 * Math.sin(2 * Math.PI * 2.3 * x + 2.1) + 0.12 * Math.exp(-(((x - 0.62) / 0.07) ** 2));
  const gap = between(g, fn, 0, 1, sx, sy, 300);
</script>

<figure class="anim gap">
  <svg viewBox="0 0 690 250" role="img" aria-label="A dashed function g above a function f n on an interval, with the region between the two graphs shaded; its height at each point is h n, the difference g minus f n">
    <path class="region" d={gap} />
    <polyline class="g" points={graph(g, 0, 1, sx, sy, 300)} />
    <polyline class="curve" points={graph(fn, 0, 1, sx, sy, 300)} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <text class="it" x={sx(1) + 26} y={sy(g(1))}>g</text>
    <text class="it" x={sx(1) + 30} y={sy(fn(1))}>f<tspan class="sub" dy="5">n</tspan></text>
    <text class="it accent" x={sx(0.38)} y={(sy(g(0.38)) + sy(fn(0.38))) / 2}>h<tspan class="sub" dy="5">n</tspan></text>
  </svg>
</figure>

<style>
  .gap { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
</style>
