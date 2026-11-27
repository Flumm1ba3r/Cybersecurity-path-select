import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Base path for GitHub Pages.
 *
 * - Default `./` (relative) works under ANY sub-path, because the app uses
 *   HashRouter – so a fork or renamed repository needs no changes.
 * - To pin an absolute base (e.g. `/my-repo/`), set BASE_PATH when building:
 *     BASE_PATH=/my-repo/ npm run build
 *   The GitHub Actions workflow sets it automatically from the repository name.
 */
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
});
