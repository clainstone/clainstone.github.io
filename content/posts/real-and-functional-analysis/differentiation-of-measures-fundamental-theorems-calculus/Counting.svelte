<script>
  // Remark 5, an instance of the passage to a subset: on [0, 1], a set E, here
  // an interval, with counting measure +∞ and positive Lebesgue measure, and
  // a finite subset of E, here 4 points, with counting measure 4 and Lebesgue
  // measure 0.
  const OX = 40, UX = 400;
  const sx = (t) => OX + t * UX;
  const ROW1 = 62, ROW2 = 146, TX = 476;
  const E = [0.22, 0.7];
  const points = [0.3, 0.41, 0.53, 0.63];
</script>

<figure class="anim counting">
  <svg viewBox="0 0 690 196" role="img" aria-label="Above, a set E of the unit interval drawn as a thick segment, with counting measure infinity and positive Lebesgue measure; below, the unit interval with four points of E, whose counting measure is 4 and whose Lebesgue measure is 0">
    <!-- Row 1: the set E. -->
    <line class="faint" x1={sx(0)} y1={ROW1} x2={sx(1)} y2={ROW1} />
    <line class="set" x1={sx(E[0])} y1={ROW1} x2={sx(E[1])} y2={ROW1} />
    <text class="it accent" x={sx(E[0]) - 20} y={ROW1}>E</text>
    <text class="left" x={TX} y={ROW1}><tspan class="it">μ</tspan>(<tspan class="it">E</tspan>) = +∞,&#8195;<tspan class="it">λ</tspan>(<tspan class="it">E</tspan>) &gt; 0</text>

    <!-- Guides from E down to the line of the subset. -->
    <line class="guide" x1={sx(E[0])} y1={ROW1 + 8} x2={sx(E[0])} y2={ROW2 - 8} />
    <line class="guide" x1={sx(E[1])} y1={ROW1 + 8} x2={sx(E[1])} y2={ROW2 - 8} />

    <!-- Row 2: [0, 1] and a finite subset of E. -->
    <line class="axis" x1={sx(0)} y1={ROW2} x2={sx(1)} y2={ROW2} />
    <line class="tick" x1={sx(0)} y1={ROW2 - 6} x2={sx(0)} y2={ROW2 + 6} />
    <line class="tick" x1={sx(1)} y1={ROW2 - 6} x2={sx(1)} y2={ROW2 + 6} />
    <text class="num" x={sx(0)} y={ROW2 + 26}>0</text>
    <text class="num" x={sx(1)} y={ROW2 + 26}>1</text>
    {#each points as t}
      <circle class="dot" cx={sx(t)} cy={ROW2} r="6" />
    {/each}
    <text class="left" x={TX} y={ROW2}>4 points of <tspan class="it">E</tspan>: <tspan class="it">μ</tspan> = 4,&#8195;<tspan class="it">λ</tspan> = 0</text>
  </svg>
</figure>

<style>
  .counting { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .faint { stroke: var(--anim-rule); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 7; stroke-opacity: 0.55; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 3; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
