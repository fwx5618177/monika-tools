import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import App from './App.tsx';

import * as pkg from 'react-helmet-async';
const { HelmetProvider } = pkg;

export function render(url: string, manifest?: Record<string, string[]>) {
  const helmetContext = {};
  const statusCode = 200;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  // 使用 ssrManifest 来生成预加载标签，并处理 files 不是数组的情况
  const preloadLinks = manifest
    ? Object.keys(manifest)
        .map((key) => {
          const files = manifest[key];
          if (Array.isArray(files)) {
            return files
              .map((file) => {
                if (file.endsWith('.js')) {
                  return `<script type="module" src="/${file}"></script>`;
                } else if (file.endsWith('.css')) {
                  return `<link rel="stylesheet" href="/${file}">`;
                }
                return '';
              })
              .join('');
          } else if (typeof files === 'string') {
            if ((files as string)?.endsWith('.js')) {
              return `<script type="module" src="/${files}"></script>`;
            } else if ((files as string)?.endsWith('.css')) {
              return `<link rel="stylesheet" href="/${files}">`;
            }
            return '';
          }
          return '';
        })
        .join('')
    : '';

  // @ts-expect-error
  const { helmet } = helmetContext;

  return {
    html,
    preloadLinks,
    helmet,
    statusCode,
  };
}
