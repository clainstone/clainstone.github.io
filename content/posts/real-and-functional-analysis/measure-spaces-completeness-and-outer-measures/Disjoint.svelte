<script>
  // Step 1 of the proof of Theorem 18 (ii): two disjoint sets E and F, and
  // the test set Z = E ∪ F.
</script>

<figure class="anim disjoint">
  <svg viewBox="0 0 420 200" role="img" aria-label="Two disjoint disks E and F, and a bracket under them labelled Z, their union">
    <circle class="set" cx="130" cy="80" r="52" />
    <circle class="set" cx="290" cy="80" r="52" />
    <text class="lab" x="130" y="80">E</text>
    <text class="lab" x="290" y="80">F</text>
    <path class="brace" d="M70,150 Q70,165 90,165 L190,165 Q210,165 210,180 Q210,165 230,165 L330,165 Q350,165 350,150" />
    <text class="lab accent" x="210" y="192">Z = E ∪ F</text>
  </svg>
</figure>

<style>
  .disjoint { margin: 1.5rem auto; max-width: 23rem; }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-accent); fill-opacity: 0.14; stroke: var(--anim-accent); stroke-width: 1.8; }
  .brace { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; }
  text { fill: var(--anim-ink); font-size: 21px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); font-size: 19px; }
</style>
