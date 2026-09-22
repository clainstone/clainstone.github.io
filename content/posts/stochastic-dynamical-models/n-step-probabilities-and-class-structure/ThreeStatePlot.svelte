<script>
  // Example 2.1: p11^(n) = 1/5 + (1/2)^n (4/5 cos(nπ/2) − 2/5 sin(nπ/2)) for
  // n = 0, ..., 16, the level 1/5, and the band 1/5 ± 2^(-n) that contains it.
  const N = 16;
  const f = (n) => 0.2 + 0.5 ** n * (0.8 * Math.cos((n * Math.PI) / 2) - 0.4 * Math.sin((n * Math.PI) / 2));
  const X = (n) => 60 + n * 40;
  const Y = (v) => 250 - v * 220;
  // The band is drawn exactly and clipped to the plotting area below.
  const band = (s) => Array.from({ length: 161 }, (_, k) => k / 10).map((t, k) => `${k ? 'L' : 'M'}${X(t)},${Y(0.2 + s * 0.5 ** t)}`).join('');
  const pts = Array.from({ length: N + 1 }, (_, n) => ({ n, v: f(n) }));
</script>

<figure class="anim three-plot">
  <svg viewBox="0 0 740 300" role="img" aria-label="The values of p11 after n steps for n from 0 to 16, oscillating around 1/5 inside the band 1/5 plus or minus 2 to the minus n; the values 3/16 at n = 5 and 51/256 at n = 10 are marked">
    <line class="axis" x1="60" y1={Y(0)} x2={X(N)} y2={Y(0)} />
    <line class="axis" x1="60" y1={Y(0)} x2="60" y2={Y(1)} />
    {#each [[0, '0'], [0.2, '1/5'], [1, '1']] as [v, t]}
      <text class="tick" x="50" y={Y(v)}>{t}</text>
    {/each}
    <line class="level" x1="60" y1={Y(0.2)} x2={X(N)} y2={Y(0.2)} />
    <clipPath id="three-plot-area"><rect x="56" y={Y(1.1)} width={X(N) - 50} height={Y(-0.06) - Y(1.1)} /></clipPath>
    <g clip-path="url(#three-plot-area)">
      <path class="band" d={band(1)} />
      <path class="band" d={band(-1)} />
    </g>
    {#each pts as p}
      <circle class="pt" class:mark={p.n === 5 || p.n === 10} cx={X(p.n)} cy={Y(p.v)} r={p.n === 5 || p.n === 10 ? 5 : 3.5} />
      <text class="n" x={X(p.n)} y={Y(0) + 18}>{p.n}</text>
    {/each}
    <text class="note" x={X(5)} y={Y(f(5)) - 26}>3/16</text>
    <text class="note" x={X(10)} y={Y(f(10)) - 26}>51/256</text>
    <text class="axis-label" x={X(N)} y={Y(0) + 38}>n</text>
  </svg>
</figure>

<style>
  .three-plot { margin: 1.5rem auto; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .level { stroke: var(--anim-muted); stroke-width: 1.2; }
  .band { fill: none; stroke: var(--anim-accent); stroke-opacity: 0.45; stroke-dasharray: 5 4; stroke-width: 1.3; }
  .pt { fill: var(--anim-ink); }
  .pt.mark { fill: var(--anim-accent); }
  .tick, .n, .axis-label { fill: var(--anim-muted); font-size: 16px; dominant-baseline: central; }
  .tick { text-anchor: end; }
  .n, .axis-label { text-anchor: middle; }
  .axis-label { font-style: italic; }
  .note { fill: var(--anim-accent); font-size: 16px; text-anchor: middle; }
</style>
