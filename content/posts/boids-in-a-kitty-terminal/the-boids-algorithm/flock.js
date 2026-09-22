// The flock the reader sees in Figure 4: the cbirds model, in pixels, as pure functions over typed arrays.
//
// A port of cbirds' boids.c and spatial_grid.c (commit 6900be5) with one flock,
// no hawks, no wind and no panel, so every term those add is zero here:
// spatial_grid_build (the grid), flock_direction (the rules), edge_push and
// boundary_vector (the edges), pointer_vector (the pointer), turn_towards and
// turn_limit (turning), update_birds (one step for all). Screen coordinates:
// x right, y down, headings in radians clockwise from east.

export const CELL = 12; // SPATIAL_CELL_SIZE: grid cells of 12 px
export const STEP = 16; // DEFAULT_SPEED 40 px a 60 Hz step times pace 0.4
export const PACE = 0.4;
export const REACH = 120; // MOUSE_REACH
const POINTER_W = 4; // MOUSE_WEIGHT
const W_C = 0.01; // COHESION_W, fixed
const W_B = 0.2; // the boundary weight at its default notch
const EDGE_FIRM = 12;
const ESCAPE_PENALTY = 8;
const TAU = 2 * Math.PI;

/** mulberry32: a small seeded generator, uniform in [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** n birds in the middle rectangle (x in [W/3, 2W/3], y in [H/3, 5H/6]), headings uniform; the grid sized as spatial_grid_prepare sizes it. */
export function createFlock(seed, n, W, H) {
  const rand = mulberry32(seed);
  const x = new Float64Array(n), y = new Float64Array(n), h = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    x[i] = W / 3 + rand() * (W / 3);
    y[i] = H / 3 + rand() * (H / 2);
    h[i] = rand() * TAU;
  }
  const cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
  return {
    n, x, y, h,
    // The snapshot every bird reads during a step, and its cosines and sines.
    sx: new Float64Array(n), sy: new Float64Array(n), sh: new Float64Array(n),
    sc: new Float64Array(n), ss: new Float64Array(n),
    grid: {
      cols, rows,
      counts: new Int32Array(cols * rows),
      offsets: new Int32Array(cols * rows + 1),
      indices: new Int32Array(n),
      cell: new Int32Array(n),
    },
  };
}

/** coordinate_to_cell: a coordinate outside the grid maps to the last cell on that side. */
function cellOf(v, cells) {
  if (!(v > 0)) return 0;
  if (v >= cells * CELL) return cells - 1;
  return Math.floor(v / CELL);
}

/** spatial_grid_build: a counting sort of the birds into cells (count, prefix sums, fill). */
export function buildGrid(g, x, y, n) {
  const { cols, counts, offsets, indices, cell } = g;
  counts.fill(0);
  for (let i = 0; i < n; i++) {
    cell[i] = cellOf(y[i], g.rows) * cols + cellOf(x[i], cols);
    counts[cell[i]]++;
  }
  offsets[0] = 0;
  for (let c = 0; c < counts.length; c++) offsets[c + 1] = offsets[c] + counts[c];
  counts.fill(0);
  for (let i = 0; i < n; i++) indices[offsets[cell[i]] + counts[cell[i]]++] = i;
}

/** edge_push: gentle inside the band (12 d^2), steep past the screen's edge. */
export function edgePush(past, band) {
  if (past <= 0) return 0;
  const d = past / band; // zero at the band's inner edge, one at the screen's
  if (d <= 1) return EDGE_FIRM * d * d;
  return (EDGE_FIRM * (W_B + (d - 1) * ESCAPE_PENALTY)) / W_B;
}

/** boundary_vector: bands of W/3 left and right, H/3 at the top, H/6 at the bottom; each pushes along its own axis, inwards. */
function boundary(px, py, W, H, out) {
  const bx = W / 3, by = H / 3, bb = H / 6;
  out[0] = px < bx ? edgePush(bx - px, bx) : px > W - bx ? -edgePush(px - (W - bx), bx) : 0;
  out[1] = py < by ? edgePush(by - py, by) : py > H - bb ? -edgePush(py - (H - bb), bb) : 0;
}

/** pointer_vector: one at the pointer, nothing at 120 px, away from it; zero when the pointer is absent. */
function pointerPush(px, py, pointer, out) {
  out[0] = out[1] = 0;
  if (!pointer) return;
  const dx = px - pointer.x, dy = py - pointer.y, q = dx * dx + dy * dy;
  if (q >= REACH * REACH || q < 1e-9) return;
  const dist = Math.sqrt(q), strength = (REACH - dist) / REACH;
  out[0] = (strength * dx) / dist;
  out[1] = (strength * dy) / dist;
}

