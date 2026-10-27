<script>
  // Example 4: for t > 0 the graphs of 1/(1 + t²) and, dashed, 1/t², and the
  // regions under them on the right of nx (the slider): their areas are
  // ∫ 1/(1 + t²) dt = π/2 − arctan(nx) and ∫ 1/t² dt = 1/(nx) over (nx, ∞).
  // The region under 1/t² is hatched, the one under 1/(1 + t²) shaded; the
  // drawing stops at t = 8 and cuts heights above 1.15.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 72, OY = 250, UY = 196, B = 8, TOP = 1.15, E = 1e-3;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const near = (t) => 1 / (1 + t * t);
  const far = (t) => 1 / (t * t);
  const nearLine = graph(near, 0, B, sx, sy, 400);
  const farLine = graph(far, E, B, sx, sy, 400, 2);

  let s = $state(1.5);
</script>

<figure class="anim tails">
  <svg viewBox="0 0 690 290" role="img" aria-label="For positive t, the graphs of 1 over 1 plus t squared and, dashed, of 1 over t squared, with the regions under both graphs on the right of the point n x hatched and shaded">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
      <clipPath id="{uid}-clip">
        <rect x={OX} y={sy(TOP)} width={B * UX + 4} height={TOP * UY} />
      </clipPath>
    </defs>
    <g clip-path="url(#{uid}-clip)">
      <path d={under(far, s, B, sx, sy, 300)} fill="url(#{uid}-h)" />
      <path class="region" d={under(near, s, B, sx, sy, 300)} />
      <line class="guide" x1={sx(s)} y1={OY} x2={sx(s)} y2={sy(far(s))} />
      <polyline class="far" points={farLine} />
      <polyline class="near" points={nearLine} />
    </g>
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 22} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(TOP) - 8} marker-end="url(#{uid}-head)" />
    {#each Array.from({ length: B }, (_, k) => k + 1) as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
    {/each}
    <line class="tick" x1={OX - 4} y1={sy(1)} x2={OX + 4} y2={sy(1)} />
    <text class="num right" x={OX - 10} y={sy(1)}>1</text>
    <text class="num" x={OX - 14} y={OY + 19}>0</text>
    <text class="it" x={sx(B) + 24} y={OY + 21}>t</text>
    <text class="lab" x={sx(s)} y={OY + 22}><tspan class="it">nx</tspan></text>

    <line class="near" x1="452" y1="50" x2="492" y2="50" />
    <text class="left" x="504" y="50">1/(1 + <tspan class="it">t</tspan><tspan class="sup" dy="-7">2</tspan><tspan dy="7">)</tspan></text>
    <line class="far" x1="452" y1="84" x2="492" y2="84" />
    <text class="left" x="504" y="84">1/<tspan class="it">t</tspan><tspan class="sup" dy="-7">2</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="nx" min={0.5} max={6} step={0.1} bind:value={s} format={(v) => v.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .tails { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 4 4; }
  .region { fill: var(--anim-accent); fill-opacity: 0.22; }
  .hatch { stroke: var(--anim-muted); stroke-width: 1.2; }
  .near { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .far { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sup { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
