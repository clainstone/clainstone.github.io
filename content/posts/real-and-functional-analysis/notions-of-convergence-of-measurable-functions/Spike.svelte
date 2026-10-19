<script>
  // Remark 7, the drawing of the lecture: f_n = n χ_[0, 1/n] on ℝ, the region of
  // area 1 under its graph, the dashed level ε and the set {|f_n| > ε}, hatched
  // on the axis: it is [0, 1/n] when n > ε and empty otherwise. The sliders
  // set n and ε.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const NMAX = 8;
  const OX = 190, UX = 330, OY = 300, UY = 32;
  const LEFT = -0.45, RIGHT = 1.45;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;

  let n = $state(3);
  let eps = $state(1.5);
  const hit = $derived(n > eps);
</script>

<figure class="anim spike">
  <svg viewBox="0 0 690 340" role="img" aria-label="The function f n, equal to n on the interval from 0 to 1 over n and to 0 elsewhere, the region of area 1 under its graph, a dashed level epsilon, and the interval from 0 to 1 over n hatched on the axis when n exceeds epsilon">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    <rect class="region" x={sx(0)} y={sy(n)} width={sx(1 / n) - sx(0)} height={n * UY} />
    {#if hit}
      <rect x={sx(0)} y={OY - 10} width={sx(1 / n) - sx(0)} height="10" fill="url(#{uid}-h)" />
    {/if}
    <line class="axis" x1={sx(LEFT)} y1={OY} x2={sx(RIGHT)} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 14} x2={OX} y2={sy(NMAX + 0.6)} marker-end="url(#{uid}-head)" />
    <line class="level" x1={sx(LEFT)} y1={sy(eps)} x2={sx(1.38)} y2={sy(eps)} />
    <line class="guide" x1={sx(1 / n)} y1={OY} x2={sx(1 / n)} y2={sy(n)} />
    <line class="tick" x1={OX - 6} y1={sy(n)} x2={OX + 6} y2={sy(n)} />
    <line class="tick" x1={sx(1 / n)} y1={OY - 5} x2={sx(1 / n)} y2={OY + 5} />
    <line class="f" x1={sx(LEFT)} y1={OY} x2={sx(0)} y2={OY} />
    <line class="f" x1={sx(0)} y1={sy(n)} x2={sx(1 / n)} y2={sy(n)} />
    <line class="f" x1={sx(1 / n)} y1={OY} x2={sx(RIGHT) - 12} y2={OY} />
    {#if hit}
      <line class="set" x1={sx(0)} y1={OY} x2={sx(1 / n)} y2={OY} />
    {/if}

    <text class="num it" x={OX - 24} y={sy(n)}>n</text>
    <text class="num" x={sx(1 / n) + (n === 1 ? 0 : 8)} y={OY + 24}>1/<tspan class="it">n</tspan></text>
    <text class="num" x={OX - 16} y={OY + 20}>0</text>
    <text class="it" x={sx(1.38) + 16} y={sy(eps)}>ε</text>
    <text class="lab" x={sx(1 / n) + 34} y={sy(n) + 2}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
      <Slider label="ε" min={0.25} max={NMAX} step={0.25} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .spike { margin: 1.5rem auto; max-width: 37rem; }
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
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
