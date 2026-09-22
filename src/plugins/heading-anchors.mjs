// Section headings of posts (h2, h3): an id made from the words a reader
// sees, with a formula read from its TeX source rather than from KaTeX's
// markup, and a "#" link to the heading that appears on hover.

const texText = (tex) => tex.replace(/\\[a-zA-Z]+/g, ' ').replace(/[\\{}^_$]/g, ' ');

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
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';

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
          properties: { className: ['anchor'], href: `#${id}`, ariaLabel: 'Link to this section' },
          children: [{ type: 'text', value: '#' }],
        });
        return;
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
