<script>
  // The idea of complete measure spaces: A ∈ 𝓜, a set C ∈ 𝓜 of measure zero
  // (dashed) that overlaps A, and a subset B of C.
  import { blob } from './shapes.js';
  const A = blob(185, 140, 150, 92, [[0.07, 3, 1.0], [0.04, 5, 0.3]]);
  const C = blob(330, 118, 70, 56, [[0.08, 3, 0.2]]);
</script>

<figure class="anim nullset">
  <svg viewBox="0 0 460 250" role="img" aria-label="A set A, a dashed set C of measure zero overlapping the edge of A, and a small set B inside C">
    <path class="a" d={A} />
    <path class="c" d={C} />
    <circle class="b" cx="322" cy="118" r="22" />
    <text class="lab" x="150" y="145">A</text>
    <text class="lab" x="322" y="118">B</text>
    <text class="lab" x="420" y="72">C</text>
  </svg>
</figure>

<style>
  .nullset { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .a { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-ink); stroke-width: 1.5; }
  .c { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
  .b { fill: var(--anim-accent); fill-opacity: 0.3; stroke: var(--anim-accent); stroke-width: 1.5; }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
</style>
