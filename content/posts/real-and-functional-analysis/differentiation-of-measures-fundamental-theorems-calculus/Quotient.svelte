<script>
  // Proof of Theorem 9, differentiability with h > 0, an instance: the graph
  // of f, the dashed level f(x), the region under the graph over (x, x + h)
  // and the rectangle over (x, x + h) with the same area, of height
  // (F(x + h) − F(x))/h = (1/h) ∫ f dλ over (x, x + h). Under the axis, the
  // interval (x − h, x + h) of the last bound. The slider sets h.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, integral, fmt } from './plot.js';
  const uid = $props.id();

  const OX = 50, UX = 590, OY = 262, UY = 200;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) => 0.55 + 0.3 * Math.sin(2 * Math.PI * (1.1 * t + 0.05)) + 0.12 * Math.sin(2 * Math.PI * 3.3 * t + 1);
  const x = 0.4;
  const fx = f(x);

  let h = $state(0.2);
  const q = $derived(integral(f, x, x + h, 300) / h);
</script>

<figure class="anim quotient">
  <svg viewBox="0 0 690 344" role="img" aria-label="The graph of a function f, a dashed horizontal line at the level f of x, the shaded region under the graph from x to x plus h, a rectangle of the same area over that interval, and, under the axis, the interval from x minus h to x plus h">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
    </defs>
    <path class="region" d={under(f, x, x + h, sx, sy, 160)} />
    <rect x={sx(x)} y={sy(q)} width={sx(x + h) - sx(x)} height={q * UY} fill="url(#{uid}-h)" />
    <rect class="rect" x={sx(x)} y={sy(q)} width={sx(x + h) - sx(x)} height={q * UY} />
    <line class="level" x1={sx(0)} y1={sy(fx)} x2={sx(1)} y2={sy(fx)} />
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1) + 14} y2={OY} />
    <polyline class="curve" points={graph(f, 0, 1, sx, sy, 300)} />
    <circle class="dot" cx={sx(x)} cy={sy(fx)} r="4.5" />
    <line class="tick" x1={sx(x)} y1={OY - 6} x2={sx(x)} y2={OY + 6} />
    <line class="tick" x1={sx(x + h)} y1={OY - 6} x2={sx(x + h)} y2={OY + 6} />
    <line class="set" x1={sx(x - h)} y1={OY + 34} x2={sx(x + h)} y2={OY + 34} />

    <text class="it" x={sx(x)} y={OY + 18}>x</text>
    <text x={sx(x + h) + (h < 0.06 ? 26 : 0)} y={OY + 18}><tspan class="it">x</tspan> + <tspan class="it">h</tspan></text>
    <text x={sx(x - h)} y={OY + 56}><tspan class="it">x</tspan> − <tspan class="it">h</tspan></text>
    <text class="it" x={sx(0.95)} y={sy(f(0.95)) - 22}>f</text>
    <text class="muted left" x={sx(1) + 8} y={sy(fx)}><tspan class="it">f</tspan>(<tspan class="it">x</tspan>)</text>
    <text class="left" x={OX} y="24">(<tspan class="it">F</tspan>(<tspan class="it">x</tspan> + <tspan class="it">h</tspan>) − <tspan class="it">F</tspan>(<tspan class="it">x</tspan>))/<tspan class="it">h</tspan> = <tspan class="accent">{fmt(q, 3)}</tspan>,&#8195;<tspan class="it">f</tspan>(<tspan class="it">x</tspan>) = {fmt(fx, 3)}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="h" min={0.01} max={0.3} step={0.01} bind:value={h} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .quotient { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-ink); fill-opacity: 0.1; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.2; stroke-opacity: 0.6; }
  .rect { fill: none; stroke: var(--anim-accent); stroke-width: 2; }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .set { stroke: var(--anim-muted); stroke-width: 4; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
