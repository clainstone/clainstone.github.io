<script>
  // Corollary 13 and Remark 14: on the left, for μ(X) < +∞ and p ≤ q, the
  // space L^q inside L^p; on the right, ℓ^1 ⊂ ℓ^p ⊂ ℓ^q ⊂ ℓ^∞. Each set is an
  // ellipse, its name at the top inside it; the innermost name sits in its
  // centre.
  const left = [
    { rx: 140, ry: 92, cy: 114, name: 'L', sup: 'p', italic: true },
    { rx: 80, ry: 50, cy: 140, name: 'L', sup: 'q', italic: true },
  ];
  const right = [
    { rx: 146, ry: 98, cy: 112, name: 'ℓ', sup: '∞' },
    { rx: 112, ry: 74, cy: 128, name: 'ℓ', sup: 'q', italic: true },
    { rx: 80, ry: 52, cy: 142, name: 'ℓ', sup: 'p', italic: true },
    { rx: 46, ry: 28, cy: 156, name: 'ℓ', sup: '1' },
  ];
  const panels = [
    {
      key: 'L',
      sets: left,
      label: 'The space L to the q inside L to the p',
    },
    {
      key: 'l',
      sets: right,
      label: 'Nested sets: little l one inside little l p inside little l q inside little l infinity',
    },
  ];
  // Where the name of set i goes: near the top of its ellipse, or in the centre of the last one.
  const nameY = (sets, i) => (i === sets.length - 1 ? sets[i].cy : sets[i].cy - sets[i].ry + 17);
  const isInner = (sets, i) => i === sets.length - 1;
</script>

<figure class="anim inclusions">
  {#each panels as panel}
    <div class="panel">
      <svg viewBox="0 0 320 220" role="img" aria-label={panel.label}>
        {#each panel.sets as s, i}
          <ellipse
            class={isInner(panel.sets, i) ? 'set inner' : 'set'}
            cx="160"
            cy={s.cy}
            rx={s.rx}
            ry={s.ry}
          />
        {/each}
        {#each panel.sets as s, i}
          <text x="160" y={nameY(panel.sets, i)}>{#if s.name === 'L'}<tspan class="it">L</tspan>{:else}ℓ{/if}<tspan class={s.italic ? 'sup it' : 'sup'} dy="-8">{s.sup}</tspan></text>
        {/each}
      </svg>
      <p>
        {#if panel.key === 'L'}
          <i>μ</i>(<i>X</i>) &lt; +∞, 1 ≤ <i>p</i> ≤ <i>q</i> ≤ +∞
        {:else}
          1 ≤ <i>p</i> ≤ <i>q</i> ≤ +∞
        {/if}
      </p>
    </div>
  {/each}
</figure>

<style>
  .inclusions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 1.5rem 0; }
  .panel p { margin: 0.2rem 0 0; text-align: center; font-size: 0.9rem; color: var(--anim-muted); }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-accent); fill-opacity: 0.06; stroke: var(--anim-ink); stroke-width: 1.6; }
  .set.inner { fill-opacity: 0.18; stroke: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sup { font-size: 13px; }
</style>
