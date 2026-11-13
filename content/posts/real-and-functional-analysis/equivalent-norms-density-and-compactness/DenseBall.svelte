<script>
  // The drawing of Definition 12.8: the ball B_r(x_0), its edge dashed because it
  // does not belong to the ball, its centre x_0, a radius of length r, and a
  // point x of D in the ball.
  const C = [380, 128], R = 104;
  const X = [C[0] - 40, C[1] + 52];
</script>

<figure class="anim denseball">
  <svg viewBox="0 0 760 256" role="img" aria-label="A ball of centre x zero and radius r with a dashed edge, and a point x of the set D inside it">
    <circle class="ball" cx={C[0]} cy={C[1]} r={R} />
    <line class="radius" x1={C[0]} y1={C[1]} x2={C[0] + R * Math.cos(-0.5)} y2={C[1] + R * Math.sin(-0.5)} />
    <text class="it" x={C[0] + 0.58 * R} y={C[1] - 0.36 * R - 14}>r</text>
    <circle class="centre" cx={C[0]} cy={C[1]} r="4.5" />
    <text class="it" x={C[0] + 4} y={C[1] + 20}>x<tspan class="sub" dy="5">0</tspan></text>
    <circle class="point" cx={X[0]} cy={X[1]} r="5" />
    <text class="start" x={X[0] + 12} y={X[1] + 2}><tspan class="it">x</tspan> ∈ <tspan class="it">D</tspan></text>
    <text class="start" x={C[0] + R + 18} y={C[1] - 0.72 * R}><tspan class="it">B</tspan><tspan class="sub it" dy="5">r</tspan><tspan dy="-5">(</tspan><tspan class="it">x</tspan><tspan class="sub" dy="5">0</tspan><tspan dy="-5">)</tspan></text>
  </svg>
</figure>

<style>
  .denseball { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .ball { fill: var(--anim-accent); fill-opacity: 0.1; stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 8 6; }
  .radius { stroke: var(--anim-ink); stroke-width: 1.4; }
  .centre { fill: var(--anim-ink); }
  .point { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .start { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: normal; }
  .sub.it { font-style: italic; }
</style>
