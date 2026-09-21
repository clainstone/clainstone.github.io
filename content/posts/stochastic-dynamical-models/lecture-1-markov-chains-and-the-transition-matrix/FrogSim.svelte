<script>
  // The simulation rule run on the frog chain: at each step a uniform U is
  // drawn, the row of the current state splits [0, 1) into intervals, and the
  // interval containing U gives the next state.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { P, W, H, R, LR, NODES, EDGES, LOOPS, edgeGeometry, loopGeometry, mulberry32, nextState, subscript } from './frog.js';

  const STEP = 1.6; // seconds per jump
  const RUN = 24; // jumps before the path starts again with fresh uniforms
  const TICK = { 0: '0', 0.25: '¼', 0.5: '½', 0.75: '¾', 1: '1' };
  let start = $state(4);
  let seed = $state(1);

  // X[0..RUN] and U[1..RUN] of one run, from the seeded uniforms.
  function path(i, s) {
    const rand = mulberry32(s * 7919 + i);
    const X = [i - 1];
    const U = [null];
    for (let n = 1; n <= RUN; n++) { U.push(rand()); X.push(nextState(X[n - 1], U[n])); }
    return { X, U };
  }
  let cache = { key: '', value: null };
  function run(r) {
    const key = `${start}/${seed}/${r}`;
    if (cache.key !== key) cache = { key, value: path(start, seed * 1000 + r) };
    return cache.value;
  }

  function draw(ctx, t, { w, h, p, narrow }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60) return;
    // The first frame of the loop can carry a slightly negative time.
    const time = Math.max(0, t);
    const k = Math.floor(time / STEP);
    const f = time / STEP - k;
    const { X, U } = run(Math.floor(k / RUN));
    const n = k % RUN;
    const from = X[n];
    const to = X[n + 1];

    // The graph in the upper part.
    const s = Math.min((w - 8) / W, (h - p.px * 7) / H);
    const ox = (w - W * s) / 2;
    const oy = 2;
    const at = (x, y) => [ox + x * s, oy + y * s];
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = withAlpha(p.muted, 0.7);
    ctx.fillStyle = withAlpha(p.muted, 0.7);
    for (const e of EDGES) {
      const g = edgeGeometry(e);
      const [ax, ay] = at(g.ax, g.ay);
      const [bx, by] = at(g.bx, g.by);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      const [mx, my] = at(g.mx + g.ux * 5, g.my + g.uy * 5);
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - g.ux * 8 + g.uy * 4, my - g.uy * 8 - g.ux * 4);
      ctx.lineTo(mx - g.ux * 8 - g.uy * 4, my - g.uy * 8 + g.ux * 4);
      ctx.fill();
    }
    for (const l of LOOPS) {
      const g = loopGeometry(l);
      const [cx, cy] = at(g.cx, g.cy);
      ctx.beginPath(); ctx.arc(cx, cy, LR * s, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.font = p.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    NODES.forEach(([x, y], i) => {
      const [cx, cy] = at(x, y);
      ctx.beginPath(); ctx.arc(cx, cy, R * s, 0, 2 * Math.PI);
      if (i === from) { ctx.fillStyle = withAlpha(p.accent, 0.15); ctx.fill(); }
      ctx.strokeStyle = i === from ? p.accent : p.ink;
      ctx.lineWidth = i === from ? 2 : 1.2;
      ctx.stroke();
      ctx.fillStyle = p.ink;
      ctx.fillText(String(i + 1), cx, cy + 1);
    });

    // The frog moves during the second half of the step.
    const m = Math.max(0, Math.min(1, (f - 0.5) / 0.35));
    let fx, fy;
    if (from === to) {
      const l = LOOPS.find((q) => q.i === from);
      const g = loopGeometry(l);
      const a0 = l.a + Math.PI;
      [fx, fy] = at(g.cx + Math.cos(a0 + 2 * Math.PI * m) * LR, g.cy + Math.sin(a0 + 2 * Math.PI * m) * LR);
    } else {
      const [x1, y1] = NODES[from];
      const [x2, y2] = NODES[to];
      [fx, fy] = at(x1 + (x2 - x1) * m, y1 + (y2 - y1) * m);
    }
    if (m > 0 && m < 1) { ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(fx, fy, 5, 0, 2 * Math.PI); ctx.fill(); }

    // The interval [0, 1) split by row X_n, and the uniform U_{n+1}.
    const bx0 = 12, bx1 = w - 12;
    const by = oy + H * s + p.px * 2;
    const bh = Math.max(16, p.px * 1.5);
    const X_ = (u) => bx0 + (bx1 - bx0) * u;
    let c = 0;
    ctx.font = p.font;
    P[from].forEach((v, j) => {
      if (v === 0) return;
      ctx.fillStyle = withAlpha(p.accent, j === to && f > 0.3 ? 0.35 : 0.1);
      ctx.fillRect(X_(c) + 1, by, X_(c + v) - X_(c) - 2, bh);
      ctx.fillStyle = p.ink;
      ctx.fillText(`J = ${j + 1}`, (X_(c) + X_(c + v)) / 2, by + bh / 2);
      ctx.fillStyle = p.muted;
      ctx.fillText(TICK[c] ?? c.toFixed(2), X_(c), by + bh + p.px * 0.9);
      c += v;
    });
    ctx.fillText(TICK[1], X_(1), by + bh + p.px * 0.9);
    const u = U[n + 1];
    if (f > 0.15) {
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X_(u), by - 6); ctx.lineTo(X_(u), by + bh + 2); ctx.stroke();
      ctx.fillStyle = p.accent;
      ctx.textAlign = u > 0.8 ? 'right' : u < 0.2 ? 'left' : 'center';
      ctx.fillText(`U${subscript(n + 1)} = ${u.toFixed(3)}`, X_(u), by - p.px * 0.9);
    }
    ctx.textAlign = 'left';
    ctx.font = p.font;
    ctx.fillStyle = p.muted;
    const line = `n = ${n},  X${subscript(n)} = ${from + 1}` + (f > 0.3 ? `,  X${subscript(n + 1)} = F(${from + 1}, U${subscript(n + 1)}) = ${to + 1}` : '');
    ctx.fillText(line, 12, by + bh + p.px * 2.6);
  }
</script>

<Canvas {draw} ratio={1.4} narrowRatio={1.05} label="The frog chain simulated with uniform random numbers: the row of the current state splits the unit interval, and the interval containing U gives the next state" deps={[start, seed]}>
  {#snippet buttons()}<button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New sample</button>{/snippet}
  <Slider label="X₀" min={1} max={7} step={1} bind:value={start} />
</Canvas>
