<script>
  // Proof of Theorem 20, second part, an instance on [a, b]: the dashed graph
  // of F, the graph of F − C at vertical distance C below it, and a
  // representative f of the class, equal to F − C except at three points,
  // where its values are the filled dots; the empty circles are the values of
  // F − C there. So f = F − C almost everywhere.
  const OX = 60, UX = 560, OY = 252, UY = 230;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const F = (t) => 0.5 + 0.22 * Math.sin(2 * Math.PI * (t - 0.15)) + 0.28 * t;
  const C = 0.3;
  const G = (t) => F(t) - C;
  const odd = [[0.22, 0.2], [0.5, -0.14], [0.79, 0.16]];
  const line = (fn) => Array.from({ length: 301 }, (_, j) => `${sx(j / 300).toFixed(1)},${sy(fn(j / 300)).toFixed(1)}`).join(' ');
  const T = 0.93;
</script>

<figure class="anim representative">
  <svg viewBox="0 0 690 290" role="img" aria-label="On an interval from a to b, the dashed graph of F, the graph of F minus C below it at vertical distance C, and a function f equal to F minus C except at three points, where its values are drawn as filled dots away from the graph">
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1)} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 6} x2={sx(0)} y2={OY + 6} />
    <line class="tick" x1={sx(1)} y1={OY - 6} x2={sx(1)} y2={OY + 6} />
    <text class="it muted" x={sx(0)} y={OY + 22}>a</text>
    <text class="it muted" x={sx(1)} y={OY + 22}>b</text>

    <polyline class="dashed" points={line(F)} />
    <polyline class="curve" points={line(G)} />
    <line class="gap" x1={sx(T)} y1={sy(F(T)) + 4} x2={sx(T)} y2={sy(G(T)) - 4} />
    <path class="head" d="M{sx(T)},{sy(F(T)) + 2} l-4,9 l8,0 z" />
    <path class="head" d="M{sx(T)},{sy(G(T)) - 2} l-4,-9 l8,0 z" />
    <text class="it" x={sx(T) + 18} y={(sy(F(T)) + sy(G(T))) / 2}>C</text>

    {#each odd as [t, dv]}
      <circle class="hole" cx={sx(t)} cy={sy(G(t))} r="4.5" />
      <circle class="dot" cx={sx(t)} cy={sy(G(t) + dv)} r="4.5" />
    {/each}
    <text class="it muted" x={sx(0.06)} y={sy(F(0.06)) - 20}>F</text>
    <text class="accent" x={sx(0.36)} y={sy(G(0.36)) + 24}><tspan class="it">F</tspan> − <tspan class="it">C</tspan></text>
    <text class="it accent" x={sx(odd[0][0]) + 18} y={sy(G(odd[0][0]) + odd[0][1])}>f</text>
  </svg>
</figure>

<style>
  .representative { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .dashed { fill: none; stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  .gap { stroke: var(--anim-ink); stroke-width: 1.4; }
  .head { fill: var(--anim-ink); }
  .hole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
