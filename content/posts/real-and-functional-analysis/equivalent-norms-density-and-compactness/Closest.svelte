<script>
  // The drawing of Example 12.11, an instance with N = 2 and V the horizontal
  // line through 0: the point x = (x_1, x_2) of the sliders, with x_2 > 0 so
  // that x ∉ V, the point v̄ = (x_1, 0) of V, the dotted segment from x to v̄
  // of length |x − v̄| = d(x, V), and a ball around a point x_0 that does not
  // meet V.
  import Slider from '@toolkit/Slider.svelte';
  import { head } from './plot.js';

  const O = [300, 232], U = 64;
  const page = (a, b) => [O[0] + U * a, O[1] - U * b];
  const X0 = page(5.6, 2.55), RHO = 0.85 * U;

  let x1 = $state(1.4);
  let x2 = $state(1.9);
  const x = $derived(page(x1, x2));
  const v = $derived(page(x1, 0));
</script>

<figure class="anim closest">
  <svg viewBox="0 0 760 300" role="img" aria-label="A line V in the plane, a point x off the line, the point of V closest to x with the dotted segment between them, and a ball around a point x zero that does not meet V">
    <line class="axis" x1={O[0]} y1={O[1] + 56} x2={O[0]} y2={O[1] - 205} />
    <polygon class="head" points={head(O[0], O[1] - 215, 0, -1)} />
    <line class="v" x1="24" y1={O[1]} x2="716" y2={O[1]} />
    <polygon class="vhead" points={head(732, O[1], 1, 0, 16)} />
    <text class="it big" x="736" y={O[1] + 30}>V</text>

    <circle class="ball" cx={X0[0]} cy={X0[1]} r={RHO} />
    <circle class="dot" cx={X0[0]} cy={X0[1]} r="4" />
    <text class="it" x={X0[0] + 18} y={X0[1] + 2}>x<tspan class="sub" dy="5">0</tspan></text>

    <line class="seg" x1={x[0]} y1={x[1]} x2={v[0]} y2={v[1]} />
    <circle class="dot" cx={x[0]} cy={x[1]} r="5" />
    <circle class="vbar" cx={v[0]} cy={v[1]} r="6" />
    <text class="it" x={x[0]} y={x[1] - 20}>x</text>
    <text class="it" x={v[0]} y={v[1] + 26}>v</text>
    <line class="bar" x1={v[0] - 5} y1={v[1] + 13} x2={v[0] + 5} y2={v[1] + 13} />
    <text class="start" x={x[0] + 12} y={(x[1] + v[1]) / 2}><tspan class="it">d</tspan>(<tspan class="it">x</tspan>, <tspan class="it">V</tspan>)</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x₁" min={-3.5} max={3.2} step={0.05} bind:value={x1} format={(v) => v.toFixed(2)} />
      <Slider label="x₂" min={0.4} max={2.9} step={0.05} bind:value={x2} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .closest { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .v { stroke: var(--anim-accent); stroke-width: 5; }
  .vhead { fill: var(--anim-accent); }
  .ball { fill: var(--anim-ink); fill-opacity: 0.05; stroke: var(--anim-ink); stroke-width: 1.6; }
  .seg { stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 3 5; }
  .dot { fill: var(--anim-ink); }
  .vbar { fill: var(--anim-accent); stroke: var(--anim-ink); stroke-width: 1.4; }
  .bar { stroke: var(--anim-ink); stroke-width: 1.4; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .start { text-anchor: start; }
  .it { font-style: italic; }
  .big { font-size: 20px; }
  .sub { font-size: 13px; font-style: normal; }
</style>
