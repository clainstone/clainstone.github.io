<script>
  // Definition 9 (i) and Remark 10: the curve of the pairs (p, p') with
  // 1/p + 1/p' = 1, that is p' = p/(p − 1), for p between 13/11 and 6.5; the
  // point (p, p') for the p of the slider and the point (p', p), which lies on
  // the same curve; the dashed diagonal, which meets the curve at (2, 2).
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';

  const sx = (p) => 70 + (p - 1) * 60;
  const sy = (q) => 386 - (q - 1) * 60;
  const conj = (p) => p / (p - 1);
  const curve = graph(conj, 6.5 / 5.5, 6.5, sx, sy, 300);
  const ticks = [1, 2, 3, 4, 5, 6];

  let p = $state(3);
  const q = $derived(conj(p));
  // Near (2, 2) the two labels would meet: the lower point's label goes below it.
  const close = $derived(Math.abs(p - q) < 0.9);
  const dyP = $derived(close && p > q ? 18 : -12);
  const dyQ = $derived(close && q > p ? 18 : -12);
</script>

<figure class="anim conjugates">
  <svg viewBox="0 0 460 436" role="img" aria-label="The curve of the pairs of conjugate exponents p and p prime, symmetric with respect to the dashed diagonal, which it meets at the point two two, with the point for the chosen p and its mirror point">
    <line class="axis" x1={sx(1)} y1={sy(1)} x2={sx(6.9)} y2={sy(1)} />
    <line class="axis" x1={sx(1)} y1={sy(1)} x2={sx(1)} y2={sy(6.9)} />
    {#each ticks as t}
      <line class="tick" x1={sx(t)} y1={sy(1)} x2={sx(t)} y2={sy(1) + 6} />
      <text class="num" x={sx(t)} y={sy(1) + 20}>{t}</text>
      <line class="tick" x1={sx(1) - 6} y1={sy(t)} x2={sx(1)} y2={sy(t)} />
      <text class="num" x={sx(1) - 20} y={sy(t)}>{t}</text>
    {/each}
    <text class="it" x={sx(6.9) + 14} y={sy(1)}>p</text>
    <text class="it start" x={sx(1) + 12} y={sy(6.9) + 2}>p′</text>
    <line class="diag" x1={sx(1)} y1={sy(1)} x2={sx(6.6)} y2={sy(6.6)} />
    <polyline class="curve" points={curve} />
    <circle class="fix" cx={sx(2)} cy={sy(2)} r="5" />
    <text class="num end" x={sx(2) - 12} y={sy(2)}>(2, 2)</text>
    <line class="pair" x1={sx(p)} y1={sy(q)} x2={sx(q)} y2={sy(p)} />
    <circle class="dot" cx={sx(p)} cy={sy(q)} r="5.5" />
    <circle class="ring" cx={sx(q)} cy={sy(p)} r="6" />
    <text class="lab start" x={sx(p) + 12} y={sy(q) + dyP}>(p, p′)</text>
    <text class="lab start" x={sx(q) + 12} y={sy(p) + dyQ}>(p′, p)</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1.2} max={6} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .conjugates { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .diag { stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; }
  .fix { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; }
  .pair { stroke: var(--anim-accent); stroke-width: 1.4; stroke-dasharray: 3 4; }
  .dot { fill: var(--anim-accent); }
  .ring { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .lab { font-style: italic; fill: var(--anim-accent); }
</style>
