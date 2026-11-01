<script>
  // Example 8, an instance: three elements x_0, x_1, x_2 of ℓ^p, drawn by their
  // first values x_n^(k), k = 0, …, 11, with x_0^(k) = 0.95 · 0.72^k cos(0.9k),
  // x_1^(k) = 0.85 (−0.8)^k, x_2^(k) = ±0.9 / (k + 1)^1.2. The sliders n and k
  // mark the value x_n^(k); below, the terms |x_n^(k)|^p of the sum in
  // ‖x_n‖_p^p for the p of the third slider.
  import Slider from '@toolkit/Slider.svelte';

  const K = 12;
  const ks = Array.from({ length: K }, (_, k) => k);
  const value = [
    (k) => 0.95 * 0.72 ** k * Math.cos(0.9 * k),
    (k) => 0.85 * (-0.8) ** k,
    (k) => ((k % 3 === 2 ? -1 : 1) * 0.9) / (k + 1) ** 1.2,
  ];
  const bx = (k) => 150 + k * 42;
  const ROW = [72, 166, 260];
  const H = 40;
  const BASE = 404;
  const BH = 74;

  let n = $state(1);
  let k = $state(3);
  let p = $state(2);
  const v = $derived(value[n](k));
  const terms = $derived(ks.map((j) => Math.abs(value[n](j)) ** p));
</script>

<figure class="anim sequences">
  <svg viewBox="0 0 690 452" role="img" aria-label="Three sequences drawn as bars over k from 0 to 11, the chosen sequence and its chosen value highlighted, and below the p-th powers of the absolute values of its terms">
    {#each value as f, row}
      <line class="base" x1="130" y1={ROW[row]} x2="640" y2={ROW[row]} />
      <text class={row === n ? 'it' : 'it faint'} x="64" y={ROW[row]}>x<tspan class="sub" dy="5">{row}</tspan></text>
      {#each ks as j}
        <line class={row === n ? (j === k ? 'bar hit' : 'bar') : 'bar dim'} x1={bx(j)} y1={ROW[row]} x2={bx(j)} y2={ROW[row] - f(j) * H} />
      {/each}
    {/each}
    <text class="it lab" x={bx(k)} y={ROW[n] - v * H + (v >= 0 ? -16 : 18)}>x<tspan class="sub" dy="5">{n}</tspan><tspan class="sup" dy="-14">({k})</tspan></text>
    <line class="base" x1="130" y1={BASE} x2="640" y2={BASE} />
    {#each ks as j}
      <rect class={j === k ? 'term hit' : 'term'} x={bx(j) - 9} y={BASE - Math.min(1, terms[j]) * BH} width="18" height={Math.min(1, terms[j]) * BH} />
      <text class="num" x={bx(j)} y={BASE + 18}>{j}</text>
    {/each}
    <text class="it" x="664" y={BASE + 18}>k</text>
    <text class="it" x="64" y={BASE - 34}>|x<tspan class="sub" dy="5">{n}</tspan><tspan class="sup" dy="-15">(k)</tspan><tspan dy="10">|</tspan><tspan class="sup" dy="-9">p</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={0} max={2} step={1} bind:value={n} />
      <Slider label="k" min={0} max={K - 1} step={1} bind:value={k} />
      <Slider label="p" min={1} max={4} step={0.1} bind:value={p} format={(x) => x.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .sequences { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .base { stroke: var(--anim-rule); stroke-width: 1.2; }
  .bar { stroke: var(--anim-ink); stroke-width: 7; }
  .bar.dim { stroke: var(--anim-muted); stroke-opacity: 0.4; }
  .bar.hit { stroke: var(--anim-accent); }
  .term { fill: var(--anim-ink); fill-opacity: 0.75; }
  .term.hit { fill: var(--anim-accent); fill-opacity: 1; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .faint { fill: var(--anim-muted); }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .sub, .sup { font-size: 13px; font-style: normal; }
</style>
