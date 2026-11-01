<script>
  // Example 3 (ii): the real line with the point 0 and the set E = [1, 2],
  // which does not contain 0, so δ₀(E) = 0, while λ(E) = 1, its length.
  const LO = -1.5, HI = 3.5, X0 = 50, X1 = 610, Y = 128;
  const px = (v) => X0 + ((v - LO) / (HI - LO)) * (X1 - X0);
  const ticks = [-1, 0, 1, 2, 3];
  const E = [1, 2];
  const cx = (px(E[0]) + px(E[1])) / 2;
</script>

<figure class="anim atom">
  <svg viewBox="0 0 660 178" role="img" aria-label="The real line with the point 0 marked and the closed interval from 1 to 2, labelled E, with the values delta zero of E equal to 0 and lambda of E equal to 1">
    <line class="axis" x1={X0 - 10} y1={Y} x2={X1 + 12} y2={Y} />
    <path class="head" d="M{X1 + 22},{Y} l-11,-5 l0,10 z" />
    {#each ticks as t}
      <line class="tick" x1={px(t)} y1={Y - 6} x2={px(t)} y2={Y + 6} />
      <text class="num" x={px(t)} y={Y + 26}>{t < 0 ? `−${-t}` : t}</text>
    {/each}
    <line class="set" x1={px(E[0])} y1={Y} x2={px(E[1])} y2={Y} />
    <!-- Closed ends drawn as brackets: the endpoints belong to E. -->
    <path class="bracket" d="M{px(E[0]) + 7},{Y - 14} L{px(E[0])},{Y - 14} L{px(E[0])},{Y + 14} L{px(E[0]) + 7},{Y + 14}" />
    <path class="bracket" d="M{px(E[1]) - 7},{Y - 14} L{px(E[1])},{Y - 14} L{px(E[1])},{Y + 14} L{px(E[1]) - 7},{Y + 14}" />
    <circle class="dot" cx={px(0)} cy={Y} r="6.5" />

    <text class="it accent" x={cx} y={Y - 30}>E</text>
    <text x={cx} y={Y - 92}>δ<tspan class="sub" dy="5">0</tspan><tspan dy="-5">(</tspan><tspan class="it">E</tspan>) = 0</text>
    <text x={cx} y={Y - 62}><tspan class="it">λ</tspan>(<tspan class="it">E</tspan>) = 1</text>
    <text class="num" x={X1 + 18} y={Y + 26}>ℝ</text>
  </svg>
</figure>

<style>
  .atom { margin: 1.5rem auto; max-width: 35rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .bracket { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
