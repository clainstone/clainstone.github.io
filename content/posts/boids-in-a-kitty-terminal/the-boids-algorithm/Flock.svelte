<script>
  // Figure 4: four hundred birds flocking by the cbirds rules, with the panel's sliders; the pointer scatters them.
  //
  // The model lives in flock.js. This component owns the fixed timestep (whole
  // 1/60 s steps, at most three a drawn frame), the pointer and the drawing.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { createFlock, stepFlock, REACH } from './flock.js';

  const N = 400;
  const SEED = 11;
  const DT = 1 / 60;
  const MAX_STEPS = 3;
  const TAU = 2 * Math.PI;

  let separation = $state(4);
  let alignment = $state(4);
  let turning = $state(8);
  let perception = $state(36);

  let view;
  let wrap;
  let flock = null;
  let size = { w: 0, h: 0 };
  // Time owed to the model; starting half a step in keeps a steady 60 Hz
  // display from alternating between zero and two steps a frame.
  let owed = DT / 2;
  let pointer = null;

  function restart() {
    flock = null;
    view?.redraw();
  }

  function draw(ctx, t, { w, h, dt, p }) {
    if (!flock || w !== size.w || h !== size.h) {
      flock = createFlock(SEED, N, w, h);
      size = { w, h };
      owed = DT / 2;
    }
    owed += dt;
    const params = { separation, alignment, turning, perception };
    let steps = 0;
    while (owed >= DT && steps < MAX_STEPS) {
      stepFlock(flock, params, pointer, w, h);
      owed -= DT;
      steps++;
    }
    if (owed >= DT) owed = DT / 2; // a long frame: drop the steps beyond three

    ctx.clearRect(0, 0, w, h);
    // The inner edges of the four bands.
    ctx.strokeStyle = withAlpha(p.rule, 0.7);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const x of [w / 3, (2 * w) / 3]) {
      const sx = Math.round(x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
    }
    for (const y of [h / 3, (5 * h) / 6]) {
      const sy = Math.round(y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
    }
    ctx.stroke();

    // Each bird a triangle 8 px long and 5 px wide, shaded by its heading
    // folded at the half turn (cbirds shade_for).
    const { n, x, y, h: heading } = flock;
    for (let i = 0; i < n; i++) {
      const a = heading[i];
      const turns = a / TAU;
      const folded = turns < 0.5 ? 2 * turns : 2 * (1 - turns);
      const c = Math.cos(a), s = Math.sin(a);
      ctx.fillStyle = withAlpha(p.ink, 0.35 + 0.65 * folded);
      ctx.beginPath();
      ctx.moveTo(x[i] + 4 * c, y[i] + 4 * s);
      ctx.lineTo(x[i] - 4 * c - 2.5 * s, y[i] - 4 * s + 2.5 * c);
      ctx.lineTo(x[i] - 4 * c + 2.5 * s, y[i] - 4 * s - 2.5 * c);
      ctx.closePath();
      ctx.fill();
    }

    if (pointer) {
      ctx.strokeStyle = withAlpha(p.rule, 0.8);
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, REACH, 0, TAU);
      ctx.stroke();
    }
  }

  // The pointer in canvas pixels, or null when it is outside the canvas.
  function onpointermove(e) {
    const rect = wrap.querySelector('canvas').getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    pointer = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height ? { x: px, y: py } : null;
    if (!view?.isPlaying()) view?.redraw();
  }

  function onpointerleave() {
    pointer = null;
    if (!view?.isPlaying()) view?.redraw();
  }

  const weight = (lo, span, digits) => (k) => (lo + (span * k) / 12).toFixed(digits);
</script>

<!-- The pointer is an extra that only scatters the birds; the figure works without it. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={wrap} {onpointermove} {onpointerleave}>
  <Canvas
    bind:this={view}
    {draw}
    ratio={2}
    label="Four hundred birds flocking by the cbirds rules; the sliders set separation, alignment, the turn limit and the perception radius; the pointer scatters them."
    deps={[separation, alignment, turning, perception]}
  >
    {#snippet buttons()}
      <button type="button" class="anim-toggle" onclick={restart}>Restart</button>
    {/snippet}
    <Slider label="separation" min={0} max={12} step={1} bind:value={separation} format={weight(0.001, 0.012, 3)} />
    <Slider label="alignment" min={0} max={12} step={1} bind:value={alignment} format={weight(0.1, 4.2, 2)} />
    <Slider label="turning" min={0} max={12} step={1} bind:value={turning} format={(k) => (k >= 12 ? 'instant' : 30 + 5 * k + '°')} />
    <Slider label="perception" min={12} max={60} step={4} bind:value={perception} format={(v) => v + ' px'} />
  </Canvas>
</div>
