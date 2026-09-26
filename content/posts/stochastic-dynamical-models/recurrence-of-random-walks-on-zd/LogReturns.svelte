<script>
  // The return probabilities p⁽²ⁿ⁾₀₀ of the symmetric walks on ℤ, ℤ² and ℤ³ for
  // n = 1, …, 200, on logarithmic scales, with the asymptotic values 1/√(πn),
  // 1/(πn) and the bound d^{d/2}/(π^{d/2} 2^{(d−1)/2}) n^{−d/2} for d = 3, dashed.
  import { returnZ, returnZ2, returnZ3 } from './walks.js';

  const NMAX = 200;
  const X0 = 80, X1 = 560, Y0 = 290, Y1 = 30;
  const LX = Math.log10(NMAX), LYMIN = -5, LYMAX = 0;
  const px = (n) => X0 + (Math.log10(n) / LX) * (X1 - X0);
  const py = (v) => Y0 - ((Math.log10(v) - LYMIN) / (LYMAX - LYMIN)) * (Y0 - Y1);
  const ns = Array.from({ length: NMAX }, (_, k) => k + 1);
  const C3 = 3 ** 1.5 / (Math.PI ** 1.5 * 2);
  const series = [
    { d: 1, exact: ns.map((n) => returnZ(n, 0.5)), asym: ns.map((n) => 1 / Math.sqrt(Math.PI * n)) },
    { d: 2, exact: ns.map((n) => returnZ2(n)), asym: ns.map((n) => 1 / (Math.PI * n)) },
    { d: 3, exact: ns.map((n) => returnZ3(n)), asym: ns.map((n) => C3 * n ** -1.5) },
  ];
  const line = (vals) => vals.map((v, k) => `${px(ns[k]).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
</script>

<figure class="anim log-returns">
  <svg viewBox="0 0 640 340" role="img" aria-label="Log-log plot of the return probabilities of the symmetric walks on Z, Z2 and Z3 against n, with dashed asymptotic lines">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 12} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 10} />
    {#each [1, 10, 100] as n}
      <line class="tick" x1={px(n)} y1={Y0} x2={px(n)} y2={Y0 + 5} />
      <text class="num" x={px(n)} y={Y0 + 20}>{n}</text>
    {/each}
    {#each [0, -1, -2, -3, -4, -5] as e}
      <line class="tick" x1={X0 - 5} y1={py(10 ** e)} x2={X0} y2={py(10 ** e)} />
      <text class="num" x={X0 - 34} y={py(10 ** e)}>{e === 0 ? '1' : `10`}{#if e !== 0}<tspan dy="-7" font-size="12">{e}</tspan>{/if}</text>
    {/each}
    {#each series as s}
      <polyline class="asym" points={line(s.asym)} />
      <polyline class="exact d{s.d}" points={line(s.exact)} />
      <text class="dim d{s.d}" x={X1 + 44} y={py(s.exact[NMAX - 1])}>d = {s.d}</text>
    {/each}
    <text class="lab" x={X1 + 18} y={Y0 + 20}>n</text>
  </svg>
</figure>

<style>
  .log-returns { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .asym { fill: none; stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 4; }
  .exact { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  .exact.d2 { stroke-opacity: 0.7; }
  .exact.d3 { stroke-opacity: 0.45; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { font-style: italic; fill: var(--anim-muted); }
  .dim { fill: var(--anim-accent); }
</style>
