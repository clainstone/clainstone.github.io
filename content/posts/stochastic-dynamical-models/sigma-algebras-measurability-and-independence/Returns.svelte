<script>
  // Section 1, an instance: a path of a chain on the states 1, 2, 3 up to time 40
  // and the event that it returns to i = 1 infinitely often, the intersection over m
  // of the unions over n ≥ m of {Xₙ = i}. The slider sets m and shades the window
  // n ≥ m; the first visit to i in the window is ringed.
  import Slider from '@toolkit/Slider.svelte';
  import { path } from './random.js';

  const LEN = 40, X0 = 90, X1 = 730, Y = { 1: 170, 2: 118, 3: 66 };
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  let m = $state(20);
  let seed = $state(5);
  const xs = $derived(path(seed, LEN));
  const hit = $derived(xs.findIndex((x, n) => n >= m && x === 1));
</script>

<figure class="anim returns">
  <svg viewBox="0 0 760 262" role="img" aria-label="A path of a chain on three states over 40 steps, its visits to state 1 marked, and the window of times n at least m">
    <rect class="window" x={px(m) - 8} y="44" width={X1 - px(m) + 16} height="148" />
    {#each [1, 2, 3] as s}
      <line class="grid" x1={X0} y1={Y[s]} x2={X1} y2={Y[s]} />
      <text class="lab" x={X0 - 22} y={Y[s]}>{s}</text>
    {/each}
    <text class="lab it" x={X0 - 62} y={Y[1]}>i =</text>
    {#each xs as x, n}
      {#if n > 0}<line class="step" x1={px(n - 1)} y1={Y[xs[n - 1]]} x2={px(n)} y2={Y[x]} />{/if}
    {/each}
    {#each xs as x, n}
      <circle class="pt" class:visit={x === 1} cx={px(n)} cy={Y[x]} r={x === 1 ? 5.5 : 3.5} />
    {/each}
    {#if hit >= 0}<circle class="ring" cx={px(hit)} cy={Y[1]} r="11" />{/if}
    {#each [0, 10, 20, 30, 40] as n}
      <text class="num" x={px(n)} y="212">{n}</text>
    {/each}
    <text class="lab it" x={X1 + 18} y="212">n</text>
    <text class="lab it" x={px(m)} y="30">m</text>
    <text class="status" x={X0} y="246">
      {#if hit >= 0}a visit to 1 at time {hit} ≥ {m}: the union over <tspan class="it">n</tspan> ≥ <tspan class="it">m</tspan> occurs{:else}no visit to 1 between times {m} and 40 on this path{/if}
    </text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="m" min={0} max={40} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .returns { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .window { fill: var(--anim-accent); fill-opacity: 0.08; stroke: var(--anim-accent); stroke-opacity: 0.35; stroke-dasharray: 4 4; }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .step { stroke: var(--anim-muted); stroke-width: 1.3; }
  .pt { fill: var(--anim-muted); }
  .pt.visit { fill: var(--anim-accent); }
  .ring { fill: none; stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .status { text-anchor: start; font-size: 16px; }
</style>
