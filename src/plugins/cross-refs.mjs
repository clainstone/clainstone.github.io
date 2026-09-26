// Cross-references in posts. Every numbered statement ("**Theorem 3.5.**"),
// every figure ("**Figure 2.**" under its visual) and every tagged display
// (\tag{6}) gets an id, and every mention of one in the prose becomes a link
// to it: "Theorem 3.5", "Examples 2.1 and 2.5", "(6)", "Theorem 10 of the
// previous post". A mention resolves in the same post first; then in the post
// its qualifier names ("of the first post", "of the previous post"); then in
// the one other post of the thread that has it. Figures resolve only in their
// own post, equations only in their own post unless their number has a dot.
// A statement or figure mention that resolves nowhere is kept as text inside
// <span data-xref-missing>, which the page check reports.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';

const KINDS = ['Definition', 'Theorem', 'Proposition', 'Lemma', 'Corollary', 'Remark', 'Note', 'Example', 'Exercise', 'Solution', 'Figure'];
const PLURAL = { Definitions: 'Definition', Theorems: 'Theorem', Propositions: 'Proposition', Lemmas: 'Lemma', Lemmata: 'Lemma', Corollaries: 'Corollary', Remarks: 'Remark', Notes: 'Note', Examples: 'Example', Exercises: 'Exercise', Solutions: 'Solution', Figures: 'Figure' };
const NUM = String.raw`\d+(?:\.\d+)*`;
const ORDINAL = { first: 0, second: 1, third: 2, fourth: 3, fifth: 4, sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9 };

const idOf = (kind, num) => `${kind.toLowerCase()}-${num.replace(/\./g, '-')}`;
const eqId = (num) => `eq-${num.replace(/\./g, '-')}`;

const LABEL = new RegExp(String.raw`^\*\*(${KINDS.join('|')}) (${NUM})[.\s(]`, 'gm');
const TAG = new RegExp(String.raw`\\tag\{(${NUM})\}`, 'g');
const REF = new RegExp(String.raw`\b(${[...KINDS, ...Object.keys(PLURAL)].sort((a, b) => b.length - a.length).join('|')}) (${NUM})((?:(?:, | and | or |, and )${NUM})*)`, 'g');
const QUALIFIER = new RegExp(String.raw`^(?: \((?:[ivx]+|[a-z])\))*(?:,)? (?:of|in) the (${Object.keys(ORDINAL).join('|')}|previous|next) post`);
const EQREF = new RegExp(String.raw`\((${NUM})\)`, 'g');
// "Example 4 and Proposition 9 (ii) of the first post": the qualifier after a
// list of mentions belongs to each of them.
const CHAIN = new RegExp(String.raw`^(?:(?: \((?:[ivx]+|[a-z])\))*(?:,| and| or|, and) (?:${[...KINDS, ...Object.keys(PLURAL)].join('|')}) ${NUM})*`);
const qualifierAfter = (rest) => rest.slice(rest.match(CHAIN)[0].length).match(QUALIFIER)?.[1];

// ---- what each post of a thread defines, read from the sources -------------
function threadPosts(postsDir, thread) {
  const dir = join(postsDir, thread);
  const posts = [];
  for (const slug of readdirSync(dir)) {
    const file = join(dir, slug, 'index.mdx');
    if (!existsSync(file)) continue;
    const src = readFileSync(file, 'utf8');
    const front = src.split(/^---\s*$/m)[1] ?? '';
    if (/^sample:\s*true\s*$/m.test(front)) continue;
    const date = front.match(/^date:\s*(\S+)/m)?.[1] ?? '';
    const ids = new Set();
    for (const m of src.matchAll(LABEL)) ids.add(idOf(m[1], m[2]));
    for (const m of src.matchAll(TAG)) ids.add(eqId(m[1]));
    posts.push({ slug, date, ids });
  }
  // The order of the thread page: oldest first, equal dates by id.
  return posts.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
}

