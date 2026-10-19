<script>
  // Proof of Proposition 11, an instance on an interval with μ = λ, for one n:
  // the graphs of 2^(p−1) (|f_n|^p + |f|^p) and of |f_n − f|^p, and the region
  // between them, whose height at each point is g_n ≥ 0. The slider sets p.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between } from './plot.js';

  const OX = 60, OY = 270, UX = 560, UY = 205;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  // The instances of f and f_n.
  const f = (t) => 0.5 * Math.sin(2 * Math.PI * t) + 0.15;
  const fn = (t) => 0.35 * Math.cos(3 * Math.PI * t) + 0.2;

  let p = $state(2);
  const upper = $derived((t) => 2 ** (p - 1) * (Math.abs(fn(t)) ** p + Math.abs(f(t)) ** p));
  const lower = $derived((t) => Math.abs(fn(t) - f(t)) ** p);
  // Where the region is highest, for the label g_n.
  const peak = $derived.by(() => {
    let best = 0;
    for (let j = 0; j <= 400; j++) {
      const t = j / 400;
      if (upper(t) - lower(t) > upper(best) - lower(best)) best = t;
    }
    return best;
  });
</script>

<figure class="anim difference">
  <svg viewBox="0 0 690 300" role="img" aria-label="On an interval, the graph of 2 to the p minus 1 times the sum of the p-th powers of the absolute values of f n and f, above the graph of the p-th power of the absolute value of f n minus f, with the region between them shaded; its height is g n, which is never negative">
    <path class="region" d={between(upper, lower, 0, 1, sx, sy, 400)} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(1.18)} />
    <polyline class="upper" points={graph(upper, 0, 1, sx, sy, 400)} />
    <polyline class="lower" points={graph(lower, 0, 1, sx, sy, 400)} />

    <text class="it accent" x={sx(peak)} y={sy((upper(peak) + lower(peak)) / 2)}>g<tspan class="sub" dy="5">n</tspan></text>
    <line class="upper" x1="452" y1="30" x2="492" y2="30" />
    <text class="left" x="502" y="30">2<tspan class="sup" dy="-7">{'p\u00a0−\u00a01'}</tspan><tspan dy="7">(|</tspan><tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">|</tspan><tspan class="sup" dy="-7">p</tspan><tspan dy="7">{'\u00a0+\u00a0|'}</tspan><tspan class="it">f</tspan>|<tspan class="sup" dy="-7">p</tspan><tspan dy="7">)</tspan></text>
    <line class="lower" x1="452" y1="64" x2="492" y2="64" />
    <text class="left" x="502" y="64">|<tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">{'\u00a0−\u00a0'}</tspan><tspan class="it">f</tspan>|<tspan class="sup" dy="-7">p</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1} max={3} step={0.1} bind:value={p} format={(v) => v.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .difference { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.18; }
  .upper { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .lower { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .sup { font-size: 13px; font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
