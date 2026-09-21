import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { globSync, readFileSync } from 'node:fs';

// The content lives in ./content. Paths are relative to the project root.
const CONTENT = './content';

// Sample posts (`sample: true`) are demonstrations: the dev server shows them,
// a build leaves them out of the collection so their components are not bundled.
const SAMPLES = import.meta.env.DEV
  ? []
  : globSync('**/index.mdx', { cwd: `${CONTENT}/posts` }).filter((file) =>
      /^sample:\s*true\s*$/m.test(readFileSync(`${CONTENT}/posts/${file}`, 'utf8').split(/^---\s*$/m)[1] ?? ''),
    );

export const threads = defineCollection({
  loader: glob({ pattern: '*.md', base: `${CONTENT}/threads` }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'closed']).default('active'),
  }),
});

export const posts = defineCollection({
  loader: glob({
    pattern: ['**/index.mdx', ...SAMPLES.map((file) => `!${file}`)],
    base: `${CONTENT}/posts`,
    // "boids-in-a-kitty-terminal/two-thousand-sprites/index.mdx"
    // becomes "boids-in-a-kitty-terminal/two-thousand-sprites".
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

export const collections = { threads, posts };