// ---- tree helpers ----------------------------------------------------------
const classes = (node) => node.properties?.className ?? [];
const isEl = (node, tag) => node?.type === 'element' && (!tag || node.tagName === tag);
function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}
function annotation(node) {
  if (isEl(node, 'annotation')) return textOf(node);
  for (const child of node.children ?? []) {
    const found = annotation(child);
    if (found != null) return found;
  }
  return null;
}
const labelKind = (text) => text.match(new RegExp(String.raw`^(${KINDS.join('|')}|Notation)( ${NUM})?( \(.*\))?\.$`, 's'));
// The bold run-in label that opens a paragraph, if any.
function labelOf(p) {
  const first = (p.children ?? []).find((c) => !(c.type === 'text' && !c.value.trim()));
  if (!isEl(first, 'strong')) return null;
  const m = labelKind(textOf(first).trim());
  return m ? { strong: first, kind: m[1], num: m[2]?.trim() } : null;
}
// ---- what a preview shows (src/scripts/xref-preview) ------------------------
// A statement's preview is its paragraph and the blocks that go on with it:
// displays, tables, lists, code, quotations and plain paragraphs, the items of
// a statement (**(ii)**) included. The first heading, rule, figure or
// component, paragraph that opens with a bold label (a proof, a caption, the
// next statement) or paragraph that cites the statement itself ends it. Each
// block after the first carries data-xref-part with the statement's id.
const ITEM = /^\((?:[ivxlcdm]+|[a-z]|\d+)\)$/;
const GOES_ON = new Set(['p', 'table', 'pre', 'blockquote', 'ul', 'ol', 'dl']);
const blank = (node) => node.type === 'text' && !node.value.trim();
const invisible = (node) => blank(node) || node.type === 'mdxFlowExpression';
const meaningful = (node) => (node.children ?? []).filter((c) => !blank(c));
const isVisual = (node) => !!node && (node.type === 'mdxJsxFlowElement' || isEl(node, 'figure') || isEl(node, 'img') || classes(node).includes('wide')
  // A paragraph that is only an image or an inline component, as Markdown writes ![...](...).
  || (isEl(node, 'p') && meaningful(node).length === 1 && (isEl(meaningful(node)[0], 'img') || meaningful(node)[0].type === 'mdxJsxTextElement')));
function cites(node, id) {
  if (isEl(node, 'a') && classes(node).includes('xref') && node.properties.href === `#${id}`) return true;
  return (node.children ?? []).some((c) => cites(c, id));
}
// 'skip' for what a reader cannot see, true for a block of the statement.
function goesOn(block, id) {
  if (invisible(block)) return 'skip';
  if (!isEl(block)) return false;
  if (classes(block).includes('katex-display')) return true;
  if (!GOES_ON.has(block.tagName) || isVisual(block)) return false;
  if (block.tagName === 'p') {
    const first = meaningful(block)[0];
    if (isEl(first, 'strong') && !ITEM.test(textOf(first).trim())) return false;
    if (cites(block, id)) return false;
  }
  return true;
}
function markExtents(node) {
  const kids = node.children ?? [];
  for (let i = 0; i < kids.length; i++) {
    const head = kids[i];
    const id = head.properties?.id;
    if (isEl(head, 'p') && id && labelOf(head)?.num) {
      for (let j = i + 1; j < kids.length; j++) {
        const verdict = goesOn(kids[j], id);
        if (verdict === 'skip') continue;
        if (!verdict) break;
        kids[j].properties = { ...kids[j].properties, dataXrefPart: id };
      }
    } else if ((isEl(head) && !classes(head).includes('katex-display')) || head.type === 'mdxJsxFlowElement') markExtents(head);
  }
}

const link = (href, children) => ({ type: 'element', tagName: 'a', properties: { href, className: ['xref'] }, children });
const text = (value) => ({ type: 'text', value });

