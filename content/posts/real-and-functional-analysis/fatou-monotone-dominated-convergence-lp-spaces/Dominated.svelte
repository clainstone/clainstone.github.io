<script>
  // Theorem 10, an instance on an interval with μ = λ: the constant g and −g
  // (dashed), the limit f, and f_n = f plus a tent of fixed height and width
  // 2/n at the midpoint, so that f_n → f at every point but the midpoint and
  // |f_n| ≤ g. The region between f_n and f is shaded. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between } from './plot.js';

  const NMAX = 12;
  const OX = 60, UX = 570, OY = 160, UY = 150;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const G = 0.9;
  const f = (x) => 0.5 * Math.sin(2 * Math.PI * x);
  const fn = (n) => (x) => f(x) + 0.35 * Math.max(0, 1 - n * Math.abs(x - 0.5));
  const fLine = graph(f, 0, 1, sx, sy, 400);

  let n = $state(4);
</script>

<figure class="anim dominated">
  <svg viewBox="0 0 690 320" role="img" aria-label="A dashed constant g and its opposite minus g, a sine-shaped limit f between them, and the function f n, equal to f plus a tent around the midpoint that narrows as n grows, with the region between f n and f shaded">
    <path class="region" d={between(fn(n), f, 0, 1, sx, sy, 600)} />
    <line class="g" x1={sx(0)} y1={sy(G)} x2={sx(1)} y2={sy(G)} />
    <line class="g" x1={sx(0)} y1={sy(-G)} x2={sx(1)} y2={sy(-G)} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <polyline class="fn" points={graph(fn(n), 0, 1, sx, sy, 600)} />
    <polyline class="curve" points={fLine} />
    <text class="it" x={sx(1) + 26} y={sy(G)}>g</text>
    <text class="it" x={sx(1) + 30} y={sy(-G)}>−g</text>
    <text class="it" x={sx(0.25)} y={sy(0.5) + 24}>f</text>
    <text class="it accent" x={sx(0.5) + 36} y={sy(fn(n)(0.5)) - 6}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .dominated { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.22; }
  .g { stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
</style>
