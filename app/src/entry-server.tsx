import {
  renderToPipeableStream,
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import * as pkg from 'react-helmet-async';
const { HelmetProvider } = pkg;

export function render(
  url: string,
  manifest?: Record<string, string[]>,
  res: Response | null = null
) {
  const helmetContext = {};
  const statusCode = 200;
  const isSSG = process.env.isSSG;
  const isSSR = process.env.isSSR;

  // 在 SSR 环境中优先使用 renderToPipeableStream，如果不可用则降级为 renderToString
  if (isSSR && typeof renderToPipeableStream === 'function') {
    return new Promise((resolve, reject) => {
      const stream = renderToPipeableStream(
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>,
        {
          onShellReady() {
            if (res) {
              (res as any)?.setHeader('Content-Type', 'text/html');
              stream.pipe(res as any);
            } else {
              resolve({ stream, helmetContext });
            }
          },
          onShellError(error) {
            reject(error);
          },
          onAllReady() {
            resolve({ stream, helmetContext });
          },
          onError(error) {
            console.error('Stream error:', error);
          },
        }
      );
    });
  }

  // SSG 使用 renderToStaticMarkup，SSR 回退至 renderToString
  const html = isSSG
    ? renderToStaticMarkup(
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      )
    : renderToString(
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      );

  // 使用 ssrManifest 来生成预加载标签，并处理 files 不是数组的情况
  const preloadLinks = manifest
    ? Array.from(
        new Set(
          Object.keys(manifest)
            .flatMap((key) => {
              const files = manifest[key];
              if (Array.isArray(files)) {
                return files;
              } else if (typeof files === 'string') {
                return [files];
              }
              return [];
            })
            .filter(Boolean) // 过滤掉空字符串或非文件路径
        )
      )
        .map((file) => {
          if (file.endsWith('.js')) {
            return `<script type="module" src="${file}"></script>`;
          } else if (file.endsWith('.css')) {
            return `<link rel="stylesheet" href="${file}">`;
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
