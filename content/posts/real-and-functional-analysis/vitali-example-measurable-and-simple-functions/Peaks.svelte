<script>
  // Example 21, as in the drawing of the exercise: g_m = m χ of [0, 1/m],
  // thin, and f_m = (−1)^m + g_m, thick, for the m of the slider. On [0, 1/m]
  // they take the values m and (−1)^m + m, elsewhere 0 and (−1)^m.
  import Slider from '@toolkit/Slider.svelte';

  const MMAX = 10;
  const OX = 200, UX = 300, LEFT = -0.5, RIGHT = 1.45;
  const TOP = MMAX + 1.4, BOTTOM = -2.4, Y0 = 16, Y1 = 350;
  const sx = (x) => OX + x * UX;
  const sy = (y) => Y0 + ((TOP - y) / (TOP - BOTTOM)) * (Y1 - Y0);

  let m = $state(3);
  const s = $derived(m % 2 === 0 ? 1 : -1);
</script>

<figure class="anim peaks">
  <svg viewBox="0 0 680 370" role="img" aria-label="The function g_m, equal to m on the interval from 0 to 1 over m and 0 elsewhere, and f_m, the same function shifted by plus or minus 1">
    <line class="axis" x1={sx(LEFT)} y1={sy(0)} x2={sx(RIGHT)} y2={sy(0)} />
    <line class="axis" x1={OX} y1={sy(-1.5)} x2={OX} y2={sy(TOP)} />
    {#each [1, -1] as y}
      <line class="tick" x1={OX - 6} y1={sy(y)} x2={OX + 6} y2={sy(y)} />
      <text class="num" x={sx(LEFT) - 24} y={sy(y)}>{y > 0 ? '1' : '−1'}</text>
    {/each}
    {#if m > 1}
      <line class="tick" x1={OX - 6} y1={sy(m)} x2={OX + 6} y2={sy(m)} />
      <text class="num it" x={OX - 24} y={sy(m)}>m</text>
    {/if}
    <line class="guide" x1={sx(1 / m)} y1={sy(0)} x2={sx(1 / m)} y2={sy(Math.max(m, m + s))} />
    <line class="guide" x1={sx(1 / m)} y1={sy(0)} x2={sx(1 / m)} y2={sy(-1) + 10} />
    <text class="num" x={sx(0) - 12} y={sy(-1) + 26}>0</text>
    <text class="num" x={sx(1 / m) + (m === 1 ? 0 : 8)} y={sy(-1) + 26}>1/<tspan class="it">m</tspan></text>

    <line class="g" x1={sx(LEFT)} y1={sy(0)} x2={sx(0)} y2={sy(0)} />
    <line class="g" x1={sx(0)} y1={sy(m)} x2={sx(1 / m)} y2={sy(m)} />
    <line class="g" x1={sx(1 / m)} y1={sy(0)} x2={sx(RIGHT)} y2={sy(0)} />
    <circle class="gdot" cx={sx(0)} cy={sy(m)} r="4" />
    <circle class="gdot" cx={sx(1 / m)} cy={sy(m)} r="4" />

    <line class="f" x1={sx(LEFT)} y1={sy(s)} x2={sx(0) - 5} y2={sy(s)} />
    <line class="f" x1={sx(0)} y1={sy(m + s)} x2={sx(1 / m)} y2={sy(m + s)} />
    <line class="f" x1={sx(1 / m) + 5} y1={sy(s)} x2={sx(RIGHT)} y2={sy(s)} />
    <circle class="fdot" cx={sx(0)} cy={sy(m + s)} r="5" />
    <circle class="fdot" cx={sx(1 / m)} cy={sy(m + s)} r="5" />
    <circle class="fhole" cx={sx(0)} cy={sy(s)} r="5" />
    <circle class="fhole" cx={sx(1 / m)} cy={sy(s)} r="5" />

    <text class="lab accent" x={sx(1.25)} y={sy(s) + (s < 0 ? 20 : -18)}>f<tspan class="sub" dy="5">m</tspan></text>
    <text class="lab muted" x={sx(1 / m) + 30} y={sy(m)}>g<tspan class="sub" dy="5">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={MMAX} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .peaks { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1.1; stroke-dasharray: 5 4; }
  .g { stroke: var(--anim-muted); stroke-width: 1.6; }
  .gdot { fill: var(--anim-muted); }
  .f { stroke: var(--anim-accent); stroke-width: 3; }
  .fdot { fill: var(--anim-accent); }
  .fhole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 12px; font-style: italic; }
  .lab { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
  .num { fill: var(--anim-muted); font-size: 16px; paint-order: stroke; stroke: var(--page, #fff); stroke-width: 5px; stroke-linejoin: round; }
</style>