export default function crossRefs() {
  return (tree, file) => {
    const path = file.path ?? file.history?.[0] ?? '';
    const parts = path.split(sep);
    const at = parts.lastIndexOf('posts');
    if (at < 0 || parts[at + 3] !== 'index.mdx') return;
    const postsDir = parts.slice(0, at + 1).join(sep);
    const [thread, slug] = [parts[at + 1], parts[at + 2]];
    const posts = threadPosts(postsDir, thread);
    const index = posts.findIndex((p) => p.slug === slug);
    const self = new Set();
    const hrefTo = (post, id) => (post.slug === slug ? `#${id}` : `/threads/${thread}/${post.slug}#${id}`);

    // Ids: statements on their paragraph, figures on an empty anchor just
    // before their visual (the caption stays the visual's next sibling),
    // tagged displays on the display.
    const anchorBefore = [];
    const visitIds = (node) => {
      const kids = node.children ?? [];
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (isEl(child, 'p')) {
          const label = labelOf(child);
          if (label?.num) {
            const id = idOf(label.kind, label.num);
            if (self.has(id)) continue;
            self.add(id);
            let j = i - 1;
            while (j >= 0 && invisible(kids[j])) j--;
            const visual = kids[j];
            if (label.kind === 'Figure' && isVisual(visual)) {
              anchorBefore.push({ parent: node, before: visual, id });
              // The caption closes the figure's preview and its wash.
              child.properties = { ...child.properties, dataXrefPart: id };
            } else child.properties = { ...child.properties, id };
          }
          continue;
        }
        if (isEl(child) && classes(child).includes('katex-display')) {
          const tag = (annotation(child) ?? '').match(new RegExp(String.raw`\\tag\{(${NUM})\}`));
          if (tag && !self.has(eqId(tag[1]))) {
            const id = eqId(tag[1]);
            self.add(id);
            child.properties = { ...child.properties, id };
            // The paragraph that leads into a tagged display is shown above it in its preview.
            let j = i - 1;
            while (j >= 0 && invisible(kids[j])) j--;
            const lead = kids[j];
            if (isEl(lead, 'p') && labelOf(lead)?.kind !== 'Figure' && !isVisual(lead)) lead.properties = { ...lead.properties, dataXrefLead: id };
          }
          continue;
        }
        visitIds(child);
      }
    };
    visitIds(tree);
    for (const { parent, before, id } of anchorBefore) {
      const k = parent.children.indexOf(before);
      parent.children.splice(k, 0, { type: 'element', tagName: 'div', properties: { id, className: ['xref-anchor'] }, children: [] });
    }

    const resolve = (id, qualifier, { local }) => {
      if (qualifier) {
        const k = qualifier === 'previous' ? index - 1 : qualifier === 'next' ? index + 1 : ORDINAL[qualifier];
        const post = posts[k];
        return post?.ids.has(id) ? hrefTo(post, id) : null;
      }
      if (self.has(id)) return `#${id}`;
      if (local) return null;
      const others = posts.filter((p) => p.slug !== slug && p.ids.has(id));
      return others.length === 1 ? hrefTo(others[0], id) : null;
    };

    // Mentions in running text.
    const missing = [];
    const linkText = (value) => {
      const out = [];
      let last = 0;
      for (const m of value.matchAll(REF)) {
        const kind = PLURAL[m[1]] ?? m[1];
        const nums = [m[2], ...(m[3] ? [...m[3].matchAll(new RegExp(NUM, 'g'))].map((x) => x[0]) : [])];
        if (!PLURAL[m[1]] && nums.length > 1) nums.length = 1;
        const end = m.index + m[1].length + 1 + m[2].length + (PLURAL[m[1]] ? m[3].length : 0);
        const qualifier = qualifierAfter(value.slice(end));
        out.push(text(value.slice(last, m.index)));
        // The first link carries the kind word; the others only their number.
        let cursor = m.index;
        nums.forEach((num, k) => {
          const start = k === 0 ? m.index : value.indexOf(num, cursor);
          if (k > 0) out.push(text(value.slice(cursor, start)));
          const shown = value.slice(start, start + (k === 0 ? m[1].length + 1 + num.length : num.length));
          const href = resolve(idOf(kind, num), qualifier, { local: kind === 'Figure' });
          if (href) out.push(link(href, [text(shown)]));
          else {
            missing.push(`${kind} ${num}${qualifier ? ` of the ${qualifier} post` : ''}`);
            out.push({ type: 'element', tagName: 'span', properties: { dataXrefMissing: `${kind} ${num}` }, children: [text(shown)] });
          }
          cursor = start + shown.length;
        });
        last = cursor;
      }
      out.push(text(value.slice(last)));
      // Equation numbers in plain text: "(6)", linked only where they resolve.
      return out.flatMap((node) => {
        if (node.type !== 'text') return [node];
        const pieces = [];
        let from = 0;
        for (const m of node.value.matchAll(EQREF)) {
          const qualifier = node.value.slice(m.index + m[0].length).match(QUALIFIER)?.[1];
          const href = resolve(eqId(m[1]), qualifier, { local: !m[1].includes('.') });
          if (!href) continue;
          pieces.push(text(node.value.slice(from, m.index)), link(href, [text(m[0])]));
          from = m.index + m[0].length;
        }
        pieces.push(text(node.value.slice(from)));
        return pieces.filter((p) => p.type !== 'text' || p.value);
      });
    };

    const SKIP = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'script', 'style', 'svg']);
    const visitText = (node) => {
      const kids = node.children;
      if (!kids) return;
      const label = isEl(node, 'p') ? labelOf(node) : null;
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (child === label?.strong) continue;
        if (child.type === 'text') {
          const replaced = linkText(child.value);
          if (replaced.length !== 1 || replaced[0].type !== 'text') {
            kids.splice(i, 1, ...replaced);
            i += replaced.length - 1;
          }
          continue;
        }
        if (child.type !== 'element' || SKIP.has(child.tagName)) continue;
        if (classes(child).includes('katex-display')) continue;
        if (classes(child).includes('katex')) {
          // An inline formula that is only an equation number: ${(6),}$.
          const tex = (annotation(child) ?? '').replace(/[{}\s]/g, '').replace(/[,.;:]$/, '');
          const m = tex.match(new RegExp(String.raw`^\((${NUM})\)$`));
          const href = m && resolve(eqId(m[1]), (() => {
            const next = kids[i + 1];
            return next?.type === 'text' ? next.value.match(QUALIFIER)?.[1] : undefined;
          })(), { local: !m[1].includes('.') });
          if (href) kids[i] = link(href, [child]);
          continue;
        }
        visitText(child);
      }
    };
    visitText(tree);
    markExtents(tree);
    if (missing.length) console.warn(`[cross-refs] ${thread}/${slug}: no target for ${[...new Set(missing)].join(', ')}`);
  };
}
