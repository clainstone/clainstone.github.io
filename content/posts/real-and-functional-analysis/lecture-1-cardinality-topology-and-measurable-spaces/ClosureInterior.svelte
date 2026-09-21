<script>
  // Definition 11 in the plane with the Euclidean topology: a set V that
  // contains part of its boundary (solid) and not the rest (dashed), its
  // interior, its closure and its boundary ∂V = closure(V) ∩ closure(X \ V).
  const N = 240;
  const pt = (th) => {
    const r = 50 * (1 + 0.14 * Math.sin(3 * th + 0.5) + 0.06 * Math.cos(5 * th));
    return [85 + 1.2 * r * Math.cos(th), 75 + 0.95 * r * Math.sin(th)];
  };
  const arc = (a, b) => Array.from({ length: N + 1 }, (_, k) => pt(a + ((b - a) * k) / N));
  const d = (pts, close = false) => pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('') + (close ? 'Z' : '');
  const whole = d(arc(0, 2 * Math.PI), true);
  const solid = d(arc(-0.4, 2.6));
  const dashed = d(arc(2.6, 2 * Math.PI - 0.4));
  const panels = [
    { key: 'V', title: 'V', fill: true, parts: [['solid', solid], ['dashed', dashed]] },
    { key: 'int', title: 'int(V)', fill: true, parts: [['dashed', whole]] },
    { key: 'cl', title: 'closure of V', fill: true, parts: [['solid', whole]] },
    { key: 'bd', title: '∂V', fill: false, parts: [['bold', whole]] },
  ];
</script>

<figure class="anim closure">
  {#each panels as p}
    <div class="panel">
      <svg viewBox="0 0 170 150" role="img" aria-label={p.title}>
        {#if p.fill}<path class="fill" d={whole} />{/if}
        {#each p.parts as [kind, path]}<path class={kind} d={path} />{/each}
      </svg>
      <p>{p.title}</p>
    </div>
  {/each}
</figure>

<style>
  .closure { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
  @media (max-width: 500px) { .closure { grid-template-columns: repeat(2, 1fr); } }
  .panel p { margin: 0.25rem 0 0; text-align: center; font-size: 0.875rem; color: var(--anim-muted); }
  .fill { fill: var(--anim-accent); fill-opacity: 0.1; stroke: none; }
  .solid, .dashed, .bold { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; }
  .dashed { stroke: var(--anim-muted); stroke-dasharray: 5 4; }
  .bold { stroke: var(--anim-accent); stroke-width: 2.6; }
</style>
