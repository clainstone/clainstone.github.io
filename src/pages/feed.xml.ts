import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getRecentPosts, getBlogPosts, postUrl, blogUrl, plain, publishedOf } from '../lib/site';

export async function GET(context: APIContext) {
  // Thread posts and blog posts together, most recently published first.
  const items = [
    ...(await getRecentPosts()).map((p) => ({ data: p.data, link: postUrl(p) })),
    ...(await getBlogPosts()).map((p) => ({ data: p.data, link: blogUrl(p) })),
  ].sort((a, b) => publishedOf(b).getTime() - publishedOf(a).getTime());
  const site = context.site ?? new URL('http://localhost');
  const newest = items[0] ? publishedOf(items[0]) : new Date(0);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${SITE.language.toLowerCase()}</language>`,
      `<lastBuildDate>${newest.toUTCString()}</lastBuildDate>`,
      `<atom:link href="${new URL('/feed.xml', site)}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items: items.map((p) => ({
      title: plain(p.data.title),
      pubDate: publishedOf(p),
      description: plain(p.data.summary ?? p.data.title),
      link: p.link,
    })),
  });
}
