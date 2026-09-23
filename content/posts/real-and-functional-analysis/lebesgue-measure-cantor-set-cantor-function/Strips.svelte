<script>
  // Theorem 4 (1), an instance with N = 2 as in the drawing of the lecture:
  // R = (0, 3) × (0, 1), its boundary, the rectangles at distance ε outside
  // and inside R, and the rectangles R₁ and R₂ around the left and the right
  // edge, hatched, drawn with second factor (−ε, 1 + ε). The slider sets ε.
  import Slider from '@toolkit/Slider.svelte';

  const U = 100;
  const X0 = 110, Y0 = 70, W = 3 * U, H = 1 * U;
  const X1 = X0 + W, Y1 = Y0 + H;
  let eps = $state(0.15);
  const e = $derived(eps * U);
</script>

<figure class="anim strips">
  <svg viewBox="0 0 520 240" role="img" aria-label="A rectangle R with its boundary, two rectangles at distance epsilon outside and inside it, and hatched rectangles R1 and R2 around its left and right sides">
    <defs>
      <pattern id="lm-strips-h1" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line class="hatch-1" x1="0" y1="0" x2="0" y2="8" />
      </pattern>
      <pattern id="lm-strips-h2" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
        <line class="hatch-2" x1="0" y1="0" x2="0" y2="8" />
      </pattern>
    </defs>
    <rect class="inside" x={X0} y={Y0} width={W} height={H} />
    <rect class="strip" x={X0 - e} y={Y0 - e} width={2 * e} height={H + 2 * e} fill="url(#lm-strips-h1)" />
    <rect class="strip two" x={X1 - e} y={Y0 - e} width={2 * e} height={H + 2 * e} fill="url(#lm-strips-h2)" />
    <rect class="frame" x={X0 - e} y={Y0 - e} width={W + 2 * e} height={H + 2 * e} />
    <rect class="frame" x={X0 + e} y={Y0 + e} width={W - 2 * e} height={H - 2 * e} />
    <rect class="boundary" x={X0} y={Y0} width={W} height={H} />
    <text class="lab" x={X0 + W / 2} y={Y0 + H / 2}>R</text>
    <text class="lab accent" x={X0 - e - 24} y={Y0 + H / 2}>R<tspan dy="5" font-size="12" font-style="normal">1</tspan></text>
    <text class="lab muted" x={X1 + e + 24} y={Y0 + H / 2}>R<tspan dy="5" font-size="12" font-style="normal">2</tspan></text>
    <line class="leader" x1={X0 + 0.8 * W} y1={Y1} x2={X0 + 0.8 * W} y2={Y1 + 42} />
    <text class="lab" x={X0 + 0.8 * W} y={Y1 + 56}>∂R</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.05} max={0.3} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .strips { margin: 1.5rem auto; max-width: 28rem; }
  svg { font-family: var(--anim-font); }
  .inside { fill: var(--anim-ink); fill-opacity: 0.04; stroke: none; }
  .strip { stroke: var(--anim-accent); stroke-width: 1.2; }
  .strip.two { stroke: var(--anim-muted); }
  .hatch-1 { stroke: var(--anim-accent); stroke-width: 1.8; }
  .hatch-2 { stroke: var(--anim-muted); stroke-width: 1.8; }
  .frame { fill: none; stroke: var(--anim-accent); stroke-width: 1; stroke-opacity: 0.7; }
  .boundary { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; }
  .leader { stroke: var(--anim-ink); stroke-width: 1; }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
