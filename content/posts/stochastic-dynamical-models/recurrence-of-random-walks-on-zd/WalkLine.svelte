<script>
  // The drawing of the lecture: the states i − 1, i, i + 1, i + 2 of the random
  // walk on ℤ, the jumps to the right with probability p, below, and to the
  // left with probability q, above.
  const X = [110, 250, 390, 530];
  const NAMES = ['i − 1', 'i', 'i + 1', 'i + 2'];
  const Y = 90, R = 30;
</script>

<figure class="anim walk-line">
  <svg viewBox="0 0 640 180" role="img" aria-label="States i-1, i, i+1, i+2 in a row; each state jumps to the right neighbour with probability p and to the left neighbour with probability q">
    <defs>
      <marker id="lm-walk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="head" d="M0,1 L10,5 L0,9 Z" />
      </marker>
    </defs>
    {#each X as x, k}
      <circle class="state" cx={x} cy={Y} r={R} />
      <text class="name" x={x} y={Y}>{NAMES[k]}</text>
      {#if k < X.length - 1}
        <line class="jump" x1={X[k + 1] - R} y1={Y - 12} x2={x + R + 4} y2={Y - 12} marker-end="url(#lm-walk-arrow)" />
        <text class="prob" x={(x + X[k + 1]) / 2} y={Y - 30}>q</text>
        <path class="jump" d="M{x + R - 4},{Y + 16} Q{(x + X[k + 1]) / 2},{Y + 52} {X[k + 1] - R + 2},{Y + 16}" marker-end="url(#lm-walk-arrow)" />
        <text class="prob" x={(x + X[k + 1]) / 2} y={Y + 52}>p</text>
      {/if}
    {/each}
    <text class="dots" x="40" y={Y}>…</text>
    <text class="dots" x="600" y={Y}>…</text>
  </svg>
</figure>

<style>
  .walk-line { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .state { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  .jump { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .head { fill: var(--anim-muted); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .name, .prob { font-style: italic; }
  .prob { fill: var(--anim-accent); }
  .dots { fill: var(--anim-muted); }
</style>
