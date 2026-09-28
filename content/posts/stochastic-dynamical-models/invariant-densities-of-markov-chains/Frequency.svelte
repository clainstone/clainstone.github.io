<script>
  // Above, a path X_0, ..., X_120 of the gambler's ruin chain with N = 6 and
  // p = 1/2 started at X_0 = 3, an instance. Below, for the state j of the
  // slider, the frequency (1/n) Σ_{k=1}^{n} 1{X_k = j} along the path (solid)
  // and the average frequency (1/n) Σ_{k=1}^{n} p⁽ᵏ⁾_ij (dashed), n = 1..120.
  import Slider from '@toolkit/Slider.svelte';
  import { gambler, averages, path, random } from './chains.js';

  const N = 6, P0 = 0.5, START = 3, LEN = 120;
  const P = gambler(N, P0);
  const mean = averages(P, START, LEN);
  const X0 = 64, X1 = 560;
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  const TOP = 18, ROW = 20;
  const ys = (s) => TOP + (N - s) * ROW;
  const B0 = 330, B1 = 182;
  const py = (v) => B0 - v * (B0 - B1);

  let seed = $state(17);
  let j = $state(6);
  const xs = $derived(path(P, START, LEN, random(seed)));
  const freq = $derived.by(() => {
    let c = 0;
    return xs.slice(1).map((x, k) => (c += x === j ? 1 : 0) / (k + 1));
  });
  const solid = $derived(freq.map((v, k) => `${px(k + 1).toFixed(1)},${py(v).toFixed(1)}`).join(' '));
  const dashed = $derived(mean.map((m, k) => `${px(k + 1).toFixed(1)},${py(m[j]).toFixed(1)}`).join(' '));
</script>

<figure class="anim frequency">
  <svg viewBox="0 0 640 384" role="img" aria-label="A path of the gambler's ruin chain and, below, the frequency of visits to the chosen state along the path with its expectation, against time">
    {#each Array.from({ length: N + 1 }, (_, s) => s) as s}
      <line class="grid" class:target={s === j} x1={X0} y1={ys(s)} x2={X1} y2={ys(s)} />
      <text class="state" class:target={s === j} x={X0 - 22} y={ys(s)}>{s}</text>
    {/each}
    <polyline class="path" points={xs.map((x, n) => `${px(n).toFixed(1)},${ys(x)}`).join(' ')} />
    <text class="axis-l" x={X0 - 48} y={ys(N / 2)}>X<tspan dy="5" font-size="12">n</tspan></text>
    <line class="axis" x1={X0} y1={B0} x2={X1 + 8} y2={B0} />
    <line class="axis" x1={X0} y1={B0} x2={X0} y2={B1 - 10} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 24} y={py(v)}>{v}</text>
    {/each}
    {#each [0, 40, 80, 120] as n}
      <line class="tick" x1={px(n)} y1={B0} x2={px(n)} y2={B0 + 5} />
      <text class="num" x={px(n)} y={B0 + 20}>{n}</text>
    {/each}
    <polyline class="mean" points={dashed} />
    <polyline class="freq" points={solid} />
    <text class="axis-l" x={X1 + 22} y={B0 + 20}>n</text>
    <text class="note" x={(X0 + X1) / 2} y="374">j = {j}: frequency {freq[LEN - 1].toFixed(3)}, average frequency {mean[LEN - 1][j].toFixed(3)} at n = {LEN}</text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="j" min={0} max={N} step={1} bind:value={j} />
    </div>
  </div>
</figure>

<style>
  .frequency { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .grid.target { stroke: var(--anim-accent); stroke-opacity: 0.5; stroke-width: 2; }
  .path { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; stroke-linejoin: round; }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .freq { fill: none; stroke: var(--anim-accent); stroke-width: 2; stroke-linejoin: round; }
  .mean { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; stroke-dasharray: 6 4; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .state { fill: var(--anim-muted); font-size: 16px; }
  .state.target { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .frequency :global(.anim-slider-label) { font-style: italic; }
</style>
