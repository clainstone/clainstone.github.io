<script>
  // Theorem 3.3 on the chain of Example 2.1, an instance: the bar of length
  // p⁽ⁿ⁾ᵢⱼ split into the terms f⁽ᵛ⁾ᵢⱼ p⁽ⁿ⁻ᵛ⁾ⱼⱼ, ν = 1, …, n, of (6).
  // The sliders set i, j and n.
  import Slider from '@toolkit/Slider.svelte';
  import { EX21, powers, firstEntrance } from './markov.js';

  const NMAX = 12;
  const Pn = powers(EX21, NMAX);
  const X0 = 40, X1 = 600, Y = 70;
  const px = (v) => X0 + v * (X1 - X0);
  let i = $state(1);
  let j = $state(1);
  let n = $state(8);
  const terms = $derived.by(() => {
    const f = firstEntrance(Pn, i - 1, j - 1);
    let at = 0;
    return Array.from({ length: n }, (_, k) => {
      const v = k + 1;
      const w = f[v] * Pn[n - v][j - 1][j - 1];
      const t = { v, a: at, b: at + w, w };
      at += w;
      return t;
    });
  });
  const total = $derived(Pn[n][i - 1][j - 1]);
  const fmt = (x) => x.toFixed(4);
</script>

<figure class="anim renewal">
  <svg viewBox="0 0 640 170" role="img" aria-label="A bar from 0 to 1 on which the probability p_ij^(n) is split into the terms f_ij^(nu) p_jj^(n-nu) of the renewal equation">
    <rect class="unit" x={X0} y={Y - 16} width={X1 - X0} height="32" />
    {#each terms as t}
      {#if t.w > 0}
        <rect class="term" class:odd={t.v % 2 === 1} x={px(t.a)} y={Y - 16} width={Math.max(px(t.b) - px(t.a), 0.8)} height="32" />
        {#if px(t.b) - px(t.a) > 34}
          <text class="nu" x={(px(t.a) + px(t.b)) / 2} y={Y}>ν = {t.v}</text>
        {/if}
      {/if}
    {/each}
    <text class="num" x={X0} y={Y + 32}>0</text>
    <text class="num" x={X1} y={Y + 32}>1</text>
    <text class="note" x="320" y="136">p<tspan dy="-7" font-size="12">({n})</tspan><tspan dy="12" font-size="12">{i}{j}</tspan><tspan dy="-5">{"\u00a0"}= {fmt(total)}; the terms add up to {fmt(terms.reduce((s, t) => s + t.w, 0))}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="i" min={1} max={3} step={1} bind:value={i} />
      <Slider label="j" min={1} max={3} step={1} bind:value={j} />
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .renewal { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .unit { fill: none; stroke: var(--anim-rule); stroke-width: 1.4; }
  .term { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 0.8; }
  .term.odd { fill-opacity: 0.3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .nu { font-size: 16px; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .note { font-style: italic; }
</style>
