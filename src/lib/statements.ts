// The index of a thread of lectures (threads with `index: true`). Every post
// of such a thread has `lecture: N` and one numbering for the whole thread:
// its statements, figures and tagged displays are numbered "N.k". The index
// lists, lecture by lecture, every numbered statement with its name, or with
// the short description that the post's `index` field gives it when the
// label has no name. The same pass reports what breaks those rules, so that
// the page checks can read it from the built index.
import { mathHtml, postUrl, formatDate, isoDate, type Post } from './site';

const KINDS = ['Definition', 'Theorem', 'Proposition', 'Lemma', 'Corollary', 'Remark', 'Note', 'Example', 'Exercise', 'Solution'];
const NUM = String.raw`\d+(?:\.\d+)*`;
// The same labels that src/plugins/cross-refs.mjs numbers, with their name.
const LABEL = new RegExp(String.raw`^\*\*(${KINDS.join('|')}) (${NUM})(?: \((.*?)\))?\.\*\*`, 'gm');
const ANY_LABEL = new RegExp(String.raw`^\*\*(${KINDS.join('|')}|Figure) (${NUM})[.\s(]`, 'gm');
const TAG = new RegExp(String.raw`\\tag\{(${NUM})\}`, 'g');

export const idOf = (kind: string, num: string) => `${kind.toLowerCase()}-${num.replace(/\./g, '-')}`;

export interface Statement { kind: string; num: string; label: string; id: string; name: string | null; what: string | null }
export interface Lecture { post: Post; lecture: number | undefined; statements: Statement[]; problems: string[] }

// What may never appear in text the site shows, outside mathematics: the
// characters of check_site.mjs (bullets, arrows, em dash, double hyphen)
// and the middle dot.
const BANNED = /[•◦▪▸►→←⇒⇐⟹⟸⟺↔➜—·]|(^|[^-])--(?!-)/;
// A name in a label is plain text with mathematics: a Markdown link keeps
// its text (STYLE.md 4.10 keeps links out of labels, but the index does not
// rely on it), emphasis its words. Whatever Markdown is left is reported.
const outsideMath = (text: string) => text.replace(/\$[^$]*\$/g, '');
// The text between formulas, changed by f; the formulas stay as written.
const betweenMath = (text: string, f: (s: string) => string) => text.split(/(\$[^$]*\$)/).map((s, k) => (k % 2 ? s : f(s))).join('');
const plainName = (name: string) => betweenMath(name, (s) => s
  .replace(/\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, '$1')
  .replace(/(^|\W)[*_]([^*_]+)[*_](?=\W|$)/g, '$1$2'));
