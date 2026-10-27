<script>
  // Remark 13, the drawing of the lecture, for the n and the ε of the sliders:
  // g_n(x) = (x/2)^n on [0, 2], solid, and on the left of 0, dashed; three
  // levels M at or above 1; the level M = 1 − ε; the part of the graph above it,
  // thick; dotted lines down to the axis, where the set {|g_n| > 1 − ε} near 2,
  // the interval (2(1 − ε)^(1/n), 2], is hatched.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const L = 40, UX = 150, OY = 232, UY = 128, A = -0.75, B = 2.2;
  const sx = (x) => L + (x - A) * UX;
  const sy = (v) => OY - v * UY;
  const RIGHT = sx(B);
  const levels = [1, 1.2, 1.4];

  let n = $state(3);
  let eps = $state(0.3);
  const gn = $derived((x) => (x / 2) ** n);
  const cut = $derived(2 * (1 - eps) ** (1 / n));
</script>

<figure class="anim esssup">
  <svg viewBox="0 0 690 300" role="img" aria-label="The graph of g n from 0 to 2, rising to 1 at 2, dashed on the left of 0, with three horizontal levels M at or above 1, the level 1 minus epsilon, and the set where the absolute value of g n exceeds 1 minus epsilon, an interval ending at 2, hatched on the axis">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
    </defs>
    {#each levels as m}
      <line class="level" x1={sx(A)} y1={sy(m)} x2={RIGHT} y2={sy(m)} />
      <text class="lab left it" x={RIGHT + 10} y={sy(m)}>M</text>
    {/each}
    <line class="cutlevel" x1={sx(A)} y1={sy(1 - eps)} x2={RIGHT} y2={sy(1 - eps)} />
    <text class="lab left" x={RIGHT + 10} y={sy(1 - eps)}><tspan class="it">M</tspan> = 1 − <tspan class="it">ε</tspan></text>
    <line class="axis" x1={sx(A)} y1={OY} x2={RIGHT + 6} y2={OY} />
    <line class="dotted" x1={sx(cut)} y1={OY} x2={sx(cut)} y2={sy(1 - eps)} />
    <line class="dotted" x1={sx(2)} y1={OY} x2={sx(2)} y2={sy(1)} />
    <rect x={sx(cut)} y={OY - 9} width={sx(2) - sx(cut)} height="9" fill="url(#{uid}-h)" />
    <line class="set" x1={sx(cut)} y1={OY} x2={sx(2)} y2={OY} />
    <polyline class="left-part" points={graph(gn, A, 0, sx, sy, 150)} />
    <polyline class="g" points={graph(gn, 0, 2, sx, sy, 300)} />
    <polyline class="above" points={graph(gn, cut, 2, sx, sy, 80)} />
    <circle class="dot" cx={sx(2)} cy={sy(1)} r="4.5" />

    <text class="num" x={sx(0)} y={OY + 20}>0</text>
    <text class="num" x={sx(2)} y={OY + 20}>2</text>
    <text class="num" x={sx(2) - 16} y={sy(1) - 16}>1</text>
    <text class="lab it" x={sx(0.9)} y={sy(gn(0.9)) - 20}>g<tspan class="sub" dy="5">n</tspan></text>
    <line class="pointer" x1={RIGHT + 8} y1={OY + 30} x2={sx(2) - Math.min(6, (sx(2) - sx(cut)) / 2)} y2={OY + 4} />
    <text class="left" x={RIGHT + 12} y={OY + 44}>{'{'}|<tspan class="it">g</tspan><tspan class="sub it" dy="5">n</tspan><tspan dy="-5">| &gt; 1 −{'\u00a0'}</tspan><tspan class="it">ε</tspan>{'}'}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={30} step={1} bind:value={n} />
      <Slider label="ε" min={0.02} max={0.9} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .esssup { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; }
  .cutlevel { stroke: var(--anim-ink); stroke-width: 1.6; stroke-dasharray: 7 5; }
  .dotted { stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 2 4; stroke-linecap: round; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 3.5; }
  .left-part { fill: none; stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 7 5; }
  .g { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  .above { fill: none; stroke: var(--anim-accent); stroke-width: 6; stroke-linecap: round; }
  .dot { fill: var(--anim-accent); }
  .pointer { stroke: var(--anim-muted); stroke-width: 1.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
