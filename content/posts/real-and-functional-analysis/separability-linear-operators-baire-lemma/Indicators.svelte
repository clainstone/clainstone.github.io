<script>
  // The drawing of the proof of Theorem 13.4 (3), with α < β as in the lecture.
  // Left: the graphs of f_α = χ_(−α, α), solid, and f_β = χ_(−β, β), dashed;
  // the hatched rectangles of height 1 over (−β, −α] ∪ [α, β), where
  // |f_α − f_β| = 1. Right: the balls U_α and U_β of radius 1/2 drawn as discs,
  // whose centres f_α and f_β are at distance ‖f_α − f_β‖_∞ = 1.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const OX = 195, OY = 215, UX = 85, UY = 120;
  const sx = (v) => OX + v * UX;
  const sy = (v) => OY - v * UY;
  const XMAX = 2.15;
  // Right panel: radius 1/2 is R px, so the distance 1 is 2R.
  const R = 72, CY = 140, CA = 500, CB = CA + 2 * R;

  let alpha = $state(0.8);
  let beta = $state(1.3);
  const fmt = (v) => v.toFixed(2);
</script>

<figure class="anim indicators">
  <svg viewBox="0 0 760 290" role="img" aria-label="On the left, the graphs of two characteristic functions of symmetric intervals, the larger one dashed, with the set where they differ hatched; on the right, two tangent discs of radius one half whose centres are at distance one">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
    </defs>
    <!-- left panel -->
    <rect x={sx(-beta)} y={sy(1)} width={(beta - alpha) * UX} height={UY} fill="url(#{uid}-h)" />
    <rect x={sx(alpha)} y={sy(1)} width={(beta - alpha) * UX} height={UY} fill="url(#{uid}-h)" />
    <line class="axis" x1={sx(-XMAX)} y1={OY} x2={sx(XMAX)} y2={OY} />
    <polygon class="head" points="{sx(XMAX) + 10},{OY} {sx(XMAX)},{OY - 5} {sx(XMAX)},{OY + 5}" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(1.45)} />
    <polygon class="head" points="{OX},{sy(1.45) - 10} {OX - 5},{sy(1.45)} {OX + 5},{sy(1.45)}" />
    <line class="tick" x1={OX - 5} y1={sy(1)} x2={OX + 5} y2={sy(1)} />
    <text class="num" x={OX - 16} y={sy(1) - 12}>1</text>
    <!-- f_α: 0 outside (−α, α), 1 on it -->
    <line class="fa" x1={sx(-XMAX)} y1={OY} x2={sx(-alpha)} y2={OY} />
    <line class="fa" x1={sx(alpha)} y1={OY} x2={sx(XMAX)} y2={OY} />
    <line class="fa" x1={sx(-alpha)} y1={sy(1)} x2={sx(alpha)} y2={sy(1)} />
    <line class="jump" x1={sx(-alpha)} y1={OY} x2={sx(-alpha)} y2={sy(1)} />
    <line class="jump" x1={sx(alpha)} y1={OY} x2={sx(alpha)} y2={sy(1)} />
    <!-- f_β, dashed -->
    <line class="fb" x1={sx(-beta)} y1={sy(1)} x2={sx(beta)} y2={sy(1)} />
    <line class="fb thin" x1={sx(-beta)} y1={OY} x2={sx(-beta)} y2={sy(1)} />
    <line class="fb thin" x1={sx(beta)} y1={OY} x2={sx(beta)} y2={sy(1)} />
    {#each [[-beta, '−β'], [-alpha, '−α'], [alpha, 'α'], [beta, 'β']] as [v, t]}
      <line class="tick" x1={sx(v)} y1={OY - 5} x2={sx(v)} y2={OY + 5} />
      <text class="it" x={sx(v)} y={OY + 24}>{t}</text>
    {/each}
    <text class="it acc" x={sx(alpha / 2) + 6} y={sy(1) - 18}>f<tspan class="sub" dy="5">α</tspan></text>
    <text class="it" x={sx(beta) + 20} y={sy(1) - 18}>f<tspan class="sub" dy="5">β</tspan></text>

    <!-- right panel -->
    <circle class="ball" cx={CA} cy={CY} r={R} />
    <circle class="ball" cx={CB} cy={CY} r={R} />
    <line class="dist" x1={CA} y1={CY} x2={CB} y2={CY} />
    <circle class="dot acc-fill" cx={CA} cy={CY} r="4.5" />
    <circle class="dot" cx={CB} cy={CY} r="4.5" />
    <text class="num ink halo" x={(CA + CB) / 2} y={CY - 16}>1</text>
    <text class="it acc" x={CA - 26} y={CY + 2}>f<tspan class="sub" dy="5">α</tspan></text>
    <text class="it" x={CB + 26} y={CY + 2}>f<tspan class="sub" dy="5">β</tspan></text>
    <text class="it" x={CA - R + 6} y={CY + R + 22}>U<tspan class="sub" dy="5">α</tspan></text>
    <text class="it" x={CB + R - 6} y={CY + R + 22}>U<tspan class="sub" dy="5">β</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="α" min={0.2} max={1} step={0.05} bind:value={alpha} format={fmt} />
      <Slider label="β" min={1.1} max={1.9} step={0.05} bind:value={beta} format={fmt} />
    </div>
  </div>
</figure>

<style>
  .indicators { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.2; stroke-opacity: 0.55; }
  .fa { stroke: var(--anim-accent); stroke-width: 3; }
  .jump { stroke: var(--anim-accent); stroke-width: 1.2; }
  .fb { stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  .fb.thin { stroke-width: 1.2; }
  .ball { fill: var(--anim-accent); fill-opacity: 0.08; stroke: var(--anim-ink); stroke-width: 1.5; stroke-dasharray: 8 6; }
  .dist { stroke: var(--anim-ink); stroke-width: 1.4; stroke-dasharray: 2 4; }
  .dot { fill: var(--anim-ink); }
  .acc-fill { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .num.ink { fill: var(--anim-ink); font-size: 18px; }
  .halo { paint-order: stroke; stroke: var(--page, #fff); stroke-width: 6px; stroke-linejoin: round; }
  .it { font-style: italic; }
  .acc { fill: var(--anim-accent); }
  .sub { font-size: 13px; }
</style>
