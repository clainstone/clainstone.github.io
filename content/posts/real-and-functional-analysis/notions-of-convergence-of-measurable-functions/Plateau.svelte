<script>
  // Example 14, the drawing of the lecture: f_n = (1/n^α) χ_[0, n] on ℝ, the
  // region under its graph, of area n^(1 − α), the dashed level ε, and the set
  // {f_n > ε} = [0, n] hatched on the axis when 1/n^α > ε (otherwise it is
  // empty). The sliders set n, α and ε.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const NMAX = 12;
  const OX = 70, UX = 44, OY = 250, UY = 190;
  const LEFT = -0.6, RIGHT = 13.4;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const ticks = Array.from({ length: 13 }, (_, k) => k + 1);

  let n = $state(4);
  let alpha = $state(0.5);
  let eps = $state(0.3);
  const h = $derived(n ** -alpha);
  const hit = $derived(h > eps);
</script>

<figure class="anim plateau">
  <svg viewBox="0 0 690 296" role="img" aria-label="The function f n, equal to 1 over n to the alpha on the interval from 0 to n and to 0 elsewhere, the region under its graph, a dashed level epsilon, and the interval from 0 to n hatched on the axis when the height exceeds epsilon">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    <rect class="region" x={sx(0)} y={sy(h)} width={n * UX} height={h * UY} />
    {#if hit}
      <rect x={sx(0)} y={OY - 10} width={n * UX} height="10" fill="url(#{uid}-h)" />
    {/if}
    <line class="axis" x1={sx(LEFT)} y1={OY} x2={sx(RIGHT)} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 14} x2={OX} y2={sy(1.15)} marker-end="url(#{uid}-head)" />
    {#each ticks as k}
      <line class="tick" x1={sx(k)} y1={OY - 3} x2={sx(k)} y2={OY + 3} />
    {/each}
    <line class="tick" x1={OX - 5} y1={sy(1)} x2={OX + 5} y2={sy(1)} />
    <line class="tick" x1={OX - 6} y1={sy(h)} x2={OX + 6} y2={sy(h)} />
    <line class="level" x1={sx(LEFT)} y1={sy(eps)} x2={sx(RIGHT) - 16} y2={sy(eps)} />
    <line class="guide" x1={sx(n)} y1={OY} x2={sx(n)} y2={sy(h)} />
    <line class="f" x1={sx(LEFT)} y1={OY} x2={sx(0)} y2={OY} />
    <line class="f" x1={sx(0)} y1={sy(h)} x2={sx(n)} y2={sy(h)} />
    <line class="f" x1={sx(n)} y1={OY} x2={sx(RIGHT) - 12} y2={OY} />
    {#if hit}
      <line class="set" x1={sx(0)} y1={OY} x2={sx(n)} y2={OY} />
    {/if}

    <text class="num" x={OX - 32} y={sy(h)}>1/<tspan class="it">n</tspan><tspan class="sup" dy="-7">α</tspan></text>
    <text class="num it" x={sx(n)} y={OY + 24}>n</text>
    <text class="num" x={OX - 14} y={OY + 20}>0</text>
    <text class="it" x={sx(RIGHT) - 4} y={sy(eps)}>ε</text>
    <text class="lab" x={sx(n) + 26} y={sy(h) - 14}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
      <Slider label="α" min={0.2} max={2} step={0.05} bind:value={alpha} format={(v) => v.toFixed(2)} />
      <Slider label="ε" min={0.05} max={1} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .plateau { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .level { stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 7 5; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 3.5; }
  .f { stroke: var(--anim-accent); stroke-width: 3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .sup { font-size: 13px; font-style: italic; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
