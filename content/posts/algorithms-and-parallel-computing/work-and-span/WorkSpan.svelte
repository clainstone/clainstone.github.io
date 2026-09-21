<script>
  // The tree sum as a task graph, run by a greedy scheduler on p workers:
  // 32 leaves, or 16 under 500 px so that the circles have space. Drawn with
  // p5 in instance mode; the p5 loop runs only while the sketch is on screen
  // and playing. Colours and type come from the page palette.
  import { onMount } from 'svelte';
  import p5 from 'p5/core';
  import shape from 'p5/shape';
  import color from 'p5/color';
  import math from 'p5/math';
  import Slider from '@toolkit/Slider.svelte';
  import { palette, withAlpha, NARROW } from '@toolkit/loop.js';
  import { buildGraph, schedule } from './schedule.js';

  const STEP = 600;
  let p = $state(4);
  let playing = $state(false);
  let host;
  let ctl = { toggle() {}, restart() {} };

  onMount(() => {
    shape(p5); color(p5); math(p5);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia(NARROW);
    let graph = buildGraph(narrow.matches ? 16 : 32);
    let pal = palette(host);
    let plan = schedule(graph, p);
    let time = 0, acc = 0;
    let wanted = !reduced, visible = false, ready = false;
    let sketch;
    const sync = () => {
      if (!ready) return;
      const should = wanted && visible && time < plan.makespan;
      if (should && !playing) { playing = true; acc = 0; sketch.loop(); }
      else if (!should && playing) { playing = false; sketch.noLoop(); }
    };
    const restart = () => {
      plan = schedule(graph, p);
      time = acc = 0;
      if (ready) { sketch.redraw(); sync(); }
    };
    const onNarrow = () => { graph = buildGraph(narrow.matches ? 16 : 32); restart(); };
    narrow.addEventListener('change', onNarrow);
    ctl = {
      restart,
      toggle() {
        if (time >= plan.makespan) { wanted = true; restart(); }
        else { wanted = !wanted; sync(); }
      },
    };
    // Text goes through the 2D context p5 draws on, which keeps the text add-on
    // and its font parser out of the bundle. Parts alternate: normal, subscript.
    const font = (i) => `${i % 2 ? Math.round(pal.px * 0.75) : pal.px}px ${pal.fontFamily}`;
    function label(s, x, y, parts, col, align = 'left') {
      const c = s.drawingContext;
      c.save();
      c.fillStyle = col;
      c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      const widths = parts.map((part, i) => { c.font = font(i); return c.measureText(part).width; });
      if (align === 'right') x -= widths.reduce((a, b) => a + b, 0);
      parts.forEach((part, i) => { c.font = font(i); c.fillText(part, x, y + (i % 2 ? 3 : 0)); x += widths[i]; });
      c.restore();
      return x;
    }

    function render(s, frac) {
      const { width: w, height: h } = s, tasks = graph.tasks, leaves = tasks.filter((t) => !t.level).length;
      const running = time < plan.makespan;
      const done = (t) => withAlpha(pal.muted, t.level ? 0.6 : 0.35);
      s.clear();
      // The graph: leaves at the bottom, the root at the top; a dot marks the end of a dependency.
      const gTop = 14, gBot = h * 0.55 - 24;
      const r = Math.min(9, Math.round((0.36 * (w - 24)) / leaves));
      const px = (t) => 12 + t.x * (w - 24);
      const py = (t) => gBot - (t.level / (graph.levels - 1)) * (gBot - gTop);
      for (const t of tasks) for (const d of t.deps) {
        const a = tasks[d];
        const L = Math.hypot(px(t) - px(a), py(t) - py(a));
        const ux = (px(t) - px(a)) / L;
        const uy = (py(t) - py(a)) / L;
        s.stroke(pal.rule); s.strokeWeight(1);
        s.line(px(a) + ux * r, py(a) + uy * r, px(t) - ux * r, py(t) - uy * r);
        s.noStroke(); s.fill(pal.muted);
        s.circle(px(t) - ux * (r + 3), py(t) - uy * (r + 3), 3);
      }
      for (const t of tasks) {
        const st = plan.start[t.id];
        if (st < time) { s.noStroke(); s.fill(done(t)); }
        else if (st === time && running) { s.noStroke(); s.fill(pal.accent); }
        else { s.noFill(); s.stroke(pal.muted); s.strokeWeight(1); }
        s.circle(px(t), py(t), 2 * r);
      }
      // The numbers.
      const hy = h * 0.55 + 8;
      const bound = graph.work / p + graph.span;
      let x = label(s, 12, hy, [`p = ${p}`], pal.accent);
      x = label(s, x + 14, hy, ['T', '1', ` = ${graph.work}   T`, '∞', ` = ${graph.span}   `], pal.muted);
      label(s, x, hy, running ? [`t = ${time}`] : ['T', 'p', ` = ${plan.makespan}`], running ? pal.muted : pal.accent);
      label(s, w - 12, hy, ['T', '1', ' / p + T', '∞', ` = ${bound.toFixed(2)}`], pal.muted, 'right');
      // The timeline: a row per worker, a cell per unit of time, the bound dashed, the clock in the accent.
      const cols = Math.max(plan.makespan, Math.ceil(bound)), tx = 30, ty = hy + 12;
      const cw = (w - tx - 12) / cols, rh = Math.min(24, (h - 8 - ty) / p);
      for (let i = 0; i < p; i++) label(s, tx - 8, ty + (i + 0.5) * rh + 4, [String(i + 1)], pal.muted, 'right');
      s.noStroke();
      for (const sl of plan.slots) {
        const x0 = tx + sl.start * cw + 1;
        const y0 = ty + sl.worker * rh + 1;
        if (sl.start < time) { s.fill(done(tasks[sl.id])); s.rect(x0, y0, cw - 2, rh - 2); }
        else if (sl.start === time && running) { s.fill(pal.accent); s.rect(x0, y0, (cw - 2) * frac, rh - 2); }
      }
      s.noFill(); s.stroke(pal.rule); s.strokeWeight(1);
      s.rect(tx, ty, cols * cw, p * rh);
      s.stroke(pal.muted);
      s.drawingContext.setLineDash([4, 4]);
      s.line(tx + bound * cw, ty - 4, tx + bound * cw, ty + p * rh + 4);
      s.drawingContext.setLineDash([]);
      const now = tx + (time + (running ? frac : 0)) * cw;
      s.stroke(pal.accent); s.strokeWeight(1.5);
      s.line(now, ty - 4, now, ty + p * rh + 4);
    }

    sketch = new p5((s) => {
      // p5's resizeCanvas calls this accessibility hook without a guard; the
      // add-on that defines it is not loaded, so give it the answer it expects.
      s._addAccsOutput = () => false;
      s.setup = () => {
        s.createCanvas(host.clientWidth, host.clientHeight);
        s.pixelDensity(window.devicePixelRatio || 1);
        s.noLoop();
        ready = true;
        sync();
      };
      s.draw = () => {
        if (playing) {
          acc += Math.min(s.deltaTime, 100);
          while (acc >= STEP && time < plan.makespan) { acc -= STEP; time++; }
          if (time >= plan.makespan) sync();
        }
        render(s, playing ? Math.min(1, acc / STEP) : 0);
      };
    }, host);
    const ro = new ResizeObserver(() => {
      if (!ready || host.clientWidth === 0) return;
      pal = palette(host);
      sketch.resizeCanvas(host.clientWidth, host.clientHeight, true);
      sketch.redraw();
    });
    ro.observe(host);
    // Starts within the island's own mount margin, as soon as it is hydrated near the fold.
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05, rootMargin: '240px' });
    io.observe(host);
    return () => {
      wanted = false;
      sync();
      narrow.removeEventListener('change', onNarrow);
      ro.disconnect();
      io.disconnect();
      sketch.remove();
    };
  });

  $effect(() => { p; ctl.restart(); });
</script>

<div class="anim">
  <div class="box" bind:this={host} role="img" aria-label="The task graph of a tree sum scheduled on p workers, with its timeline"></div>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => ctl.toggle()} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
    <button type="button" class="anim-toggle" onclick={() => ctl.restart()}>Restart</button>
    <div class="anim-sliders"><Slider label="p" min={1} max={8} step={1} bind:value={p} /></div>
  </div>
</div>

<style>
  .box { position: relative; width: 100%; aspect-ratio: 2 / 1; overflow: hidden; }
  @media (max-width: 500px) { .box { aspect-ratio: 1 / 1; } }
  .box :global(canvas) { display: block; }
</style>
