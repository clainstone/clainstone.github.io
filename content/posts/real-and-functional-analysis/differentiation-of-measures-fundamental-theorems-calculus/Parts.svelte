<script>
  // Corollary 17, an instance on (a, b) = (0, 1): on the left a function f of
  // AC([a, b]) (smooth here) and its derivative f′, dashed; on the right a
  // function φ of C_c^∞(a, b), the bump exp(1 − 1/(1 − u²)) with u = (t − 1/2)/0.3,
  // which vanishes near a and b. Below, the two integrals of the corollary,
  // computed by the midpoint rule.
  import { graph, fmt } from './plot.js';

  const f = (t) => 0.3 + 0.4 * t + 0.15 * Math.sin(2 * Math.PI * t);
  const df = (t) => 0.4 + 0.3 * Math.PI * Math.cos(2 * Math.PI * t);
  const phi = (t) => {
    const u = (t - 0.5) / 0.3;
    return Math.abs(u) >= 1 ? 0 : Math.exp(1 - 1 / (1 - u * u));
  };
  const dphi = (t) => {
    const u = (t - 0.5) / 0.3;
    return Math.abs(u) >= 1 ? 0 : (phi(t) * (-2 * u)) / (1 - u * u) ** 2 / 0.3;
  };
  const N = 4000;
  let I1 = 0, I2 = 0;
  for (let j = 0; j < N; j++) {
    const t = (j + 0.5) / N;
    I1 += (f(t) * dphi(t)) / N;
    I2 -= (df(t) * phi(t)) / N;
  }
  const W = 290, BASE = 150, UY = 70;
  const panels = [0, 345].map((x0) => ({ x0, sx: (t) => x0 + 20 + t * (W - 40), sy: (v) => BASE - v * UY }));
  const [L, R] = panels;
</script>

<figure class="anim parts">
  <svg viewBox="0 0 690 270" role="img" aria-label="On the left, a function f on an interval from a to b and its derivative, dashed; on the right, a smooth bump function that vanishes near a and b; below, the two integrals of the integration by parts formula, which are equal">
    {#each panels as p}
      <line class="axis" x1={p.sx(0)} y1={BASE} x2={p.sx(1)} y2={BASE} />
      <line class="tick" x1={p.sx(0)} y1={BASE - 6} x2={p.sx(0)} y2={BASE + 6} />
      <line class="tick" x1={p.sx(1)} y1={BASE - 6} x2={p.sx(1)} y2={BASE + 6} />
      <text class="it muted" x={p.sx(0)} y={BASE + 22}>a</text>
      <text class="it muted" x={p.sx(1)} y={BASE + 22}>b</text>
    {/each}
    <polyline class="dashed" points={graph(df, 0, 1, L.sx, L.sy, 200)} />
    <polyline class="curve" points={graph(f, 0, 1, L.sx, L.sy, 200)} />
    <text class="it" x={L.sx(1) + 2} y={L.sy(f(1)) - 18}>f</text>
    <text class="muted" x={L.sx(0.5) + 26} y={L.sy(df(0.5)) + 8}><tspan class="it">f</tspan>′</text>

    <polyline class="curve accentline" points={graph(phi, 0, 1, R.sx, R.sy, 400)} />
    <text class="it accent" x={R.sx(0.5)} y={R.sy(1) - 18}>φ</text>

    <text x="345" y="232"><tspan>∫ </tspan><tspan class="it">f</tspan><tspan> </tspan><tspan class="it">φ</tspan>′ d<tspan class="it">λ</tspan> = {fmt(I1, 4)}&#8195;and&#8195;−∫ <tspan class="it">f</tspan>′ <tspan class="it">φ</tspan> d<tspan class="it">λ</tspan> = {fmt(I2, 4)}</text>
  </svg>
</figure>

<style>
  .parts { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .accentline { stroke: var(--anim-accent); }
  .dashed { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 6 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
