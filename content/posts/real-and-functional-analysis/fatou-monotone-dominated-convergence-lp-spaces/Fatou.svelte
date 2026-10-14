<script>
  // Theorem 1, the drawing of the proof with an instance on an interval X,
  // μ = λ: the function f, the level a_k of s over A_k, the dotted level
  // t a_k, the first functions f_j with j ≥ n, faint, and f_n in the accent.
  // On the axis the set B_{k,n}, where every f_j with j ≥ n is at least t a_k,
  // under hatched rectangles of height t a_k. The sliders set n and t.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, intervals } from './plot.js';
  const uid = $props.id();

  const OX = 100, UX = 560, OY = 252, UY = 330;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  // The set A_k and the value a_k of s on it: f ≥ a_k on A_k.
  const A = [0.08, 0.58], AK = 0.375;
  const f = (x) => 0.5 + 0.12 * Math.sin(2 * Math.PI * 2.2 * x + 1.2) - 0.3 * Math.exp(-(((x - 0.74) / 0.06) ** 2));
  // An instance of the sequence: f_j dips below f at one of three points of
  // A_k, by a depth that tends to 0, so that f_j → f.
  const CENTRES = [0.17, 0.34, 0.49];
  const depth = (j) => 0.95 * 0.74 ** j;
  const fj = (j) => (x) => f(x) * (1 - depth(j) * Math.exp(-(((x - CENTRES[j % 3]) / 0.028) ** 2)));
  const fLine = graph(f, 0, 1, sx, sy, 500);

  let n = $state(1);
  let t = $state(0.8);
  const faint = $derived(Array.from({ length: 9 }, (_, i) => graph(fj(n + 1 + i), 0, 1, sx, sy, 500)));
  const fnLine = $derived(graph(fj(n), 0, 1, sx, sy, 500));
  const B = $derived(intervals((x) => {
    for (let j = n; j < n + 40; j++) if (fj(j)(x) < t * AK) return false;
    return true;
  }, A[0], A[1], 800));
  const dip = $derived(CENTRES[n % 3]);
</script>

<figure class="anim fatou">
  <svg viewBox="0 0 690 330" role="img" aria-label="A positive function f on an interval, the level a k of the simple function over the set A k and a dotted lower level t a k; faint functions f j that dip below f at points of A k; on the axis the set B k n where all the f j with j at least n stay above the dotted level, under hatched rectangles of that height">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
    </defs>
    {#each B as [a, b]}
      <rect x={sx(a)} y={sy(t * AK)} width={sx(b) - sx(a)} height={t * AK * UY} fill="url(#{uid}-h)" />
    {/each}
    <line class="level" x1={sx(A[0])} y1={sy(AK)} x2={sx(A[1])} y2={sy(AK)} />
    <line class="dotted" x1={sx(A[0])} y1={sy(t * AK)} x2={sx(A[1])} y2={sy(t * AK)} />
    {#each faint as pts}
      <polyline class="faint" points={pts} />
    {/each}
    <polyline class="fn" points={fnLine} />
    <polyline class="curve" points={fLine} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 16} y2={OY} />
    {#each B as [a, b]}
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    <line class="ak" x1={sx(A[0])} y1={OY + 30} x2={sx(A[1])} y2={OY + 30} />
    <line class="ak" x1={sx(A[0])} y1={OY + 23} x2={sx(A[0])} y2={OY + 37} />
    <line class="ak" x1={sx(A[1])} y1={OY + 23} x2={sx(A[1])} y2={OY + 37} />

    <text class="it" x={sx(A[0]) - 24} y={sy(AK)}>a<tspan class="sub" dy="5">k</tspan></text>
    <text class="it" x={sx(A[1]) + 34} y={sy(t * AK)}>t a<tspan class="sub" dy="5">k</tspan></text>
    <text class="it" x={sx(0.95)} y={sy(f(0.95)) - 18}>f</text>
    <text class="it accent halo" x={sx(dip) + 30} y={sy(fj(n)(dip)) + 2}>f<tspan class="sub" dy="5">n</tspan></text>
    <text class="it accent" x={OX - 40} y={OY}>B<tspan class="sub" dy="5">k,n</tspan></text>
    <text class="it muted" x={OX - 40} y={OY + 30}>A<tspan class="sub" dy="5">k</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={0} max={8} step={1} bind:value={n} />
      <Slider label="t" min={0.5} max={0.95} step={0.01} bind:value={t} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .fatou { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.3; stroke-opacity: 0.55; }
  .level { stroke: var(--anim-muted); stroke-width: 1.8; }
  .dotted { stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 1.5 5; stroke-linecap: round; }
  .faint { fill: none; stroke: var(--anim-muted); stroke-opacity: 0.4; stroke-width: 1.2; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linejoin: round; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .ak { stroke: var(--anim-muted); stroke-width: 1.6; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
  .halo { paint-order: stroke; stroke: var(--page, #fff); stroke-width: 5px; stroke-linejoin: round; }
</style>
