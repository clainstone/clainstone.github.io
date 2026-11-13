<script>
  // Remark 7.9, the drawings of the lecture: above, f_n = χ_[0, 1 − 1/n] and,
  // dashed, its limit χ_[0, 1]; below, their difference |χ_[0, 1] − f_n| =
  // χ_(1 − 1/n, 1], whose essential supremum is 1 for every n. The slider
  // sets n.
  import Slider from '@toolkit/Slider.svelte';

  const NMAX = 10;
  const OX = 140, UX = 360, UY = 66;
  const TOP = 116, BOTTOM = 248;
  const LEFT = -0.3, RIGHT = 1.45;
  const sx = (x) => OX + x * UX;

  let n = $state(3);
  const c = $derived(1 - 1 / n);
</script>

<figure class="anim edge">
  <svg viewBox="0 0 690 290" role="img" aria-label="Above, the function f n, equal to 1 on the interval from 0 to 1 minus 1 over n, and dashed the characteristic function of the unit interval; below, their difference, equal to 1 on the interval from 1 minus 1 over n, excluded, to 1">
    <!-- above: f_n and, dashed, χ_[0, 1] -->
    <line class="axis" x1={sx(LEFT)} y1={TOP} x2={sx(RIGHT)} y2={TOP} />
    <line class="dashed" x1={sx(0)} y1={TOP - UY} x2={sx(1)} y2={TOP - UY} />
    <line class="guide" x1={sx(1)} y1={TOP} x2={sx(1)} y2={TOP - UY} />
    <line class="guide" x1={sx(c)} y1={TOP} x2={sx(c)} y2={TOP - UY} />
    <line class="f" x1={sx(LEFT)} y1={TOP} x2={sx(0)} y2={TOP} />
    <line class="f" x1={sx(0)} y1={TOP - UY} x2={sx(c)} y2={TOP - UY} />
    <line class="f" x1={sx(c)} y1={TOP} x2={sx(RIGHT) - 6} y2={TOP} />
    <circle class="dot" cx={sx(0)} cy={TOP - UY} r="3.5" />
    <circle class="dot" cx={sx(c)} cy={TOP - UY} r="3.5" />
    <text class="lab" x={sx(c / 2)} y={TOP - UY - 20}>f<tspan class="sub" dy="5">n</tspan></text>
    <text class="it" x={sx(1) + 52} y={TOP - UY}>χ<tspan class="sub" dy="6">[0, 1]</tspan></text>

    <!-- below: the difference χ_(1 − 1/n, 1] -->
    <line class="axis" x1={sx(LEFT)} y1={BOTTOM} x2={sx(RIGHT)} y2={BOTTOM} />
    <line class="guide" x1={sx(c)} y1={BOTTOM} x2={sx(c)} y2={BOTTOM - UY + 4} />
    <line class="guide" x1={sx(1)} y1={BOTTOM} x2={sx(1)} y2={BOTTOM - UY} />
    <line class="f" x1={sx(LEFT)} y1={BOTTOM} x2={sx(c)} y2={BOTTOM} />
    <line class="f" x1={sx(c) + 4} y1={BOTTOM - UY} x2={sx(1)} y2={BOTTOM - UY} />
    <line class="f" x1={sx(1)} y1={BOTTOM} x2={sx(RIGHT) - 6} y2={BOTTOM} />
    <circle class="open" cx={sx(c)} cy={BOTTOM - UY} r="4" />
    <circle class="dot" cx={sx(1)} cy={BOTTOM - UY} r="3.5" />
    <text class="it" x={sx(1) + 82} y={BOTTOM - UY}>χ<tspan class="sub" dy="6">(1 − 1/n, 1]</tspan></text>

    {#each [TOP, BOTTOM] as y}
      <line class="tick" x1={sx(0)} y1={y - 4} x2={sx(0)} y2={y + 4} />
      <line class="tick" x1={sx(c)} y1={y - 4} x2={sx(c)} y2={y + 4} />
      <line class="tick" x1={sx(1)} y1={y - 4} x2={sx(1)} y2={y + 4} />
      <text class="num" x={sx(0)} y={y + 22}>0</text>
      <text class="num end" x={sx(c) + 4} y={y + 22}>1 − 1/<tspan class="it">n</tspan></text>
      <text class="num start" x={sx(1) - 4} y={y + 22}>1</text>
    {/each}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={2} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .edge { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 4; }
  .dashed { stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 8 6; }
  .f { stroke: var(--anim-accent); stroke-width: 3; }
  .dot { fill: var(--anim-accent); }
  .open { fill: none; stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: normal; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
  .end { text-anchor: end; }
  .start { text-anchor: start; }
</style>
