<script>
  // A canvas with a render loop and one row of controls under it: the
  // Play/Pause button at the left, the sliders (this component's children)
  // at its right, further sliders below the first.
  //
  //   <Canvas {draw} ratio={2} narrowRatio={1} deps={[n]}>
  //     <Slider label="n" bind:value={n} />
  //   </Canvas>
  //
  // `draw(ctx, t, { w, h, dt, p, narrow })` runs every frame while playing;
  // `p` is the page palette (ink, muted, rule, accent, font). `deps` lists
  // values whose change redraws one frame even while paused, so sliders
  // work at rest. `narrowRatio` replaces `ratio` under 500 px.
  import { onMount } from 'svelte';
  import { loop, NARROW } from './loop.js';

  let {
    draw,
    ratio = 16 / 9,
    narrowRatio = undefined,
    label = 'Animation',
    controls = true,
    autoplay = true,
    deps = [],
    children,
    buttons,
  } = $props();

  let canvas;
  let anim = $state(null);
  let playing = $state(false);
  let narrow = $state(false);
  const aspect = $derived(narrow && narrowRatio ? narrowRatio : ratio);

  onMount(() => {
    const mq = window.matchMedia(NARROW);
    narrow = mq.matches;
    const onChange = (e) => (narrow = e.matches);
    mq.addEventListener('change', onChange);
    anim = loop(canvas, (ctx, t, size) => draw(ctx, t, size), { autoplay, onState: (p) => (playing = p) });
    return () => { mq.removeEventListener('change', onChange); anim.destroy(); };
  });

  $effect(() => {
    deps.forEach(() => {});
    anim?.redraw();
  });

  export function redraw() { anim?.redraw(); }
  export function pause() { anim?.pause(); }
  export function play() { anim?.play(); }
  /** True while the reader wants it to play (it may be parked off screen). */
  export function isPlaying() { return playing; }
</script>

<div class="anim">
  <canvas bind:this={canvas} style:aspect-ratio={aspect} role="img" aria-label={label}></canvas>
  {#if controls || children}
    <div class="anim-controls">
      {#if controls}
        <button type="button" class="anim-toggle" onclick={() => anim?.toggle()} aria-pressed={playing}>
          {playing ? 'Pause' : 'Play'}
        </button>
      {/if}
      {@render buttons?.()}
      {#if children}
        <div class="anim-sliders">{@render children()}</div>
      {/if}
    </div>
  {/if}
</div>
