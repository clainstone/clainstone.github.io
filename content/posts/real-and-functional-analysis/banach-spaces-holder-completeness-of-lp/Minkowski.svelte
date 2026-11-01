<script>
  // Proposition 16, an instance on [0, 1] with μ = λ: u = 0.55 sin(1.8πx + 0.35)
  // + 0.15 and v = 0.5 cos(2.8πx + 0.2) − 0.05, for the p of the slider. Two
  // stacked bands of heights |u||u + v|^(p−1) and |v||u + v|^(p−1), whose sum
  // (|u| + |v|)|u + v|^(p−1) is at least |u + v|^p, drawn as a curve. For p = 1
  // the bands are |u| and |v|. The vertical scale fits the stack for each p.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between, maximum } from './plot.js';

  const OX = 60, UX = 560, OY = 236, UY = 206;
  const u = (x) => 0.55 * Math.sin(2 * Math.PI * 0.9 * x + 0.35) + 0.15;
  const v = (x) => 0.5 * Math.cos(2 * Math.PI * 1.4 * x + 0.2) - 0.05;
  const s = (x) => Math.abs(u(x) + v(x));
  const sx = (x) => OX + x * UX;

  let p = $state(2);
  const one = $derived((x) => Math.abs(u(x)) * s(x) ** (p - 1));
  const two = $derived((x) => one(x) + Math.abs(v(x)) * s(x) ** (p - 1));
  const sum = $derived((x) => s(x) ** p);
  const top = $derived(maximum(two, 0, 1, 600).value);
  const sy = $derived((y) => OY - (y / top) * UY);
</script>

<figure class="anim minkowski">
  <svg viewBox="0 0 690 330" role="img" aria-label="On the unit interval, two stacked bands whose heights are the two terms of the splitting in the proof of the Minkowski inequality, and the graph of the p-th power of the absolute value of u plus v below their top">
    <path class="band1" d={between(one, () => 0, 0, 1, sx, sy, 400)} />
    <path class="band2" d={between(two, one, 0, 1, sx, sy, 400)} />
    <polyline class="sum" points={graph(sum, 0, 1, sx, sy, 400)} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 5} x2={sx(0)} y2={OY + 5} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="num" x={sx(0)} y={OY + 20}>0</text>
    <text class="num" x={sx(1)} y={OY + 20}>1</text>
    <rect class="band1" x="70" y="276" width="22" height="16" />
    <text class="start" x="100" y="284">|<tspan class="it">u</tspan>| |<tspan class="it">u</tspan> + <tspan class="it">v</tspan>|<tspan class="sup" dy="-8"><tspan class="it">p</tspan> − 1</tspan></text>
    <rect class="band2" x="300" y="276" width="22" height="16" />
    <text class="start" x="330" y="284">|<tspan class="it">v</tspan>| |<tspan class="it">u</tspan> + <tspan class="it">v</tspan>|<tspan class="sup" dy="-8"><tspan class="it">p</tspan> − 1</tspan></text>
    <line class="sum" x1="70" y1="312" x2="92" y2="312" />
    <text class="start" x="100" y="312">|<tspan class="it">u</tspan> + <tspan class="it">v</tspan>|<tspan class="sup it" dy="-8">p</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1} max={4} step={0.05} bind:value={p} format={(x) => x.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .minkowski { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .band1 { fill: var(--anim-accent); fill-opacity: 0.3; }
  .band2 { fill: var(--anim-muted); fill-opacity: 0.28; }
  .sum { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .start { text-anchor: start; }
  .sup { font-size: 13px; }
</style>
