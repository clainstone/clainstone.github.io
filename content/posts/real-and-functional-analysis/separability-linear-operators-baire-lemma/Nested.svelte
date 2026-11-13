<script>
  // The drawing of the claim in the proof of Theorem 13.19 (1), an instance in the
  // plane: radii r_m = 0.9/2^m < 1/2^m and centres x_m = x_{m-1} + 0.35 r_{m-1} e_m
  // with unit vectors e_m, so that d(x_m, x_{m-1}) + r_m < r_{m-1} and each closed
  // ball lies in the open ball before it. For the N of the slider: the closed
  // ball B̄_{r_N}(x_N), the points x_m with m ≥ N inside it, and their limit x_∞.
  import Slider from '@toolkit/Slider.svelte';

  const C = [300, 225], S = 420;
  const M = 40;
  const r = Array.from({ length: M + 1 }, (_, m) => 0.9 / 2 ** m);
  const x = [null, [0, 0]];
  for (let m = 2; m <= M; m++) {
    const t = 0.6 + 2.2 * m;
    x.push([x[m - 1][0] + 0.35 * r[m - 1] * Math.cos(t), x[m - 1][1] + 0.35 * r[m - 1] * Math.sin(t)]);
  }
  const page = ([a, b]) => [C[0] + a * S, C[1] - b * S];
  const inf = page(x[M]);
  const SHOWN = 7;

  let N = $state(1);
  const centre = $derived(page(x[N]));
  const rad = $derived(r[N] * S);
  const edge = $derived([centre[0] + rad, centre[1]]);
</script>

<figure class="anim nested">
  <svg viewBox="0 0 760 450" role="img" aria-label="Nested closed balls shrinking to a point; the ball of the chosen index is highlighted, with the later points of the sequence inside it and their limit">
    {#each Array.from({ length: SHOWN }, (_, i) => i + 1) as m}
      {#if m !== N}
        <circle class="faint" cx={page(x[m])[0]} cy={page(x[m])[1]} r={r[m] * S} />
      {/if}
    {/each}
    <circle class="ball" cx={centre[0]} cy={centre[1]} r={rad} />
    {#each x.slice(1, 25) as q, i}
      <circle class={i + 1 >= N ? 'pt' : 'pt old'} cx={page(q)[0]} cy={page(q)[1]} r={i + 1 >= N ? 3.2 : 2.6} />
    {/each}
    <circle class="limit" cx={inf[0]} cy={inf[1]} r="5.5" />
    <line class="lead" x1={edge[0]} y1={edge[1]} x2="560" y2="150" />
    <line class="bar" x1="572" y1="136" x2="583" y2="136" />
    <text class="it acc start" x="570" y="150">B<tspan class="sub" dy="5">r</tspan><tspan class="subsub" dy="4">N</tspan><tspan dy="-9">(x</tspan><tspan class="sub" dy="5">N</tspan><tspan dy="-5">)</tspan></text>
    <line class="lead" x1={inf[0] + 6} y1={inf[1] + 4} x2="560" y2="300" />
    <text class="it start" x="570" y="300">x<tspan class="sub" dy="5">∞</tspan></text>
    <text class="start note" x="570" y="340">points <tspan class="it">x</tspan><tspan class="sub" dy="5">m</tspan><tspan dy="-5">, </tspan><tspan class="it">m</tspan> ≥ <tspan class="it">N</tspan></text>
    <circle class="pt" cx="556" cy="340" r="3.2" />
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={1} max={6} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .nested { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .faint { fill: none; stroke: var(--anim-muted); stroke-width: 1; stroke-opacity: 0.7; }
  .ball { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-accent); stroke-width: 2.2; }
  .pt { fill: var(--anim-ink); }
  .pt.old { fill: var(--anim-muted); fill-opacity: 0.6; }
  .limit { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; }
  .lead { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 2 3; }
  .bar { stroke: var(--anim-accent); stroke-width: 1.3; }
  text { fill: var(--anim-ink); font-size: 18px; dominant-baseline: central; }
  .it { font-style: italic; }
  .acc { fill: var(--anim-accent); }
  .start { text-anchor: start; }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .sub { font-size: 13px; }
  .subsub { font-size: 11px; }
</style>
