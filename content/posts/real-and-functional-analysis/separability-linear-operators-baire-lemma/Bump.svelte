<script>
  // The drawing of Example 7, an instance on [a, b] = [−1/2, 3/2]: the function
  // f_m(x) = (1/m) sin²(mπx) on [0, 1/m] and 0 elsewhere, which is C¹, vanishes
  // outside (0, 1/m) and has the value 1/m at 1/(2m); the dashed level 1/m; the
  // dotted chord from (0, 0) to (1/(2m), 1/m), of slope 2; and the tangent at
  // the point x_m of (0, 1/(2m)) where f_m' = 2, as the mean value theorem says.
  // Same unit on both axes, so slopes are drawn as they are. The slider sets m.
  import Slider from '@toolkit/Slider.svelte';

  const A = -0.5, B = 1.5;
  const OX = 200, OY = 300, U = 270;
  const sx = (v) => OX + v * U;
  const sy = (v) => OY - v * U;
  const ROW1 = OY + 24, ROW2 = OY + 48;

  let m = $state(1);
  const f = $derived((x) => (x > 0 && x < 1 / m ? Math.sin(m * Math.PI * x) ** 2 / m : 0));
  const graph = $derived.by(() => {
    const pts = [];
    for (let j = 0; j <= 800; j++) {
      const x = A + ((B - A) * j) / 800;
      pts.push(`${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
    }
    return pts.join(' ');
  });
  // f_m'(x) = π sin(2mπx) = 2 at x_m = arcsin(2/π)/(2mπ), in (0, 1/(2m)).
  const xm = $derived(Math.asin(2 / Math.PI) / (2 * m * Math.PI));
  const P = $derived([sx(xm), sy(f(xm))]);
  const D = [1 / Math.sqrt(5), -2 / Math.sqrt(5)]; // slope 2 on the page
  const T = 62;
  // Below P the tangent stops at the axis.
  const down = $derived(Math.min(T, (OY - P[1]) / -D[1]));
</script>

<figure class="anim bump">
  <svg viewBox="0 0 700 360" role="img" aria-label="The graph of a smooth bump of height one over m on the interval from 0 to one over m, zero elsewhere on the interval from a to b, with the dashed level one over m, a dotted chord of slope 2 and a tangent line of slope 2">
    <line class="axis" x1={sx(-0.62)} y1={OY} x2={sx(1.62)} y2={OY} />
    <polygon class="head" points="{sx(1.62) + 10},{OY} {sx(1.62)},{OY - 5} {sx(1.62)},{OY + 5}" />
    <line class="axis" x1={OX} y1={OY + 10} x2={OX} y2={sy(1.12)} />
    <polygon class="head" points="{OX},{sy(1.12) - 10} {OX - 5},{sy(1.12)} {OX + 5},{sy(1.12)}" />
    {#each [[A, 'a'], [B, 'b']] as [v, t]}
      <line class="tick" x1={sx(v)} y1={OY - 6} x2={sx(v)} y2={OY + 6} />
      <text class="it" x={sx(v)} y={ROW1}>{t}</text>
    {/each}
    <line class="level" x1={sx(-0.12)} y1={sy(1 / m)} x2={sx(1 / m + 0.3)} y2={sy(1 / m)} />
    <text class="start" x={sx(1 / m + 0.3) + 8} y={sy(1 / m)}>1/<tspan class="it">m</tspan></text>
    <line class="drop" x1={sx(1 / (2 * m))} y1={sy(1 / m)} x2={sx(1 / (2 * m))} y2={OY} />
    <line class="chord" x1={OX} y1={OY} x2={sx(1 / (2 * m))} y2={sy(1 / m)} />
    <polyline class="graph" points={graph} />
    <line class="tangent" x1={P[0] - down * D[0]} y1={P[1] - down * D[1]} x2={P[0] + T * D[0]} y2={P[1] + T * D[1]} />
    <circle class="dot" cx={P[0]} cy={P[1]} r="4.5" />
    <text class="start small" x={P[0] + T * D[0] + 8} y={P[1] + T * D[1]}>slope 2</text>
    <line class="drop" x1={P[0]} y1={P[1]} x2={P[0]} y2={OY} />
    <line class="tick" x1={P[0]} y1={OY - 5} x2={P[0]} y2={OY + 5} />
    <text class="it end" x={P[0] - 6} y={ROW1}>x<tspan class="sub" dy="5">m</tspan></text>
    <line class="tick" x1={sx(1 / (2 * m))} y1={OY - 6} x2={sx(1 / (2 * m))} y2={OY + 6} />
    <text x={sx(1 / (2 * m))} y={ROW1}>1/(2<tspan class="it">m</tspan>)</text>
    <line class="tick" x1={sx(1 / m)} y1={OY - 6} x2={sx(1 / m)} y2={OY + 6} />
    <text x={sx(1 / m)} y={ROW2}>1/<tspan class="it">m</tspan></text>
    <text class="it acc start" x={sx(1 / m) + 10} y={sy(0.5 / m)}>f<tspan class="sub" dy="5">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={5} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .bump { margin: 1.5rem auto; max-width: 700px; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .graph { fill: none; stroke: var(--anim-accent); stroke-width: 2.8; stroke-linejoin: round; }
  .level { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 7 6; }
  .drop { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 2 3; }
  .chord { stroke: var(--anim-ink); stroke-width: 1.6; stroke-dasharray: 2 4; }
  .tangent { stroke: var(--anim-ink); stroke-width: 1.8; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .small { font-size: 16px; fill: var(--anim-muted); }
  .it { font-style: italic; }
  .acc { fill: var(--anim-accent); }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .sub { font-size: 13px; }
</style>
