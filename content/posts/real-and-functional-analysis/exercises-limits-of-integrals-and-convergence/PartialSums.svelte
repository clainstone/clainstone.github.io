<script>
  // Example 7 on [0, 1]: the sum of the terms x^n (1 − x) e^x with n = 1, …, N
  // for the N of the slider, with the region under its graph shaded, and,
  // dashed, the sum x e^x of the series. The partial sum is computed term by
  // term.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const OX = 80, UX = 520, OY = 262, UY = 82;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const limit = (x) => x * Math.exp(x);
  const limitLine = graph(limit, 0, 1, sx, sy, 300);

  let N = $state(3);
  const partial = $derived((x) => {
    let s = 0;
    for (let n = 1; n <= N; n++) s += x ** n * (1 - x) * Math.exp(x);
    return s;
  });
</script>

<figure class="anim partialsums">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the unit interval, the sum of the first N terms of the series, a function that vanishes at 0 and at 1, with the region under its graph shaded, below the dashed graph of x times e to the x">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <path class="region" d={under(partial, 0, 1, sx, sy, 400)} />
    <polyline class="limit" points={limitLine} />
    <polyline class="fn" points={graph(partial, 0, 1, sx, sy, 400)} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(1) + 34} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(3)} marker-end="url(#{uid}-head)" />
    <line class="tick" x1={sx(1)} y1={OY - 4} x2={sx(1)} y2={OY + 4} />
    <line class="tick" x1={sx(0.5)} y1={OY - 4} x2={sx(0.5)} y2={OY + 4} />
    {#each [1, 2] as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 19}>0</text>
    <text class="num" x={sx(0.5)} y={OY + 21}>1/2</text>
    <text class="num" x={sx(1)} y={OY + 21}>1</text>
    <text class="it" x={sx(1) + 36} y={OY + 21}>x</text>
    <text class="left" x={sx(1) + 12} y={sy(Math.E)}><tspan class="it">x</tspan> e<tspan class="sup it" dy="-7">x</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={1} max={40} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .partialsums { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .limit { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sup { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
