<script>
  // Proposition 7 and Theorem 14: a triangle E and a sequence of sets whose
  // union contains it, disks named Eₙ or ellipses named Aₙ as in the two
  // drawings of the lecture.
  let { name = 'E' } = $props();
  const T = [[95, 160], [300, 62], [345, 162]];
  const disks = [[118, 150, 42, 42, 0], [182, 128, 50, 50, 0], [248, 104, 52, 52, 0], [310, 92, 42, 42, 0], [322, 150, 44, 44, 0], [250, 160, 42, 42, 0]];
  const ellipses = [[132, 146, 62, 34, -20], [218, 118, 62, 40, -20], [292, 96, 46, 36, -10], [322, 146, 46, 40, 0], [240, 154, 70, 32, -5]];
  const sets = name === 'A' ? ellipses : disks;
</script>

<figure class="anim cover">
  <svg viewBox="0 0 440 230" role="img" aria-label="A triangle E covered by {sets.length} overlapping sets {name}n">
    {#each sets as [cx, cy, rx, ry, rot]}
      <ellipse class="set" {cx} {cy} {rx} {ry} transform="rotate({rot} {cx} {cy})" />
    {/each}
    <polygon class="tri" points={T.map((p) => p.join(',')).join(' ')} />
    <text class="lab tri-lab" x="262" y="136">E</text>
    <text class="lab" x="400" y="80">{name}<tspan dy="6" font-size="12">n</tspan></text>
  </svg>
</figure>

<style>
  .cover { margin: 1.5rem auto; max-width: 25rem; }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-muted); fill-opacity: 0.08; stroke: var(--anim-muted); stroke-width: 1.3; }
  .tri { fill: var(--anim-accent); fill-opacity: 0.18; stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .tri-lab { fill: var(--anim-accent); paint-order: stroke; stroke: var(--page, #fff); stroke-width: 4px; stroke-linejoin: round; }
</style>
