<script>
  // The drawing of Example 12.4. Left: f_n, equal to 0 on [−1, 0], linear on
  // [0, 1/n] and equal to 1 on [1/n, 1], for the n of the slider, with the
  // dashed vertical at 1/n; H dashed where it differs from f_n, on (0, 1/n),
  // and the region between the two graphs shaded, of area ‖f_n − H‖_1.
  // Right: H, equal to 0 on [−1, 0] and to 1 on (0, 1].
  import Slider from '@toolkit/Slider.svelte';
  import { head } from './plot.js';

  const UX = 140, UY = 140, OY = 222;
  const L = 190, R = 570;
  const px = (o, x) => o + x * UX;
  const py = (y) => OY - y * UY;

  let n = $state(3);
  const ramp = $derived(`${px(L, -1)},${py(0)} ${px(L, 0)},${py(0)} ${px(L, 1 / n)},${py(1)} ${px(L, 1)},${py(1)}`);
  const gap = $derived(`${px(L, 0)},${py(0)} ${px(L, 0)},${py(1)} ${px(L, 1 / n)},${py(1)}`);
</script>

<figure class="anim ramps">
  <svg viewBox="0 0 760 270" role="img" aria-label="On the left a continuous function that is zero up to the origin, rises linearly to one at one over n and then stays at one; on the right the function equal to zero up to the origin and to one after it">
    {#each [L, R] as o}
      <line class="axis" x1={px(o, -1.25)} y1={OY} x2={px(o, 1.2)} y2={OY} />
      <polygon class="head" points={head(px(o, 1.2) + 10, OY, 1, 0)} />
      <line class="axis" x1={o} y1={OY + 28} x2={o} y2={py(1.32)} />
      <polygon class="head" points={head(o, py(1.32) - 10, 0, -1)} />
      <line class="tick" x1={px(o, -1)} y1={OY - 5} x2={px(o, -1)} y2={OY + 5} />
      <line class="tick" x1={px(o, 1)} y1={OY - 5} x2={px(o, 1)} y2={OY + 5} />
      <text x={px(o, -1)} y={OY + 22}>−1</text>
      <text x={px(o, 1)} y={OY + 22}>1</text>
      <text x={px(o, -0.5)} y={py(0) - 18}>0</text>
      <text x={px(o, 0.62)} y={py(1) - 18}>1</text>
    {/each}

    <polygon class="area" points={gap} />
    <line class="guide" x1={px(L, 1 / n)} y1={py(0)} x2={px(L, 1 / n)} y2={py(1)} />
    <line class="hdash" x1={px(L, 0)} y1={py(1)} x2={px(L, 1 / n)} y2={py(1)} />
    <polyline class="fn" points={ramp} />
    <line class="tick" x1={px(L, 1 / n)} y1={OY - 5} x2={px(L, 1 / n)} y2={OY + 5} />
    <text x={Math.max(px(L, 1 / n), L + 22)} y={OY + 24}>1<tspan class="up">/</tspan><tspan class="it">n</tspan></text>
    <text class="it" x={px(L, -0.82)} y={py(0.42)}>f<tspan class="sub" dy="5">n</tspan></text>

    <line class="h" x1={px(R, -1)} y1={py(0)} x2={px(R, 0)} y2={py(0)} />
    <line class="h" x1={px(R, 0)} y1={py(1)} x2={px(R, 1)} y2={py(1)} />
    <circle class="filled" cx={R} cy={py(0)} r="4.5" />
    <circle class="empty" cx={R} cy={py(1)} r="4.5" />
    <text class="it" x={px(R, 1.12)} y={py(1.12)}>H</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={20} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .ramps { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .area { fill: var(--anim-accent); fill-opacity: 0.22; stroke: none; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 4 4; }
  .hdash { stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .h { stroke: var(--anim-ink); stroke-width: 2.6; }
  .filled { fill: var(--anim-ink); }
  .empty { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.8; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .up { font-style: normal; }
  .sub { font-size: 13px; font-style: normal; }
</style>
