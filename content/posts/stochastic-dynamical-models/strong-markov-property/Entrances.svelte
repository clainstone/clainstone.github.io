<script>
  // Theorem 6.8 on an instance: a path X_0, ..., X_40 of the chain of
  // Example 2.1 started at X_0 = i = 1, its entrances in 1 numbered in order,
  // and below it Y_m = X_(T+m) with T = T_1^(1), drawn under the same times,
  // its entrances in 1 numbered too. The slider sets n and joins the n-th
  // entrance of X to the (n - 1)-th entrance of Y.
  import Slider from '@toolkit/Slider.svelte';
  import { path, entrances } from './chain.js';

  const LEN = 40, X0 = 96, X1 = 724, STEP = 22;
  const px = (k) => X0 + (k * (X1 - X0)) / LEN;
  const rows = (top) => ({ 3: top, 2: top + STEP, 1: top + 2 * STEP });
  const A = rows(52), C = rows(168);
  let seed = $state(3);
  let n = $state(3);
  const drawn = $derived.by(() => {
    let xs = [];
    for (let s = seed; s < seed + 1000; s++) {
      xs = path(s, 1, LEN);
      if (entrances(xs, 1).length >= 3) break;
    }
    return xs;
  });
  const xs = $derived(drawn);
  const hits = $derived(entrances(xs, 1));
  const T = $derived(hits[0]);
  const Y = $derived(xs.slice(T));
  const yhits = $derived(entrances(Y, 1));
  $effect(() => { if (n > hits.length) n = hits.length; });
  const line = (pts, rows, from) => pts.map((x, k) => `${k ? 'L' : 'M'}${px(from + k)},${rows[x]}`).join(' ');
  const th = (k) => `${k}${k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th'}`;
</script>

<figure class="anim entrances">
  <svg viewBox="0 0 760 312" role="img" aria-label="A path of the chain started at state 1 over 40 steps with its entrances in 1 numbered, and below it the path restarted at the first entrance with its own entrances numbered; the slider joins the n-th entrance of the first to the entrance before it in the count of the second">
    {#each [[A, 'X'], [C, 'Y']] as [r, name]}
      {#each [1, 2, 3] as s}
        <line class="grid" x1={X0} y1={r[s]} x2={X1} y2={r[s]} />
        <text class="state" x={X0 - 22} y={r[s]}>{s}</text>
      {/each}
      <text class="name" x="34" y={r[2]}>{name}</text>
    {/each}
    {#each [0, 10, 20, 30, 40] as k}
      <text class="num" x={px(k)} y={A[3] - 26}>{k}</text>
    {/each}
    {#each [0, 10, 20, 30] as m}
      {#if T + m <= LEN}<text class="num" x={px(T + m)} y={C[1] + 50}>{m}</text>{/if}
    {/each}
    <line class="mark" x1={px(T)} y1={A[1] + 32} x2={px(T)} y2={C[1] - 8} />
    <path class="walk" d={line(xs, A, 0)} />
    <path class="walk" d={line(Y, C, T)} />
    <line class="join" x1={px(hits[n - 1])} y1={A[1] + 32} x2={px(hits[n - 1])} y2={C[1] - 12} />
    {#each hits as k, h}
      <circle class="hit" class:on={h === n - 1} cx={px(k)} cy={A[1]} r={h === n - 1 ? 7 : 5} />
      <text class="order" class:on={h === n - 1} x={px(k)} y={A[1] + 20}>{h + 1}</text>
    {/each}
    {#each yhits as m, h}
      <circle class="hit" class:on={h === n - 2} cx={px(T + m)} cy={C[1]} r={h === n - 2 ? 7 : 5} />
      <text class="order" class:on={h === n - 2} x={px(T + m)} y={C[1] + 20}>{h + 1}</text>
    {/each}
    <circle class="start" cx={px(T)} cy={C[1]} r="5" />
    <text class="status" x={(X0 + X1) / 2} y="296">the {th(n)} entrance of <tspan class="i">X</tspan> in 1, at time {hits[n - 1]}, is the {th(n - 1)} entrance of <tspan class="i">Y</tspan> in 1, at time {hits[n - 1] - T}</text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="n" min={2} max={hits.length} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .entrances { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .walk { fill: none; stroke: var(--anim-muted); stroke-width: 1.3; stroke-linejoin: round; }
  .mark { stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 4 3; }
  .join { stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 5 3; }
  .hit { fill: var(--anim-ink); }
  .hit.on { fill: var(--anim-accent); }
  .start { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .state { fill: var(--anim-muted); font-size: 16px; }
  .name, .i { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .order { font-size: 16px; fill: var(--anim-muted); }
  .order.on { fill: var(--anim-accent); font-weight: 600; }
  .status { font-size: 16px; }
  .entrances :global(.anim-slider-label) { font-style: italic; }
</style>
