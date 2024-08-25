import fs from 'node:fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';

// Constants
const __dirname = dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const base = process.env.BASE || '/';

// Cached production assets
const distDir = resolve(__dirname, '..', '..', 'dist/client');
const templateHtml = isProduction
  ? await fs.readFile(resolve(__dirname, '..', 'index.html'), 'utf-8')
  : '';
const ssrManifest = isProduction
  ? JSON.parse(
      await fs.readFile(resolve(distDir, '.vite/ssr-manifest.json'), 'utf-8')
    )
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv(distDir, { extensions: [] }));
}

app.get('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;

    if (!isProduction) {
      // In development, always read fresh template
      template = await fs.readFile(
        resolve(__dirname, '..', 'index.html'),
        'utf-8'
      );
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      const entryServerModule = await import(
        resolve(distDir, '../server/entry-server.js')
      );
      render = entryServerModule.render;
    }

    const {
      html,
      helmet,
      preloadLinks,
      statusCode = 200,
    } = await render(url, ssrManifest);

    const fullHtml = template
      .replace(`{{ title }}`, 'Monica Tools')
      .replace(`<!--app-head-->`, `${helmet?.head || ''}${preloadLinks || ''}`)
      .replace(`<!--app-html-->`, html || '');

    res.status(statusCode).set({ 'Content-Type': 'text/html' }).send(fullHtml);
  } catch (error) {
    if (!isProduction && vite) {
      vite.ssrFixStacktrace(error);
    }

    console.error('Rendering error:', error);
    if (isProduction) {
      res.status(500).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>500 - Internal Server Error</title>
          </head>
          <body>
            <h1>500 - Internal Server Error</h1>
            <p>Something went wrong on our end. Please try again later.</p>
          </body>
          </html>
        `);
    } else {
      res.status(500).end(error.stack);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
