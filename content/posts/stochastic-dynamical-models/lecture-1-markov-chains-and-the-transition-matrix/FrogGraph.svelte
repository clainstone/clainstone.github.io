<script>
  // The frog chain of Example 1.1: seven pads, every jump with positive
  // probability drawn as an arrow, every probability of staying as a loop.
  import { W, H, R, LR, NODES, EDGES, LOOPS, edgeGeometry, loopGeometry, fraction } from './frog.js';

  const edges = EDGES.map((e) => {
    const g = edgeGeometry(e);
    const tip = [g.mx + g.ux * 7, g.my + g.uy * 7];
    const base = [g.mx - g.ux * 5, g.my - g.uy * 5];
    const head = [tip, [base[0] + g.uy * 5, base[1] - g.ux * 5], [base[0] - g.uy * 5, base[1] + g.ux * 5]];
    return { ...g, head: head.map((q) => q.join(',')).join(' '), label: fraction(e.v) };
  });
  const loops = LOOPS.map((l) => ({ ...loopGeometry(l), label: fraction(l.v) }));
</script>

<figure class="anim frog-graph">
  <svg viewBox="0 0 {W} {H}" role="img" aria-label="Diagram of the frog chain: seven lily pads numbered 1 to 7, arrows for the jumps with their probabilities, loops for the probabilities of staying">
    {#each loops as l}
      <circle class="edge" cx={l.cx} cy={l.cy} r={LR} />
      <text class="prob" x={l.lx} y={l.ly}>{l.label}</text>
    {/each}
    {#each edges as e}
      <line class="edge" x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by} />
      <polygon class="head" points={e.head} />
      <text class="prob" x={e.lx} y={e.ly}>{e.label}</text>
    {/each}
    {#each NODES as [x, y], i}
      <circle class="pad" cx={x} cy={y} r={R} />
      <text class="name" {x} {y}>{i + 1}</text>
    {/each}
  </svg>
</figure>

<style>
  .frog-graph { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; }
  .head { fill: var(--anim-muted); }
  .pad { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; }
  .name { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .prob { fill: var(--anim-accent); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
</style>
