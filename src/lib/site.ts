import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import katex from 'katex';
import site from '../../content/site.json';

export type Thread = CollectionEntry<'threads'>;
export type Post = CollectionEntry<'posts'>;

export const SITE = site;

/** The portrait, whichever file `site.json` names. */
const photos = import.meta.glob<{ default: ImageMetadata }>('../../content/photo.*', { eager: true });
export const PHOTO: ImageMetadata = Object.entries(photos).find(([p]) => p.endsWith(`/${site.photo}`))![1].default;

/** Posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id));
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

/** Active threads that have posts, with their counts, most recently active first. */
export async function getThreads(): Promise<{ thread: Thread; count: number; last: Date }[]> {
  const threads = await getCollection('threads');
  const posts = await getPosts();
  const rows = threads
    .filter((t) => t.data.status === 'active')
    .map((thread) => {
      const own = posts.filter((p) => threadIdOf(p) === thread.id);
      return { thread, count: own.length, last: own[0]?.data.date ?? new Date(0) };
    })
    .filter((row) => row.count > 0);
  return rows.sort((a, b) => b.last.getTime() - a.last.getTime() || a.thread.data.title.localeCompare(b.thread.data.title));
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

const SYMBOLS: Record<string, string> = { infty: '∞', to: '→', le: '≤', ge: '≥', ne: '≠', times: '×', cdot: '·', pm: '±', alpha: 'α', beta: 'β', lambda: 'λ', mu: 'μ', pi: 'π', sigma: 'σ', ell: 'ℓ' };

/** The same string for `<title>`, meta tags and the feed: no HTML. */
export function plain(s: string): string {
  return s.replace(/\$([^$]+)\$/g, (_, tex: string) =>
    tex.replace(/\\([a-zA-Z]+)/g, (m, name) => SYMBOLS[name] ?? m.slice(1)).replace(/[{}]/g, '').replace(/\s+/g, ' ').trim(),
  );
}
