// Drawing helper for the figures of this post. The figures reproduce the
// lecture's hand drawings: their points are read off the drawings and mapped
// to the page.

/** A map from the coordinates of a drawing to the page: scale k, then shift. */
export function place(x0, y0, k, X0, Y0) {
  return ([x, y]) => [X0 + (x - x0) * k, Y0 + (y - y0) * k];
}
