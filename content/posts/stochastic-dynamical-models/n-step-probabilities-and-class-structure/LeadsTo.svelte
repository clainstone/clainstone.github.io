<script>
  // "i leads to j" on the chain of Example 1.1: choosing a pad i marks every
  // pad j with i → j, that is, every j at the end of a sequence of jumps of
  // positive probability from i (Theorem 2.4), and among them those with
  // i ↔ j.
  import { W, H, R, LR, NODES, EDGES, LOOPS, P, edgeGeometry, loopGeometry } from '../lecture-1-markov-chains-and-the-transition-matrix/frog.js';

  const reach = P.map((_, i) => {
    const seen = new Set([i]); const stack = [i];
    while (stack.length) { const k = stack.pop(); P[k].forEach((v, j) => { if (v > 0 && !seen.has(j)) { seen.add(j); stack.push(j); } }); }
    return seen;
  });
  const edges = EDGES.map((e) => {
    const g = edgeGeometry(e);
    const tip = [g.mx + g.ux * 7, g.my + g.uy * 7], base = [g.mx - g.ux * 5, g.my - g.uy * 5];
    const head = [tip, [base[0] + g.uy * 5, base[1] - g.ux * 5], [base[0] - g.uy * 5, base[1] + g.ux * 5]];
    return { ...g, i: e.i, j: e.j, head: head.map((q) => q.join(',')).join(' ') };
  });
  const loops = LOOPS.map((l) => ({ ...loopGeometry(l), i: l.i }));

  let from = $state(3);
  const leads = $derived(reach[from]);
  const comm = $derived(new Set([...reach[from]].filter((j) => reach[j].has(from))));
  const list = (s) => `{${[...s].sort((a, b) => a - b).map((k) => k + 1).join(', ')}}`;
  const pick = (i) => (from = i);
</script>

<figure class="anim leads-to">
  <svg viewBox="0 0 {W} {H}" role="img" aria-label="The chain of Example 1.1; choose a pad to mark the pads it leads to">
    {#each loops as l}<circle class="edge" class:on={leads.has(l.i)} cx={l.cx} cy={l.cy} r={LR} />{/each}
    {#each edges as e}
      <line class="edge" class:on={leads.has(e.i)} x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by} />
      <polygon class="head" class:on={leads.has(e.i)} points={e.head} />
    {/each}
    {#each NODES as [x, y], i}
      <g class="pad" role="button" tabindex="0" aria-label="Start from pad {i + 1}" onclick={() => pick(i)}
        onkeydown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), pick(i))}>
        <circle class:lead={leads.has(i)} class:comm={comm.has(i)} class:from={i === from} cx={x} cy={y} r={R + 4} />
        <text {x} {y}>{i + 1}</text>
      </g>
    {/each}
  </svg>
  <p class="readout">
    State {from + 1} leads to the states {list(leads)} and communicates with the states {list(comm)}.
  </p>
</figure>

<style>
  .leads-to { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-rule); stroke-width: 1.6; }
  .head { fill: var(--anim-rule); }
  .edge.on { stroke: var(--anim-muted); }
  .head.on { fill: var(--anim-muted); }
  .pad { cursor: pointer; outline: none; }
  .pad circle { fill: var(--page, #fff); stroke: var(--anim-muted); stroke-width: 1.4; }
  .pad circle.lead { stroke: var(--anim-accent); stroke-width: 2; }
  .pad circle.comm { fill: var(--anim-accent); fill-opacity: 0.18; }
  .pad circle.from { stroke-width: 3.5; }
  .pad:focus-visible circle { stroke-dasharray: 4 3; }
  .pad text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
  .readout { margin: 0.4rem 0 0; font-size: 0.875rem; color: var(--anim-muted); }
</style>
