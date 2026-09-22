import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getRecentPosts, postUrl, plain, publishedOf } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getRecentPosts();
  const site = context.site ?? new URL('http://localhost');
  const newest = posts[0] ? publishedOf(posts[0]) : new Date(0);
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
    items: posts.map((p) => ({
      title: plain(p.data.title),
      pubDate: publishedOf(p),
      description: plain(p.data.summary ?? p.data.title),
      link: postUrl(p),
    })),
  });
}
