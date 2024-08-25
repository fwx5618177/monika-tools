#!/usr/bin/env node

import fs from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { ssgRoutes } from '../src/config/routes.ssg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', '..', 'dist');

async function generateStaticPages() {
  const render = (await import(resolve(outDir, 'ssg', 'entry-server.js')))
    .render;
  const ssrManifest = JSON.parse(
    await fs.readFile(
      resolve(outDir, 'ssg', '.vite', 'ssr-manifest.json'),
      'utf-8'
    )
  );

  const templateHtml = await fs.readFile(
    resolve(__dirname, '..', 'index.html'),
    'utf-8'
  );

  for (const route of ssgRoutes) {
    const url = route.path === '*' ? '/404' : (route.path as string); // 为 404 页设置路径
    const { html, helmet, preloadLinks } = await render(url, ssrManifest);

    const headContent = [
      helmet?.title?.toString(),
      helmet?.meta?.toString(),
      helmet?.link?.toString(),
      helmet?.style?.toString(),
      helmet?.script?.toString(),
      preloadLinks,
    ]
      .filter(Boolean)
      .join('');
    console.log('Generating:', helmet, headContent);

    // 用渲染后的内容替换模板中的占位符
    const fullHtml = templateHtml
      .replace(`<title>{{ title }}</title>`, '')
      .replace(`<!--app-head-->`, `${headContent || ''}${preloadLinks || ''}`)
      .replace(`<!--app-html-->`, html || '');

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
    await fs.writeFile(filePath, fullHtml);
  }
}

generateStaticPages()
  .then(() => {
    console.log('SSG Complete');
  })
  .catch((error) => {
    console.error('SSG Generation Error:', error);
  });
