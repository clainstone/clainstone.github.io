<script>
  // Compose k random layers of width 4, each a piecewise-linear map of
  // [-1,1] into itself, and count the linear pieces of the result: depth
  // multiplies the count where width only adds to it.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  const WIDTH = 4, MAXK = 6;

  let k = $state(3);
  let seed = $state(1);
  let canvas;
  let clock = 0;

  const rng = (s) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;

  // One layer: WIDTH ReLU units with their kinks inside (-1,1), rescaled so that [-1,1] maps onto [-1,1].
  function layer(r) {
    const units = Array.from({ length: WIDTH }, () => {
      const a = (r() < 0.5 ? -1 : 1) * (1 + 2 * r()), knot = 2 * r() - 1;
      return { a, b: -a * knot, c: (r() < 0.5 ? -1 : 1) * (0.5 + r()), knot };
    });
    const raw = (x) => units.reduce((s, u) => s + u.c * Math.max(0, u.a * x + u.b), 0);
    const v = [-1, 1, ...units.map((u) => u.knot)].map(raw);
    const lo = Math.min(...v), hi = Math.max(...v), scale = hi > lo ? 2 / (hi - lo) : 1;
    return { f: (x) => (raw(x) - lo) * scale - 1, knots: units.map((u) => u.knot) };
  }

  // The compositions of depth 1 to MAXK. Each new layer adds a kink wherever
  // the previous function crosses one of its knot levels, so the endpoints of
  // the linear pieces are known exactly and the function is drawn through them.
  function compose(seed) {
    const r = rng(seed * 7919 + 17), out = [];
    let f = (x) => x, xs = [-1, 1];
    for (let i = 0; i < MAXK; i++) {
      const L = layer(r), prev = f, ys = xs.map(prev), found = [];
      for (const lv of L.knots) {
        for (let j = 0; j + 1 < xs.length; j++) {
          if ((ys[j] - lv) * (ys[j + 1] - lv) < 0) found.push(xs[j] + ((lv - ys[j]) / (ys[j + 1] - ys[j])) * (xs[j + 1] - xs[j]));
        }
      }
      xs = [...new Set([...xs, ...found])].sort((a, b) => a - b);
      f = (x) => L.f(prev(x));
      out.push({ pts: xs.map((x) => [x, f(x)]) });
    }
    return out;
  }
  const models = $derived(compose(seed));

  function text(ctx, s, x, y, align, color) {
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y);
  }

  function draw(ctx, t, { w, h, dt, p }) {
    if (dt > 0) { clock += dt; if (clock >= 1.8) { clock = 0; k = (k % MAXK) + 1; } }
    ctx.clearRect(0, 0, w, h);
    ctx.font = p.font;
    ctx.lineWidth = 1;
    const pad = { l: 30, r: 12, t: 30, b: 26 };
    const X = (x) => pad.l + ((x + 1) / 2) * (w - pad.l - pad.r);
    const Y = (y) => pad.t + ((1 - y) / 2) * (h - pad.t - pad.b);
    ctx.strokeStyle = p.rule;
    ctx.strokeRect(X(-1) + 0.5, Y(1) + 0.5, X(1) - X(-1) - 1, Y(-1) - Y(1) - 1);
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(X(-1), Y(0)); ctx.lineTo(X(1), Y(0)); ctx.moveTo(X(0), Y(-1)); ctx.lineTo(X(0), Y(1)); ctx.stroke();
    ctx.setLineDash([]);
    for (const [v, s] of [[-1, '−1'], [0, '0'], [1, '1']]) { text(ctx, s, X(v), h - 8, 'center', p.muted); text(ctx, s, pad.l - 6, Y(v) + 4, 'right', p.muted); }
    const plot = (m, style, width) => {
      ctx.strokeStyle = style; ctx.lineWidth = width; ctx.beginPath();
      m.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
      ctx.stroke();
    };
    // The shallower compositions stay as muted traces under the current one.
    for (let i = 0; i < k - 1; i++) plot(models[i], withAlpha(p.muted, 0.35), 1);
    const m = models[k - 1];
    plot(m, p.accent, 2);
    ctx.lineWidth = 1;
    if (m.pts.length <= 160) {
      ctx.fillStyle = p.ink;
      for (const [x, y] of m.pts.slice(1, -1)) { ctx.beginPath(); ctx.arc(X(x), Y(y), 2, 0, 7); ctx.fill(); }
    }
    const pieces = m.pts.length - 1;
    text(ctx, `depth ${k}: ${pieces} linear piece${pieces === 1 ? '' : 's'}`, pad.l, p.px + 2, 'left', p.accent);
    text(ctx, `width ${WIDTH}, at most ${(WIDTH + 1) ** k}`, w - pad.r, p.px + 2, 'right', p.muted);
  }
</script>

<Canvas bind:this={canvas} {draw} ratio={2} label="A random piecewise-linear function of depth k on the interval from minus one to one, its linear pieces counted" deps={[k, seed]}>
  {#snippet buttons()}<button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New weights</button>{/snippet}
  <Slider label="depth" min={1} max={MAXK} step={1} bind:value={k} oninput={() => canvas?.pause()} />
</Canvas>
