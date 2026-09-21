<script>
  // Two thousand boids drawn as one three.js Points object over a 2D box.
  // The rules live in boids.js. This component owns the canvas, the renderer
  // and the loop, and it pauses while the box is out of view. The points take
  // the page's accent and the frame its rule colour, read from the palette.
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import Slider from '@toolkit/Slider.svelte';
  import { palette } from '@toolkit/loop.js';
  import { createFlock, step } from './boids.js';

  const N = 2000;
  const W = 320;
  const H = 180;
  let separation = $state(1.5);
  let alignment = $state(1);
  let cohesion = $state(1);
  let playing = $state(false);
  let failed = $state(false);
  let root;
  let box;
  let canvas;
  let toggle = () => {};

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      failed = true;
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, W, H, 0, -1, 1);
    const flock = createFlock(N, W, H);
    const positions = new Float32Array(N * 3);
    const attribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', attribute);
    // At three quarters opacity the accent reads as a lighter tint of itself.
    const material = new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, transparent: true, opacity: 0.75 });
    scene.add(new THREE.Points(geometry, material));
    // The palette, on mount and again at every resize.
    const paint = () => {
      const p = palette(root);
      material.color.set(p.accent);
      box.style.borderColor = p.rule;
    };

    const render = () => {
      for (let i = 0; i < N; i++) {
        positions[3 * i] = flock.x[i];
        positions[3 * i + 1] = flock.y[i];
      }
      attribute.needsUpdate = true;
      renderer.render(scene, camera);
    };
    let wanted = !reduced;
    let visible = false;
    let raf = 0;
    let prev = 0;
    const tick = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      step(flock, { separation, alignment, cohesion }, dt);
      render();
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const should = wanted && visible;
      if (should && !playing) {
        playing = true;
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!should && playing) {
        playing = false;
        cancelAnimationFrame(raf);
      }
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      paint();
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(rect.width, rect.height, false);
      render();
    };
    paint();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(canvas);
    toggle = () => { wanted = !wanted; sync(); };
    return () => {
      wanted = false;
      sync();
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  });

  const one = (v) => Number(v).toFixed(1);
</script>

<div class="anim" bind:this={root}>
  <div class="box" bind:this={box}>
    <canvas bind:this={canvas} role="img" aria-label="Two thousand boids flocking in a box whose edges wrap around"></canvas>
    {#if failed}
      <p class="fallback">This browser offers no WebGL, so the flock cannot be drawn here.</p>
    {/if}
  </div>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => toggle()} aria-pressed={playing} disabled={failed}>
      {playing ? 'Pause' : 'Play'}
    </button>
    <div class="anim-sliders">
      <Slider label="separation" min={0} max={3} step={0.1} bind:value={separation} format={one} />
      <Slider label="alignment" min={0} max={3} step={0.1} bind:value={alignment} format={one} />
      <Slider label="cohesion" min={0} max={3} step={0.1} bind:value={cohesion} format={one} />
    </div>
  </div>
</div>

<style>
  .box {
    position: relative; width: 100%; aspect-ratio: 16 / 9; box-sizing: border-box;
    border: 1px solid var(--anim-rule); overflow: hidden;
  }
  .box canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .fallback {
    position: absolute; inset: 0; display: grid; place-items: center; margin: 0; padding: 1rem;
    font-family: var(--anim-font); font-size: 0.75em; color: var(--anim-muted); text-align: center;
  }
</style>
