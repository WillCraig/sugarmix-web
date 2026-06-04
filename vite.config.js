import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const defaultPagesBase =
  !repoName || repoName.endsWith('.github.io') ? '/' : `/${repoName}/`;
const pagesBase =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_PAGES === 'true' ? defaultPagesBase : '/');

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase,
  plugins: [react()],
});
