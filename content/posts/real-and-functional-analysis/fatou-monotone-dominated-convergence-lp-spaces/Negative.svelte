<script>
  // Remark 2, the drawing of the lecture: f_n = −n on [0, 1/n] and 0 elsewhere,
  // with the dashed line at 1/n, and the region between the graph and the
  // axis, of area 1. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const NMAX = 8;
  const OX = 200, UX = 320, Y0 = 52, UY = 29;
  const LEFT = -0.55, RIGHT = 1.45;
  const sx = (x) => OX + x * UX;
  const sy = (v) => Y0 - v * UY;

  let n = $state(2);
</script>

<figure class="anim negative">
  <svg viewBox="0 0 690 312" role="img" aria-label="The function f n, equal to minus n on the interval from 0 to 1 over n and to 0 elsewhere, with the region between its graph and the axis shaded">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <rect class="region" x={sx(0)} y={Y0} width={sx(1 / n) - sx(0)} height={n * UY} />
    <line class="axis" x1={sx(LEFT)} y1={Y0} x2={sx(RIGHT)} y2={Y0} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={sy(-NMAX - 0.5)} x2={OX} y2={Y0 - 38} marker-end="url(#{uid}-head)" />
    <line class="guide" x1={sx(1 / n)} y1={Y0} x2={sx(1 / n)} y2={sy(-n)} />
    <line class="tick" x1={sx(1 / n)} y1={Y0 - 6} x2={sx(1 / n)} y2={Y0 + 6} />
    <line class="tick" x1={OX - 6} y1={sy(-n)} x2={OX + 6} y2={sy(-n)} />

    <line class="f" x1={sx(LEFT)} y1={Y0} x2={sx(0)} y2={Y0} />
    <line class="f" x1={sx(0)} y1={sy(-n)} x2={sx(1 / n)} y2={sy(-n)} />
    <line class="f" x1={sx(1 / n)} y1={Y0} x2={sx(RIGHT) - 12} y2={Y0} />

    <text class="num" x={sx(1 / n) + (n === 1 ? 0 : 6)} y={Y0 - 22}>1/<tspan class="it">n</tspan></text>
    <text class="num" x={OX - 30} y={sy(-n)}>−<tspan class="it">n</tspan></text>
    <text class="lab" x={sx(1 / n) + 34} y={sy(-n) + 2}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .negative { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .f { stroke: var(--anim-accent); stroke-width: 3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
