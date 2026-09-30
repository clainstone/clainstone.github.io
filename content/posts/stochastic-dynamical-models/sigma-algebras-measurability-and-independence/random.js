// A small seeded generator, so that every reader sees the same first path.
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

// A path of a chain on the states 1, 2, 3: at each step it stays with
// probability 1/2 and otherwise moves to one of the other two states.
export function path(seed, len) {
  const u = mulberry32(seed);
  const xs = [1 + Math.floor(u() * 3)];
  for (let n = 0; n < len; n++) {
    const x = xs[n], r = u();
    xs.push(r < 0.5 ? x : 1 + ((x - 1 + (r < 0.75 ? 1 : 2)) % 3));
  }
  return xs;
}
