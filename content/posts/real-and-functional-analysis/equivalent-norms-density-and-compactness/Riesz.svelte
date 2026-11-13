<script>
  // The drawing of the proof of Step 1 (Theorem 12.18), an instance in R^2 with
  // the Euclidean norm: M the horizontal line through 0, x_0 = (1.75, 1.3), so
  // that d(x_0, M) = 1.3; the thick part of M where
  // ‖x_0 − m‖ ≤ d(x_0, M)/(1 − ε), for the ε of the first slider; m_0 in it,
  // set by the second slider (at 0, m_0 is the foot of x_0, as in the
  // lecture's drawing); the vectors x_0 and m_0 from 0, the dotted segment
  // from x_0 to m_0, and v = (x_0 − m_0)/‖x_0 − m_0‖ from 0. The dashed line
  // at height 1 − ε stays below the tip of v, since d(v, M) ≥ 1 − ε.
  import Slider from '@toolkit/Slider.svelte';
  import { head } from './plot.js';

  const MY = 262, U = 118, O = [190, MY];
  const P = 1.75, Hh = 1.3;
  const page = (a, b) => [O[0] + U * a, MY - U * b];
  const X0 = page(P, Hh);

  let eps = $state(0.3);
  let s = $state(0);
  const w = $derived(Hh * Math.sqrt(1 / (1 - eps) ** 2 - 1));
  const m0 = $derived(P + s * w);
  const n0 = $derived(Math.hypot(P - m0, Hh));
  const v = $derived([(P - m0) / n0, Hh / n0]);
  const M0 = $derived(page(m0, 0));
  const V = $derived(page(v[0], v[1]));
  const level = $derived(MY - U * (1 - eps));
</script>

<figure class="anim riesz">
  <svg viewBox="0 0 760 300" role="img" aria-label="A line M, a point x zero above it, a thick stretch of M around the foot of x zero, a point m zero in that stretch, and the unit vector v in the direction from m zero to x zero, above a dashed line at height one minus epsilon">
    <line class="m" x1="24" y1={MY} x2="718" y2={MY} />
    <polygon class="mhead" points={head(734, MY, 1, 0, 16)} />
    <text class="it big" x="742" y={MY + 26}>M</text>
    <line class="ok" x1={page(P - w, 0)[0]} y1={MY} x2={page(P + w, 0)[0]} y2={MY} />
    <line class="level" x1="24" y1={level} x2="734" y2={level} />
    <text class="start" x="28" y={level - 16}>1 − <tspan class="it">ε</tspan></text>

    <line class="dots" x1={X0[0]} y1={X0[1]} x2={M0[0]} y2={M0[1]} />
    <line class="vec" x1={O[0]} y1={O[1]} x2={X0[0]} y2={X0[1]} />
    <polygon class="vhead" points={head(X0[0], X0[1], X0[0] - O[0], X0[1] - O[1])} />
    {#if Math.abs(M0[0] - O[0]) > 14}
      <line class="vec" x1={O[0]} y1={O[1] - 1} x2={M0[0]} y2={M0[1] - 1} />
      <polygon class="vhead" points={head(M0[0], M0[1] - 1, M0[0] - O[0], 0)} />
    {/if}
    <line class="unit" x1={O[0]} y1={O[1]} x2={V[0]} y2={V[1]} />
    <polygon class="uhead" points={head(V[0], V[1], V[0] - O[0], V[1] - O[1], 13)} />

    <circle class="dot" cx={X0[0]} cy={X0[1]} r="4.5" />
    <circle class="dot" cx={M0[0]} cy={M0[1]} r="4.5" />
    <text class="it" x={X0[0] + 20} y={X0[1] - 14}>x<tspan class="sub" dy="5">0</tspan></text>
    <text class="it" x={M0[0] + 4} y={MY + 24}>m<tspan class="sub" dy="5">0</tspan></text>
    <text class="it acc" x={V[0] - 18} y={V[1] - 12}>v</text>
    <text x={O[0] - 4} y={MY + 24}>0</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.05} max={0.55} step={0.01} bind:value={eps} format={(x) => x.toFixed(2)} />
      <Slider label="m₀" min={-1} max={1} step={0.01} bind:value={s} format={(x) => x.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .riesz { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .m { stroke: var(--anim-muted); stroke-width: 2; }
  .mhead { fill: var(--anim-muted); }
  .ok { stroke: var(--anim-accent); stroke-width: 7; stroke-opacity: 0.5; }
  .level { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 7 5; }
  .dots { stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 2 4; }
  .vec { stroke: var(--anim-ink); stroke-width: 1.6; }
  .vhead { fill: var(--anim-ink); }
  .unit { stroke: var(--anim-accent); stroke-width: 2.6; }
  .uhead { fill: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .start { text-anchor: start; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .big { font-size: 20px; }
  .sub { font-size: 13px; font-style: normal; }
</style>
