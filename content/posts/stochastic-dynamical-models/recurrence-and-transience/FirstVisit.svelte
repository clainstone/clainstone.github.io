<script>
  // Definition 3.2, an instance: a path X₀, …, X₁₄ of the chain of Example 2.1
  // started at X₀ = 1. The buttons choose j; the first n ≥ 1 with Xₙ = j,
  // that is T_j, is marked. "New path" draws another path.
  import { EX21, path, random } from './markov.js';

  const LEN = 14;
  const X0 = 70, X1 = 610, Y = { 0: 190, 1: 120, 2: 50 };
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  let seed = $state(7);
  let j = $state(0);
  const xs = $derived(path(EX21, 0, LEN, random(seed)));
  const hit = $derived(xs.findIndex((x, n) => n >= 1 && x === j));
</script>

<figure class="anim first-visit">
  <svg viewBox="0 0 640 262" role="img" aria-label="A path of the chain of Example 2.1 over 14 steps, with the first time after 0 at which it is in the chosen state j marked">
    {#each [0, 1, 2] as s}
      <line class="grid" class:target={s === j} x1={X0} y1={Y[s]} x2={X1} y2={Y[s]} />
      <text class="state" class:target={s === j} x={X0 - 30} y={Y[s]}>{s + 1}</text>
    {/each}
    {#each xs as x, n}
      {#if n > 0}
        <line class="step" x1={px(n - 1)} y1={Y[xs[n - 1]]} x2={px(n)} y2={Y[x]} />
      {/if}
    {/each}
    {#each xs as x, n}
      <circle class="pt" class:hit={n === hit} class:start={n === 0} cx={px(n)} cy={Y[x]} r={n === hit ? 8 : 5} />
      <text class="num" x={px(n)} y="222">{n}</text>
    {/each}
    {#if hit > 0}
      <line class="mark" x1={px(hit)} y1={Y[j] + 12} x2={px(hit)} y2="208" />
    {/if}
    <text class="note" x={X0 + (X1 - X0) / 2} y="252">{hit > 0 ? `T${'₁₂₃'[j]} = ${hit}` : `T${'₁₂₃'[j]} > ${LEN}`}</text>
    <text class="axis" x={X1 + 20} y="222">n</text>
  </svg>
  <div class="anim-controls">
    {#each [0, 1, 2] as s}
      <button type="button" class="anim-toggle" aria-pressed={s === j} onclick={() => (j = s)}>j = {s + 1}</button>
    {/each}
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
  </div>
</figure>

<style>
  .first-visit { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .grid.target { stroke: var(--anim-accent); stroke-opacity: 0.45; stroke-width: 2; }
  .step { stroke: var(--anim-muted); stroke-width: 1.4; }
  .pt { fill: var(--anim-muted); }
  .pt.start { fill: var(--anim-ink); }
  .pt.hit { fill: var(--anim-accent); }
  .mark { stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 4 3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .state { fill: var(--anim-muted); }
  .state.target { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .note { font-style: italic; fill: var(--anim-accent); }
  .axis { font-style: italic; fill: var(--anim-muted); }
  .anim-toggle[aria-pressed='true'] { color: var(--anim-ink); border-color: var(--anim-accent); }
</style>
