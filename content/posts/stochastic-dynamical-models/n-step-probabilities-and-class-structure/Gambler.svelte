<script>
  // The gambler's ruin chain on {0, 1, ..., N}: up with probability p and
  // down with probability 1 - p from 1, ..., N - 1; 0 and N are kept with
  // probability 1. The classes {0}, {1, ..., N - 1}, {N} are shaded. For
  // 1 ≤ i ≤ j ≤ N - 1 (the j slider starts at i) the path of j - i steps up
  // from i to j and the path of j - i steps down from j to i are marked, with
  // their probabilities.
  import Slider from '@toolkit/Slider.svelte';
  import { edge, loop } from './draw.js';

  let N = $state(6);
  let p = $state(0.6);
  let i = $state(2);
  let j = $state(4);
  // 1 ≤ i ≤ j ≤ N - 1, as in the example.
  $effect(() => { if (i > N - 1) i = N - 1; if (j > N - 1) j = N - 1; if (j < i) j = i; });
  const lo = $derived(i);
  const hi = $derived(j);

  const W = 760, Yc = 110, r = 17;
  const x = $derived((k) => 80 + ((W - 160) * k) / N);
  const up = $derived(Array.from({ length: N - 1 }, (_, t) => t + 1).map((k) => ({ k, on: k >= lo && k < hi, ...edge([x(k), Yc], [x(k + 1), Yc], { r, bend: -26, gap: 13 }) })));
  const down = $derived(Array.from({ length: N - 1 }, (_, t) => t + 1).map((k) => ({ k, on: k > lo && k <= hi, ...edge([x(k), Yc], [x(k - 1), Yc], { r, bend: -26, gap: 13 }) })));
  const loops = $derived([loop([x(0), Yc], 180, { r }), loop([x(N), Yc], 0, { r })]);
  const fmt = (v) => (v >= 1e-4 ? v.toFixed(4) : v.toExponential(2));
</script>

<figure class="anim gambler">
  <svg viewBox="0 0 {W} 220" role="img" aria-label="States 0 to {N} in a row; each middle state moves up with probability p and down with probability 1 − p; 0 and {N} are kept with probability 1">
    <rect class="group" x={x(0) - 48} y="46" width="72" height="128" rx="16" />
    <rect class="group" x={x(1) - 26} y="46" width={x(N - 1) - x(1) + 52} height="128" rx="16" />
    <rect class="group" x={x(N) - 24} y="46" width="72" height="128" rx="16" />
    {#each loops as l}
      <circle class="edge" cx={l.cx} cy={l.cy} r={l.r} />
      <text class="prob" x={l.lx} y={l.ly}>1</text>
    {/each}
    {#each up as e}
      <path class="edge" class:on={e.on} d={e.d} /><polygon class="head" class:on={e.on} points={e.head} />
      <text class="prob" x={e.lx} y={e.ly}>p</text>
    {/each}
    {#each down as e}
      <path class="edge" class:on2={e.on} d={e.d} /><polygon class="head" class:on2={e.on} points={e.head} />
      <text class="prob" x={e.lx} y={e.ly}>1 − p</text>
    {/each}
    {#each Array.from({ length: N + 1 }, (_, k) => k) as k}
      <circle class="node" class:mark={k === lo || k === hi} cx={x(k)} cy={Yc} {r} />
      <text class="name" x={x(k)} y={Yc}>{k}</text>
    {/each}
  </svg>
  <p class="readout">
    <span class="nowrap"><i>p</i><sub>{lo}{hi}</sub><sup>({hi - lo})</sup> = <i>p</i><sup>{hi - lo}</sup> = {fmt(p ** (hi - lo))}</span>,
    <span class="nowrap"><i>p</i><sub>{hi}{lo}</sub><sup>({hi - lo})</sup> = (1 − <i>p</i>)<sup>{hi - lo}</sup> = {fmt((1 - p) ** (hi - lo))}</span>
  </p>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={2} max={10} step={1} bind:value={N} />
      <Slider label="p" min={0.05} max={0.95} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
      <Slider label="i" min={1} max={N - 1} step={1} bind:value={i} />
      <Slider label="j" min={i} max={N - 1} step={1} bind:value={j} />
    </div>
  </div>
</figure>

<style>
  .gambler { margin: 1.5rem 0; }
  svg { display: block; width: 100%; height: auto; font-family: var(--anim-font); }
  .group { fill: var(--anim-muted); fill-opacity: 0.07; stroke: var(--anim-muted); stroke-dasharray: 5 4; stroke-width: 1.2; }
  .edge { fill: none; stroke: var(--anim-muted); stroke-opacity: 0.55; stroke-width: 1.5; }
  .head { fill: var(--anim-muted); fill-opacity: 0.55; }
  .edge.on, .edge.on2 { stroke: var(--anim-accent); stroke-opacity: 1; stroke-width: 2.6; }
  .head.on, .head.on2 { fill: var(--anim-accent); fill-opacity: 1; }
  .gambler :global(.anim-slider-label) { font-style: italic; }
  .node { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.5; }
  .node.mark { stroke: var(--anim-accent); stroke-width: 3; }
  .name { fill: var(--anim-ink); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .prob { fill: var(--anim-muted); font-size: 14px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .readout { margin: 0.4rem 0 0; font-size: 0.875rem; color: var(--anim-muted); }
</style>
