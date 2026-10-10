<script>
  // Proposition 17, the drawing of the proof, an instance: a function f with
  // 0 ≤ f < 1 on an interval X, the levels i/m (dashed) and the simple
  // function f_m = Σ (i/m) χ of D_m^i, equal to j/m where j/m ≤ f < (j+1)/m.
  import Slider from '@toolkit/Slider.svelte';

  const OX = 60, OY = 300, UX = 560, UY = 250;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const f = (x) => 0.94 * Math.sin(Math.PI * x) ** 0.8;
  const S = 1200;
  const xs = Array.from({ length: S + 1 }, (_, j) => j / S);
  const fLine = xs.map((x) => `${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`).join(' ');
  for (const x of xs) if (f(x) < 0 || f(x) >= 1) throw new Error('the instance needs 0 ≤ f < 1');

  // The pieces of f_m: maximal runs of sample points with the same value.
  function steps(m) {
    const out = [];
    let start = 0, level = Math.floor(m * f(0));
    for (let j = 1; j <= S + 1; j++) {
      const l = j <= S ? Math.floor(m * f(xs[j])) : NaN;
      if (l !== level) { out.push({ x0: xs[start], x1: xs[Math.min(j, S)], y: level / m }); start = j; level = l; }
    }
    return out;
  }

  let m = $state(4);
  const pieces = $derived(steps(m));
</script>

<figure class="anim approx">
  <svg viewBox="0 0 680 350" role="img" aria-label="A function f between 0 and 1, the levels i over m dashed, and below f the step function f_m that rounds f down to the level beneath it">
    {#each Array.from({ length: m }, (_, i) => i + 1) as i}
      <line class="level" x1={OX} y1={sy(i / m)} x2={sx(1)} y2={sy(i / m)} />
    {/each}
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 30} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(1) - 20} />
    <polyline class="fcurve" points={fLine} />
    {#each pieces as p, i}
      {#if i > 0}<line class="riser" x1={sx(p.x0)} y1={sy(pieces[i - 1].y)} x2={sx(p.x0)} y2={sy(p.y)} />{/if}
      <line class="step" x1={sx(p.x0)} y1={sy(p.y)} x2={sx(p.x1)} y2={sy(p.y)} />
    {/each}
    <text class="num" x={OX - 16} y={OY}>0</text>
    <text class="num" x={OX - 16} y={sy(1)}>1</text>
    <text class="num it" x={sx(1) + 34} y={OY + 16}>X</text>
    <text class="lab" x={sx(0.12) - 18} y={sy(f(0.12)) - 8}>f</text>
    <text class="lab accent" x={sx(0.5)} y={sy(Math.floor(m * f(0.5)) / m) + 20}>f<tspan class="sub" dy="5">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={16} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .approx { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .level { stroke: var(--anim-rule); stroke-width: 1.1; stroke-dasharray: 6 5; }
  .fcurve { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  .step { stroke: var(--anim-accent); stroke-width: 3; }
  .riser { stroke: var(--anim-accent); stroke-width: 1.2; stroke-opacity: 0.6; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .sub { font-size: 12px; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
