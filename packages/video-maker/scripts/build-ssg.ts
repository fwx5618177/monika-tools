#!/usr/bin/env node

import fs from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { ssgRoutes } from '../src/config/routes.ssg';

require.extensions['.scss'] = () => ({});

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', '..', 'dist');
const ssgDir = resolve(outDir, 'ssg');

async function generateStaticPages() {
  console.log('Generating Static Pages...');
  const render = (await import(resolve(ssgDir, 'server.js'))).render;

  const ssrManifest = JSON.parse(
    await fs.readFile(resolve(ssgDir, '.vite', 'ssr-manifest.json'), 'utf-8')
  );

  const manifest = JSON.parse(
    await fs.readFile(resolve(ssgDir, '.vite', 'manifest.json'), 'utf-8')
  );

  const templateHtml = await fs.readFile(
    resolve(__dirname, '..', 'index.html'),
    'utf-8'
  );

  for (const route of ssgRoutes) {
    const url = route.path === '*' ? '/404' : (route.path as string); // 为 404 页设置路径
    const { html, helmet, preloadLinks } = await render(url, ssrManifest);

    // const headContent = [
    //   helmet?.title?.toString(),
    //   helmet?.meta?.toString(),
    //   helmet?.link?.toString(),
    //   helmet?.style?.toString(),
    //   helmet?.script?.toString(),
    //   preloadLinks,
    // ]
    //   .filter(Boolean)
    //   .join('');
    // console.log('Generating:', helmet, headContent);

    // 用渲染后的内容替换模板中的占位符
    const fullHtml = templateHtml
      .replace(`<title>{{ title }}</title>`, '')
      .replace(`<!--app-head-->`, `${helmet?.head || ''}${preloadLinks || ''}`)
      .replace(`<!--app-html-->`, html || '');

    let filePath;
    if (url === '/404') {
      filePath = resolve(ssgDir, '404.html');
    } else if (url === '/error') {
      filePath = resolve(ssgDir, 'error.html');
    } else {
      filePath = resolve(
        ssgDir,
        `${url === '/' ? 'index' : url.replace('/', '')}.html`
      );
    }

    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, fullHtml);
  }
}

generateStaticPages()
  .then(() => {
    console.log('SSG Complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('SSG Generation Error:', error);
    process.exit(1);
  });
