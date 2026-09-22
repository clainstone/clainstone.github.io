<script>
  // The proof of Theorem 10: a set E between two sets F₁ ⊂ E ⊂ F₂ of 𝓜 whose
  // difference F₂ \ F₁ has measure zero, drawn as a thin band.
  import { blob } from './shapes.js';
  const W = [[0.06, 3, 0.9], [0.03, 6, 0.2]];
  const F2 = blob(210, 115, 150, 88, W, 1);
  const E = blob(210, 115, 150, 88, [[0.06, 3, 0.9], [0.03, 6, 0.2], [0.012, 11, 0.5]], 0.965);
  const F1 = blob(210, 115, 150, 88, W, 0.93);
</script>

<figure class="anim sandwich">
  <svg viewBox="0 0 470 230" role="img" aria-label="Three nested sets F1 inside E inside F2, with F2 minus F1 a thin band">
    <path class="band" d="{F2} {F1}" fill-rule="evenodd" />
    <path class="f1" d={F1} />
    <path class="e" d={E} />
    <path class="f2" d={F2} />
    <line class="leader" x1="62" y1="200" x2="89.7" y2="173.1" />
    <text class="lab" x="50" y="212">E</text>
    <text class="lab muted" x="210" y="115">F<tspan dy="6" font-size="12" font-style="normal">1</tspan></text>
    <text class="lab accent" x="390" y="190">F<tspan dy="6" font-size="12" font-style="normal">2</tspan></text>
    <text class="note accent" x="462" y="24">μ(F<tspan dy="4" font-size="0.72em" font-style="normal">2</tspan><tspan dy="-4"> \ F</tspan><tspan dy="4" font-size="0.72em" font-style="normal">1</tspan><tspan dy="-4">) = 0</tspan></text>
  </svg>
</figure>

<style>
  .sandwich { margin: 1.5rem auto; max-width: 27rem; }
  svg { font-family: var(--anim-font); }
  .band { fill: var(--anim-accent); fill-opacity: 0.25; stroke: none; }
  .f1 { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .e { fill: none; stroke: var(--anim-ink); stroke-width: 1.2; }
  .f2 { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .muted { fill: var(--anim-muted); }
  .accent { fill: var(--anim-accent); }
  .leader { stroke: var(--anim-ink); stroke-width: 1; }
  .note { font-size: 15px; text-anchor: end; font-style: italic; }
</style>
