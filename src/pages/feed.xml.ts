import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getPosts, postUrl, plain } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.line,
    site: context.site ?? 'http://localhost',
    trailingSlash: false,
    items: posts.map((p) => ({
      title: plain(p.data.title),
      pubDate: p.data.date,
      description: plain(p.data.summary ?? p.data.title),
      link: postUrl(p),
    })),
  });
}
