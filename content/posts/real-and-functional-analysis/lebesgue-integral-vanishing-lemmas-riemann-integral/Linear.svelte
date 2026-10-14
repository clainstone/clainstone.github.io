<script>
  // Remark 13, an instance: the map f ↦ ∫ f dμ sends f, g and αf + βg in the
  // set of integrable functions (the oval) to ∫ f, ∫ g and α∫ f + β∫ g on the
  // real line (vertical, on the right).
  const uid = $props.id();
  const LINE = 470;
  const items = [
    { from: [190, 66], to: 58, name: 'f', image: '∫ f', main: false },
    { from: [230, 128], to: 124, name: 'αf + βg', image: 'α∫ f + β∫ g', main: true },
    { from: [182, 192], to: 196, name: 'g', image: '∫ g', main: false },
  ];
  const curve = ([x, y], to) => `M${x + 8},${y} C${x + 110},${y} ${LINE - 110},${to} ${LINE - 9},${to}`;
</script>

<figure class="anim linear">
  <svg viewBox="0 0 690 250" role="img" aria-label="An oval with three points f, alpha f plus beta g and g, and arrows from them to three points of a vertical real line, their integrals">
    <defs>
      <marker id="{uid}-m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="muted-fill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <marker id="{uid}-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="accent-fill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <marker id="{uid}-line" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="ink-fill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <ellipse class="space" cx="190" cy="128" rx="125" ry="104" />
    <line class="axis" x1={LINE} y1="236" x2={LINE} y2="16" marker-end="url(#{uid}-line)" />
    {#each items as it}
      <path class="arrow" class:main={it.main} d={curve(it.from, it.to)} marker-end="url(#{uid}-{it.main ? 'a' : 'm'})" />
      <circle class="dot" class:main={it.main} cx={it.from[0]} cy={it.from[1]} r="4" />
      <circle class="dot" class:main={it.main} cx={LINE} cy={it.to} r="4" />
      <text class="lab end" class:accent={it.main} x={it.from[0] - 12} y={it.from[1]}>{it.name}</text>
      <text class="lab start" class:accent={it.main} x={LINE + 14} y={it.to}>{it.image}</text>
    {/each}
  </svg>
</figure>

<style>
  .linear { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .space { fill: var(--anim-ink); fill-opacity: 0.04; stroke: var(--anim-muted); stroke-width: 1.4; }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .arrow { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; }
  .arrow.main { stroke: var(--anim-accent); stroke-width: 1.9; }
  .dot { fill: var(--anim-ink); }
  .dot.main { fill: var(--anim-accent); }
  .muted-fill { fill: var(--anim-muted); }
  .accent-fill { fill: var(--anim-accent); }
  .ink-fill { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; font-style: italic; dominant-baseline: central; }
  .end { text-anchor: end; }
  .start { text-anchor: start; }
  .accent { fill: var(--anim-accent); }
</style>
