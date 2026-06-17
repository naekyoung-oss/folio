import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const base = '/folio/';

// Dev-only: serve <dir>/index.html for trailing-slash requests so the dev
// server matches GitHub Pages, which resolves directory indexes in production.
// Only rewrites when the index.html actually exists in the public dir, so the
// site root ("/folio/") and unknown routes are left untouched.
function publicDirIndex() {
  return {
    name: 'public-dir-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const [urlPath, query] = req.url.split('?');
          if (urlPath.endsWith('/')) {
            const rel = urlPath.startsWith(base)
              ? urlPath.slice(base.length)
              : urlPath.replace(/^\//, '');
            if (rel && fs.existsSync(path.join(server.config.publicDir, rel, 'index.html'))) {
              req.url = urlPath + 'index.html' + (query ? '?' + query : '');
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [publicDirIndex()],
});
