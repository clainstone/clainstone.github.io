<script>
  // Definition 2, an instance: a function f from X to Y, a set E of the
  // σ-algebra on Y, and its preimage f⁻¹(E), here made of two pieces. Arrows
  // from points of the preimage end in E, the other arrows end outside E.
  import { blob } from './shapes.js';

  const uid = $props.id();
  const X = blob(150, 160, 120, 118, [[0.05, 3, 0.2]]);
  const Y = blob(560, 160, 120, 118, [[0.05, 4, 1.1]]);
  const E = blob(575, 128, 64, 48, [[0.06, 3, 0.7]]);
  const pieces = [blob(118, 112, 44, 34, [[0.08, 3, 0.3]]), blob(178, 216, 46, 30, [[0.08, 2, 1.4]])];
  // [from, to, into E]
  const arrows = [
    [[110, 108], [560, 112], true],
    [[130, 120], [600, 140], true],
    [[175, 214], [578, 152], true],
    [[200, 150], [520, 220], false],
    [[90, 190], [610, 230], false],
    [[205, 90], [500, 160], false],
  ];
  const path = ([x1, y1], [x2, y2]) => `M${x1},${y1} C${x1 + 140},${y1 - 70} ${x2 - 140},${y2 - 70} ${x2},${y2}`;
</script>

<figure class="anim preimage">
  <svg viewBox="0 0 720 320" role="img" aria-label="A function f from a set X to a set Y; a set E inside Y and its preimage, two pieces inside X, with the arrows from the preimage ending in E">
    <defs>
      <marker id="{uid}-in" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path class="head in" d="M0,0 L8,4 L0,8 z" /></marker>
      <marker id="{uid}-out" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L8,4 L0,8 z" /></marker>
    </defs>
    <path class="space" d={X} />
    <path class="space" d={Y} />
    <path class="set" d={E} />
    {#each pieces as d}<path class="set" {d} />{/each}
    {#each arrows as [from, to, inE]}
      <path class="arrow" class:in={inE} d={path(from, to)} marker-end="url(#{uid}-{inE ? 'in' : 'out'})" />
      <circle class="pt" class:in={inE} cx={from[0]} cy={from[1]} r="4" />
    {/each}
    <text class="lab it" x="50" y="40">X</text>
    <text class="lab it" x="670" y="40">Y</text>
    <text class="lab it accent" x="640" y="92">E</text>
    <text class="lab accent" x="150" y="290"><tspan class="it">f</tspan><tspan class="sup" dy="-8">−1</tspan><tspan dy="8">(</tspan><tspan class="it">E</tspan>)</text>
    <line class="leader" x1="150" y1="276" x2="166" y2="244" />
    <text class="lab it" x="355" y="30">f</text>
  </svg>
</figure>

<style>
  .preimage { margin: 1.5rem auto; max-width: 38rem; }
  svg { font-family: var(--anim-font); }
  .space { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  .set { fill: var(--anim-accent); fill-opacity: 0.16; stroke: var(--anim-accent); stroke-width: 1.6; }
  .arrow { fill: none; stroke: var(--anim-rule); stroke-width: 1.3; }
  .arrow.in { stroke: var(--anim-accent); stroke-width: 1.6; }
  .head { fill: var(--anim-rule); }
  .head.in { fill: var(--anim-accent); }
  .pt { fill: var(--anim-muted); }
  .pt.in { fill: var(--anim-accent); }
  .leader { stroke: var(--anim-accent); stroke-width: 1; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .sup { font-size: 12px; }
</style>