const MARKDOWN = /\]\(|[*_`[\]]/;
// A description stays short: at most 95 characters as read,
// a formula counted by its symbols, not by its TeX.
const MAX_WHAT = 95;
const shown = (text: string) => text.replace(/\$([^$]*)\$/g, (_, tex: string) => tex.replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}_^\s]/g, '')).length;

export function lectureOf(post: Post): Lecture {
  const body = post.body ?? '';
  const n = post.data.lecture;
  const descriptions = post.data.index ?? {};
  const problems: string[] = [];
  if (n === undefined) problems.push('no `lecture` in the frontmatter');
  const statements: Statement[] = [...body.matchAll(LABEL)].map((m) => {
    const [, kind, num, raw] = m;
    const label = `${kind} ${num}`;
    const name = raw === undefined ? null : plainName(raw);
    if (name && MARKDOWN.test(outsideMath(name))) problems.push(`${label}: the name (${raw}) holds Markdown that the index cannot show`);
    const what = name ?? descriptions[label] ?? null;
    return { kind, num, label, id: idOf(kind, num), name, what };
  });
  // Every label, figures included, carries the lecture's number, and each
  // counter runs 1, 2, 3 in the order of the post.
  const counters = new Map<string, number>();
  const loose = [...body.matchAll(ANY_LABEL)];
  if (loose.filter((m) => m[1] !== 'Figure').length !== statements.length) {
    problems.push('a statement label is not of the form **Kind N.k.** or **Kind N.k (Name).**');
  }
  for (const m of loose) {
    const [, kind, num] = m;
    const [head, k, ...rest] = num.split('.');
    if (n !== undefined && (head !== String(n) || !k || rest.length)) { problems.push(`${kind} ${num}: the number must be ${n}.k`); continue; }
    const counter = kind === 'Figure' ? 'Figure' : 'statement';
    const want = (counters.get(counter) ?? 0) + 1;
    if (Number(k) !== want) problems.push(`${kind} ${num}: expected ${n}.${want}, the ${counter === 'Figure' ? 'figures' : 'statements'} are numbered in order`);
    counters.set(counter, Number(k));
  }
  for (const m of body.matchAll(TAG)) {
    if (n !== undefined && !new RegExp(String.raw`^${n}\.\d+$`).test(m[1])) problems.push(`\\tag{${m[1]}}: the number must be ${n}.k`);
  }
  // Descriptions: one for each statement without a name, and no other.
  for (const s of statements) {
    if (!s.name && !descriptions[s.label]?.trim()) problems.push(`${s.label} has no name and no description in \`index\``);
  }
  for (const [label, text] of Object.entries(descriptions)) {
    const s = statements.find((x) => x.label === label);
    if (!s) { problems.push(`index: "${label}" is not a label of the post`); continue; }
    if (s.name) problems.push(`index: ${label} has a name, (${s.name}), and takes no description`);
    const words = outsideMath(text);
    if (shown(text.trim()) > MAX_WHAT) problems.push(`index: the description of ${label} is longer than ${MAX_WHAT} characters as read`);
    if (/\.\s*$/.test(text)) problems.push(`index: the description of ${label} ends with a full stop`);
    if (BANNED.test(words)) problems.push(`index: the description of ${label} has a banned character (em dash, bullet, middle dot, arrow or double hyphen)`);
    if (MARKDOWN.test(words)) problems.push(`index: the description of ${label} holds Markdown, which the index shows as typed`);
    if ((text.match(/\$/g) ?? []).length % 2) problems.push(`index: the description of ${label} has an unclosed $`);
  }
  return { post, lecture: n, statements, problems };
}

/** Problems of the thread as a whole: two posts with the same lecture number. */
export function threadProblems(lectures: Lecture[]): { post: string; message: string }[] {
  const byNumber = new Map<number, string[]>();
  for (const { post, lecture } of lectures) if (lecture !== undefined) byNumber.set(lecture, [...(byNumber.get(lecture) ?? []), post.id]);
  return [...byNumber].filter(([, ids]) => ids.length > 1).flatMap(([n, ids]) =>
    ids.map((id) => ({ post: id, message: `lecture ${n} is also the lecture of ${ids.filter((x) => x !== id).join(', ')}` })));
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The index as HTML, lecture by lecture, for the panel of LectureIndex.astro. */
export function indexHtml(lectures: Lecture[]): string {
  const blocks = lectures.map(({ post, lecture, statements }) => {
    const url = postUrl(post);
    const items = statements.map((s) =>
      `<li><a class="xref" href="${url}#${s.id}">${s.label}</a><span class="index-what">${s.what ? mathHtml(s.what) : ''}</span></li>`,
    ).join('');
    return `<section class="index-lecture" data-path="${escape(url)}">`
      + `<h3 class="index-lecture-head"><span class="index-n">Lecture ${lecture ?? ''}</span>`
      + `<a class="index-title" href="${url}">${mathHtml(post.data.title)}</a>`
      + `<time class="index-date" datetime="${isoDate(post.data.date)}">${formatDate(post.data.date)}</time></h3>`
      + `<ol class="index-items">${items}</ol></section>`;
  });
  return blocks.join('');
}
