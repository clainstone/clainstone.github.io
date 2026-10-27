<script>
  // Example 11, Part 1, on (1, 10]: f_n(x) = n² log(1 + 2/(nx)) / (x + n) for
  // the n of the slider and, dashed, its limit f(x) = 2/x.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 63, OY = 262, UY = 104, A = 1, B = 10;
  const sx = (x) => OX + (x - A) * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 2 / x;
  const fLine = graph(f, A, B, sx, sy, 400);

  let n = $state(2);
  const fn = $derived((x) => (n * n * Math.log(1 + 2 / (n * x))) / (x + n));
</script>

<figure class="anim logarithm">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 1 to 10, the function f n for the chosen n below the dashed graph of 2 over x, which it approaches as n grows">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <polyline class="f" points={fLine} />
    <polyline class="fn" points={graph(fn, A, B, sx, sy, 400)} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(2.25)} marker-end="url(#{uid}-head)" />
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each [1, 2] as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="it" x={sx(B) + 26} y={OY + 21}>x</text>

    <line class="fn" x1="470" y1="56" x2="510" y2="56" />
    <text class="left it" x="522" y="56">f<tspan class="sub" dy="5">n</tspan></text>
    <line class="f" x1="470" y1="88" x2="510" y2="88" />
    <text class="left" x="522" y="88"><tspan class="it">f</tspan>(<tspan class="it">x</tspan>) = 2/<tspan class="it">x</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={60} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .logarithm { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
