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
 * Threads that have posts, with their counts, the one that published last first.
 * Closed threads keep their page and are listed after the active ones.
 */
export async function getThreads(): Promise<{ thread: Thread; count: number; last: Date }[]> {
  const threads = await getCollection('threads');
  const posts = await getPosts();
  const rows = threads
    .map((thread) => {
      const own = posts.filter((p) => threadIdOf(p) === thread.id);
      const last = own.map(publishedOf).sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date(0);
      return { thread, count: own.length, last };
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

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
  vartheta: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ',
  varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ',
  omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ',
  Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};
const SYMBOLS: Record<string, string> = {
  ...GREEK,
  infty: '∞', to: '→', rightarrow: '→', leftarrow: '←', gets: '←', Rightarrow: '⇒', Leftarrow: '⇐',
  Leftrightarrow: '⇔', leftrightarrow: '↔', iff: '⇔', implies: '⇒', mapsto: '↦', uparrow: '↑', downarrow: '↓',
  nearrow: '↗', searrow: '↘', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', sim: '∼',
  simeq: '≃', equiv: '≡', cong: '≅', propto: '∝', ll: '≪', gg: '≫', times: '×', cdot: '·', circ: '∘', ast: '∗',
  star: '⋆', pm: '±', mp: '∓', div: '÷', in: '∈', notin: '∉', ni: '∋', subset: '⊂', subseteq: '⊆',
  subsetneq: '⊊', supset: '⊃', supseteq: '⊇', setminus: '∖', cup: '∪', cap: '∩', bigcup: '∪', bigcap: '∩',
  sqcup: '⊔', emptyset: '∅', varnothing: '∅', sum: 'Σ', prod: 'Π', int: '∫', oint: '∮', partial: '∂',
  nabla: '∇', forall: '∀', exists: '∃', nexists: '∄', neg: '¬', lnot: '¬', wedge: '∧', land: '∧', vee: '∨',
  lor: '∨', oplus: '⊕', otimes: '⊗', perp: '⊥', top: '⊤', bot: '⊥', mid: '|', vert: '|', lvert: '|',
  rvert: '|', Vert: '‖', lVert: '‖', rVert: '‖', langle: '⟨', rangle: '⟩', lfloor: '⌊', rfloor: '⌋',
  lceil: '⌈', rceil: '⌉', colon: ':', dots: '…', ldots: '…', cdots: '⋯', vdots: '⋮', prime: '′', ell: 'ℓ',
  hbar: 'ℏ', aleph: 'ℵ', Re: 'ℜ', Im: 'ℑ', triangle: '△', square: '□', blacksquare: '■',
  lim: 'lim', limsup: 'lim sup', liminf: 'lim inf', sup: 'sup', inf: 'inf', max: 'max', min: 'min',
  log: 'log', ln: 'ln', exp: 'exp', sin: 'sin', cos: 'cos', tan: 'tan', det: 'det', dim: 'dim', ker: 'ker',
  deg: 'deg', gcd: 'gcd', arg: 'arg', Pr: 'Pr', mod: 'mod', bmod: 'mod',
  quad: ' ', qquad: ' ', left: '', right: '', big: '', Big: '', bigg: '', Bigg: '', bigl: '', bigr: '', Bigl: '',
  Bigr: '', displaystyle: '', textstyle: '', limits: '', nolimits: '',
};
const BLACKBOARD: Record<string, string> = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ', P: 'ℙ', E: '𝔼', '1': '1' };
const ACCENTS: Record<string, string> = { hat: '̂', widehat: '̂', bar: '̄', overline: '̅', tilde: '̃', widetilde: '̃', vec: '⃗', dot: '̇', ddot: '̈' };
const SUP: Record<string, string> = Object.fromEntries(
  [...'0123456789+-=()niabcdefghjklmoprstuvwxyz*\''].map((c, k) => [c, '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ*′'[k]]),
);
const SUB: Record<string, string> = Object.fromEntries(
  [...'0123456789+-=()aehijklmnoprstuvx'].map((c, k) => [c, '₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ'[k]]),
);
/**
 * A script as Unicode when every character has a raised or lowered form,
 * else written out in parentheses: χ_(A), because Unicode has no subscript A.
 */
const script = (body: string, map: Record<string, string>, mark: string) => {
  const chars = [...body.replace(/\s+/g, '')];
  return chars.every((c) => map[c]) ? chars.map((c) => map[c]).join('') : `${mark}(${body})`;
};
/** Scripts: ^{...}, ^x, _{...}, _x, innermost braces first. */
function scripts(s: string): string {
  for (let k = 0; k < 4; k++) {
    s = s
      .replace(/\^\{([^{}\\]*)\}/g, (m, b: string) => script(b, SUP, '^'))
      .replace(/_\{([^{}\\]*)\}/g, (m, b: string) => script(b, SUB, '_'))
      .replace(/\^([^{}\s(\\])/g, (m, b: string) => script(b, SUP, '^'))
      .replace(/_([^{}\s(\\])/g, (m, b: string) => script(b, SUB, '_'));
  }
  return s;
}
/** A group that needs parentheses when it becomes one side of a slash. */
const operand = (x: string) => (/^[\p{L}\p{N}.′]+$/u.test(x.trim()) ? x.trim() : `(${x.trim()})`);

/** One TeX formula as plain text: symbols as Unicode, scripts raised or lowered. */
function plainTex(tex: string): string {
  // Escaped characters wait behind placeholders, so that the braces and
  // underscores of the TeX syntax can be removed without touching them.
  const ESCAPED = '#{}%&_$|';
  const GROUP = '\\{([^{}]*)\\}';
  let s = tex
    .replace(/\\([#{}%&_$|])/g, (m, c: string) => (c === '|' ? '‖' : String.fromCharCode(0xe000 + ESCAPED.indexOf(c))))
    .replace(/\\\\/g, ' ')
    .replace(/\\[,;:! ]/g, ' ')
    // Symbols first, so that the arguments below are already plain.
    .replace(/\\([a-zA-Z]+)/g, (m, name: string) => (name in SYMBOLS ? SYMBOLS[name] : m));
  // TeX shorthand: \frac12, \sqrt[3]{x}.
  s = s
    .replace(/\\(d|t)?frac\s*(\d)\s*(\d)/g, '\\frac{$2}{$3}')
    .replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, (m, n: string, x: string) => `${script(n, SUP, '^')}√${operand(x)}`);
  // Commands with arguments and scripts, innermost first: an argument may hold
  // a script (\frac{1}{2^{n}}) and a script an argument (x^{\hat{y}}).
  for (let k = 0; k < 6; k++) {
    s = scripts(s)
      .replace(new RegExp(`\\\\mathbb${GROUP}`, 'g'), (m, c: string) => BLACKBOARD[c.trim()] ?? c)
      .replace(new RegExp(`\\\\(?:mathcal|mathscr|mathfrak|mathrm|mathbf|mathit|mathsf|boldsymbol|operatorname|text|textrm|textit|textbf|mbox)${GROUP}`, 'g'), '$1')
      .replace(new RegExp(`\\\\(${Object.keys(ACCENTS).join('|')})${GROUP}`, 'g'), (m, a: string, x: string) => `${x}${ACCENTS[a]}`)
      .replace(new RegExp(`\\\\(?:d|t)?frac${GROUP}${GROUP}`, 'g'), (m, a: string, b: string) => `${operand(a)}/${operand(b)}`)
      .replace(new RegExp(`\\\\binom${GROUP}${GROUP}`, 'g'), (m, a: string, b: string) => `C(${a.trim()}, ${b.trim()})`)
      .replace(new RegExp(`\\\\sqrt${GROUP}`, 'g'), (m, x: string) => `√${operand(x)}`);
  }
  const left = s.match(/\\([a-zA-Z]+)/);
  if (left) {
    const known = ['mathbb', 'frac', 'dfrac', 'tfrac', 'binom', 'sqrt', ...Object.keys(ACCENTS)].includes(left[1]);
    throw new Error(
      known
        ? `plain(): unsupported arguments for \\${left[1]} in "${tex}"`
        : `plain(): no plain form for \\${left[1]} in "${tex}"; add it to SYMBOLS in src/lib/site.ts`,
    );
  }
  s = scripts(scripts(s));
  return s
    .replace(/[{}]/g, '')
    // TeX ignores spaces: none inside brackets.
    .replace(/([⟨(\[⌊⌈])\s+/g, '$1')
    .replace(/\s+([⟩)\]⌋⌉])/g, '$1')
    .replace(/[\ue000-\ue007]/g, (c) => ESCAPED[c.charCodeAt(0) - 0xe000])
    .replace(/\s+/g, ' ')
    .trim();
}

/** The same string for `<title>`, meta tags, cards and the feed: no HTML, no TeX. */
export function plain(s: string): string {
  const out = s.replace(/\$([^$]+)\$/g, (_, tex: string) => plainTex(tex));
  if (/\\/.test(out)) throw new Error(`plain(): TeX left in "${out}"`);
  return out;
}

// Checked on every build: a change that breaks one of these stops it.
for (const [tex, text] of [
  ['$\\#\\mathcal{P}(X) > \\#X$', '#P(X) > #X'],
  ['$p^{(n)}_{ij}$', 'p⁽ⁿ⁾ᵢⱼ'],
  ['$\\mathbb{R}^n$', 'ℝⁿ'],
  ['$L^p$', 'Lᵖ'],
  ['$\\langle x, y \\rangle$', '⟨x, y⟩'],
  ['$\\frac{1}{2}$', '1/2'],
  ['$\\frac{1}{2^{n}}$', '1/2ⁿ'],
  ['$\\frac{\\lambda^{k}}{k!}$', 'λᵏ/(k!)'],
  ['$\\overline{E_{n}}$', 'Eₙ\u0305'],
  ['$\\frac12$', '1/2'],
  ['$\\sqrt[3]{x}$', '³√x'],
  ['$\\frac{\\beta}{\\alpha + \\beta}$', 'β/(α + β)'],
  ['$\\sqrt{2}$', '√2'],
  ['$\\hat{f}$', 'f̂'],
  ['$\\mathbf{1}_A$', '1_(A)'],
  ['$\\{ x \\in X : f(x) = 1 \\}$', '{ x ∈ X : f(x) = 1 }'],
  ['$\\mu^*$', 'μ*'],
  ['$\\sigma$-algebra', 'σ-algebra'],
]) {
  const got = plain(tex);
  if (got !== text) throw new Error(`plain() self-test: "${tex}" gave "${got}", expected "${text}"`);
}
