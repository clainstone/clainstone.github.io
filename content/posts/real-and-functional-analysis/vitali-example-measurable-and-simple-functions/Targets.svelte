<script>
  // The convention that follows Proposition 3: the five sets that Y can be,
  // from top to bottom R, the extended real line, [0, +∞), [0, +∞] and
  // (−∞, +∞], drawn on the extended real line. A filled end belongs to the
  // set, an empty one does not.
  const X0 = 60, X1 = 620, ZERO = 340;
  const rows = [
    { from: X0, to: X1, inFrom: false, inTo: false },
    { from: X0, to: X1, inFrom: true, inTo: true },
    { from: ZERO, to: X1, inFrom: true, inTo: false },
    { from: ZERO, to: X1, inFrom: true, inTo: true },
    { from: X0, to: X1, inFrom: false, inTo: true },
  ];
  const y = (i) => 30 + i * 40;
  const AXIS = 238;
</script>

<figure class="anim targets">
  <svg viewBox="0 0 680 280" role="img" aria-label="Five sets drawn on the extended real line, from top to bottom: the real line, the extended real line, [0, +∞), [0, +∞] and (−∞, +∞]">
    {#each rows as r, i}
      <line class="set" x1={r.from} y1={y(i)} x2={r.to} y2={y(i)} />
      <circle class="end" class:in={r.inFrom} cx={r.from} cy={y(i)} r="5" />
      <circle class="end" class:in={r.inTo} cx={r.to} cy={y(i)} r="5" />
    {/each}
    <line class="axis" x1={X0} y1={AXIS} x2={X1} y2={AXIS} />
    <circle class="end in axis-end" cx={X0} cy={AXIS} r="4" />
    <circle class="end in axis-end" cx={X1} cy={AXIS} r="4" />
    <line class="tick" x1={ZERO} y1={AXIS - 6} x2={ZERO} y2={AXIS + 6} />
    <text class="name" x={X0} y={AXIS + 26}>−∞</text>
    <text class="name" x={ZERO} y={AXIS + 26}>0</text>
    <text class="name" x={X1} y={AXIS + 26}>+∞</text>
  </svg>
</figure>

<style>
  .targets { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .set { stroke: var(--anim-accent); stroke-width: 3; }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.4; }
  .end { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  .end.in { fill: var(--anim-accent); }
  .axis-end { stroke: var(--anim-ink); fill: var(--anim-ink) !important; }
  .name { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
</style>
