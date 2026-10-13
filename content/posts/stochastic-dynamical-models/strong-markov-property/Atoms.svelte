<script>
  // The events {X_n = i_n, ..., X_0 = i_0} that generate F_n, an instance with
  // the states I = {1, 2} and n from 0 to 3: each node closes the branch read
  // from the row of X_0 down to its row. One branch is coloured, the event
  // {X_3 = 1, X_2 = 2, X_1 = 2, X_0 = 1}. Static.
  const LEVELS = 4;
  const X0 = 96, X1 = 744, ROW = [44, 112, 180, 248];
  const leaves = 2 ** LEVELS;
  const gap = (X1 - X0) / leaves;
  // The node of level n with index b: the bits of b, from the highest, are the
  // states i_0, ..., i_n minus 1.
  const nodes = [];
  for (let n = 0; n < LEVELS; n++) {
    const span = 2 ** (LEVELS - 1 - n);
    for (let b = 0; b < 2 ** (n + 1); b++) {
      nodes.push({ n, b, x: X0 + gap * (b * span + span / 2), state: (b & 1) + 1 });
    }
  }
  const at = (n, b) => nodes.find((d) => d.n === n && d.b === b);
  const edges = nodes.filter((d) => d.n > 0).map((d) => ({ from: at(d.n - 1, d.b >> 1), to: d }));
  // The coloured branch 1, 2, 2, 1: indices 0, 1, 3, 6.
  const branch = new Set(['0-0', '1-1', '2-3', '3-6']);
  const on = (d) => branch.has(`${d.n}-${d.b}`);
</script>

<figure class="anim atoms">
  <svg viewBox="0 0 760 276" role="img" aria-label="Two binary trees of states 1 and 2 over the rows of X0 to X3: each branch from the top row to a node is one event fixing X0 to Xn, and one branch, states 1, 2, 2, 1, is coloured">
    {#each edges as e}
      <line class="edge" class:on={on(e.to)} x1={e.from.x} y1={ROW[e.from.n] + 12} x2={e.to.x} y2={ROW[e.to.n] - 12} />
    {/each}
    {#each nodes as d}
      <circle class="node" class:on={on(d)} cx={d.x} cy={ROW[d.n]} r="12" />
      <text class="state" class:on={on(d)} x={d.x} y={ROW[d.n]}>{d.state}</text>
    {/each}
    {#each ROW as y, n}
      <text class="row" x="34" y={y}>X<tspan class="sub" dy="6">{n}</tspan></text>
    {/each}
  </svg>
</figure>

<style>
  .atoms { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .edge { stroke: var(--anim-rule); stroke-width: 1.6; }
  .edge.on { stroke: var(--anim-accent); stroke-width: 2.4; }
  .node { fill: none; stroke: var(--anim-muted); stroke-width: 1.2; }
  .node.on { stroke: var(--anim-accent); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .state.on { fill: var(--anim-accent); font-weight: 600; }
  .row { font-style: italic; font-size: 17px; fill: var(--anim-muted); }
  .sub { font-size: 12px; font-style: normal; }
</style>
