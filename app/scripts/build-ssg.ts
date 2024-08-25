import fs from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import routes from '../dist/config/routes';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', '..', 'dist');

async function generateStaticPages() {
  const render = (await import(resolve(outDir, 'server', 'entry-server.js')))
    .render;
  const ssrManifest = JSON.parse(
    await fs.readFile(
      resolve(outDir, 'client', '.vite', 'ssr-manifest.json'),
      'utf-8'
    )
  );

  for (const route of routes) {
    const url = route.path === '*' ? '/404' : (route.path as string); // 为 404 页设置路径
    const { html } = await render(url, ssrManifest);

    const filePath =
      url === '/404'
        ? resolve(outDir, 'ssg', '404.html')
        : resolve(
            outDir,
            'ssg',
            `${url === '/' ? 'index' : url.replace('/', '')}.html`
          );

    console.log('filePath:', url, filePath);
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, html);
  }
}

generateStaticPages()
  .then(() => {
    console.log('SSG Complete');
  })
  .catch((error) => {
    console.error('SSG Generation Error:', error);
  });
