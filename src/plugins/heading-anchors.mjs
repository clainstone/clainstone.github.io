// Section headings of posts (h2, h3): an id made from the words a reader
// sees, with a formula read from its TeX source rather than from KaTeX's
// markup, and a "#" link to the heading that appears on hover.

// Greek letters, typed or in TeX, become their names in ids: σ-algebras, sigma-algebras.
const GREEK = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'theta', κ: 'kappa', λ: 'lambda', μ: 'mu', ν: 'nu', ξ: 'xi', π: 'pi', ρ: 'rho', σ: 'sigma', τ: 'tau', φ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega', Γ: 'gamma', Δ: 'delta', Θ: 'theta', Λ: 'lambda', Σ: 'sigma', Φ: 'phi', Ψ: 'psi', Ω: 'omega' };
const NAMES = new Set(Object.values(GREEK));
const texText = (tex) => tex.replace(/\\([a-zA-Z]+)/g, (m, name) => (NAMES.has(name.toLowerCase()) ? ` ${name.toLowerCase()} ` : ' ')).replace(/[\\{}^_$]/g, ' ');

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type !== 'element') return '';
  const classes = node.properties?.className ?? [];
  if (classes.includes('katex')) {
    const annotation = findAnnotation(node);
    return annotation ? texText(annotation) : '';
  }
  return (node.children ?? []).map(textOf).join('');
}

function findAnnotation(node) {
  if (node.type === 'element' && node.tagName === 'annotation') return (node.children ?? []).map((c) => c.value ?? '').join('');
  for (const child of node.children ?? []) {
    const found = findAnnotation(child);
    if (found) return found;
  }
  return null;
}

const slugify = (s) =>
  s.replace(/[α-ωΑ-Ω]/g, (c) => GREEK[c] ?? c).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';

export default function headingAnchors() {
  return (tree) => {
    const seen = new Map();
    const visit = (node) => {
      if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
        const base = slugify(textOf(node));
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        node.properties = { ...node.properties, id };
        node.children.push({
          type: 'element',
          tagName: 'a',
          // Not part of the heading's name for screen readers, and not a tab stop.
          properties: { className: ['anchor'], href: `#${id}`, ariaHidden: 'true', tabIndex: -1 },
          children: [{ type: 'text', value: '#' }],
        });
        return;
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
