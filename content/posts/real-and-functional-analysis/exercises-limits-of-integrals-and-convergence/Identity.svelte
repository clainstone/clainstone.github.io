<script>
  // Remark 6: for y in (0, 6], the graphs of arctan(y) and arctan(1/y), and, at
  // the y of the slider, the two values stacked in one bar: arctan(y) from the
  // axis, arctan(1/y) on top of it. The bar always ends on the dashed level π/2.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 92, OY = 250, UY = 132, B = 6, E = 1e-3;
  const sx = (y) => OX + y * UX;
  const sy = (v) => OY - v * UY;
  const up = graph(Math.atan, 0, B, sx, sy, 300);
  const down = graph((y) => Math.atan(1 / y), E, B, sx, sy, 300, 2);
  const half = Math.PI / 2;

  let y = $state(1.6);
  const a = $derived(Math.atan(y));
  const b = $derived(Math.atan(1 / y));
</script>

<figure class="anim identity">
  <svg viewBox="0 0 690 290" role="img" aria-label="For y between 0 and 6, the increasing graph of arctan y and the decreasing graph of arctan of 1 over y, and at the chosen y a bar made of the two values, one on top of the other, reaching the dashed level pi over 2">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="level" x1={OX} y1={sy(half)} x2={sx(B)} y2={sy(half)} />
    <polyline class="up" points={up} />
    <polyline class="down" points={down} />
    <line class="bar up" x1={sx(y)} y1={OY} x2={sx(y)} y2={sy(a)} />
    <line class="bar down" x1={sx(y)} y1={sy(a)} x2={sx(y)} y2={sy(a + b)} />
    <circle class="dot up" cx={sx(y)} cy={sy(a)} r="4.5" />
    <circle class="dot down" cx={sx(y)} cy={sy(b)} r="4.5" />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(1.85)} marker-end="url(#{uid}-head)" />
    {#each [1, 2, 3, 4, 5, 6] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    <text class="num right" x={OX - 10} y={sy(half)}>π/2</text>
    <text class="num" x={OX - 14} y={OY + 19}>0</text>
    <text class="it" x={sx(B) + 26} y={OY + 21}>y</text>

    <text class="right accent" x={sx(B) - 2} y={sy(Math.atan(B)) + 24}>arctan(<tspan class="it">y</tspan>)</text>
    <text class="right" x={sx(B) - 2} y={sy(Math.atan(1 / B)) - 20}>arctan(1/<tspan class="it">y</tspan>)</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="y" min={0.2} max={6} step={0.05} bind:value={y} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .identity { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .level { stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 7 5; }
  polyline.up { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  polyline.down { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .bar { stroke-width: 7; stroke-linecap: butt; }
  .bar.up { stroke: var(--anim-accent); stroke-opacity: 0.55; }
  .bar.down { stroke: var(--anim-ink); stroke-opacity: 0.45; }
  .dot.up { fill: var(--anim-accent); }
  .dot.down { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
