<script>
  // Remark 5 (i): a set E inside a set F, and the difference F \ E, shaded.
  import { blob } from './shapes.js';
  const F = blob(250, 125, 200, 100, [[0.05, 3, 0.8], [0.03, 5, 0.1]]);
  const E = blob(190, 128, 88, 52, [[0.06, 2, 1.1], [0.03, 5, 2.0]]);
</script>

<figure class="anim monotone">
  <svg viewBox="0 0 500 250" role="img" aria-label="A set E inside a set F; the part of F outside E, F minus E, is shaded">
    <path class="ring" d="{F} {E}" fill-rule="evenodd" />
    <path class="f" d={F} />
    <path class="e" d={E} />
    <text class="lab" x="190" y="128">E</text>
    <text class="lab accent" x="360" y="120">F <tspan font-style="normal">\</tspan> E</text>
    <text class="lab" x="468" y="40">F</text>
  </svg>
</figure>

<style>
  .monotone { margin: 1.5rem auto; max-width: 28rem; }
  svg { font-family: var(--anim-font); }
  .ring { fill: var(--anim-accent); fill-opacity: 0.16; stroke: none; }
  .f, .e { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
