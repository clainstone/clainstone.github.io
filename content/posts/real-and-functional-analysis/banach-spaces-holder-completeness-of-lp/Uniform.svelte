<script>
  // Example 5 (iii) and its idea, an instance on [a, b] (drawn as [0, 1]): a
  // continuous function u, dashed, the continuous function
  // u_n = u + (0.3/n) cos(2π(1.6 + 0.12 n)x + 0.9 n)(0.6 + 0.4 sin(3x + n))
  // for the n of the slider, and a vertical segment where |u_n − u| is
  // largest, of length ‖u_n − u‖_∞ = max |u_n − u|.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, maximum } from './plot.js';

  const OX = 60, UX = 540, OY = 236, UY = 180;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const u = (t) => 0.62 + 0.22 * Math.sin(2 * Math.PI * 0.85 * t + 0.4);
  const bump = (n, t) => (0.3 / n) * Math.cos(2 * Math.PI * (1.6 + 0.12 * n) * t + 0.9 * n) * (0.6 + 0.4 * Math.sin(3 * t + n));
  const uLine = graph(u, 0, 1, sx, sy, 300);

  let n = $state(1);
  const un = $derived((t) => u(t) + bump(n, t));
  const unLine = $derived(graph(un, 0, 1, sx, sy, 300));
  const worst = $derived(maximum((t) => Math.abs(bump(n, t)), 0, 1, 1200));
  // The labels at the right end, pushed apart when the two graphs end close together.
  const ends = $derived.by(() => {
    const a = sy(u(1)), b = sy(un(1));
    if (Math.abs(a - b) >= 22) return [a, b];
    const m = (a + b) / 2;
    return b < a ? [m + 11, m - 11] : [m - 11, m + 11];
  });
</script>

<figure class="anim uniform">
  <svg viewBox="0 0 690 280" role="img" aria-label="A continuous function u, dashed, a continuous function u n close to it, and a vertical segment where the distance between their graphs is largest">
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 5} x2={sx(0)} y2={OY + 5} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="it num" x={sx(0)} y={OY + 22}>a</text>
    <text class="it num" x={sx(1)} y={OY + 22}>b</text>
    <polyline class="u" points={uLine} />
    <polyline class="un" points={unLine} />
    <line class="gap" x1={sx(worst.at)} y1={sy(u(worst.at))} x2={sx(worst.at)} y2={sy(un(worst.at))} />
    <text class="lab" x={sx(worst.at)} y={Math.min(sy(u(worst.at)), sy(un(worst.at))) - 18}><tspan class="up">‖</tspan>u<tspan class="sub" dy="5">n</tspan><tspan dy="-5"> − u</tspan><tspan class="up">‖</tspan><tspan class="sub up" dy="5">∞</tspan></text>
    <text class="it" x={sx(1) + 30} y={ends[0]}>u</text>
    <text class="it" x={sx(1) + 34} y={ends[1]}>u<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={30} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .uniform { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .u { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .un { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .gap { stroke: var(--anim-accent); stroke-width: 3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .up { font-style: normal; }
  .num { fill: var(--anim-muted); }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .sub { font-size: 13px; font-style: normal; }
</style>
