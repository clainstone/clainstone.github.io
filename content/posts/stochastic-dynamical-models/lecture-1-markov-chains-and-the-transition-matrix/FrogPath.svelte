<script>
  // Theorem 1.3 on the frog chain: the probability of a path i0, i1, ..., in
  // started from δ_{i0} is the product of the entries of P along the path.
  // Clicking a pad appends it to the path; the product is updated at once and
  // becomes 0 as soon as a jump has probability 0.
  import { W, H, R, LR, NODES, EDGES, LOOPS, P, edgeGeometry, loopGeometry, fraction } from './frog.js';

  const edges = EDGES.map((e) => {
    const g = edgeGeometry(e);
    const tip = [g.mx + g.ux * 7, g.my + g.uy * 7];
    const base = [g.mx - g.ux * 5, g.my - g.uy * 5];
    const head = [tip, [base[0] + g.uy * 5, base[1] - g.ux * 5], [base[0] - g.uy * 5, base[1] + g.ux * 5]];
    return { ...g, i: e.i, j: e.j, head: head.map((q) => q.join(',')).join(' ') };
  });
  const loops = LOOPS.map((l) => ({ ...loopGeometry(l), i: l.i }));
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const sub = (s) => String(s).split('').map((d) => SUB[Number(d)]).join('');

  // The path of question (a): 1, 2, 3, 1.
  let path = $state([0, 1, 2, 0]);

  const steps = $derived(path.slice(1).map((j, k) => ({ i: path[k], j, v: P[path[k]][j] })));
  const zero = $derived(steps.some((s) => s.v === 0));
  // Every entry is 1, 1/2 or 1/4, so a positive product is 1/2^e.
  const exponent = $derived(steps.reduce((e, s) => e + (s.v === 0.5 ? 1 : s.v === 0.25 ? 2 : 0), 0));
  const product = $derived(zero ? '0' : exponent === 0 ? '1' : `1/${2 ** exponent}`);
  const used = $derived(new Set(steps.map((s) => `${s.i}-${s.j}`)));

  function add(j) {
    if (path.length >= 9) path = [j];
    else path = [...path, j];
  }
</script>

<figure class="anim frog-path">
  <svg viewBox="0 0 {W} {H}" role="group" aria-label="The frog chain with a path highlighted; click a pad to extend the path">
    {#each loops as l}
      <circle class="edge" class:on={used.has(`${l.i}-${l.i}`)} cx={l.cx} cy={l.cy} r={LR} />
    {/each}
    {#each edges as e}
      <line class="edge" class:on={used.has(`${e.i}-${e.j}`)} x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by} />
      <polygon class="head" class:on={used.has(`${e.i}-${e.j}`)} points={e.head} />
    {/each}
    {#each NODES as [x, y], i}
      <g class="pad" role="button" tabindex="0" aria-label="Add pad {i + 1} to the path"
        onclick={() => add(i)} onkeydown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), add(i))}>
        <circle class:start={path[0] === i} class:last={path[path.length - 1] === i} cx={x} cy={y} r={R + 4} />
        <text {x} {y}>{i + 1}</text>
      </g>
    {/each}
  </svg>
  <div class="readout">
    <p>Path: {path.map((i) => i + 1).join(', ')}</p>
    <p>
      P(X₀ = {path[0] + 1}{#each steps as s, k}, X{sub(k + 1)} = {s.j + 1}{/each}) = λ{sub(path[0] + 1)}{#each steps as s} p{sub(`${s.i + 1}${s.j + 1}`)}{/each}
      = 1{#each steps as s} · {s.v === 0 ? '0' : fraction(s.v)}{/each} = <strong>{product}</strong>
    </p>
  </div>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (path = [path[0]])}>Restart from {path[0] + 1}</button>
    <button type="button" class="anim-toggle" onclick={() => (path = [0, 1, 2, 0])}>Path 1, 2, 3, 1</button>
  </div>
</figure>

<style>
  .frog-path { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-rule); stroke-width: 1.6; }
  .head { fill: var(--anim-rule); }
  .edge.on { stroke: var(--anim-accent); stroke-width: 3; }
  .head.on { fill: var(--anim-accent); }
  .pad { cursor: pointer; outline: none; }
  .pad circle { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.6; }
  .pad circle.start { stroke: var(--anim-accent); stroke-width: 3; }
  .pad circle.last { fill: var(--anim-accent); fill-opacity: 0.15; }
  .pad:focus-visible circle { stroke-dasharray: 4 3; }
  .pad text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
  .readout { margin-top: 0.4rem; font-size: 0.875rem; line-height: 1.5; color: var(--anim-muted); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  .readout strong { color: var(--anim-ink); font-weight: 600; }
</style>
