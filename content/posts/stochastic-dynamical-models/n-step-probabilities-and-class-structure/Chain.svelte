<script>
  // A static state diagram: nodes, labelled arrows, loops, and optional
  // shaded groups (communicating classes) behind them.
  import { edge, loop } from './draw.js';

  let { width, height, nodes, edges = [], loops = [], groups = [], label, maxWidth = '34rem', r = 16 } = $props();
  const at = Object.fromEntries(nodes.map((n) => [n.id, [n.x, n.y]]));
  const E = edges.map((e) => ({ ...e, ...edge(at[e.from], at[e.to], { r, bend: e.bend ?? 0, side: e.side ?? 1, gap: e.gap ?? 15 }) }));
  const L = loops.map((l) => ({ ...l, ...loop(at[l.at], l.angle, { r }) }));
</script>

<figure class="anim chain" style:max-width={maxWidth}>
  <svg viewBox="0 0 {width} {height}" role="img" aria-label={label}>
    {#each groups as g}
      <rect class="group" class:closed={g.closed} x={g.x} y={g.y} width={g.w} height={g.h} rx="18" />
      {#if g.label}<text class="glabel" x={g.x + g.w - 10} y={g.y + g.h - 10}>{g.label}</text>{/if}
    {/each}
    {#each L as l}
      <circle class="edge" cx={l.cx} cy={l.cy} r={l.r} />
      {#if l.label}<text class="prob" x={l.lx} y={l.ly}>{l.label}</text>{/if}
    {/each}
    {#each E as e}
      <path class="edge" d={e.d} />
      <polygon class="head" points={e.head} />
      {#if e.label}<text class="prob" x={e.lx} y={e.ly}>{e.label}</text>{/if}
    {/each}
    {#each nodes as n}
      <circle class="node" cx={n.x} cy={n.y} {r} />
      <text class="name" x={n.x} y={n.y}>{n.name ?? n.id}</text>
    {/each}
  </svg>
</figure>

<style>
  .chain { margin: 1.5rem auto; }
  svg { font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; }
  .head { fill: var(--anim-muted); }
  .node { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.5; }
  .name { fill: var(--anim-ink); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .prob { fill: var(--anim-accent); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .group { fill: var(--anim-muted); fill-opacity: 0.08; stroke: var(--anim-muted); stroke-dasharray: 5 4; stroke-width: 1.2; }
  .group.closed { fill: var(--anim-accent); fill-opacity: 0.1; stroke: var(--anim-accent); stroke-dasharray: none; }
  .glabel { fill: var(--anim-muted); font-size: 14px; font-style: italic; text-anchor: end; }
</style>
