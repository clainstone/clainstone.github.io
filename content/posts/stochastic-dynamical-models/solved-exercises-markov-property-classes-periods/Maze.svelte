<script>
  // Exercise 2: the maze of the exercise, six rooms with a door between any
  // two neighbouring rooms, and, dashed, the two routes of 3 steps from room 1
  // to room 6 of Solution 2.
  const S = 90, X = 150, Y = 20;
  // Room k at column c, row r of the drawing.
  const ROOMS = { 1: [1, 0], 2: [0, 1], 3: [1, 1], 4: [2, 1], 5: [1, 2], 6: [2, 2] };
  const centre = (k) => [X + ROOMS[k][0] * S + S / 2, Y + ROOMS[k][1] * S + S / 2];
  const routes = [[1, 3, 4, 6], [1, 3, 5, 6]];
  const offset = [-7, 7];
</script>

<figure class="anim maze">
  <svg viewBox="0 0 480 310" role="img" aria-label="Six rooms: 1 above 3, 2 to the left of 3, 4 to the right of 3, 5 below 3, 6 to the right of 5 and below 4; two dashed routes go from 1 through 3 and 4 or 5 to 6">
    {#each Object.entries(ROOMS) as [k, [c, r]]}
      <rect class="room" x={X + c * S} y={Y + r * S} width={S} height={S} />
      <text class="name" x={X + c * S + 16} y={Y + r * S + 18}>{k}</text>
    {/each}
    {#each routes as route, n}
      <polyline class="route" class:second={n === 1} points={route.map((k) => centre(k).map((v) => v + offset[n]).join(',')).join(' ')} />
    {/each}
  </svg>
</figure>

<style>
  .maze { margin: 1.5rem auto; max-width: 25rem; }
  svg { font-family: var(--anim-font); }
  .room { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  .route { fill: none; stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 6 4; stroke-linejoin: round; }
  .route.second { stroke: var(--anim-muted); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
</style>
