<script>
  // Proof of Theorem 9, continuity, an instance on (a, b): the dashed graph of
  // |f|, the graph of f χ_(a, x_n), equal to f on (a, x_n) and to 0 after x_n,
  // and, shaded, the region where it differs from f χ_(a, x_0), between x_0
  // and x_n, for the sequence x_n = x_0 + (−1)^n 0.22/n. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';

  const OX = 50, UX = 590, OY = 150, UY = 150;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) => 0.6 * Math.sin(2 * Math.PI * (t + 0.05)) + 0.18 * Math.sin(6 * Math.PI * t + 0.5);
  const absf = (t) => Math.abs(f(t));
  const x0 = 0.3;

  let n = $state(1);
  const xn = $derived(x0 + ((n % 2 === 0 ? 1 : -1) * 0.22) / n);
  const lo = $derived(Math.min(x0, xn));
  const hi = $derived(Math.max(x0, xn));
</script>

<figure class="anim truncations">
  <svg viewBox="0 0 690 262" role="img" aria-label="On an interval from a to b, the dashed graph of the absolute value of f, the graph of f times the characteristic function of the interval from a to x n, and the shaded region between x zero and x n where it differs from f times the characteristic function of the interval from a to x zero">
    <path class="region" d={under(f, lo, hi, sx, sy, 160)} />
    <polyline class="dashed" points={graph(absf, 0, 1, sx, sy, 400)} />
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1)} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 6} x2={sx(0)} y2={OY + 6} />
    <line class="tick" x1={sx(1)} y1={OY - 6} x2={sx(1)} y2={OY + 6} />
    <!-- f χ_(a, x_n): f up to x_n, then 0. -->
    <polyline class="curve" points={graph(f, 0, xn, sx, sy, 300)} />
    <line class="jump" x1={sx(xn)} y1={sy(f(xn))} x2={sx(xn)} y2={OY} />
    <line class="zero" x1={sx(xn)} y1={OY} x2={sx(1)} y2={OY} />
    <line class="mark" x1={sx(x0)} y1={OY - 9} x2={sx(x0)} y2={OY + 9} />

    <text class="it muted" x={sx(0)} y={OY + 24}>a</text>
    <text class="it muted" x={sx(1)} y={OY + 24}>b</text>
    <text class="it" x={sx(x0)} y={OY + (xn > x0 ? 24 : 48)}>x<tspan class="sub" dy="5">0</tspan></text>
    <text class="it accent" x={sx(xn)} y={OY + (xn > x0 ? 48 : 24)}>x<tspan class="sub" dy="5">n</tspan></text>
    <text class="muted" x={sx(0.74)} y={sy(absf(0.74)) - 22}>|<tspan class="it">f</tspan>|</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={30} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .truncations { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.22; }
  .dashed { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .jump { stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 3 3; }
  .zero { stroke: var(--anim-accent); stroke-width: 3.4; }
  .mark { stroke: var(--anim-ink); stroke-width: 1.8; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
