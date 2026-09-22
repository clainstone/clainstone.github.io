<script>
  // The open sets that generate the topology of the extended real line in the
  // example: intervals (a, b), and the rays [-∞, a) and (a, +∞] that contain
  // an infinite endpoint. A filled dot belongs to the set, an empty one does not.
  const X0 = 40, X1 = 580;
  const A = 250, B = 400;
  const rows = [
    { y: 50, from: X0, to: A, inFrom: true, inTo: false, label: '[−∞, a)' },
    { y: 100, from: A, to: B, inFrom: false, inTo: false, label: '(a, b)' },
    { y: 150, from: A, to: X1, inFrom: false, inTo: true, label: '(a, +∞]' },
  ];
</script>

<figure class="anim ext-line">
  <svg viewBox="0 0 620 240" role="img" aria-label="The extended real line from minus infinity to plus infinity, with the open sets [−∞, a), (a, b) and (a, +∞] drawn above it">
    {#each rows as r}
      <line class="set" x1={r.from} y1={r.y} x2={r.to} y2={r.y} />
      <circle class="end" class:in={r.inFrom} cx={r.from} cy={r.y} r="5" />
      <circle class="end" class:in={r.inTo} cx={r.to} cy={r.y} r="5" />
      <text class="lab" x={(r.from + r.to) / 2} y={r.y - 12}>{r.label}</text>
    {/each}
    <line class="axis" x1={X0} y1="200" x2={X1} y2="200" />
    <circle class="end in axis-end" cx={X0} cy="200" r="4" />
    <circle class="end in axis-end" cx={X1} cy="200" r="4" />
    <line class="tick" x1={A} y1="194" x2={A} y2="206" />
    <line class="tick" x1={B} y1="194" x2={B} y2="206" />
    <text class="name" x={X0} y="230">−∞</text>
    <text class="name" x={A} y="230">a</text>
    <text class="name" x={B} y="230">b</text>
    <text class="name" x={X1} y="230">+∞</text>
  </svg>
</figure>

<style>
  .ext-line { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .set { stroke: var(--anim-accent); stroke-width: 3; }
  .axis { stroke: var(--anim-ink); stroke-width: 1.4; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.4; }
  .end { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  .end.in { fill: var(--anim-accent); }
  .axis-end { stroke: var(--anim-ink); fill: var(--anim-ink) !important; }
  .lab { fill: var(--anim-accent); font-size: 18px; text-anchor: middle; }
  .name { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; }
</style>
