<script>
  // The drawing of Example 1, used again in Example 3: the function f_n,
  // equal to −1 on [−1, −1/n], linear on [−1/n, 1/n] and equal to 1 on
  // [1/n, 1], for the n of the slider, with the dotted verticals of the
  // lecture's drawing at −1/n and 1/n.
  import Slider from '@toolkit/Slider.svelte';
  import { head } from './plot.js';

  const OX = 380, OY = 150, UX = 240, UY = 95;
  const px = (x) => OX + x * UX;
  const py = (y) => OY - y * UY;

  let n = $state(3);
  const k = $derived(1 / n);
  const ramp = $derived(`${px(-1)},${py(-1)} ${px(-k)},${py(-1)} ${px(k)},${py(1)} ${px(1)},${py(1)}`);
</script>

<figure class="anim ramp">
  <svg viewBox="0 0 760 300" role="img" aria-label="The graph of f n on the interval from minus 1 to 1: equal to minus 1 up to minus 1 over n, a segment from height minus 1 at minus 1 over n to height 1 at 1 over n, and equal to 1 from 1 over n to 1">
    <line class="axis" x1={px(-1.3)} y1={OY} x2={px(1.3)} y2={OY} />
    <polygon class="head" points={head(px(1.3) + 10, OY, 1, 0)} />
    <line class="axis" x1={OX} y1={py(-1.4)} x2={OX} y2={py(1.4)} />
    <polygon class="head" points={head(OX, py(1.4) - 10, 0, -1)} />

    <line class="dot" x1={px(-k)} y1={OY} x2={px(-k)} y2={py(-1)} />
    <line class="dot" x1={px(k)} y1={OY} x2={px(k)} y2={py(1)} />
    {#each [-1, -k, k, 1] as x}
      <line class="tick" x1={px(x)} y1={OY - 5} x2={px(x)} y2={OY + 5} />
    {/each}
    <polyline class="fn" points={ramp} />

    <text x={px(-1)} y={OY - 20}>−1</text>
    <text x={Math.min(px(-k), OX - 26)} y={OY - 20}>−1/<tspan class="it">n</tspan></text>
    <text x={Math.max(px(k), OX + 22)} y={OY + 22}>1/<tspan class="it">n</tspan></text>
    <text x={px(1)} y={OY + 22}>1</text>
    <text x={px((k + 1) / 2)} y={py(1) - 20}>1</text>
    <text x={px(-(k + 1) / 2)} y={py(-1) + 22}>−1</text>
    <text class="lab it" x={px(1) + 36} y={py(1)}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={2} max={12} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .ramp { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .dot { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 2 4; stroke-linecap: round; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .sub { font-size: 13px; }
</style>
