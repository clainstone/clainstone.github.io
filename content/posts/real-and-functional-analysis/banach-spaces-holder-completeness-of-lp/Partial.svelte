<script>
  // Theorem 17, an instance on [0, 1] with μ = λ: f_n = 0.62^n sin((n + 1)πx
  // + 0.7n), so that Σ ‖f_n‖_p < +∞. For the N of the slider, the partial sum
  // S_N = f_0 + … + f_N and g_N = |f_0| + … + |f_N|; dashed, the limit g of
  // (g_N), computed with 60 terms, and −g; the band between −g and g, where
  // S_N lies, is shaded.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between } from './plot.js';

  const OX = 60, UX = 560, OY = 150, UY = 50;
  const f = (n, x) => 0.62 ** n * Math.sin((n + 1) * Math.PI * x + 0.7 * n);
  const partial = (N, x) => { let s = 0; for (let n = 0; n <= N; n++) s += f(n, x); return s; };
  const absPartial = (N, x) => { let s = 0; for (let n = 0; n <= N; n++) s += Math.abs(f(n, x)); return s; };
  const g = (x) => absPartial(60, x);
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const band = between(g, (x) => -g(x), 0, 1, sx, sy, 500);
  const gLine = graph(g, 0, 1, sx, sy, 500);
  const minusG = graph((x) => -g(x), 0, 1, sx, sy, 500);

  let N = $state(2);
  const sLine = $derived(graph((x) => partial(N, x), 0, 1, sx, sy, 500));
  const gNLine = $derived(graph((x) => absPartial(N, x), 0, 1, sx, sy, 500));
</script>

<figure class="anim partial">
  <svg viewBox="0 0 690 340" role="img" aria-label="On the unit interval, a dashed function g and its opposite with the band between them shaded, the partial sum S N inside the band and the function g N increasing towards g">
    <path class="band" d={band} />
    <polyline class="g" points={gLine} />
    <polyline class="g" points={minusG} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <polyline class="gn" points={gNLine} />
    <polyline class="sn" points={sLine} />
    <line class="tick" x1={sx(0)} y1={OY - 5} x2={sx(0)} y2={OY + 5} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="num" x={sx(0) - 14} y={OY + 16}>0</text>
    <text class="num" x={sx(1) + 14} y={OY + 16}>1</text>
    <line class="gn" x1="70" y1="306" x2="104" y2="306" />
    <text class="start it" x="114" y="306">g<tspan class="sub" dy="5">N</tspan></text>
    <line class="sn" x1="220" y1="306" x2="254" y2="306" />
    <text class="start it" x="264" y="306">S<tspan class="sub" dy="5">N</tspan></text>
    <line class="g" x1="370" y1="306" x2="404" y2="306" />
    <text class="start" x="414" y="306"><tspan class="it">g</tspan> and −<tspan class="it">g</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={0} max={15} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .partial { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .band { fill: var(--anim-accent); fill-opacity: 0.08; }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .gn { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  .sn { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .start { text-anchor: start; }
  .sub { font-size: 13px; font-style: normal; }
</style>
