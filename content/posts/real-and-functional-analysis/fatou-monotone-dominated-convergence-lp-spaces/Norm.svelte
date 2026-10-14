<script>
  // Definition 17, an instance on X = [0, 1] with μ = λ: the graph of |f| and,
  // dashed, the level ‖f‖_p = (∫ |f|^p dλ)^(1/p), computed with the midpoint
  // rule on 4000 points, for the p of the slider.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';

  const OX = 60, UX = 560, OY = 232, UY = 220;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 0.85 * Math.exp(-(((x - 0.3) / 0.11) ** 2)) - 0.5 * Math.exp(-(((x - 0.74) / 0.09) ** 2)) + 0.08;
  const absf = (x) => Math.abs(f(x));
  const N = 4000;
  const samples = Array.from({ length: N }, (_, j) => absf((j + 0.5) / N));
  const norm = (p) => (samples.reduce((s, v) => s + v ** p, 0) / N) ** (1 / p);

  let p = $state(2);
  const level = $derived(norm(p));
</script>

<figure class="anim norm">
  <svg viewBox="0 0 690 270" role="img" aria-label="The graph of the absolute value of a function on the unit interval, with two bumps, and a dashed horizontal level at the height of its L p norm, which moves with p">
    <path class="region" d={under(absf, 0, 1, sx, sy, 400)} />
    <polyline class="curve" points={graph(absf, 0, 1, sx, sy, 400)} />
    <line class="level" x1={sx(0)} y1={sy(level)} x2={sx(1)} y2={sy(level)} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="num" x={sx(0)} y={OY + 20}>0</text>
    <text class="num" x={sx(1)} y={OY + 20}>1</text>
    <text class="it" x={sx(0.3) + 62} y={sy(absf(0.3)) + 4}>|f|</text>
    <text class="it accent halo" x={sx(1) + 38} y={sy(level)}><tspan class="bars">||</tspan>f<tspan class="bars">||</tspan><tspan class="sub" dy="5">p</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1} max={40} step={1} bind:value={p} />
    </div>
  </div>
</figure>

<style>
  .norm { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-ink); fill-opacity: 0.06; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .level { stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 8 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
  .bars { font-style: normal; letter-spacing: -1px; }
  .halo { paint-order: stroke; stroke: var(--page, #fff); stroke-width: 5px; stroke-linejoin: round; }
</style>
