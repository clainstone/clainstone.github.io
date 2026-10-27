<script>
  // Example 11, Part 2 (1): the values g_n(x) = (x/2)^n for n = 1, …, 16 and the
  // x of the slider, as points over n, with the case of the solution that x
  // falls in. A value beyond the drawn range ±2.4 is a triangle at the edge.
  import Slider from '@toolkit/Slider.svelte';
  const uid = $props.id();

  const NMAX = 16, OX = 70, UN = 36, OY = 150, UY = 50, LIM = 2.4;
  const sx = (n) => OX + n * UN;
  const sy = (v) => OY - v * UY;
  const ns = Array.from({ length: NMAX }, (_, k) => k + 1);

  let x = $state(1.6);
  const xr = $derived(Math.round(x * 100) / 100);
  const values = $derived(ns.map((n) => ({ n, v: (xr / 2) ** n })));
  // The case as text before and after the italic x: |x| < 2, x = 2, x = −2, x > 2, x < −2.
  const which = $derived(
    Math.abs(xr) < 2 ? ['|', '| < 2'] : xr === 2 ? ['', ' = 2'] : xr === -2 ? ['', ' = −2'] : xr > 2 ? ['', ' > 2'] : ['', ' < −2'],
  );
  const tri = (n, up) => {
    const cx = sx(n), cy = up ? sy(LIM) : sy(-LIM);
    return up ? `${cx - 6},${cy + 4} ${cx + 6},${cy + 4} ${cx},${cy - 7}` : `${cx - 6},${cy - 4} ${cx + 6},${cy - 4} ${cx},${cy + 7}`;
  };
</script>

<figure class="anim powervalues">
  <svg viewBox="0 0 690 300" role="img" aria-label="The values of x over 2 to the n for n from 1 to 16 and the chosen x, as points over n, with the case of the solution written above">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="grid" x1={OX} y1={sy(1)} x2={sx(NMAX) + 12} y2={sy(1)} />
    <line class="grid" x1={OX} y1={sy(-1)} x2={sx(NMAX) + 12} y2={sy(-1)} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(NMAX) + 30} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={sy(-LIM) - 6} x2={OX} y2={sy(LIM) - 14} marker-end="url(#{uid}-head)" />
    {#each [1, 4, 8, 12, 16] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 20}>{k}</text>
    {/each}
    <text class="num right" x={OX - 10} y={sy(1)}>1</text>
    <text class="num right" x={OX - 10} y={sy(-1)}>−1</text>
    <text class="it" x={sx(NMAX) + 32} y={OY + 20}>n</text>
    {#each values as p}
      {#if Math.abs(p.v) <= LIM}
        <circle class="pt" cx={sx(p.n)} cy={sy(p.v)} r="4.5" />
      {:else}
        <polygon class="pt" points={tri(p.n, p.v > 0)} />
      {/if}
    {/each}
    <text class="case" x={OX + 22} y="18">{which[0]}<tspan class="it">x</tspan>{which[1]}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x" min={-2.6} max={2.6} step={0.05} bind:value={x} format={(v) => (Math.round(v * 100) / 100).toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .powervalues { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .grid { stroke: var(--anim-rule); stroke-width: 1.2; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .case { text-anchor: start; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
