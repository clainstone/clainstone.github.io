// Every published page, at the address GitHub Pages serves it (no .html).
import type { APIRoute } from 'astro';
import { getPosts, getThreads, postUrl, threadUrl, publishedOf, isoDate } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const newest = posts.map((p) => p.data.updated ?? publishedOf(p)).sort((a, b) => b.getTime() - a.getTime())[0];
  const rows: [string, Date | undefined][] = [['/', newest], ['/threads', newest]];
  for (const { thread } of await getThreads()) {
    const own = posts.filter((p) => p.id.startsWith(`${thread.id}/`)).map((p) => p.data.updated ?? publishedOf(p));
    rows.push([threadUrl(thread), own.sort((a, b) => b.getTime() - a.getTime())[0]]);
  }
  for (const p of posts) rows.push([postUrl(p), p.data.updated ?? publishedOf(p)]);
  const body = rows
    .map(([path, last]) => `  <url><loc>${new URL(path, site)}</loc>${last ? `<lastmod>${isoDate(last)}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
