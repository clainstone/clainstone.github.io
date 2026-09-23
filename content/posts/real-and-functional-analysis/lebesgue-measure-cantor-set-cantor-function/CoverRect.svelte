<script>
  // Remark 2 (ii), an instance with N = 2: a rectangle and four rectangles of
  // F whose union contains it, placed as in the drawing of the lecture.
  const R = { x: 82, y: 68, w: 312, h: 127 };
  const cover = [
    { x: 65, y: 39, w: 178, h: 110 },
    { x: 220, y: 29, w: 226, h: 87 },
    { x: 22, y: 122, w: 155, h: 103 },
    { x: 135, y: 96, w: 323, h: 150 },
  ];
</script>

<figure class="anim cover-rect">
  <svg viewBox="0 0 480 270" role="img" aria-label="A rectangle of the plane covered by four overlapping rectangles">
    {#each cover as c}
      <rect class="cover" x={c.x} y={c.y} width={c.w} height={c.h} />
    {/each}
    <rect class="rect" x={R.x} y={R.y} width={R.w} height={R.h} />
  </svg>
</figure>

<style>
  .cover-rect { margin: 1.5rem auto; max-width: 25rem; }
  .cover { fill: var(--anim-muted); fill-opacity: 0.07; stroke: var(--anim-muted); stroke-width: 1.4; }
  .rect { fill: var(--anim-accent); fill-opacity: 0.16; stroke: var(--anim-accent); stroke-width: 2.2; }
</style>
