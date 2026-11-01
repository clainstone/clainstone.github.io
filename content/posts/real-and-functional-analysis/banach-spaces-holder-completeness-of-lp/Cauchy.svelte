<script>
  // Definition 4 (i), an instance in R with the norm |·|: x_n = 1 + (−1)^n / n
  // for n = 1, …, 40. For the ε of the slider, N is the first index such that
  // all the terms with n ≥ N lie in a strip of height less than ε (the strip
  // from the infimum to the supremum of the tail, of height 1/N + 1/(N + 1)),
  // so that |x_n − x_m| < ε for all n, m ≥ N. The bracket at the right has
  // height ε.
  import Slider from '@toolkit/Slider.svelte';

  const NMAX = 40;
  const ns = Array.from({ length: NMAX }, (_, i) => i + 1);
  const x = (n) => 1 + (n % 2 ? -1 : 1) / n;
  const sxn = (n) => 70 + ((n - 1) * 540) / (NMAX - 1);
  const sy = (v) => 262 - v * 140;
  const AXIS = 288;
  const firstN = (eps) => {
    let N = 1;
    while (1 / N + 1 / (N + 1) >= eps) N += 1;
    return N;
  };

  let eps = $state(0.4);
  const N = $derived(firstN(eps));
  const sup = $derived(N % 2 ? x(N + 1) : x(N));
  const inf = $derived(N % 2 ? x(N) : x(N + 1));
</script>

<figure class="anim cauchy">
  <svg viewBox="0 0 690 320" role="img" aria-label="The terms of a sequence of real numbers against n, the first index N from which all the terms lie in a shaded strip of height less than epsilon, and a bracket of height epsilon">
    <rect class="strip" x={sxn(N) - 7} y={sy(sup)} width={640 - sxn(N) + 7} height={sy(inf) - sy(sup)} />
    <line class="cut" x1={sxn(N) - 7} y1="24" x2={sxn(N) - 7} y2={AXIS} />
    <text class="lab" x={sxn(N) - 7} y="12">N</text>
    {#each ns as n}
      <circle class={n >= N ? 'dot' : 'dot faint'} cx={sxn(n)} cy={sy(x(n))} r="3.6" />
    {/each}
    <line class="bracket" x1="660" y1={sy(inf)} x2="660" y2={sy(inf + eps)} />
    <line class="bracket" x1="654" y1={sy(inf)} x2="666" y2={sy(inf)} />
    <line class="bracket" x1="654" y1={sy(inf + eps)} x2="666" y2={sy(inf + eps)} />
    <text class="lab" x="678" y={sy(inf + eps / 2)}>ε</text>
    <line class="axis" x1="56" y1={AXIS} x2="640" y2={AXIS} />
    {#each [1, 10, 20, 30, 40] as m}
      <line class="tick" x1={sxn(m)} y1={AXIS} x2={sxn(m)} y2={AXIS + 6} />
      <text class="num" x={sxn(m)} y={AXIS + 20}>{m}</text>
    {/each}
    <text class="it" x="40" y={AXIS}>n</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.06} max={1} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .cauchy { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .strip { fill: var(--anim-accent); fill-opacity: 0.14; }
  .cut { stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 6 4; }
  .dot { fill: var(--anim-ink); }
  .faint { fill: var(--anim-muted); fill-opacity: 0.55; }
  .bracket { stroke: var(--anim-accent); stroke-width: 2; }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
