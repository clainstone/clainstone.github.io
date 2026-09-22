<script>
  // The drawing next to the main goal of the lecture: in ℝⁿ, a set E, a line
  // that crosses it, and a set A.
  import { blob } from './shapes.js';
  const E = blob(215, 150, 150, 85, [[0.08, 3, 0.4], [0.05, 5, 1.3], [0.03, 9, 0.2]]);
  const A = 'M372,92 C352,112 350,150 364,182 L492,178 L488,96 Z';
</script>

<figure class="anim volumes">
  <svg viewBox="0 0 520 270" role="img" aria-label="In R^n, an irregular set E, a straight line crossing it, and a set A at its right">
    <path class="e" d={E} />
    <path class="a" d={A} />
    <line class="cut" x1="290" y1="28" x2="372" y2="258" />
    <text class="lab" x="175" y="160">E</text>
    <text class="lab" x="440" y="140">A</text>
    <text class="space" x="30" y="40">ℝ<tspan dy="-9" font-size="12" font-style="italic">n</tspan></text>
  </svg>
</figure>

<style>
  .volumes { margin: 1.5rem auto; max-width: 30rem; }
  svg { font-family: var(--anim-font); }
  .e { fill: var(--anim-accent); fill-opacity: 0.1; stroke: var(--anim-ink); stroke-width: 1.5; }
  .a { fill: var(--anim-accent); fill-opacity: 0.22; stroke: var(--anim-ink); stroke-width: 1.5; }
  .cut { stroke: var(--anim-ink); stroke-width: 1.5; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .space { text-anchor: start; }
</style>
