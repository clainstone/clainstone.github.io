// The index of a thread of lectures, built once with the site and fetched by
// the panel of LectureIndex.astro on first use, so that no post page carries
// it. `problems` lists, post by post, what breaks the thread's numbering or
// lacks a description: `make check-site` and `make check-post` report them.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postsOf } from '../../../lib/site';
import { lectureOf, indexHtml, threadProblems } from '../../../lib/statements';

export async function getStaticPaths() {
  const threads = await getCollection('threads');
  return threads.filter((t) => t.data.index).map((t) => ({ params: { thread: t.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lectures = (await postsOf(params.thread!)).map(lectureOf);
  const problems = [
    ...lectures.flatMap((l) => l.problems.map((message) => ({ post: l.post.id, message }))),
    ...threadProblems(lectures),
  ];
  return new Response(JSON.stringify({ html: indexHtml(lectures), problems }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
