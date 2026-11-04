<script>
  // Example 10 on [−1, 1], for the n of the slider. Without `limit`, the drawing
  // of the lecture: f_n, equal to 0 on [−1, 0], the segment from (0, 0) to
  // (1/n, 1), and 1 on [1/n, 1]; f_(n+1); and the region between their graphs,
  // hatched, whose area is ‖f_(n+1) − f_n‖₁. With `limit`: f_n, its pointwise
  // limit f, dashed, with f(0) = 0 filled and (0, 1) empty, and the region
  // between their graphs, shaded, whose area is ‖f_n − f‖₁.
  import Slider from '@toolkit/Slider.svelte';
  let { limit = false } = $props();
  const uid = $props.id();

  const CX = 330, UX = 270, Y0 = 236, UY = 150;
  const sx = (x) => CX + x * UX;
  const sy = (v) => Y0 - v * UY;
  const P = (x, v) => `${sx(x).toFixed(1)},${sy(v).toFixed(1)}`;

  let n = $state(limit ? 4 : 2);
  const ramp = (m) => [P(-1, 0), P(0, 0), P(1 / m, 1), P(1, 1)].join(' ');
  const region = $derived(limit ? [P(0, 0), P(0, 1), P(1 / n, 1)].join(' ') : [P(0, 0), P(1 / (n + 1), 1), P(1 / n, 1)].join(' '));
</script>

<figure class="anim ramps">
  <svg viewBox="0 0 690 290" role="img" aria-label={limit
    ? 'On the interval from minus 1 to 1, the function f n, zero up to 0, rising along a segment to 1 at 1 over n, then constant 1; dashed, the step function f, zero up to 0 and 1 after it; the region between the two graphs, a thin triangle near 0, shaded'
    : 'On the interval from minus 1 to 1, the functions f n and f n plus 1, zero up to 0, rising along segments to 1 at 1 over n and at 1 over n plus 1, then constant 1; the thin triangle between the two rising segments is hatched'}>
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    <polygon class={limit ? 'shade' : 'hatched'} points={region} fill={limit ? undefined : `url(#${uid}-h)`} />
    <line class="axis" x1={sx(-1.12)} y1={Y0} x2={sx(1.18)} y2={Y0} />
    <path class="head" d="M{sx(1.18) - 9},{Y0 - 5} L{sx(1.18)},{Y0} L{sx(1.18) - 9},{Y0 + 5}" />
    <line class="axis" x1={CX} y1={Y0 + 24} x2={CX} y2={sy(1.32)} />
    <path class="head" d="M{CX - 5},{sy(1.32) + 9} L{CX},{sy(1.32)} L{CX + 5},{sy(1.32) + 9}" />
    <line class="dashed" x1={sx(1 / n)} y1={Y0} x2={sx(1 / n)} y2={sy(1)} />
    <line class="dashed" x1={sx(1)} y1={Y0} x2={sx(1)} y2={sy(1)} />
    {#if limit}
      <polyline class="step" points={[P(0, 1), P(1, 1)].join(' ')} />
      <polyline class="fn accent" points={ramp(n)} />
      <circle class="hole" cx={sx(0)} cy={sy(1)} r="5" />
      <text class="it" x={sx(0.55)} y={sy(1) - 22}>f</text>
      <text class="it lab" x={sx(1 / n) + 22} y={sy(0.5)}>f<tspan class="sub" dy="5">n</tspan></text>
    {:else}
      <polyline class="fn" points={ramp(n)} />
      <polyline class="fn accent" points={[P(0, 0), P(1 / (n + 1), 1), P(1 / n, 1)].join(' ')} />
      <text class="it lab" x={sx(1 / (n + 1)) - 34} y={sy(1) - 18}>f<tspan class="sub" dy="5">n+1</tspan></text>
      <text class="it" x={sx(1 / n) + 24} y={sy(0.5)}>f<tspan class="sub" dy="5">n</tspan></text>
      <text x={sx(-0.5)} y={Y0 - 18}>0</text>
      <text x={sx(0.62)} y={sy(1) - 20}>1</text>
    {/if}
    <circle class="dot" cx={sx(0)} cy={Y0} r="5" />
    <circle class="dot" cx={sx(1)} cy={sy(1)} r="4.5" />
    <line class="tick" x1={sx(-1)} y1={Y0 - 6} x2={sx(-1)} y2={Y0 + 6} />
    <text class="num" x={sx(-1)} y={Y0 + 22}>−1</text>
    <text class="num" x={sx(1 / n)} y={Y0 + 22}>1/<tspan class="it">n</tspan></text>
    <text class="num" x={sx(1)} y={Y0 + 22}>1</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={2} max={limit ? 20 : 10} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .ramps { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .dashed { stroke: var(--anim-ink); stroke-width: 1.1; stroke-dasharray: 5 4; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.4; }
  .hatched { stroke: none; }
  .shade { fill: var(--anim-accent); fill-opacity: 0.25; }
  .fn { fill: none; stroke: var(--anim-ink); stroke-width: 2.6; stroke-linejoin: round; }
  .fn.accent { stroke: var(--anim-accent); }
  .step { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  .hole { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 2; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
