<script>
  // Remark 3, an instance in R^2 with the Euclidean norm: points
  // x_n = x_0 + (1.4/n)(cos(1.1n + 0.4), sin(1.1n + 0.4)) that converge to x_0 = (3.2, 0.9),
  // the segment from x_n to x_0, and dashed arcs centred at 0 that carry x_n and
  // x_0 to their norms on the half-line [0, +∞). The slider sets n.
  import Slider from '@toolkit/Slider.svelte';

  const O = [50, 300];
  const U = 115;
  const x0 = [3.2, 0.9];
  const NMAX = 30;
  const point = (n) => [x0[0] + (1.4 / n) * Math.cos(1.1 * n + 0.4), x0[1] + (1.4 / n) * Math.sin(1.1 * n + 0.4)];
  const pts = Array.from({ length: NMAX }, (_, i) => point(i + 1));
  const sx = (v) => O[0] + v * U;
  const sy = (v) => O[1] - v * U;
  const norm = (q) => Math.hypot(q[0], q[1]);
  // The arc of the circle centred at 0 from the point q down to the positive axis.
  const arc = (q) => {
    const r = norm(q) * U;
    return `M${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(O[0] + r).toFixed(1)},${O[1]}`;
  };

  let n = $state(1);
  const xn = $derived(pts[n - 1]);
  const away = $derived.by(() => {
    const dx = xn[0] - x0[0], dy = xn[1] - x0[1];
    const len = Math.hypot(dx, dy) || 1;
    return [sx(xn[0]) + (22 * dx) / len, sy(xn[1]) - (22 * dy) / len];
  });
</script>

<figure class="anim continuity">
  <svg viewBox="0 0 600 340" role="img" aria-label="Points x n converging to x 0 in the plane, the segment between x n and x 0, and dashed arcs centred at the origin that carry both points to their norms on the positive horizontal half-line">
    <line class="axis" x1={O[0]} y1={O[1]} x2="585" y2={O[1]} />
    <line class="axis" x1={O[0]} y1={O[1] + 10} x2={O[0]} y2="22" />
    <path class="arc" d={arc(x0)} />
    <path class="arc accent" d={arc(xn)} />
    {#each pts.slice(0, n - 1) as q}
      <circle class="faint" cx={sx(q[0])} cy={sy(q[1])} r="3" />
    {/each}
    <line class="seg" x1={sx(xn[0])} y1={sy(xn[1])} x2={sx(x0[0])} y2={sy(x0[1])} />
    <circle class="dot" cx={sx(x0[0])} cy={sy(x0[1])} r="5" />
    <circle class="dot accent" cx={sx(xn[0])} cy={sy(xn[1])} r="5" />
    <line class="tick" x1={O[0] + norm(x0) * U} y1={O[1] - 7} x2={O[0] + norm(x0) * U} y2={O[1] + 7} />
    <line class="tick accent" x1={O[0] + norm(xn) * U} y1={O[1] - 7} x2={O[0] + norm(xn) * U} y2={O[1] + 7} />
    <text x={O[0] - 14} y={O[1] + 18}>0</text>
    <text class="it" x={sx(x0[0]) - 20} y={sy(x0[1]) + 16}>x<tspan class="sub" dy="5">0</tspan></text>
    <text class="it accent" x={away[0]} y={away[1]}>x<tspan class="sub" dy="5">n</tspan></text>
    <text class="it end" x={O[0] + norm(x0) * U - 8} y={O[1] - 18}><tspan class="up">‖</tspan>x<tspan class="sub" dy="5">0</tspan><tspan class="up" dy="-5">‖</tspan></text>
    <text class="it accent" x={O[0] + norm(xn) * U} y={O[1] + 26}><tspan class="up">‖</tspan>x<tspan class="sub" dy="5">n</tspan><tspan class="up" dy="-5">‖</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .continuity { margin: 1.5rem auto; max-width: 32rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .arc { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
  .arc.accent { stroke: var(--anim-accent); }
  .seg { stroke: var(--anim-accent); stroke-width: 2.4; }
  .tick { stroke: var(--anim-ink); stroke-width: 2; }
  .tick.accent { stroke: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  .faint { fill: var(--anim-muted); fill-opacity: 0.5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .up { font-style: normal; }
  .end { text-anchor: end; }
  .sub { font-size: 13px; font-style: normal; }
  text.accent { fill: var(--anim-accent); }
</style>
