<script>
  // Example 7 (3), the drawing of the lecture with the values f_n(±1) = 5^(−1/n)
  // of (1), for the n and the ε of the sliders: the graph of f_n, zero and thick
  // outside [−1, 1]; the level M = 5^(−1/n) − ε; the set {f_n > M}, the two
  // intervals near −1 and 1, thick on the axis; dotted, the level 1.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';

  const CX = 310, UX = 190, Y0 = 244, UY = 190, L = -1.45, RR = 1.45;
  const sx = (x) => CX + x * UX;
  const sy = (v) => Y0 - v * UY;

  let n = $state(2);
  let eps = $state(0.2);
  const c = $derived(5 ** (-1 / n));
  const fn = $derived((x) => c * x ** (2 * n));
  const M = $derived(c - eps);
  const r = $derived((M / c) ** (1 / (2 * n)));
</script>

<figure class="anim levelset">
  <svg viewBox="0 0 690 300" role="img" aria-label="The graph of f n, a U-shaped curve on the interval from minus 1 to 1 with end values 5 to the minus 1 over n, zero outside; a horizontal level M equal to that value minus epsilon, and the two intervals near minus 1 and near 1 where f n exceeds M, thick on the axis">
    <line class="one" x1={sx(-1.2)} y1={sy(1)} x2={sx(1.2)} y2={sy(1)} />
    <line class="axis" x1={sx(L)} y1={Y0} x2={sx(RR)} y2={Y0} />
    <line class="axis" x1={CX} y1={Y0 + 30} x2={CX} y2={sy(1.12)} />
    <path class="head" d="M{CX - 5},{sy(1.12) + 9} L{CX},{sy(1.12)} L{CX + 5},{sy(1.12) + 9}" />
    <line class="outside" x1={sx(L)} y1={Y0} x2={sx(-1)} y2={Y0} />
    <line class="outside" x1={sx(1)} y1={Y0} x2={sx(RR)} y2={Y0} />
    <line class="level" x1={sx(L)} y1={sy(M)} x2={sx(1.15)} y2={sy(M)} />
    {#each [-1, 1] as e}
      <line class="dotted" x1={sx(e)} y1={Y0} x2={sx(e)} y2={sy(c)} />
      <line class="dotted accent" x1={sx(e * r)} y1={Y0} x2={sx(e * r)} y2={sy(M)} />
      <line class="set" x1={sx(e * r)} y1={Y0} x2={sx(e)} y2={Y0} />
      <circle class="dot" cx={sx(e)} cy={sy(c)} r="4.5" />
      <text x={sx(e) + e * 6} y={sy(c) - 22}>5<tspan class="sup" dy="-7">−1/<tspan class="it">n</tspan></tspan></text>
      <text class="num" x={sx(e)} y={Y0 + 22}>{e < 0 ? '−1' : '1'}</text>
    {/each}
    <polyline class="f" points={graph(fn, -1, 1, sx, sy, 600)} />
    <text class="num" x={sx(-1.2) - 14} y={sy(1)}>1</text>
    <text class="lab left" x={sx(1.15) + 8} y={sy(M)}><tspan class="it">M</tspan> = 5<tspan class="sup" dy="-7">−1/<tspan class="it">n</tspan></tspan><tspan dy="7"> − </tspan><tspan class="it">ε</tspan></text>
    <text class="it" x={sx(0.5)} y={sy(fn(0.5)) - 22}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={2} max={30} step={1} bind:value={n} />
      <Slider label="ε" min={0.02} max={0.4} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .levelset { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .outside { stroke: var(--anim-ink); stroke-width: 4; }
  .one { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 2 4; }
  .level { stroke: var(--anim-accent); stroke-width: 2; }
  .dotted { stroke: var(--anim-ink); stroke-width: 1.1; stroke-dasharray: 3 4; }
  .dotted.accent { stroke: var(--anim-accent); }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub, .sup { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
