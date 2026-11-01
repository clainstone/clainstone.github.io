<script>
  // Example 5 with N = 2, the drawings of the lecture: the balls B_1(0) for
  // the norms |·| (a disc), ‖·‖_∞ (a square with corners (±1, ±1)) and ‖·‖_1
  // (a square with vertices (±1, 0) and (0, ±1)).
  const C = [120, 118];
  const U = 50;
  const px = (v) => C[0] + v * U;
  const py = (v) => C[1] - v * U;
  const square = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
  const diamond = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const poly = (pts) => pts.map(([a, b]) => `${px(a)},${py(b)}`).join(' ');
  const squareLabels = [
    { at: [-1, 1], t: '(−1, 1)', dx: -4, dy: -16, end: true },
    { at: [1, 1], t: '(1, 1)', dx: 4, dy: -16, end: false },
    { at: [-1, -1], t: '(−1, −1)', dx: -4, dy: 18, end: true },
    { at: [1, -1], t: '(1, −1)', dx: 4, dy: 18, end: false },
  ];
  const diamondLabels = [
    { at: [0, 1], t: '(0, 1)', dx: 8, dy: -12, end: false },
    { at: [-1, 0], t: '(−1, 0)', dx: -4, dy: -16, end: true },
    { at: [1, 0], t: '(1, 0)', dx: 4, dy: -16, end: false },
    { at: [0, -1], t: '(0, −1)', dx: 8, dy: 12, end: false },
  ];
  const panels = [
    { key: 'e', shape: 'circle', labels: [] },
    { key: 'inf', shape: poly(square), corners: square, labels: squareLabels },
    { key: 'one', shape: poly(diamond), corners: diamond, labels: diamondLabels },
  ];
</script>

<figure class="anim balls">
  {#each panels as p}
    <div class="panel">
      <svg viewBox="0 0 240 236" role="img" aria-label={p.key === 'e' ? 'The unit ball of the Euclidean norm in the plane, a disc' : p.key === 'inf' ? 'The unit ball of the maximum norm in the plane, a square with corners at plus or minus one in both coordinates' : 'The unit ball of the norm one in the plane, a square with vertices at plus or minus one on the two axes'}>
        <line class="axis" x1="14" y1={C[1]} x2="224" y2={C[1]} />
        <polygon class="head" points="230,{C[1]} 220,{C[1] - 5} 220,{C[1] + 5}" />
        <line class="axis" x1={C[0]} y1="226" x2={C[0]} y2="14" />
        <polygon class="head" points="{C[0]},8 {C[0] - 5},18 {C[0] + 5},18" />
        {#if p.shape === 'circle'}
          <circle class="ball" cx={C[0]} cy={C[1]} r={U} />
        {:else}
          <polygon class="ball" points={p.shape} />
          {#each p.corners as [a, b]}
            <circle class="dot" cx={px(a)} cy={py(b)} r="3.2" />
          {/each}
        {/if}
        {#each p.labels as l}
          <text class={l.end ? 'end' : 'start'} x={px(l.at[0]) + l.dx} y={py(l.at[1]) + l.dy}>{l.t}</text>
        {/each}
      </svg>
      <p>
        <i>B</i><sub>1</sub>(0) for
        {#if p.key === 'e'}|·|{:else if p.key === 'inf'}‖·‖<sub>∞</sub>{:else}‖·‖<sub>1</sub>{/if}
      </p>
    </div>
  {/each}
</figure>

<style>
  .balls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
  .panel p { margin: 0.2rem 0 0; text-align: center; font-size: 0.9rem; color: var(--anim-muted); }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .ball { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-accent); stroke-width: 2; stroke-linejoin: round; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 16px; dominant-baseline: central; }
  .end { text-anchor: end; }
  .start { text-anchor: start; }
</style>
