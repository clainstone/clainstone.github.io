<script>
  // Definition 1 (ii) and (v), an instance on an interval with μ = λ: a
  // function f (dashed), a function f_n, the band of the points at vertical
  // distance at most ε from the graph of f, and the set {|f_n − f| > ε}
  // hatched on the axis. The vertical segment marks the largest value of
  // |f_n − f|. The slider sets ε.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between, intervals, widest } from './plot.js';
  const uid = $props.id();

  const OX = 60, UX = 570, OY = 262, UY = 240;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 0.5 + 0.14 * Math.sin(2 * Math.PI * 1.1 * x + 0.5);
  const fn = (x) => f(x) + 0.05 * Math.sin(2 * Math.PI * 2.7 * x + 1.2) + 0.3 * Math.exp(-(((x - 0.7) / 0.045) ** 2));
  const gap = (x) => Math.abs(fn(x) - f(x));
  const fLine = graph(f, 0, 1, sx, sy, 400);
  const fnLine = graph(fn, 0, 1, sx, sy, 600);

  // Where |f_n − f| is largest, on a fine grid.
  let xs = 0;
  for (let j = 0; j <= 4000; j++) if (gap(j / 4000) > gap(xs)) xs = j / 4000;
  const top = Math.max(fn(xs), f(xs));
  const bottom = Math.min(fn(xs), f(xs));

  let eps = $state(0.12);
  const band = $derived(between((x) => f(x) + eps, (x) => f(x) - eps, 0, 1, sx, sy, 400));
  const sets = $derived(intervals((x) => gap(x) > eps, 0, 1, 3000));
  const wide = $derived(widest(sets));
</script>

<figure class="anim band">
  <svg viewBox="0 0 690 300" role="img" aria-label="A dashed function f and a function f n on an interval, the shaded band of the points within distance epsilon of the graph of f, the set where the distance between f n and f exceeds epsilon hatched on the axis, and a vertical segment at the point where that distance is largest">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    <path class="region" d={band} />
    {#each sets as [a, b]}
      <rect x={sx(a)} y={OY - 9} width={Math.max(sx(b) - sx(a), 1.5)} height="9" fill="url(#{uid}-h)" />
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    <polyline class="dashed" points={fLine} />
    <polyline class="fn" points={fnLine} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="sup" x1={sx(xs)} y1={sy(top)} x2={sx(xs)} y2={sy(bottom)} />
    <line class="sup" x1={sx(xs) - 6} y1={sy(top)} x2={sx(xs) + 6} y2={sy(top)} />
    <line class="sup" x1={sx(xs) - 6} y1={sy(bottom)} x2={sx(xs) + 6} y2={sy(bottom)} />

    <text x={sx(xs)} y={sy(top) - 24}>sup |<tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">{'\u00a0−\u00a0'}</tspan><tspan class="it">f</tspan>|</text>
    <text class="it" x={sx(1) + 24} y={sy(f(1)) - 12}>f</text>
    <text class="it accent" x={sx(1) + 26} y={sy(fn(1)) + 12}>f<tspan class="sub" dy="5">n</tspan></text>
    {#if wide}
      <text class="accent" x={(sx(wide[0]) + sx(wide[1])) / 2} y={OY + 24}>{'{'}|<tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">{'\u00a0−\u00a0'}</tspan><tspan class="it">f</tspan>| &gt; <tspan class="it">ε</tspan>{'}'}</text>
    {/if}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.02} max={0.34} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .band { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.1; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 3; }
  .dashed { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  .sup { stroke: var(--anim-ink); stroke-width: 1.6; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
