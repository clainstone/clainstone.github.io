<script>
  // Section 5, an instance: a map f from a set E of 6 points to a set F of 4
  // points. Left, a set B and its preimage; right, the complement of B and its
  // preimage, which is the complement of the preimage of B.
  const f = [0, 0, 1, 2, 2, 3]; // the image of each point of E
  const B = [1, 2];
  const uid = $props.id();
  const ye = (i) => 38 + i * 30, yf = (j) => 58 + j * 40;
  const panels = [
    { inB: (j) => B.includes(j), set: 'B' },
    { inB: (j) => !B.includes(j), set: 'Bc' },
  ];
</script>

<figure class="anim preimage">
  <svg viewBox="0 0 760 262" role="img" aria-label="Two arrow diagrams of a map from six points to four points: a set B and its preimage, then the complement of B and its preimage">
    <defs>
      <marker id="{uid}-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path class="head" d="M0,0 L8,4 L0,8 z" /></marker>
      <marker id="{uid}-b" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path class="head on" d="M0,0 L8,4 L0,8 z" /></marker>
    </defs>
    {#each panels as p, k}
      <g transform="translate({k * 380}, 0)">
        <text class="lab it" x="70" y="14">E</text>
        <text class="lab it" x="270" y="14">F</text>
        {#each f as j, i}
          <line class="arrow" class:on={p.inB(j)} x1="78" y1={ye(i)} x2="260" y2={yf(j)} marker-end="url(#{uid}-{p.inB(j) ? 'b' : 'a'})" />
          <circle class="pt" class:on={p.inB(j)} cx="70" cy={ye(i)} r="5" />
        {/each}
        {#each [0, 1, 2, 3] as j}
          <circle class="pt" class:on={p.inB(j)} cx="270" cy={yf(j)} r="5" />
        {/each}
        {#if k === 0}
          <rect class="set" x="252" y={yf(1) - 18} width="36" height="76" rx="18" />
          <text class="it" x="312" y={yf(1) + 20}>B</text>
        {:else}
          <rect class="set" x="252" y={yf(0) - 18} width="36" height="36" rx="18" />
          <rect class="set" x="252" y={yf(3) - 18} width="36" height="36" rx="18" />
          <text x="318" y={yf(0)}><tspan class="it">B</tspan><tspan class="sup" dy="-8">c</tspan></text>
          <text x="318" y={yf(3)}><tspan class="it">B</tspan><tspan class="sup" dy="-8">c</tspan></text>
        {/if}
      </g>
    {/each}
    <text x="180" y="240"><tspan class="it">f</tspan><tspan class="sup" dy="-8">−1</tspan><tspan dy="8">(</tspan><tspan class="it">B</tspan>) is shaded</text>
    <text x="560" y="240"><tspan class="it">f</tspan><tspan class="sup" dy="-8">−1</tspan><tspan dy="8">(</tspan><tspan class="it">B</tspan><tspan class="sup" dy="-8">c</tspan><tspan dy="8">)&nbsp;=&nbsp;</tspan><tspan class="it">f</tspan><tspan class="sup" dy="-8">−1</tspan><tspan dy="8">(</tspan><tspan class="it">B</tspan>)<tspan class="sup" dy="-8">c</tspan><tspan dy="8">&nbsp;is shaded</tspan></text>
  </svg>
</figure>

<style>
  .preimage { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .arrow { stroke: var(--anim-rule); stroke-width: 1.2; }
  .arrow.on { stroke: var(--anim-accent); stroke-width: 1.6; }
  .head { fill: var(--anim-rule); }
  .head.on { fill: var(--anim-accent); }
  .pt { fill: var(--anim-muted); }
  .pt.on { fill: var(--anim-accent); }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); }
  .it { font-style: italic; }
  .sup { font-size: 12px; font-style: normal; }
</style>
