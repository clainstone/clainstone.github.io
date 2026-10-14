<script>
  // The proof of Corollary 10 (1), an instance on an interval E: a function
  // f ≥ 0 that vanishes on part of E, the level 1/m (dashed), the set
  // Eₘ = {x ∈ E : f(x) > 1/m} on the axis and, below it, the set
  // {x ∈ E : f(x) > 0}, the union of the Eₘ. The slider sets m.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, intervals } from './plot.js';

  const OX = 60, OY = 232, UX = 560, UY = 160;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) =>
    t <= 0.5 ? 1.15 * Math.sin((Math.PI * t) / 0.5) ** 1.3
    : t < 0.72 ? 0
    : 0.7 * Math.sin((Math.PI * (t - 0.72)) / 0.28) ** 1.2;
  const fLine = graph(f, 0, 1, sx, sy, 500);
  const positive = intervals((t) => f(t) > 0, 0, 1, 2000);

  let m = $state(3);
  const sets = $derived(intervals((t) => f(t) > 1 / m, 0, 1, 2000));
</script>

<figure class="anim levels">
  <svg viewBox="0 0 690 318" role="img" aria-label="A nonnegative function f on an interval E, zero on a middle part, a dashed level 1 over m, the set where f exceeds 1 over m on the axis, and below it the set where f is positive">
    <line class="level" x1={OX} y1={sy(1 / m)} x2={sx(1)} y2={sy(1 / m)} />
    <polyline class="curve" points={fLine} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 20} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(1.25)} />
    {#each sets as [a, b]}
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    {#each positive as [a, b]}
      <line class="pos" x1={sx(a)} y1={OY + 44} x2={sx(b)} y2={OY + 44} />
    {/each}
    <text class="lab" x={OX - 26} y={sy(1 / m)}>1/<tspan class="it">m</tspan></text>
    <text class="lab it" x={sx(0.25) + 30} y={sy(f(0.25)) - 12}>f</text>
    <text class="lab it muted" x={sx(1) + 32} y={OY}>E</text>
    {#if sets.length}
      <text class="lab it accent" x={(sx(sets[0][0]) + sx(sets[0][1])) / 2} y={OY + 20}>E<tspan class="sub" dy="5">m</tspan></text>
    {/if}
    <text class="lab muted" x={(sx(positive[0][0]) + sx(positive[0][1])) / 2} y={OY + 66}>{`{x ∈ E : f(x) > 0}`}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={30} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .levels { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .level { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .pos { stroke: var(--anim-muted); stroke-width: 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
