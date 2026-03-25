// vite.config.js
// Multi-page app config. Each module has its own index.html entry point.
// Run: npm run dev   → dev server with HMR
//      npm run build → production build to dist/

import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Collects all module entry points from modules/*/index.html. */
function moduleEntries() {
  const modulesDir = resolve(__dirname, 'modules');
  if (!existsSync(modulesDir)) return {};
  return Object.fromEntries(
    readdirSync(modulesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => resolve(modulesDir, d.name, 'index.html'))
      .filter(existsSync)
      .map(p => {
        const name = p.replace(__dirname + '/', '').replace('/index.html', '').replace('/', '-');
        return [name, p];
      })
  );
}

export default defineConfig({
  root: __dirname,
  // No custom publicDir — data/ is served as static files in dev (Vite serves
  // the full root), and copied explicitly to dist/ in the deploy workflow.
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...moduleEntries(),
      },
    },
  },
  server: {
    open: true,
  },
});
