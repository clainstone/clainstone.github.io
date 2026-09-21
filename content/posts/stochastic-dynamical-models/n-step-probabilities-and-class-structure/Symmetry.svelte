<script>
  // Example 2.2: the random walk on the complete graph K4, each line a jump in
  // either direction with probability 1/3, and p11^(n) = 1/4 + (3/4)(-1/3)^n
  // for n = 0, ..., 10 with the level 1/4.
  const V = [[70, 50], [250, 50], [250, 230], [70, 230]];
  const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const f = (n) => 0.25 + 0.75 * (-1 / 3) ** n;
  const X = (n) => 380 + n * 34;
  const Y = (v) => 250 - v * 210;
</script>

<figure class="anim symmetry">
  <svg viewBox="0 0 760 290" role="img" aria-label="Left: four states, every pair joined by a line. Right: the values of p11 after n steps for n from 0 to 10, alternating around 1/4 and approaching it">
    {#each pairs as [a, b]}
      <line class="edge" x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} />
    {/each}
    {#each V as [x, y], i}
      <circle class="node" cx={x} cy={y} r="16" />
      <text class="name" {x} {y}>{i + 1}</text>
    {/each}
    <line class="axis" x1="380" y1={Y(0)} x2={X(10)} y2={Y(0)} />
    <line class="axis" x1="380" y1={Y(0)} x2="380" y2={Y(1)} />
    {#each [[0, '0'], [0.25, '1/4'], [1, '1']] as [v, t]}
      <text class="tick" x="370" y={Y(v)}>{t}</text>
    {/each}
    <line class="level" x1="380" y1={Y(0.25)} x2={X(10)} y2={Y(0.25)} />
    {#each Array.from({ length: 11 }, (_, n) => n) as n}
      <circle class="pt" cx={X(n)} cy={Y(f(n))} r="3.5" />
      <text class="n" x={X(n)} y={Y(0) + 18}>{n}</text>
    {/each}
    <text class="axis-label" x={X(10)} y={Y(0) + 38}>n</text>
  </svg>
</figure>

<style>
  .symmetry { margin: 1.5rem auto; }
  svg { font-family: var(--anim-font); }
  .edge { stroke: var(--anim-muted); stroke-width: 1.5; }
  .node { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.5; }
  .name { fill: var(--anim-ink); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .level { stroke: var(--anim-muted); stroke-width: 1.2; }
  .pt { fill: var(--anim-accent); }
  .tick, .n, .axis-label { fill: var(--anim-muted); font-size: 14px; dominant-baseline: central; }
  .tick { text-anchor: end; }
  .n, .axis-label { text-anchor: middle; }
  .axis-label { font-style: italic; }
</style>
