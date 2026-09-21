<script>
  // A closed triangle K, a family of open disks whose union contains K, and a
  // finite subfamily V_1, ..., V_m of it whose union still contains K.
  import Canvas from '@toolkit/Canvas.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { mulberry32, subscript } from './random.js';

  let seed = $state(1);
  const TRI = [[0.2, 0.86], [1.42, 0.86], [1.0, 0.14]];
  const PERIOD = 7;

  // Grid points of the closed triangle. Every point of the triangle lies within
  // 0.0104 of a grid point, so a grid point lying more than MARGIN inside a disk
  // certifies every point of the triangle within 0.0104 of it.
  const STEPS = 60;
  const MARGIN = 0.011;
  const points = [];
  for (let a = 0; a <= STEPS; a++) {
    for (let b = 0; a + b <= STEPS; b++) {
      const c = STEPS - a - b;
      points.push([0, 1].map((k) => (a * TRI[0][k] + b * TRI[1][k] + c * TRI[2][k]) / STEPS));
    }
  }
  const inside = ([x, y], d) => Math.hypot(x - d.x, y - d.y) < d.r - MARGIN;

  const cover = $derived.by(() => {
    const rand = mulberry32(seed * 104729 + 7);
    const disks = [];
    for (let i = 0; i < 12; i++) disks.push({ x: 0.15 + rand() * 1.32, y: 0.12 + rand() * 0.78, r: 0.18 + rand() * 0.14 });
    for (const q of points) {
      if (!disks.some((d) => inside(q, d))) disks.push({ x: q[0] + (rand() - 0.5) * 0.08, y: q[1] + (rand() - 0.5) * 0.08, r: 0.2 + rand() * 0.08 });
    }
    // Greedy choice of a finite subfamily that still contains every grid point with margin MARGIN.
    let left = points.slice();
    const chosen = new Set();
    while (left.length) {
      let best = -1, bestCount = -1;
      disks.forEach((d, i) => {
        if (chosen.has(i)) return;
        const count = left.filter((q) => inside(q, d)).length;
        if (count > bestCount) { best = i; bestCount = count; }
      });
      chosen.add(best);
      left = left.filter((q) => !inside(q, disks[best]));
    }
    const box = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    for (const d of disks) {
      box.x0 = Math.min(box.x0, d.x - d.r); box.x1 = Math.max(box.x1, d.x + d.r);
      box.y0 = Math.min(box.y0, d.y - d.r); box.y1 = Math.max(box.y1, d.y + d.r);
    }
    return { disks, chosen, box };
  });

  function draw(ctx, t, { w, h, p }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60 || h < 60) return; // the canvas has not been laid out yet
    const { disks, chosen, box } = cover;
    const top = p.px * 2;
    const s = Math.min((w - 8) / (box.x1 - box.x0), (h - top - 4) / (box.y1 - box.y0));
    const ox = (w - (box.x1 - box.x0) * s) / 2 - box.x0 * s;
    const oy = top + (h - top - (box.y1 - box.y0) * s) / 2 - box.y0 * s;
    const X = (x) => ox + x * s;
    const Y = (y) => oy + y * s;
    const fade = Math.max(0, Math.min(1, ((t % PERIOD) - 2) / 1.2));

    ctx.beginPath();
    TRI.forEach(([x, y], k) => (k ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
    ctx.closePath();
    ctx.fillStyle = p.rule;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    disks.forEach((d, i) => {
      const picked = chosen.has(i);
      ctx.beginPath();
      ctx.arc(X(d.x), Y(d.y), d.r * s, 0, 2 * Math.PI);
      if (picked && fade > 0) { ctx.fillStyle = withAlpha(p.accent, 0.08 * fade); ctx.fill(); }
      ctx.strokeStyle = withAlpha(p.accent, picked ? 0.5 + 0.5 * fade : 0.5 - 0.4 * fade);
      ctx.lineWidth = picked ? 1 + 0.8 * fade : 1;
      ctx.stroke();
    });

    ctx.font = p.font;
    ctx.fillStyle = p.ink;
    ctx.textAlign = 'center';
    ctx.fillText('K', X((TRI[0][0] + TRI[1][0] + TRI[2][0]) / 3), Y((TRI[0][1] + TRI[1][1] + TRI[2][1]) / 3) + p.px * 0.35);
    ctx.textAlign = 'left';
    ctx.fillStyle = p.muted;
    ctx.fillText(fade > 0
      ? `a finite subfamily V₁, …, V${subscript(chosen.size)} whose union contains K`
      : 'open disks Uα whose union contains K', 4, p.px * 1.1);
  }
</script>

<Canvas {draw} ratio={1.6} narrowRatio={1.1} label="A closed triangle K covered by open disks, then a finite subfamily of the disks whose union still contains K" deps={[seed]}>
  {#snippet buttons()}<button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New family</button>{/snippet}
</Canvas>
