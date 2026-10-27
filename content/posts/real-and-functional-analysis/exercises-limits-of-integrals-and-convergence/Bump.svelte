<script>
  // Example 9 (3) on [0, 10]: g_n = f_n + χ_[n, n+1] for the n of the slider,
  // the almost everywhere limit f(x) = e^(−x)/(1 + x²), dashed, and the region
  // between the graphs of g_n and f, shaded. Filled dots belong to the graph of
  // g_n at x = n and x = n + 1, empty ones do not.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between } from './plot.js';
  const uid = $props.id();

  const OX = 50, UX = 60, OY = 262, UY = 104, B = 10;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => Math.exp(-x) / (1 + x * x);
  const fLine = graph(f, 0, B, sx, sy, 500);

  let n = $state(2);
  const fn = $derived((x) => (Math.exp(-n * x) + n * n * Math.exp(-x)) / (n + n * n + (1 + n * n) * x * x));
  const gn = $derived((x) => fn(x) + (x >= n && x <= n + 1 ? 1 : 0));
</script>

<figure class="anim bump">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 0 to 10, the function g n, equal to f n plus 1 on the interval from n to n plus 1, the dashed limit f, and the shaded region between the two graphs, mostly a block of height 1 over that interval">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <path class="region" d={between(gn, f, 0, B, sx, sy, 2000)} />
    <polyline class="f" points={fLine} />
    <polyline class="fn" points={graph(fn, 0, n, sx, sy, 300)} />
    <polyline class="fn" points={graph((x) => fn(x) + 1, n, n + 1, sx, sy, 60)} />
    <polyline class="fn" points={graph(fn, n + 1, B, sx, sy, 300)} />
    <circle class="open" cx={sx(n)} cy={sy(fn(n))} r="4" />
    <circle class="open" cx={sx(n + 1)} cy={sy(fn(n + 1))} r="4" />
    <circle class="filled" cx={sx(n)} cy={sy(fn(n) + 1)} r="4" />
    <circle class="filled" cx={sx(n + 1)} cy={sy(fn(n + 1) + 1)} r="4" />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 22} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(2.3)} marker-end="url(#{uid}-head)" />
    {#each Array.from({ length: B }, (_, k) => k + 1) as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each [1, 2] as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 19}>0</text>

    <line class="fn" x1="500" y1="50" x2="540" y2="50" />
    <text class="left it" x="552" y="50">g<tspan class="sub" dy="5">n</tspan></text>
    <line class="f" x1="500" y1="82" x2="540" y2="82" />
    <text class="left it" x="552" y="82">f</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={8} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .bump { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .filled { fill: var(--anim-accent); }
  .open { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 1.8; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
