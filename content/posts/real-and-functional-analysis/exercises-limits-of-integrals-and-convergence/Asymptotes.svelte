<script>
  // Remarks 8.1 and 8.5, the drawings of the lecture: on ℝ, the graph of tanh with
  // the dashed levels 1 and −1 (kind="tanh"), or the graph of arctan with the
  // dashed level π/2 and the value −π/2 marked on the left (kind="arctan"), as
  // on p02, where only π/2 is dashed.
  import { graph } from './plot.js';
  let { kind = 'tanh' } = $props();
  const uid = $props.id();

  const tanh = kind === 'tanh';
  const fn = tanh ? Math.tanh : Math.atan;
  const level = tanh ? 1 : Math.PI / 2;
  const B = tanh ? 4.4 : 9;
  const OX = 345, OY = 134, UX = 290 / B, UY = 92 / level;
  const sx = (y) => OX + y * UX;
  const sy = (v) => OY - v * UY;
  const line = graph(fn, -B, B, sx, sy, 400);
  const name = tanh ? 'tanh' : 'arctan';
  const label = tanh
    ? 'The graph of tanh on the real line, increasing through the origin from the dashed level minus 1 on the left to the dashed level 1 on the right'
    : 'The graph of arctan on the real line, increasing through the origin from the value minus pi over 2, marked on the left, to the dashed level pi over 2 on the right';
</script>

<figure class="anim asymptotes">
  <svg viewBox="0 0 690 270" role="img" aria-label={label}>
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="level" x1={sx(-B)} y1={sy(level)} x2={sx(B)} y2={sy(level)} />
    {#if tanh}
      <line class="level" x1={sx(-B)} y1={sy(-level)} x2={sx(B)} y2={sy(-level)} />
    {/if}
    <line class="axis" x1={sx(-B) - 12} y1={OY} x2={sx(B) + 30} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={sy(-1.36 * level)} x2={OX} y2={sy(1.36 * level)} marker-end="url(#{uid}-head)" />
    <polyline class="f" points={line} />

    {#if tanh}
      <text class="num left" x={sx(B) + 10} y={sy(level)}>1</text>
      <text class="num right" x={sx(-B) - 10} y={sy(-level)}>−1</text>
    {:else}
      <text class="num left" x={sx(B) + 10} y={sy(level)}>π/2</text>
      <text class="num right" x={sx(-B) - 10} y={sy(-level)}>−π/2</text>
    {/if}
    <text class="num" x={OX + 14} y={OY + 18}>0</text>
    <text class="it" x={sx(B) + 30} y={OY + 22}>y</text>
    <text class="right" x={OX - 12} y={sy(1.3 * level)}>{name}(<tspan class="it">y</tspan>)</text>
  </svg>
</figure>

<style>
  .asymptotes { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .level { stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 7 5; }
  .f { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
