<script>
  // Proof of Theorem 6, an instance on an interval with μ = λ: the graph of
  // |f_n − f|^p for one n, the dashed level ε^p, the set {|f_n − f| > ε} on the
  // axis, the region under the graph over that set (the middle integral of the
  // proof) and inside it the rectangles of height ε^p over that set, hatched
  // (ε^p times the measure of the set). The sliders set ε and p.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, intervals, widest } from './plot.js';
  const uid = $props.id();

  const OX = 60, OY = 266, UX = 570, UY = 280;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  // The instance of |f_n − f|.
  const h = (t) => 0.12 + 0.68 * Math.exp(-(((t - 0.3) / 0.11) ** 2)) + 0.42 * Math.exp(-(((t - 0.74) / 0.08) ** 2));

  let eps = $state(0.4);
  let p = $state(2);
  const H = $derived((t) => h(t) ** p);
  const L = $derived(eps ** p);
  const sets = $derived(intervals((t) => h(t) > eps, 0, 1, 2000));
  const wide = $derived(widest(sets));
</script>

<figure class="anim powers">
  <svg viewBox="0 0 690 310" role="img" aria-label="The graph of the p-th power of the distance between f n and f on an interval, a dashed level epsilon to the p, the set where the distance exceeds epsilon on the axis, the region under the graph over that set, and the rectangles of height epsilon to the p over that set, hatched">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
    </defs>
    <path class="whole" d={under(H, 0, 1, sx, sy, 400)} />
    {#each sets as [a, b]}
      <path class="over" d={under(H, a, b, sx, sy, 160)} />
      <rect class="rect" x={sx(a)} y={sy(L)} width={sx(b) - sx(a)} height={L * UY} />
      <rect x={sx(a)} y={sy(L)} width={sx(b) - sx(a)} height={L * UY} fill="url(#{uid}-h)" />
    {/each}
    <line class="level" x1={OX} y1={sy(L)} x2={sx(1)} y2={sy(L)} />
    <polyline class="curve" points={graph(H, 0, 1, sx, sy, 400)} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 20} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(0.86)} />
    {#each sets as [a, b]}
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}

    <text class="it" x={OX - 24} y={sy(L)}>ε<tspan class="sup" dy="-7">p</tspan></text>
    <text class="left" x={sx(0.39)} y={sy(H(0.39)) - 12}>|<tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">{'\u00a0−\u00a0'}</tspan><tspan class="it">f</tspan>|<tspan class="sup" dy="-7">p</tspan></text>
    {#if wide}
      <text class="accent" x={(sx(wide[0]) + sx(wide[1])) / 2} y={OY + 24}>{'{'}|<tspan class="it">f</tspan><tspan class="sub" dy="5">n</tspan><tspan dy="-5">{'\u00a0−\u00a0'}</tspan><tspan class="it">f</tspan>| &gt; <tspan class="it">ε</tspan>{'}'}</text>
    {/if}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="ε" min={0.15} max={0.75} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
      <Slider label="p" min={1} max={3} step={0.1} bind:value={p} format={(v) => v.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .powers { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .whole { fill: var(--anim-ink); fill-opacity: 0.06; }
  .over { fill: var(--anim-accent); fill-opacity: 0.16; }
  .rect { fill: none; stroke: var(--anim-accent); stroke-width: 1.4; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.4; }
  .level { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .sup { font-size: 13px; font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
