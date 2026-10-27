<script>
  // Example 14 on (−1, 6]: f_n(x) = √(n + 1) / (√n (x² + 2x) + √(n + √n) (2x + 3))
  // for the n of the slider, its limit f(x) = 1/((x + 1)(x + 3)), which blows up
  // at −1, and, dashed on (1, 6], the bound √2/((x + 1)(x + 3)) of (3). The
  // dotted line marks x = 1; heights above 0.9 are cut.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const A = -1, B = 6, L = 80, UX = 81, OY = 262, UY = 258, TOP = 0.9, E = 1e-4;
  const sx = (x) => L + (x - A) * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 1 / ((x + 1) * (x + 3));
  const fLine = graph(f, A + E, B, sx, sy, 500, 3);
  const bound = graph((x) => Math.SQRT2 * f(x), 1, B, sx, sy, 300);

  let n = $state(1);
  const fn = $derived((x) => Math.sqrt(n + 1) / (Math.sqrt(n) * (x * x + 2 * x) + Math.sqrt(n + Math.sqrt(n)) * (2 * x + 3)));
</script>

<figure class="anim roots">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from minus 1 to 6, the function f n for the chosen n, its limit f, which grows without bound near minus 1, and, dashed after 1, the bound square root of 2 times f">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <clipPath id="{uid}-clip">
        <rect x={L} y={sy(TOP)} width={(B - A) * UX + 4} height={TOP * UY} />
      </clipPath>
    </defs>
    <line class="dotted" x1={sx(1)} y1={OY} x2={sx(1)} y2={sy(TOP)} />
    <g clip-path="url(#{uid}-clip)">
      <polyline class="bound" points={bound} />
      <polyline class="f" points={fLine} />
      <polyline class="fn" points={graph(fn, A, B, sx, sy, 500, 2)} />
    </g>
    <line class="axis" x1={L - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={sx(A)} y1={OY + 12} x2={sx(A)} y2={sy(TOP) - 8} marker-end="url(#{uid}-head)" />
    {#each [0, 1, 2, 3, 4, 5, 6] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each [0.25, 0.5] as k}
      <line class="tick" x1={sx(A) - 4} y1={sy(k)} x2={sx(A) + 4} y2={sy(k)} />
      <text class="num right" x={sx(A) - 10} y={sy(k)}>{k === 0.25 ? '1/4' : '1/2'}</text>
    {/each}
    <text class="num" x={sx(A)} y={OY + 21}>−1</text>
    <text class="it" x={sx(B) + 26} y={OY + 21}>x</text>

    <line class="fn" x1="440" y1="56" x2="480" y2="56" />
    <text class="left it" x="492" y="56">f<tspan class="sub" dy="5">n</tspan></text>
    <line class="f" x1="440" y1="88" x2="480" y2="88" />
    <text class="left it" x="492" y="88">f</text>
    <line class="bound" x1="440" y1="120" x2="480" y2="120" />
    <text class="left" x="492" y="120">√2 /((<tspan class="it">x</tspan> + 1)(<tspan class="it">x</tspan> + 3))</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={50} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .roots { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .dotted { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 2 4; stroke-linecap: round; }
  .bound { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
