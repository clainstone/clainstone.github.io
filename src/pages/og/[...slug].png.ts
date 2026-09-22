// The link-preview card of every page: /og/index.png for the main page,
// /og/threads.png, /og/threads/<thread>.png and /og/threads/<thread>/<post>.png.
import type { APIRoute } from 'astro';
import { cardPng, type Card } from '../../lib/cards';
import { SITE, getPosts, getThreads, threadOf, formatDate, plain } from '../../lib/site';

export async function getStaticPaths() {
  const paths: { params: { slug: string }; props: { card: Card } }[] = [
    { params: { slug: 'index' }, props: { card: { title: SITE.name, text: SITE.line, photo: true } } },
    { params: { slug: 'threads' }, props: { card: { kicker: 'Threads', title: 'Notes, one subject per thread', text: SITE.description } } },
  ];
  for (const { thread, count } of await getThreads()) {
    paths.push({
      params: { slug: `threads/${thread.id}` },
      props: { card: { kicker: 'Thread', title: plain(thread.data.title), text: thread.data.description, note: `${count} ${count === 1 ? 'post' : 'posts'}` } },
    });
  }
  for (const post of await getPosts()) {
    const thread = await threadOf(post);
    paths.push({
      params: { slug: `threads/${post.id}` },
      props: { card: { kicker: plain(thread.data.title), title: plain(post.data.title), note: formatDate(post.data.date) } },
    });
  }
  return paths;
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await cardPng((props as { card: Card }).card)), { headers: { 'Content-Type': 'image/png' } });
