<script>
  // Example 5.2 with p_m = p and q_m = q for every m, an instance: the terms
  // of the series are (p/q)^n. Above, its partial sums for n up to 30; below,
  // when it converges, the invariant density π_n for n = 0, ..., 20, from
  // π_n = (p/q)^n π_0 and π_0 = (1 + S)^(−1). The sliders set p and q.
  import Slider from '@toolkit/Slider.svelte';

  const MMAX = 30, NMAX = 20;
  const X0 = 64, X1 = 560;
  const T0 = 158, T1 = 28;
  const B0 = 390, B1 = 228;
  let p = $state(0.3);
  let q = $state(0.45);
  const rho = $derived(p / q);
  const partial = $derived.by(() => {
    let s = 0;
    return Array.from({ length: MMAX }, (_, k) => (s += rho ** (k + 1)));
  });
  const S = $derived(rho < 1 ? rho / (1 - rho) : Infinity);
  const pi = $derived(Number.isFinite(S) ? Array.from({ length: NMAX + 1 }, (_, n) => rho ** n / (1 + S)) : null);
  // The vertical range of the partial sums: 30 when they diverge, else a little above S.
  const SMAX = $derived(Number.isFinite(S) ? Math.max(2, Math.ceil(1.25 * S)) : 30);
  const ticks = $derived([0, SMAX / 2, SMAX]);
  const tx = (m) => X0 + ((m - 1) * (X1 - X0)) / (MMAX - 1);
  const ty = (v) => T0 - (Math.min(v, SMAX) * (T0 - T1)) / SMAX;
  const top = $derived(pi ? Math.max(0.25, Math.ceil(pi[0] * 4) / 4) : 1);
  const bw = (X1 - X0) / (NMAX + 1);
  const by = (v) => B0 - (v * (B0 - B1)) / top;
</script>

<figure class="anim density-n">
  <svg viewBox="0 0 640 424" role="img" aria-label="Above, the partial sums of the series of Example 5.2 with constant p and q; below, the invariant density when the series converges">
    <line class="axis" x1={X0} y1={T0} x2={X1 + 8} y2={T0} />
    <line class="axis" x1={X0} y1={T0} x2={X0} y2={T1 - 8} />
    {#each ticks as v}
      <text class="num" x={X0 - 24} y={ty(v)}>{Number.isInteger(v) ? v : v.toFixed(1)}</text>
    {/each}
    {#each [1, 10, 20, 30] as m}
      <text class="num" x={tx(m)} y={T0 + 18}>{m}</text>
    {/each}
    {#if Number.isFinite(S) && S <= SMAX}
      <line class="level" x1={X0} y1={ty(S)} x2={X1} y2={ty(S)} />
    {/if}
    {#each partial as v, k}
      <circle class="pt" class:out={v > SMAX} cx={tx(k + 1)} cy={ty(v)} r="3.5" />
    {/each}
    <text class="note" x={(X0 + X1) / 2} y="192">{Number.isFinite(S) ? `p < q: the series converges, S = ${S.toFixed(3)}` : 'p ≥ q: the series diverges, no invariant density'}</text>
    <line class="axis" x1={X0} y1={B0} x2={X1 + 8} y2={B0} />
    {#if pi}
      {#each [0, top / 2, top] as v}
        <line class="guide" x1={X0} y1={by(v)} x2={X1} y2={by(v)} />
        <text class="num" x={X0 - 28} y={by(v)}>{v.toFixed(2)}</text>
      {/each}
      {#each pi as v, n}
        <rect class="bar" x={X0 + n * bw + 3} y={by(v)} width={bw - 6} height={B0 - by(v)} />
      {/each}
    {/if}
    {#each [0, 5, 10, 15, 20] as n}
      <text class="num" x={X0 + n * bw + bw / 2} y={B0 + 18}>{n}</text>
    {/each}
    <text class="axis-l" x={X1 + 22} y={B0 + 18}>n</text>
    <text class="axis-l" x={X1 + 22} y={T0 + 18}>n</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={0.05} max={0.5} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
      <Slider label="q" min={0.05} max={0.5} step={0.05} bind:value={q} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .density-n { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .level { stroke: var(--anim-ink); stroke-width: 1.4; stroke-dasharray: 6 4; }
  .pt { fill: var(--anim-accent); }
  .pt.out { fill: var(--anim-muted); }
  .bar { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 1; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-ink); font-style: italic; }
  .density-n :global(.anim-slider-label) { font-style: italic; }
</style>
