<script>
  // The two drawings of the lecture of a function that vanishes near both ends
  // of an interval, the zero parts thick on the axis. Without `phi`, Remark 1:
  // a function f of C_c((a, b)), zero on (a, a + ε) and on (b − ε, b). With
  // `phi`, Example 2: a function φ of C_c^∞((0, 1)), zero on (0, ε) and on
  // (1 − ε, 1). An instance of each.
  import { graph } from './plot.js';
  let { phi = false } = $props();

  const X0 = 110, X1 = 580, Y0 = 126, UY = 62;
  const E = 0.16;
  const sx = (t) => X0 + t * (X1 - X0);
  const sy = (v) => Y0 - v * UY;
  // Bumps (height, centre, width) on [0, 1], times the window
  // exp(0.3 (4 − 1/(u(1 − u)))), which is infinitely differentiable and flat
  // at both ends of (E, 1 − E): the function, 0 outside, is infinitely
  // differentiable on the whole axis.
  const bumps = phi
    ? [[0.45, 0.14, 0.08], [-1.15, 0.36, 0.1], [0.9, 0.6, 0.07], [0.7, 0.75, 0.05], [0.8, 0.86, 0.05]]
    : [[0.35, 0.12, 0.07], [-0.95, 0.3, 0.09], [-0.6, 0.45, 0.06], [1.0, 0.62, 0.07], [0.5, 0.8, 0.06]];
  const wiggle = (t) => {
    if (t <= E || t >= 1 - E) return 0;
    const u = (t - E) / (1 - 2 * E);
    const w = Math.exp(0.3 * (4 - 1 / (u * (1 - u))));
    return w * bumps.reduce((s, [a, c, d]) => s + a * Math.exp(-(((u - c) / d) ** 2)), 0) * 1.6;
  };
  // Each label of the axis as [text, italic] pieces.
  const ends = phi
    ? [[['0', false]], [['ε', true]], [['1 − ', false], ['ε', true]], [['1', false]]]
    : [[['a', true]], [['a', true], [' + ', false], ['ε', true]], [['b', true], [' − ', false], ['ε', true]], [['b', true]]];
  const at = [0, E, 1 - E, 1];
  // The name of the function, above its highest point.
  let top = E;
  for (let j = 0; j <= 400; j++) if (wiggle(j / 400) > wiggle(top)) top = j / 400;
  const name = phi ? 'φ' : 'f';
  const label = phi
    ? 'A function phi on the interval from 0 to 1, equal to zero on the stretches from 0 to epsilon and from 1 minus epsilon to 1, drawn thick on the axis, and oscillating in between'
    : 'A function f on the interval from a to b, equal to zero on the stretches from a to a plus epsilon and from b minus epsilon to b, drawn thick on the axis, and oscillating in between';
</script>

<figure class="anim support">
  <svg viewBox="0 0 690 250" role="img" aria-label={label}>
    <line class="axis" x1={X0 - 60} y1={Y0} x2={X1 + 60} y2={Y0} />
    <line class="zero" x1={sx(0)} y1={Y0} x2={sx(E)} y2={Y0} />
    <line class="zero" x1={sx(1 - E)} y1={Y0} x2={sx(1)} y2={Y0} />
    <polyline class="f" points={graph(wiggle, E, 1 - E, sx, sy, 500)} />
    {#each at as t, i}
      <line class="tick" x1={sx(t)} y1={Y0 - 7} x2={sx(t)} y2={Y0 + 7} />
      <text x={sx(t)} y={Y0 + 26}>{#each ends[i] as [s, it]}<tspan class:it>{s}</tspan>{/each}</text>
    {/each}
    <text class="lab it" x={sx(top) + 18} y={sy(wiggle(top)) - 16}>{name}</text>
  </svg>
</figure>

<style>
  .support { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .zero { stroke: var(--anim-accent); stroke-width: 5; stroke-linecap: butt; }
  .f { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
</style>
