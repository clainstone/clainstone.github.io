<script>
  // Definition 16: a set E and a test set Z; the definition splits Z into the
  // part inside E and the part outside it.
</script>

<figure class="anim split">
  <svg viewBox="0 0 520 250" role="img" aria-label="A rectangle E and an ellipse Z that overlaps its lower right corner; Z intersect E and Z minus E are shaded differently">
    <defs>
      <clipPath id="split-e"><rect x="40" y="40" width="300" height="100" /></clipPath>
      <mask id="split-not-e"><rect x="0" y="0" width="520" height="250" fill="white" /><rect x="40" y="40" width="300" height="100" fill="black" /></mask>
    </defs>
    <ellipse class="in" cx="340" cy="162" rx="150" ry="68" clip-path="url(#split-e)" />
    <ellipse class="out" cx="340" cy="162" rx="150" ry="68" mask="url(#split-not-e)" />
    <rect class="e" x="40" y="40" width="300" height="100" />
    <ellipse class="z" cx="340" cy="162" rx="150" ry="68" />
    <text class="lab accent" x="64" y="66">E</text>
    <text class="lab" x="506" y="170">Z</text>
    <text class="note accent" x="270" y="118">Z ∩ E</text>
    <text class="note" x="390" y="190">Z \ E</text>
  </svg>
</figure>

<style>
  .split { margin: 1.5rem auto; max-width: 29rem; }
  svg { font-family: var(--anim-font); }
  .in { fill: var(--anim-accent); fill-opacity: 0.3; }
  .out { fill: var(--anim-muted); fill-opacity: 0.16; }
  .e { fill: none; stroke: var(--anim-accent); stroke-width: 1.8; }
  .z { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  text { fill: var(--anim-ink); font-size: 21px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .note { font-size: 19px; }
</style>
