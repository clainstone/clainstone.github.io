<script>
  // One warp of 32 threads, each loading one 4-byte word, over memory drawn
  // as 128-byte segments. Every segment the request touches is one
  // transaction, so the stride sets the cost while the bytes used stay 128.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  const STRIDES = [1, 2, 4, 8, 16, 32];
  const SEGS = 32, WORDS = SEGS * 32;
  const SLOT = 2.8;
  const words_ = (n) => `${n} word${n === 1 ? '' : 's'}`;

  let k = $state(0);
  let offset = $state(0);
  let canvas;
  let clock = 0, live = false;

  const stride = $derived(STRIDES[k]);
  const words = $derived(Array.from({ length: 32 }, (_, i) => i * stride + offset));
  const segs = $derived([...new Set(words.map((a) => Math.floor(a / 32)))]);

  function text(ctx, s, x, y, align, color) {
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y);
  }

  function draw(ctx, t, { w, h, dt, p }) {
    // While playing the stride cycles, and the transactions light up one after another.
    if (dt > 0) { live = true; clock += dt; if (clock >= SLOT) { clock = 0; k = (k + 1) % STRIDES.length; } }
    const lit = live ? Math.floor(Math.max(0, clock - 0.5) / 0.05) : SEGS;
    const issued = new Set(segs.slice(0, lit));
    ctx.clearRect(0, 0, w, h);
    ctx.font = p.font;
    ctx.lineWidth = 1;
    const x0 = w * 0.04, W = w * 0.92, ts = W / 32, tq = Math.max(4, Math.min(ts * 0.7, h * 0.08));
    const ty = h * 0.17, my = h * 0.62, mh = h * 0.13, sw = W / SEGS, ww = W / WORDS;
    text(ctx, '32 threads, one 4-byte word each', x0, ty - 7, 'left', p.muted);
    text(ctx, `stride ${stride}, offset ${offset}`, x0 + W, ty - 7, 'right', p.accent);
    for (let i = 0; i < 32; i++) {
      ctx.strokeStyle = issued.has(Math.floor(words[i] / 32)) ? withAlpha(p.accent, 0.55) : p.rule;
      ctx.beginPath(); ctx.moveTo(x0 + (i + 0.5) * ts, ty + tq); ctx.lineTo(x0 + (words[i] + 0.5) * ww, my); ctx.stroke();
    }
    ctx.strokeStyle = p.ink;
    for (let i = 0; i < 32; i++) ctx.strokeRect(x0 + (i + 0.5) * ts - tq / 2 + 0.5, ty + 0.5, tq - 1, tq - 1);
    for (let s = 0; s < SEGS; s++) {
      const x = x0 + s * sw;
      if (issued.has(s)) { ctx.fillStyle = withAlpha(p.accent, 0.18); ctx.fillRect(x, my, sw, mh); }
      ctx.strokeStyle = segs.includes(s) ? p.ink : p.rule;
      ctx.strokeRect(x + 0.5, my + 0.5, sw - 1, mh - 1);
    }
    ctx.fillStyle = p.accent;
    for (const a of words) if (issued.has(Math.floor(a / 32))) ctx.fillRect(x0 + a * ww, my + 2, Math.max(1.5, ww), mh - 4);
    text(ctx, 'memory in 128-byte segments', x0, my + mh + p.px + 3, 'left', p.muted);
    text(ctx, '4 KB', x0 + W, my + mh + p.px + 3, 'right', p.muted);
    const c = Math.min(lit, segs.length);
    text(ctx, `${c} transaction${c === 1 ? '' : 's'}, ${c * 128} bytes moved for 128 bytes used`, x0, h - 7, 'left', p.accent);
  }

  function dragged() { live = false; clock = 0; canvas?.pause(); }
</script>

<Canvas bind:this={canvas} {draw} ratio={2} label="Thirty-two threads reaching into memory segments; the segments touched are filled and counted as transactions" deps={[k, offset]}>
  <Slider label="stride" min={0} max={5} step={1} bind:value={k} format={(v) => words_(STRIDES[v])} oninput={dragged} />
  <Slider label="offset" min={0} max={31} step={1} bind:value={offset} format={words_} oninput={dragged} />
</Canvas>
