// Boids in a box whose edges wrap around. Positions and velocities live in
// typed arrays. A uniform grid with cells at least as wide as the perception
// radius keeps the neighbour search linear in the size of the flock.

const MAX_SPEED = 48;
const MIN_SPEED = 20;
const MAX_FORCE = 140;

export function createFlock(n, w, h, radius = 12) {
  const cols = Math.max(3, Math.floor(w / radius));
  const rows = Math.max(3, Math.floor(h / radius));
  const f = {
    n, w, h, radius, cols, rows, cw: w / cols, ch: h / rows,
    x: new Float32Array(n), y: new Float32Array(n),
    vx: new Float32Array(n), vy: new Float32Array(n),
    ax: new Float32Array(n), ay: new Float32Array(n),
    cellOf: new Int32Array(n), order: new Int32Array(n),
    start: new Int32Array(cols * rows + 1), cursor: new Int32Array(cols * rows),
  };
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 2 * Math.PI;
    const s = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    f.x[i] = Math.random() * w;
    f.y[i] = Math.random() * h;
    f.vx[i] = Math.cos(a) * s;
    f.vy[i] = Math.sin(a) * s;
  }
  return f;
}

// Counting sort of the boids by cell. Afterwards the boids of cell c are
// order[start[c]] up to, not including, order[start[c + 1]].
function bin(f) {
  const { n, cols, rows, cw, ch, start, cursor, cellOf, order } = f;
  start.fill(0);
  for (let i = 0; i < n; i++) {
    const cx = Math.min(cols - 1, Math.floor(f.x[i] / cw));
    const cy = Math.min(rows - 1, Math.floor(f.y[i] / ch));
    const c = cy * cols + cx;
    cellOf[i] = c;
    start[c + 1]++;
  }
  for (let c = 0; c < cols * rows; c++) start[c + 1] += start[c];
  cursor.set(start.subarray(0, cols * rows));
  for (let i = 0; i < n; i++) order[cursor[cellOf[i]]++] = i;
}

// Steering toward a direction: the velocity wanted at full speed minus the
// current velocity, clamped to the maximum force. Written into a scratch pair.
const out = new Float32Array(2);
function steer(dx, dy, vx, vy) {
  const m = Math.hypot(dx, dy);
  if (m === 0) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  let sx = (dx / m) * MAX_SPEED - vx;
  let sy = (dy / m) * MAX_SPEED - vy;
  const s = Math.hypot(sx, sy);
  if (s > MAX_FORCE) {
    sx *= MAX_FORCE / s;
    sy *= MAX_FORCE / s;
  }
  out[0] = sx;
  out[1] = sy;
  return out;
}

// One step of dt seconds with the three weights: separation, alignment,
// cohesion. Forces are accumulated first, then every boid moves.
export function step(f, weights, dt) {
  bin(f);
  const { n, w, h, radius, cols, rows, cw, ch, x, y, vx, vy, ax, ay, start, order } = f;
  const r2 = radius * radius;
  const near2 = (radius * 0.45) ** 2;
  const hw = w / 2;
  const hh = h / 2;
  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = y[i];
    const cx = Math.min(cols - 1, Math.floor(xi / cw));
    const cy = Math.min(rows - 1, Math.floor(yi / ch));
    let sx = 0, sy = 0, alx = 0, aly = 0, cox = 0, coy = 0, count = 0;
    for (let oy = -1; oy <= 1; oy++) {
      const gy = (cy + oy + rows) % rows;
      for (let ox = -1; ox <= 1; ox++) {
        const c = gy * cols + ((cx + ox + cols) % cols);
        for (let k = start[c], end = start[c + 1]; k < end; k++) {
          const j = order[k];
          if (j === i) continue;
          let dx = x[j] - xi;
          let dy = y[j] - yi;
          if (dx > hw) dx -= w; else if (dx < -hw) dx += w;
          if (dy > hh) dy -= h; else if (dy < -hh) dy += h;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          count++;
          alx += vx[j];
          aly += vy[j];
          cox += dx;
          coy += dy;
          if (d2 < near2 && d2 > 0) {
            sx -= dx / d2;
            sy -= dy / d2;
          }
        }
      }
    }
    let fx = 0;
    let fy = 0;
    if (count > 0) {
      let s = steer(sx, sy, vx[i], vy[i]);
      fx += s[0] * weights.separation;
      fy += s[1] * weights.separation;
      s = steer(alx, aly, vx[i], vy[i]);
      fx += s[0] * weights.alignment;
      fy += s[1] * weights.alignment;
      s = steer(cox, coy, vx[i], vy[i]);
      fx += s[0] * weights.cohesion;
      fy += s[1] * weights.cohesion;
    }
    ax[i] = fx;
    ay[i] = fy;
  }
  for (let i = 0; i < n; i++) {
    let ux = vx[i] + ax[i] * dt;
    let uy = vy[i] + ay[i] * dt;
    const s = Math.hypot(ux, uy);
    if (s > MAX_SPEED) {
      ux *= MAX_SPEED / s;
      uy *= MAX_SPEED / s;
    } else if (s < MIN_SPEED && s > 0) {
      ux *= MIN_SPEED / s;
      uy *= MIN_SPEED / s;
    }
    vx[i] = ux;
    vy[i] = uy;
    let nx = x[i] + ux * dt;
    let ny = y[i] + uy * dt;
    if (nx < 0) nx += w; else if (nx >= w) nx -= w;
    if (ny < 0) ny += h; else if (ny >= h) ny -= h;
    x[i] = nx;
    y[i] = ny;
  }
}
