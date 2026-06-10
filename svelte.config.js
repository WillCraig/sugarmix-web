import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPage =
  process.env.GITHUB_PAGES === 'true' &&
  repositoryName &&
  !repositoryName.endsWith('.github.io');
const base =
  process.env.BASE_PATH ?? (isProjectPage ? `/${repositoryName}` : '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      strict: true,
    }),
    paths: {
      base,
    },
  },
};

export default config;
