<script>
  // Definition 16, as in the drawing of the lecture, an instance with k = 4:
  // X is an interval split into the intervals D₁, D₂, D₃, D₄, and the simple
  // function s takes the value aᵢ on Dᵢ.
  const OX = 60, OY = 220, UY = 150;
  const cuts = [60, 210, 340, 470, 620];
  const values = [0.32, 0.72, 0.3, 0.98];
  const sy = (y) => OY - y * UY;
</script>

<figure class="anim simple">
  <svg viewBox="0 0 680 270" role="img" aria-label="A step function s on an interval X split into four intervals D1 to D4, constant on each of them">
    <line class="axis" x1={OX} y1={OY} x2={cuts[4] + 30} y2={OY} />
    <path class="head" d="M{cuts[4] + 40},{OY} l-11,-5 l0,10 z" />
    <line class="axis" x1={OX} y1={OY + 16} x2={OX} y2={sy(1) - 30} />
    <path class="head" d="M{OX},{sy(1) - 40} l-5,11 l10,0 z" />
    {#each values as a, i}
      <line class="step" x1={cuts[i]} y1={sy(a)} x2={cuts[i + 1]} y2={sy(a)} />
      <text class="lab" x={(cuts[i] + cuts[i + 1]) / 2} y={sy(a) - 18}><tspan class="it">a</tspan><tspan class="sub" dy="5">{i + 1}</tspan></text>
      <text class="name" x={(cuts[i] + cuts[i + 1]) / 2} y={OY + 26}><tspan class="it">D</tspan><tspan class="sub" dy="5">{i + 1}</tspan></text>
    {/each}
    {#each cuts.slice(1, 4) as x}
      <line class="tick" x1={x} y1={OY - 7} x2={x} y2={OY + 7} />
    {/each}
    <text class="name it" x={cuts[4] + 34} y={OY + 26}>X</text>
    <text class="lab accent it" x={cuts[4] + 18} y={sy(values[3])}>s</text>
  </svg>
</figure>

<style>
  .simple { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .step { stroke: var(--anim-accent); stroke-width: 3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-accent); }
  .name { fill: var(--anim-ink); }
  .it { font-style: italic; }
  .sub { font-size: 12px; font-style: normal; }
  .accent { fill: var(--anim-accent); }
</style>
