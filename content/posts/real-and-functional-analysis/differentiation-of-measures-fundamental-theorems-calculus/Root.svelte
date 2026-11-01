<script>
  // Example 16: above, the graph of g(x) = √x on [0, 1] and the increment
  // g(y) − g(x) at y; below, the graph of g′(t) = 1/(2√t), cut at the top of
  // its panel because it is unbounded near 0, and the region under it over
  // (x, y), whose area is g(y) − g(x). The sliders set x and y.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between, fmt } from './plot.js';

  const OX = 60, UX = 560;
  const sx = (t) => OX + t * UX;
  const TOP = 178, UY1 = 140;
  const BOT = 418, UY2 = 30, CAP = 6.4;
  const sy1 = (v) => TOP - v * UY1;
  const sy2 = (v) => BOT - Math.min(v, CAP) * UY2;
  const g = (t) => Math.sqrt(Math.max(t, 0));
  const dg = (t) => 1 / (2 * Math.sqrt(Math.max(t, 1e-9)));
  const T0 = 1 / (4 * CAP * CAP);

  let x = $state(0.16);
  let y = $state(0.64);
  // The sliders keep x < y: x runs over [0, 0.49] and y over [0.51, 1].
  const lo = $derived(x);
  const hi = $derived(y);
  const inc = $derived(g(hi) - g(lo));
</script>

<figure class="anim root">
  <svg viewBox="0 0 690 456" role="img" aria-label="Above, the graph of the square root on the unit interval with a vertical segment showing the increment between x and y; below, the graph of one over two square root of t, which grows without bound near 0, with the region under it between x and y shaded">
    <!-- Above: g and the increment g(y) − g(x). -->
    <line class="axis" x1={sx(0)} y1={TOP} x2={sx(1) + 14} y2={TOP} />
    <line class="guide" x1={sx(lo)} y1={sy1(g(lo))} x2={sx(hi)} y2={sy1(g(lo))} />
    <polyline class="curve" points={graph(g, 0, 1, sx, sy1, 400)} />
    <line class="bar" x1={sx(hi)} y1={sy1(g(lo))} x2={sx(hi)} y2={sy1(g(hi))} />
    <circle class="dot" cx={sx(lo)} cy={sy1(g(lo))} r="4" />
    <circle class="dot" cx={sx(hi)} cy={sy1(g(hi))} r="4" />
    <text class="it" x={sx(0.86)} y={sy1(g(0.86)) - 20}>g</text>
    <text class="num" x={sx(0)} y={TOP + 20}>0</text>
    <text class="num" x={sx(1)} y={TOP + 20}>1</text>

    <!-- Below: g′, cut at the top of the panel, and the region over (x, y). -->
    <path class="region" d={between(dg, () => 0, Math.max(lo, T0 / 4), hi, sx, sy2, 300)} />
    <line class="axis" x1={sx(0)} y1={BOT} x2={sx(1) + 14} y2={BOT} />
    <line class="axis" x1={sx(0)} y1={BOT} x2={sx(0)} y2={sy2(CAP) - 8} />
    <polyline class="curve" points={graph(dg, T0, 1, sx, sy2, 600)} />
    <line class="tick" x1={sx(lo)} y1={BOT - 6} x2={sx(lo)} y2={BOT + 6} />
    <line class="tick" x1={sx(hi)} y1={BOT - 6} x2={sx(hi)} y2={BOT + 6} />
    <text class="it" x={sx(lo)} y={BOT + 20}>x</text>
    <text class="it" x={sx(hi)} y={BOT + 20}>y</text>
    <text x={sx(0.8)} y={sy2(dg(0.8)) - 24}><tspan class="it">g</tspan>′</text>
    <text class="left" x={sx(0.3)} y={sy2(CAP) + 6}><tspan class="it">g</tspan>(<tspan class="it">y</tspan>) − <tspan class="it">g</tspan>(<tspan class="it">x</tspan>) = <tspan class="accent">{fmt(inc, 3)}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x" min={0} max={0.49} step={0.01} bind:value={x} format={(v) => v.toFixed(2)} />
      <Slider label="y" min={0.51} max={1} step={0.01} bind:value={y} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .root { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .bar { stroke: var(--anim-accent); stroke-width: 3; }
  .dot { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.25; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