const edge = new Float64Array(2), push = new Float64Array(2);

/** flock_direction: the heading bird b wants, from the snapshot, the grid, the edges and the pointer. */
function flockDirection(f, b, r, ws, wa, pointer, W, H) {
  const { sx, sy, sh, sc, ss, grid } = f;
  const { cols, rows, offsets, indices } = grid;
  const px = sx[b], py = sy[b], r2 = r * r, reach = Math.ceil(r / CELL);
  boundary(px, py, W, H, edge);
  pointerPush(px, py, pointer, push);
  const cx = cellOf(px, cols), cy = cellOf(py, rows);
  const x0 = Math.max(cx - reach, 0), x1 = Math.min(cx + reach, cols - 1);
  const y0 = Math.max(cy - reach, 0), y1 = Math.min(cy + reach, rows - 1);
  let sX = 0, sY = 0, aX = 0, aY = 0, cX = 0, cY = 0, n = 0;
  for (let gy = y0; gy <= y1; gy++) {
    for (let gx = x0; gx <= x1; gx++) {
      const cell = gy * cols + gx;
      for (let slot = offsets[cell]; slot < offsets[cell + 1]; slot++) {
        const j = indices[slot];
        if (j === b) continue;
        const dx = px - sx[j], dy = py - sy[j];
        if (dx * dx + dy * dy >= r2) continue;
        sX += dx; sY += dy; // separation: the sum of p - p_j
        aX += sc[j]; aY += ss[j]; // alignment: the neighbours' unit headings
        cX += sx[j]; cY += sy[j]; // cohesion: their positions
        n++;
      }
    }
  }
  if (n > 0) {
    aX /= n; aY /= n;
    cX = cX / n - px; cY = cY / n - py;
    const vx = ws * sX + wa * aX + W_C * cX + W_B * edge[0] + POINTER_W * push[0];
    const vy = ws * sY + wa * aY + W_C * cY + W_B * edge[1] + POINTER_W * push[1];
    return vx === 0 && vy === 0 ? sh[b] : Math.atan2(vy, vx);
  }
  // No neighbour: only the edges and the pointer nudge the current heading.
  const ux = W_B * edge[0] + POINTER_W * push[0], uy = W_B * edge[1] + POINTER_W * push[1];
  if (ux === 0 && uy === 0) return sh[b];
  const x = sc[b] + ux, y = ss[b] + uy;
  return x === 0 && y === 0 ? sh[b] : Math.atan2(y, x);
}

/** turn_limit: (30 + 5k) degrees a 60 Hz step at pace 1, times pace 0.4; notch 12 is instant. */
export function turnLimit(k) {
  if (k >= 12) return TAU;
  return Math.min((Math.PI / 6 + ((Math.PI / 2 - Math.PI / 6) * k) / 12) * PACE, TAU);
}

/** turn_towards: the wrapped difference clamped to [-most, most], the result wrapped into [0, 2 pi). */
export function turnTowards(from, to, most) {
  let delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  if (delta > most) delta = most;
  if (delta < -most) delta = -most;
  let turned = from + delta;
  if (turned < 0) turned += TAU;
  if (turned >= TAU) turned -= TAU;
  return turned;
}

/** The weights from the sliders' notches, as notch_value computes them. */
export function weights(k) {
  return { ws: 0.001 + (0.012 * k.separation) / 12, wa: 0.1 + (4.2 * k.alignment) / 12 };
}

/** update_birds: one 1/60 s step. Every bird decides from the same snapshot, then all turn and move. */
export function stepFlock(f, params, pointer, W, H) {
  const { n, x, y, h, sx, sy, sh, sc, ss } = f;
  sx.set(x); sy.set(y); sh.set(h);
  for (let i = 0; i < n; i++) { sc[i] = Math.cos(sh[i]); ss[i] = Math.sin(sh[i]); }
  buildGrid(f.grid, sx, sy, n);
  const { ws, wa } = weights(params);
  const L = turnLimit(params.turning);
  for (let b = 0; b < n; b++) {
    const want = flockDirection(f, b, params.perception, ws, wa, pointer, W, H);
    h[b] = turnTowards(sh[b], want, L);
    x[b] = sx[b] + STEP * Math.cos(h[b]);
    y[b] = sy[b] + STEP * Math.sin(h[b]);
  }
}
