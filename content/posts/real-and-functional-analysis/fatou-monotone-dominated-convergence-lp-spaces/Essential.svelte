<script>
  // Definition 19 (i), the drawing of the lecture: a function f ≥ 0 on an
  // interval, the dashed level M, dashed lines down from the points where the
  // graph crosses it, and the set {|f| > M} hatched on the axis. The slider
  // sets M.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, intervals } from './plot.js';
  const uid = $props.id();

  const OX = 60, UX = 560, OY = 226, UY = 230;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 0.1 + 0.62 * Math.exp(-(((x - 0.42) / 0.19) ** 4)) + 0.06 * Math.exp(-(((x - 0.86) / 0.12) ** 2));
  const fLine = graph(f, 0.02, 0.98, sx, sy, 400);

  let M = $state(0.55);
  const sets = $derived(intervals((x) => f(x) > M, 0.02, 0.98, 1500));
  const widest = $derived(sets.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a), [0, 0]));
</script>

<figure class="anim essential">
  <svg viewBox="0 0 690 290" role="img" aria-label="A positive function f on an interval, a dashed horizontal level M, dashed vertical lines from the points where the graph crosses the level, and the set where the absolute value of f exceeds M hatched on the axis">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    <line class="level" x1={OX - 6} y1={sy(M)} x2={sx(1)} y2={sy(M)} />
    {#each sets as [a, b]}
      <line class="guide" x1={sx(a)} y1={sy(M)} x2={sx(a)} y2={OY} />
      <line class="guide" x1={sx(b)} y1={sy(M)} x2={sx(b)} y2={OY} />
      <rect x={sx(a)} y={OY - 9} width={sx(b) - sx(a)} height="9" fill="url(#{uid}-h)" />
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    <polyline class="curve" points={fLine} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <text class="it" x={OX - 26} y={sy(M)}>M</text>
    <text class="it" x={sx(0.08)} y={sy(f(0.08)) - 24}>f</text>
    {#if widest[1] > widest[0]}
      <text class="accent" x={(sx(widest[0]) + sx(widest[1])) / 2} y={OY + 26}>{'{'}|<tspan class="it">f</tspan>| &gt; <tspan class="it">M</tspan>{'}'}</text>
    {/if}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="M" min={0} max={0.85} step={0.01} bind:value={M} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .essential { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .level { stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 7 5; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 4; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
