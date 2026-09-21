<script>
  // Cantor's set U = { x : x ∉ f(x) } for X = {1, ..., 6}. Row x is the
  // indicator function of f(x). The row U flips the diagonal, and the
  // highlight walks y through X: U and f(y) differ at the element y.
  import Canvas from '@toolkit/Canvas.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { mulberry32 } from './random.js';

  const N = 6;
  const PERIOD = 1.6;
  let seed = $state(1);

  // Draw rows until the diagonal holds both values, so that U is not trivial.
  const rows = $derived.by(() => {
    const rand = mulberry32(seed * 7919 + 11);
    for (;;) {
      const r = Array.from({ length: N }, () => Array.from({ length: N }, () => (rand() < 0.5 ? 1 : 0)));
      const ones = r.reduce((n, row, i) => n + row[i], 0);
      if (ones > 1 && ones < N - 1) return r;
    }
  });
  const U = $derived(rows.map((row, i) => 1 - row[i]));

  function draw(ctx, t, { w, h, p, narrow }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60 || h < 60) return; // the canvas has not been laid out yet
    const y = (Math.floor(t / PERIOD) % (N + 1)) - 1; // -1: overview, then y = 0..N-1
    const labelW = narrow ? 40 : 56;
    const top = p.px * 2.2;
    const bottom = p.px * 2.6;
    const cell = Math.min(44, (w - labelW - 12) / N, (h - top - bottom) / (N + 1.5));
    const gx = labelW + (w - labelW - cell * N) / 2;
    const rowY = (i) => top + (i < N ? i : N + 0.5) * cell;

    ctx.font = p.font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = p.muted;
    for (let j = 0; j < N; j++) ctx.fillText(String(j + 1), gx + (j + 0.5) * cell, top - p.px * 0.9);

    const cellBox = (i, j, fill, stroke, width) => {
      const x = gx + j * cell;
      const yy = rowY(i);
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, yy, cell, cell); }
      ctx.strokeStyle = stroke; ctx.lineWidth = width;
      ctx.strokeRect(x + width / 2, yy + width / 2, cell - width, cell - width);
    };

    for (let i = 0; i <= N; i++) {
      const values = i < N ? rows[i] : U;
      const active = y >= 0 && (i === y || i === N);
      ctx.textAlign = 'right';
      ctx.fillStyle = i === y || (i === N && y >= 0) ? p.accent : p.muted;
      ctx.fillText(i < N ? `f(${i + 1})` : 'U', gx - 8, rowY(i) + cell / 2);
      for (let j = 0; j < N; j++) {
        const diagonal = i < N && i === j;
        let fill = diagonal ? withAlpha(p.accent, 0.1) : null;
        if (active && i === y && y >= 0) fill = withAlpha(p.accent, diagonal ? 0.2 : 0.06);
        cellBox(i, j, fill, p.rule, 1);
        ctx.textAlign = 'center';
        ctx.fillStyle = values[j] ? p.ink : p.muted;
        ctx.fillText(String(values[j]), gx + (j + 0.5) * cell, rowY(i) + cell / 2);
      }
    }
    if (y >= 0) {
      cellBox(y, y, null, p.accent, 2);
      cellBox(N, y, null, p.accent, 2);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = p.muted;
    const note = y < 0
      ? 'x ∈ U exactly when x ∉ f(x)'
      : `${y + 1} ${rows[y][y] ? '∈' : '∉'} f(${y + 1}) and ${y + 1} ${U[y] ? '∈' : '∉'} U, so U ≠ f(${y + 1})`;
    ctx.fillText(note, Math.max(4, gx - labelW), h - p.px * 0.8);
  }
</script>

<Canvas {draw} ratio={1.5} narrowRatio={0.95} label="A function f from a six-element set to its power set, drawn as rows of indicator functions, and the set U that differs from every row on the diagonal" deps={[seed]}>
  {#snippet buttons()}<button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New f</button>{/snippet}
</Canvas>
