<script>
  // Remark 7 and Proposition 8 (i) for X = {1, 2, 3}: the 2³ = 8 subsets A of X,
  // each with its indicator function f_A, the image of A under the bijection φ.
  // Choosing the elements of A changes the highlighted row.
  const X = [1, 2, 3];
  const subsets = Array.from({ length: 8 }, (_, m) => X.filter((_, k) => [4, 2, 1][k] & m));
  const order = subsets.map((s, m) => ({ s, m })).sort((a, b) => a.s.length - b.s.length || a.m - b.m);
  const name = (s) => (s.length ? `{${s.join(', ')}}` : '∅');

  let chosen = $state([1, 3]);
  const toggle = (x) => (chosen = chosen.includes(x) ? chosen.filter((y) => y !== x) : [...chosen, x].sort());
  const same = (s) => s.length === chosen.length && s.every((x) => chosen.includes(x));
</script>

<figure class="anim power-set">
  <table>
    <thead>
      <tr><th scope="col">A</th>{#each X as x}<th scope="col">f<sub>A</sub>({x})</th>{/each}</tr>
    </thead>
    <tbody>
      {#each order as { s }}
        <tr class:on={same(s)}>
          <th scope="row">{name(s)}</th>
          {#each X as x}<td>{s.includes(x) ? 1 : 0}</td>{/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="anim-controls">
    {#each X as x}
      <button type="button" class="anim-toggle" aria-pressed={chosen.includes(x)} onclick={() => toggle(x)}>
        {chosen.includes(x) ? `${x} ∈ A` : `${x} ∉ A`}
      </button>
    {/each}
  </div>
</figure>

<style>
  .power-set { margin: 1.5rem auto; max-width: 26rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; font-variant-numeric: tabular-nums; }
  th, td { padding: 0.3rem 0.6rem; border-bottom: 1px solid var(--anim-rule); text-align: center; font-weight: 400; }
  thead th { color: var(--anim-muted); }
  tbody th { text-align: left; }
  tr.on th, tr.on td { background: color-mix(in srgb, var(--anim-accent) 12%, transparent); color: var(--anim-ink); font-weight: 600; }
  .anim-toggle[aria-pressed='true'] { color: var(--anim-ink); border-color: var(--anim-accent); }
</style>
