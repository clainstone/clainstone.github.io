<script>
  // The drawing of the second solution of Example 18.7: the function
  // χ_(a − x_0, b − x_0), solid, and the function χ_(a − x_m, b − x_m), dashed,
  // for an m with x_m close to x_0, so that the second interval is the first
  // one moved a little to the left. An instance.
  import { head } from './plot.js';

  const Y = 160, H = 84;
  const A0 = 270, B0 = 480; // a − x_0 and b − x_0
  const D = 26; // the drawn shift x_m − x_0
  const box = (a, b) => `${a},${Y} ${a},${Y - H} ${b},${Y - H} ${b},${Y}`;
</script>

<figure class="anim shift">
  <svg viewBox="0 0 680 252" role="img" aria-label="Two indicator functions of height one on the real line: a solid one over the interval from a minus x 0 to b minus x 0, and a dashed one over the same interval moved a little to the left, the interval from a minus x m to b minus x m">
    <line class="axis" x1={70} y1={Y} x2={620} y2={Y} />
    <polygon class="head" points={head(630, Y, 1, 0)} />
    <polyline class="one" points={box(A0, B0)} />
    <polyline class="two" points={box(A0 - D, B0 - D)} />
    {#each [A0, B0] as x}
      <line class="tick" x1={x} y1={Y - 7} x2={x} y2={Y + 7} />
    {/each}
    <text x={A0 + 6} y={Y + 26}><tspan class="it">a</tspan> − <tspan class="it">x</tspan><tspan class="sub" dy="5">0</tspan></text>
    <text x={B0 + 6} y={Y + 26}><tspan class="it">b</tspan> − <tspan class="it">x</tspan><tspan class="sub" dy="5">0</tspan></text>
    <text class="lab" x={(A0 + B0) / 2} y={Y - H - 26}><tspan class="it">χ</tspan><tspan class="sub" dy="7">(<tspan class="it">a</tspan> − <tspan class="it">x</tspan></tspan><tspan class="sub2" dy="4">0</tspan><tspan class="sub" dy="-4">, <tspan class="it">b</tspan> − <tspan class="it">x</tspan></tspan><tspan class="sub2" dy="4">0</tspan><tspan class="sub" dy="-4">)</tspan></text>
    <line class="lead" x1={170} y1={Y + 52} x2={A0 - D - 8} y2={Y - 34} />
    <polygon class="head" points={head(A0 - D - 5, Y - 38, A0 - D - 178, -86)} />
    <text x={150} y={Y + 72}><tspan class="it">χ</tspan><tspan class="sub" dy="7">(<tspan class="it">a</tspan> − <tspan class="it">x</tspan></tspan><tspan class="sub2 it" dy="4">m</tspan><tspan class="sub" dy="-4">, <tspan class="it">b</tspan> − <tspan class="it">x</tspan></tspan><tspan class="sub2 it" dy="4">m</tspan><tspan class="sub" dy="-4">)</tspan></text>
  </svg>
</figure>

<style>
  .shift { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .one { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .two { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 7 5; stroke-linejoin: round; }
  .lead { stroke: var(--anim-ink); stroke-width: 1.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .sub { font-size: 13px; }
  .sub2 { font-size: 10px; }
</style>
