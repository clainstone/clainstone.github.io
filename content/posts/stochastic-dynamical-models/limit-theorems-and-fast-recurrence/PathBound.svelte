<script>
  // The inequality p⁽ᵃ⁺ⁿ⁺ᵇ⁾_jj ≥ p⁽ᵃ⁾_ji p⁽ⁿ⁾_ii p⁽ᵇ⁾_ij: the paths from j back
  // to j in a + n + b steps that are in i at the times a and a + n. Drawn
  // schematically: the levels of the states j and i against time.
  const T = [70, 220, 430, 570];
  const YJ = 62, YI = 160, AX = 262;
  const seg = [
    [[70, YJ], [95, 88], [118, 74], [142, 112], [166, 98], [192, 140], [220, YI]],
    [[220, YI], [248, 196], [276, 132], [304, 188], [334, 126], [364, 200], [398, 140], [430, YI]],
    [[430, YI], [454, 128], [478, 142], [502, 100], [526, 114], [550, 80], [570, YJ]],
  ];
  const pts = (s) => s.map((q) => q.join(',')).join(' ');
</script>

<figure class="anim path-bound">
  <svg viewBox="0 0 640 300" role="img" aria-label="A path from state j to state i in a steps, from i back to i in n steps, and from i to j in b steps, drawn against time">
    <line class="level" x1={T[0]} y1={YJ} x2={T[3] + 20} y2={YJ} />
    <line class="level" x1={T[0]} y1={YI} x2={T[3] + 20} y2={YI} />
    <text class="state" x={T[0] - 28} y={YJ}>j</text>
    <text class="state" x={T[0] - 28} y={YI}>i</text>
    {#each seg as s, k}
      <polyline class="path" class:mid={k === 1} points={pts(s)} />
    {/each}
    {#each [[T[0], YJ], [T[1], YI], [T[2], YI], [T[3], YJ]] as [x, y]}
      <circle class="dot" cx={x} cy={y} r="5" />
    {/each}
    <text class="lab" x="140" y="150">p<tspan dy="5" font-size="12">ji</tspan><tspan dy="-12" font-size="12">(a)</tspan></text>
    <text class="lab mid" x="325" y="226">p<tspan dy="5" font-size="12">ii</tspan><tspan dy="-12" font-size="12">(n)</tspan></text>
    <text class="lab" x="515" y="150">p<tspan dy="5" font-size="12">ij</tspan><tspan dy="-12" font-size="12">(b)</tspan></text>
    <line class="axis" x1={T[0]} y1={AX} x2={T[3] + 30} y2={AX} />
    {#each T as x}
      <line class="tick" x1={x} y1={AX} x2={x} y2={AX + 6} />
    {/each}
    <text class="num up" x={T[0]} y={AX + 22}>0</text>
    <text class="num" x={T[1]} y={AX + 22}>a</text>
    <text class="num" x={T[2]} y={AX + 22}>a<tspan font-style="normal">&nbsp;+&nbsp;</tspan>n</text>
    <text class="num" x={T[3]} y={AX + 22}>a<tspan font-style="normal">&nbsp;+&nbsp;</tspan>n<tspan font-style="normal">&nbsp;+&nbsp;</tspan>b</text>
  </svg>
</figure>

<style>
  .path-bound { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .level { stroke: var(--anim-rule); stroke-width: 1.2; stroke-dasharray: 4 4; }
  .path { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; stroke-linejoin: round; }
  .path.mid { stroke: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .state, .num, .lab { font-style: italic; }
  .state { font-size: 18px; }
  .num { fill: var(--anim-muted); }
  .num.up { font-style: normal; }
  .lab.mid { fill: var(--anim-accent); }
</style>
