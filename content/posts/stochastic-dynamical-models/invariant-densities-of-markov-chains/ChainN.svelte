<script>
  // The chain of Example 5.2 on the states 0, ..., 5: from m it moves to m + 1
  // with probability p_m, to m − 1 with probability q_m (m ≥ 1) and stays with
  // probability r_m. The three arrows into the state 2 are in colour: they
  // carry p_1, r_2 and q_3, the terms of the equation for π_2.
  const uid = $props.id();
  const K = 6, Y = 120, R = 21;
  const x = (m) => 62 + m * 118;
  const into = (from, to) => to === 2;
</script>

<figure class="anim chain-n">
  <svg viewBox="0 0 760 214" role="img" aria-label="States 0 to 5 in a row; from each state m an arrow to m plus 1 with probability p sub m and a loop with probability r sub m, and from each state m from 1 on an arrow to m minus 1 with probability q sub m; the arrows into state 2 are highlighted">
    <defs>
      <marker id="{uid}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="head" d="M0,1 L10,5 L0,9 Z" />
      </marker>
      <marker id="{uid}-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="head on" d="M0,1 L10,5 L0,9 Z" />
      </marker>
    </defs>
    {#each Array.from({ length: K }, (_, m) => m) as m}
      <!-- the loop r_m above the state m -->
      <path class="edge" class:on={m === 2} d="M{x(m) - 9},{Y - R + 3} C{x(m) - 30},{Y - 78} {x(m) + 30},{Y - 78} {x(m) + 9},{Y - R + 3}" marker-end="url(#{uid}-{m === 2 ? 'b' : 'a'})" />
      <text class="prob" class:on={m === 2} x={x(m)} y={Y - 76}>r<tspan dy="5" font-size="12">{m}</tspan></text>
      {#if m < K - 1}
        <!-- to the right with p_m, above the axis -->
        <line class="edge" class:on={into(m, m + 1)} x1={x(m) + R + 2} y1={Y - 8} x2={x(m + 1) - R - 3} y2={Y - 8} marker-end="url(#{uid}-{into(m, m + 1) ? 'b' : 'a'})" />
        <text class="prob" class:on={into(m, m + 1)} x={(x(m) + x(m + 1)) / 2} y={Y - 24}>p<tspan dy="5" font-size="12">{m}</tspan></text>
        <!-- to the left with q_{m+1}, below the axis -->
        <line class="edge" class:on={into(m + 1, m)} x1={x(m + 1) - R - 2} y1={Y + 8} x2={x(m) + R + 3} y2={Y + 8} marker-end="url(#{uid}-{into(m + 1, m) ? 'b' : 'a'})" />
        <text class="prob" class:on={into(m + 1, m)} x={(x(m) + x(m + 1)) / 2} y={Y + 26}>q<tspan dy="5" font-size="12">{m + 1}</tspan></text>
      {/if}
      <circle class="node" class:on={m === 2} cx={x(m)} cy={Y} r={R} />
      <text class="name" x={x(m)} y={Y}>{m}</text>
    {/each}
    <line class="edge" x1={x(K - 1) + R + 2} y1={Y - 8} x2={x(K - 1) + 62} y2={Y - 8} marker-end="url(#{uid}-a)" />
    <line class="edge" x1={x(K - 1) + 62} y1={Y + 8} x2={x(K - 1) + R + 3} y2={Y + 8} marker-end="url(#{uid}-a)" />
    <text class="prob" x={x(K - 1) + 42} y={Y - 24}>p<tspan dy="5" font-size="12">{K - 1}</tspan></text>
    <text class="prob" x={x(K - 1) + 42} y={Y + 26}>q<tspan dy="5" font-size="12">{K}</tspan></text>
    <text class="dots" x={x(K - 1) + 82} y={Y}>…</text>
    <text class="eq" x="380" y="190">π<tspan dy="5" font-size="12">2</tspan><tspan dy="-5">&nbsp;=&nbsp;p</tspan><tspan dy="5" font-size="12">1</tspan><tspan dy="-5">π</tspan><tspan dy="5" font-size="12">1</tspan><tspan dy="-5">&nbsp;+&nbsp;r</tspan><tspan dy="5" font-size="12">2</tspan><tspan dy="-5">π</tspan><tspan dy="5" font-size="12">2</tspan><tspan dy="-5">&nbsp;+&nbsp;q</tspan><tspan dy="5" font-size="12">3</tspan><tspan dy="-5">π</tspan><tspan dy="5" font-size="12">3</tspan></text>
  </svg>
</figure>

<style>
  .chain-n { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .edge.on { stroke: var(--anim-accent); stroke-width: 2.4; }
  .head { fill: var(--anim-muted); }
  .head.on { fill: var(--anim-accent); }
  .node { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.5; }
  .node.on { stroke: var(--anim-accent); stroke-width: 2.6; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .prob { font-style: italic; fill: var(--anim-muted); }
  .prob.on { fill: var(--anim-accent); }
  .dots { fill: var(--anim-muted); }
  .eq { font-style: italic; fill: var(--anim-accent); }
</style>
