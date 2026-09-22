// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import headingAnchors from './src/plugins/heading-anchors.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The public address of the site. Links are root-absolute, so the site must
// be served at the root of this domain.
const SITE_URL = 'https://clainstone.com';

// In GitHub Actions (CI=true) refuse to build with placeholders left in.
if (process.env.CI) {
  const site = JSON.parse(readFileSync(new URL('./content/site.json', import.meta.url), 'utf8'));
  const missing = [];
  if (SITE_URL === 'https://example.com') missing.push('SITE_URL in astro.config.mjs');
  if (site.emailIsPlaceholder) missing.push('email in content/site.json (then set emailIsPlaceholder to false)');
  if (missing.length) throw new Error(`Placeholders left: ${missing.join('; ')}`);
}

const math = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [[rehypeKatex, { strict: false }], headingAnchors],
};

export default defineConfig({
  site: SITE_URL,
  // Port 4300 is the one reached from the laptop through `ssh homelab`.
  // Bind every interface: the site runs inside a container.
  server: { host: '0.0.0.0', port: 4300 },
  compressHTML: true,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), svelte()],
  markdown: {
    processor: unified(math),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
  vite: {
    // Fail instead of moving to another port the tunnel does not reach.
    server: { strictPort: true },
    preview: { strictPort: true },
    resolve: {
      alias: { '@toolkit': fileURLToPath(new URL('./content/toolkit', import.meta.url)) },
    },
    build: {
      // three.js and p5 posts ship large chunks by nature; the limit only
      // controls Rollup's warning.
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        // MDX posts carry a "use astro:head-inject" directive that Rollup
        // reports as unpreserved; Astro handles it before bundling.
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && /astro:head-inject/.test(warning.message)) return;
          warn(warning);
        },
      },
    },
  },
});
