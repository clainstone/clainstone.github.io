<script>
  // Corollary 15, an instance on X = [0, 5/4] with the Lebesgue measure, p = 1
  // and q = 4: u = 1 on [0, 1] and u = 3 on (1, 5/4], drawn in the inset, so
  // that ‖u‖_r = (1 + 3^r / 4)^(1/r). For r in [1, 4]: ‖u‖_r, solid, and the
  // bound ‖u‖_1^α ‖u‖_4^(1−α) with 1/r = α + (1 − α)/4, dashed. The slider
  // sets r and marks the two values.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';

  const norm = (r) => (1 + 3 ** r / 4) ** (1 / r);
  const alpha = (r) => (1 / r - 1 / 4) / (1 - 1 / 4);
  const bound = (r) => norm(1) ** alpha(r) * norm(4) ** (1 - alpha(r));
  const sx = (r) => 90 + (r - 1) * 170;
  const sy = (v) => 262 - (v - 1.7) * 400;
  const normLine = graph(norm, 1, 4, sx, sy, 300);
  const boundLine = graph(bound, 1, 4, sx, sy, 300);
  // The inset: u on [0, 5/4], values 1 and 3.
  const ix = (t) => 110 + t * 96;
  const iy = (v) => 128 - v * 26;

  let r = $state(2);
</script>

<figure class="anim interpolation">
  <svg viewBox="0 0 690 310" role="img" aria-label="For r from 1 to 4, the L r norm of a function with two values, solid, below the interpolation bound, dashed, the two curves meeting at r equal to 1 and r equal to 4; an inset shows the function">
    <line class="axis" x1={sx(1) - 14} y1="276" x2={sx(4) + 20} y2="276" />
    {#each [1, 2, 3, 4] as t}
      <line class="tick" x1={sx(t)} y1="276" x2={sx(t)} y2="282" />
      <text class="num" x={sx(t)} y="296">{t}</text>
    {/each}
    <text class="it" x={sx(4) + 36} y="276">r</text>
    <line class="mark" x1={sx(r)} y1="276" x2={sx(r)} y2={sy(bound(r))} />
    <polyline class="bound" points={boundLine} />
    <polyline class="norm" points={normLine} />
    <circle class="dot" cx={sx(r)} cy={sy(norm(r))} r="5" />
    <circle class="dot accent" cx={sx(r)} cy={sy(bound(r))} r="5" />
    <text class="start" x={sx(3.1)} y={sy(norm(3.1)) + 26}><tspan class="up">‖</tspan><tspan class="it">u</tspan><tspan class="up">‖</tspan><tspan class="sub it" dy="5">r</tspan></text>
    <text class="end lab" x={sx(2.75)} y={sy(bound(2.75)) - 24}><tspan class="up">‖</tspan><tspan class="it">u</tspan><tspan class="up">‖</tspan><tspan class="sub" dy="5">1</tspan><tspan class="sup it" dx="-7" dy="-15">α</tspan><tspan dx="8" dy="10">‖</tspan><tspan class="it">u</tspan><tspan>‖</tspan><tspan class="sub" dy="5">4</tspan><tspan class="sup" dx="-7" dy="-15">1 − </tspan><tspan class="sup it">α</tspan></text>
    <line class="axis" x1={ix(0)} y1={iy(0)} x2={ix(1.25) + 14} y2={iy(0)} />
    <line class="axis" x1={ix(0)} y1={iy(0)} x2={ix(0)} y2={iy(3.4)} />
    <polyline class="u" points="{ix(0)},{iy(1)} {ix(1)},{iy(1)}" />
    <polyline class="u" points="{ix(1)},{iy(3)} {ix(1.25)},{iy(3)}" />
    <line class="guide" x1={ix(1)} y1={iy(0)} x2={ix(1)} y2={iy(3)} />
    <text class="num" x={ix(0) - 12} y={iy(1)}>1</text>
    <text class="num" x={ix(0) - 12} y={iy(3)}>3</text>
    <text class="it" x={ix(0.5)} y={iy(1) - 16}>u</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="r" min={1} max={4} step={0.05} bind:value={r} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .interpolation { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .norm { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; }
  .bound { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-dasharray: 8 5; }
  .mark { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 3 4; }
  .u { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .dot { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .up { font-style: normal; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .sub, .sup { font-size: 13px; }
</style>
