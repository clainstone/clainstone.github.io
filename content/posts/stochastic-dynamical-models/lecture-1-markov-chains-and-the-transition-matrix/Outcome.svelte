<script>
  // The outcome ω of the annotation: eleven positions of the frog, drawn
  // against n = 0, ..., 10. The random variable X_n takes ω and returns its
  // n-th coordinate; the slider chooses n.
  import Slider from '@toolkit/Slider.svelte';

  const OMEGA = [1, 2, 3, 2, 3, 4, 3, 4, 2, 1, 2];
  const sub = (v) => String(v).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join('');
  let n = $state(3);
  const x = (k) => 50 + k * 54;
  const y = (s) => 250 - (s - 1) * 36;
  const line = OMEGA.map((s, k) => `${k ? 'L' : 'M'}${x(k)},${y(s)}`).join('');
</script>

<figure class="anim outcome">
  <svg viewBox="0 0 620 300" role="img" aria-label="The eleven positions of the outcome omega plotted against n from 0 to 10, with the chosen position highlighted">
    {#each [1, 2, 3, 4, 5, 6, 7] as s}
      <line class="grid" x1={x(0)} y1={y(s)} x2={x(10)} y2={y(s)} />
      <text class="state" x={x(0) - 22} y={y(s)}>{s}</text>
    {/each}
    <path class="traj" d={line} />
    {#each OMEGA as s, k}
      <circle class="pt" class:on={k === n} cx={x(k)} cy={y(s)} r={k === n ? 7 : 4} />
      <text class="time" x={x(k)} y="285">{k}</text>
    {/each}
    <text class="read" x={x(n)} y={y(OMEGA[n]) - 16}>X{sub(n)}(ω) = {OMEGA[n]}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders"><Slider label="n" min={0} max={10} step={1} bind:value={n} /></div>
  </div>
</figure>

<style>
  .outcome { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .state, .time { fill: var(--anim-muted); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .traj { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .pt { fill: var(--anim-muted); }
  .pt.on { fill: var(--anim-accent); }
  .read { fill: var(--anim-accent); font-size: 17px; text-anchor: middle; font-style: italic; }
</style>
