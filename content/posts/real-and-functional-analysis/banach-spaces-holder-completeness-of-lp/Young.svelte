<script>
  // Lemma 11, the drawing of the proof: the graph of log and its chord between
  // the points with abscissas α = a^p and β = b^(p'), p' = p/(p − 1), for the
  // a, b and p of the sliders (an instance: a, b in [0.7, 1.25], p in [1.5, 3]).
  // Above the abscissa tα + (1 − t)β with t = 1/p, which is a^p/p + b^(p')/p',
  // the chord is at height t log α + (1 − t) log β = log(ab) and the graph at
  // height log(a^p/p + b^(p')/p').
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';

  const sx = (x) => 70 + x * 260;
  const sy = (y) => 50 + (0.9 - y) * 125;
  const logLine = graph(Math.log, Math.exp(-1.3), 2.25, sx, sy, 400);

  let a = $state(0.7);
  let b = $state(1.25);
  let p = $state(3);
  const q = $derived(p / (p - 1));
  const al = $derived(a ** p);
  const be = $derived(b ** q);
  const M = $derived(al / p + be / q);
  const low = $derived(Math.log(a * b));
  const high = $derived(Math.log(M));
  // The label of the graph point sits 40 above it, on the side with room, with a leader.
  const leftSide = $derived(sx(M) > 340);
  const tag = $derived([sx(M) + (leftSide ? -26 : 26), sy(high) - 42]);
  // The label of the chord point goes below it, away from the chord.
  const rising = $derived(be >= al);
  const axisLabel = (x) => (Math.log(x) < 0 ? sy(0) - 16 : sy(0) + 18);
</script>

<figure class="anim young">
  <svg viewBox="0 0 690 345" role="img" aria-label="The graph of the logarithm, a chord between two of its points, and above a point between them the chord at height log of a b and the graph above it">
    <line class="axis" x1="54" y1={sy(0)} x2="660" y2={sy(0)} />
    <line class="axis" x1={sx(0)} y1={sy(-1.32)} x2={sx(0)} y2={sy(0.95)} />
    <text class="it" x="674" y={sy(0)}>x</text>
    <line class="guide" x1={sx(al)} y1={sy(0)} x2={sx(al)} y2={sy(Math.log(al))} />
    <line class="guide" x1={sx(be)} y1={sy(0)} x2={sx(be)} y2={sy(Math.log(be))} />
    <line class="guide accent" x1={sx(M)} y1={sy(0)} x2={sx(M)} y2={sy(high)} />
    <polyline class="curve" points={logLine} />
    <line class="chord" x1={sx(al)} y1={sy(Math.log(al))} x2={sx(be)} y2={sy(Math.log(be))} />
    <circle class="dot" cx={sx(al)} cy={sy(Math.log(al))} r="4.5" />
    <circle class="dot" cx={sx(be)} cy={sy(Math.log(be))} r="4.5" />
    <circle class="dot accent" cx={sx(M)} cy={sy(low)} r="4.5" />
    <circle class="ring" cx={sx(M)} cy={sy(high)} r="6" />
    <text class="it" x={sx(al)} y={axisLabel(al)}>α</text>
    <text class="it" x={sx(be)} y={axisLabel(be)}>β</text>
    <text class={rising ? 'lab start' : 'lab end'} x={sx(M) + (rising ? 10 : -10)} y={sy(low) + 20}>log(<tspan class="it">ab</tspan>)</text>
    <line class="leader" x1={tag[0]} y1={tag[1] + 10} x2={sx(M) + (leftSide ? -5 : 5)} y2={sy(high) - 5} />
    <text class={leftSide ? 'lab end' : 'lab start'} x={tag[0]} y={tag[1]}>log(<tspan class="it">a</tspan><tspan class="sup it" dy="-8">p</tspan><tspan dy="8">/</tspan><tspan class="it">p</tspan> + <tspan class="it">b</tspan><tspan class="sup it" dy="-8">p′</tspan><tspan dy="8">/</tspan><tspan class="it">p′</tspan>)</text>
    <text class="start" x={sx(1.78)} y={sy(Math.log(2.25)) - 2}>log(<tspan class="it">x</tspan>)</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="a" min={0.7} max={1.25} step={0.01} bind:value={a} format={(v) => v.toFixed(2)} />
      <Slider label="b" min={0.7} max={1.25} step={0.01} bind:value={b} format={(v) => v.toFixed(2)} />
      <Slider label="p" min={1.5} max={3} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .young { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; }
  .chord { stroke: var(--anim-accent); stroke-width: 2.2; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 3 4; }
  .guide.accent { stroke: var(--anim-accent); }
  .leader { stroke: var(--anim-accent); stroke-width: 1; }
  .dot { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  .ring { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .sup { font-size: 13px; }
</style>
