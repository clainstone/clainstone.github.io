<script>
  // Proof of Lemma 13, an instance with X = [0, 1] and μ = λ: the graph of |f|,
  // below it the simple function s = ⌊k|f|⌋/k with k = ⌈2/ε⌉, so that
  // 0 ≤ s ≤ |f| and ∫ (|f| − s) dλ ≤ 1/k ≤ ε/2; its maximum M, dashed; δ =
  // ε/(2M); and a set E = [c, c + 0.9δ] with the region under |f| over E
  // shaded. The sliders set ε (the reader's "for every") and the position c.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, integral, bump, fmt } from './plot.js';

  const OX = 50, UX = 590, OY = 300, UY = 122;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const b1 = bump(0.36, 0.26, 0.12);
  const b2 = bump(1.55, 0.7, 0.028);
  const g = (t) => 0.24 + b1(t) + b2(t);

  let eps = $state(0.2);
  let pos = $state(0.5);
  const k = $derived(Math.ceil(2 / eps));
  const s = $derived((t) => Math.floor(k * g(t)) / k);
  const M = $derived.by(() => {
    let m = 0;
    for (let j = 0; j <= 2000; j++) m = Math.max(m, s(j / 2000));
    return m;
  });
  const delta = $derived(eps / (2 * M));
  const len = $derived(0.9 * delta);
  const c = $derived(pos * (1 - len));
  const area = $derived(integral(g, c, c + len, 400));
</script>

<figure class="anim small">
  <svg viewBox="0 0 690 352" role="img" aria-label="The graph of the absolute value of f on an interval with a tall narrow peak, a step function below it, a dashed level at its maximum M, and a short interval E on the axis with the region under the graph over E shaded, together with the values of delta and of the integral over E">
    <path class="region" d={under(g, c, c + len, sx, sy, 120)} />
    <line class="level" x1={sx(0)} y1={sy(M)} x2={sx(1)} y2={sy(M)} />
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1)} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 6} x2={sx(0)} y2={OY + 6} />
    <line class="tick" x1={sx(1)} y1={OY - 6} x2={sx(1)} y2={OY + 6} />
    <polyline class="step" points={graph(s, 0, 1, sx, sy, 1600)} />
    <polyline class="curve" points={graph(g, 0, 1, sx, sy, 1600)} />
    <line class="set" x1={sx(c)} y1={OY} x2={sx(c + len)} y2={OY} />

    <text class="it accent" x={sx(c + len / 2)} y={OY + 22}>E</text>
    <text class="it muted" x={sx(1) + 22} y={sy(M)}>M</text>
    <text class="muted" x={sx(0.9)} y={sy(g(0.9)) - 20}>|<tspan class="it">f</tspan>|</text>
    <text class="it accentsoft" x={sx(0.12)} y={sy(s(0.12)) + 18}>s</text>
    <text class="left" x={OX} y="22"><tspan class="it">δ</tspan> = <tspan class="it">ε</tspan>/(2<tspan class="it">M</tspan>) = {fmt(delta, 4)},&#8195;<tspan class="it">λ</tspan>(<tspan class="it">E</tspan>) = 0.9<tspan class="it">δ</tspan>,&#8195;∫<tspan class="sub" dy="6">E</tspan><tspan dy="-6"> |</tspan><tspan class="it">f</tspan>| d<tspan class="it">λ</tspan> = <tspan class="accent">{fmt(area, 4)}</tspan> &lt; <tspan class="it">ε</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.05} max={0.4} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
      <Slider label="E" min={0} max={1} step={0.005} bind:value={pos} format={(v) => (pos * (1 - len)).toFixed(3)} />
    </div>
  </div>
</figure>

<style>
  .small { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.3; }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .step { fill: none; stroke: var(--anim-accent); stroke-width: 1.4; stroke-opacity: 0.8; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-linejoin: round; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .accentsoft { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
