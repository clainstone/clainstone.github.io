import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import katex from 'katex';
import site from '../../content/site.json';

export type Thread = CollectionEntry<'threads'>;
export type Post = CollectionEntry<'posts'>;

export const SITE = site;

/** The portrait, whichever file `site.json` names. */
const photos = import.meta.glob<{ default: ImageMetadata }>('../../content/photo.*', { eager: true });
export const PHOTO: ImageMetadata = Object.entries(photos).find(([p]) => p.endsWith(`/${site.photo}`))![1].default;

/** When a post appeared on the site: `published`, else the date of its subject. */
export const publishedOf = (post: Post) => post.data.published ?? post.data.date;

/** Posts, newest first by the date of their subject (a lecture's date). */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id));
}

/** Posts, most recently published first: the order of Latest posts and of the feed. */
export async function getRecentPosts(): Promise<Post[]> {
  const all = await getPosts();
  return all.sort((a, b) => publishedOf(b).getTime() - publishedOf(a).getTime() || b.data.date.getTime() - a.data.date.getTime());
}

/** The thread a post belongs to, from its id. */
export function threadIdOf(post: Post): string {
  return post.id.split('/')[0];
}

export async function threadOf(post: Post): Promise<Thread> {
  const t = await getEntry('threads', threadIdOf(post));
  if (!t) throw new Error(`Post ${post.id} belongs to unknown thread ${threadIdOf(post)}`);
  return t;
}

/** A thread's posts, oldest first: a thread reads forward. */
export async function postsOf(threadId: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => threadIdOf(p) === threadId).reverse();
}

/**
 * Threads that have posts, with their counts, most recently active first.
 * Closed threads keep their page and are listed after the active ones.
 */
export async function getThreads(): Promise<{ thread: Thread; count: number; last: Date }[]> {
  const threads = await getCollection('threads');
  const posts = await getPosts();
  const rows = threads
    .map((thread) => {
      const own = posts.filter((p) => threadIdOf(p) === thread.id);
      return { thread, count: own.length, last: own[0]?.data.date ?? new Date(0) };
    })
    .filter((row) => row.count > 0);
  const closed = (row: (typeof rows)[number]) => (row.thread.data.status === 'closed' ? 1 : 0);
  return rows.sort((a, b) => closed(a) - closed(b) || b.last.getTime() - a.last.getTime() || a.thread.data.title.localeCompare(b.thread.data.title));
}

export const postUrl = (post: Post) => `/threads/${post.id}`;
export const threadUrl = (thread: Thread | string) => `/threads/${typeof thread === 'string' ? thread : thread.id}`;

/** Words of prose in a post body: imports, components, code and mathematics excluded. */
export function wordCount(body: string | undefined): number {
  const text = (body ?? '')
    .replace(/^import .*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/[*_`#>\[\]]/g, ' ');
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

const NUMBER = new Intl.NumberFormat('en-GB');
/** "1,435 words" */
export const formatWords = (n: number) => `${NUMBER.format(n)} ${n === 1 ? 'word' : 'words'}`;

const LONG = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => LONG.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/* ---- inline mathematics in frontmatter strings ------------------------- */

const INLINE = /\$([^$]+)\$([,.;:!?)\]]*)/g;
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A title with its `$...$` segments typeset by KaTeX; punctuation stays glued to the math. */
export function mathHtml(s: string): string {
  let out = '';
  let last = 0;
  for (const m of s.matchAll(INLINE)) {
    out += escapeHtml(s.slice(last, m.index));
    out += `<span class="nowrap">${katex.renderToString(m[1], { throwOnError: false, strict: false })}${escapeHtml(m[2])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(s.slice(last));
}

/* ---- the same strings as plain text ------------------------------------ */

const SYMBOLS: Record<string, string> = {
  infty: '∞', to: '→', mapsto: '↦', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈',
  times: '×', cdot: '·', pm: '±', in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', supset: '⊃', setminus: '∖',
  cup: '∪', cap: '∩', bigcup: '∪', bigcap: '∩', emptyset: '∅', varnothing: '∅', sum: 'Σ', prod: 'Π', int: '∫',
  forall: '∀', exists: '∃', iff: '⇔', implies: '⇒', mid: '|', colon: ':', dots: '…', ldots: '…', cdots: '⋯',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', varepsilon: 'ε', epsilon: 'ε', lambda: 'λ', mu: 'μ', nu: 'ν',
  pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', omega: 'ω', Omega: 'Ω', Sigma: 'Σ', Delta: 'Δ',
  ell: 'ℓ', partial: '∂', lim: 'lim', sup: 'sup', inf: 'inf', max: 'max', min: 'min', log: 'log', exp: 'exp',
  quad: ' ', qquad: ' ', left: '', right: '', big: '', Big: '', bigl: '', bigr: '', Bigl: '', Bigr: '',
};
const BLACKBOARD: Record<string, string> = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ' };
const SUP: Record<string, string> = Object.fromEntries(
  [...'0123456789+-=()niabcdefghjklmoprstuvwxyz*\''].map((c, k) => [c, '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ*′'[k]]),
);
const SUB: Record<string, string> = Object.fromEntries(
  [...'0123456789+-=()aehijklmnoprstuvx'].map((c, k) => [c, '₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ'[k]]),
);
/** A script as Unicode when every character has a form, else in parentheses. */
const script = (body: string, map: Record<string, string>, mark: string) => {
  const chars = [...body.replace(/\s+/g, '')];
  return chars.every((c) => map[c]) ? chars.map((c) => map[c]).join('') : `${mark}(${body})`;
};

/** One TeX formula as plain text: symbols as Unicode, scripts raised or lowered. */
function plainTex(tex: string): string {
  // Escaped characters wait behind placeholders, so that the braces and
  // underscores of the TeX syntax can be removed without touching them.
  const ESCAPED = '#{}%&_$';
  let s = tex
    .replace(/\\([#{}%&_$])/g, (m, c: string) => String.fromCharCode(0xe000 + ESCAPED.indexOf(c)))
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\mathbb\{([A-Z])\}/g, (m, c: string) => BLACKBOARD[c] ?? c)
    .replace(/\\(?:mathcal|mathscr|mathrm|mathbf|mathit|mathsf|operatorname|text|textrm|textit)\{([^{}]*)\}/g, '$1')
    .replace(/\\overline\{([^{}]*)\}/g, '$1̄')
    .replace(/\\([a-zA-Z]+)/g, (m, name: string) => SYMBOLS[name] ?? name);
  // Scripts: ^{...}, ^x, _{...}, _x; innermost braces first.
  for (let k = 0; k < 4; k++) {
    s = s
      .replace(/\^\{([^{}]*)\}/g, (m, b: string) => script(b, SUP, '^'))
      .replace(/_\{([^{}]*)\}/g, (m, b: string) => script(b, SUB, '_'))
      .replace(/\^([^{}\s(])/g, (m, b: string) => script(b, SUP, '^'))
      .replace(/_([^{}\s(])/g, (m, b: string) => script(b, SUB, '_'));
  }
  return s
    .replace(/[{}]/g, '')
    .replace(/[\ue000-\ue006]/g, (c) => ESCAPED[c.charCodeAt(0) - 0xe000])
    .replace(/\s+/g, ' ')
    .trim();
}

/** The same string for `<title>`, meta tags, cards and the feed: no HTML, no TeX. */
export function plain(s: string): string {
  const out = s.replace(/\$([^$]+)\$/g, (_, tex: string) => plainTex(tex));
  if (/\\/.test(out)) throw new Error(`plain(): TeX left in "${out}"`);
  return out;
}
