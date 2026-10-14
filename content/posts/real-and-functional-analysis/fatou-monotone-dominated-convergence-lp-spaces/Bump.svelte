<script>
  // Remark 5, the drawing of the lecture: f_n = 1 on [n, n + 1] and 0
  // elsewhere, with the dashed lines at n and n + 1 and the region of area 1
  // under the graph. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const NMAX = 7;
  const OX = 70, UX = 66, Y0 = 160, UY = 92;
  const LEFT = -0.5, RIGHT = 8.7;
  const sx = (x) => OX + x * UX;
  const sy = (v) => Y0 - v * UY;
  const ticks = Array.from({ length: 9 }, (_, k) => k);

  let n = $state(2);
</script>

<figure class="anim bump">
  <svg viewBox="0 0 690 214" role="img" aria-label="The function f n, equal to 1 on the interval from n to n plus 1 and to 0 elsewhere, with the region of area 1 under its graph shaded">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <rect class="region" x={sx(n)} y={sy(1)} width={UX} height={UY} />
    <line class="axis" x1={sx(LEFT)} y1={Y0} x2={sx(RIGHT)} y2={Y0} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={Y0 + 14} x2={OX} y2={sy(1) - 44} marker-end="url(#{uid}-head)" />
    {#each ticks as k}
      <line class="tick" x1={sx(k)} y1={Y0 - 4} x2={sx(k)} y2={Y0 + 4} />
    {/each}
    <line class="guide" x1={sx(n)} y1={Y0} x2={sx(n)} y2={sy(1)} />
    <line class="guide" x1={sx(n + 1)} y1={Y0} x2={sx(n + 1)} y2={sy(1)} />
    <line class="f" x1={sx(n)} y1={sy(1)} x2={sx(n + 1)} y2={sy(1)} />
    <circle class="dot" cx={sx(n)} cy={Y0} r="4" />
    <circle class="dot" cx={sx(n + 1)} cy={Y0} r="4" />

    <text class="num" x={sx(n + 0.5)} y={sy(1) - 18}>1</text>
    <text class="lab" x={sx(n + 1) + 30} y={sy(1) + 8}>f<tspan class="sub" dy="5">n</tspan></text>
    <text class="num it" x={sx(n)} y={Y0 + 26}>n</text>
    <text class="num" x={sx(n + 1)} y={Y0 + 26}><tspan class="it">n</tspan> + 1</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={0} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .bump { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .f { stroke: var(--anim-accent); stroke-width: 3; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
