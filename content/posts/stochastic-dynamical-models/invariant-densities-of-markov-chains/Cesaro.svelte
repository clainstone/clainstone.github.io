<script>
  // The averages μ⁽ⁿ⁾_j = (1/n) Σ_{k=1}^{n} p⁽ᵏ⁾_ij of the proof of Theorem 5.3,
  // with μ⁽⁰⁾ = δ_i, for the gambler's ruin chain on {0, ..., N}: one line
  // for each state j, n from 1 to 200. The sliders set N, p and i.
  import Slider from '@toolkit/Slider.svelte';
  import { gambler, averages } from './chains.js';

  const NMAX = 200;
  const X0 = 64, X1 = 540, Y0 = 262, Y1 = 34;
  const px = (n) => X0 + ((n - 1) * (X1 - X0)) / (NMAX - 1);
  const py = (v) => Y0 - v * (Y0 - Y1);

  let N = $state(4);
  let p = $state(0.5);
  let i = $state(1);
  $effect(() => { if (i > N - 1) i = N - 1; });
  const start = $derived(Math.min(i, N - 1));
  const mus = $derived(averages(gambler(N, p), start, NMAX));
  const line = (j) => mus.map((m, k) => `${px(k + 1).toFixed(1)},${py(m[j]).toFixed(1)}`).join(' ');
  const last = $derived(mus[NMAX - 1]);
  const inner = $derived(Array.from({ length: N - 1 }, (_, t) => t + 1));
  // The grey label sits above the highest inner line at n = 14.
  const midY = $derived(py(Math.max(...inner.map((j) => mus[13][j]))) - 14);
</script>

<figure class="anim cesaro">
  <svg viewBox="0 0 640 318" role="img" aria-label="The averages of the n-step transition probabilities from the state i to every state j of the gambler's ruin chain, against n from 1 to 200">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 12} />
    {#each [1, 50, 100, 150, 200] as n}
      <line class="tick" x1={px(n)} y1={Y0} x2={px(n)} y2={Y0 + 5} />
      <text class="num" x={px(n)} y={Y0 + 20}>{n}</text>
    {/each}
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 24} y={py(v)}>{v}</text>
    {/each}
    {#each inner as j}
      <polyline class="mid" points={line(j)} />
    {/each}
    <polyline class="zero" points={line(0)} />
    <polyline class="top" points={line(N)} />
    <text class="lab zero-l" x={X1 + 12} y={py(last[0]) + (last[0] > last[N] ? -10 : 10)}>j = 0</text>
    <text class="lab top-l" x={X1 + 12} y={py(last[N]) + (last[N] >= last[0] ? -10 : 10)}>j = {N}</text>
    <text class="lab mid-l" x={px(14)} y={midY}>0 &lt; j &lt; {N}</text>
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>n</text>
    <text class="note" x={(X0 + X1) / 2} y="306">start i = {start}; at n = {NMAX}: j = 0 gives {last[0].toFixed(3)}, j = {N} gives {last[N].toFixed(3)}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={2} max={8} step={1} bind:value={N} />
      <Slider label="p" min={0.05} max={0.95} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
      <Slider label="i" min={1} max={N - 1} step={1} bind:value={i} />
    </div>
  </div>
</figure>

<style>
  .cesaro { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  polyline { fill: none; stroke-linejoin: round; }
  .mid { stroke: var(--anim-muted); stroke-width: 1.2; stroke-opacity: 0.8; }
  .zero { stroke: var(--anim-accent); stroke-width: 2.2; }
  .top { stroke: var(--anim-ink); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { text-anchor: start; font-size: 16px; font-style: italic; }
  .zero-l { fill: var(--anim-accent); }
  .mid-l { fill: var(--anim-muted); }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .cesaro :global(.anim-slider-label) { font-style: italic; }
</style>
