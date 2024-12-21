import path, { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import commonjs from 'vite-plugin-commonjs';

import { PwaConfig } from './scripts/pwa';

export default defineConfig(({ mode }) => {
  const isSSR = process.env.BUILD_TARGET === 'server';
  const isClient = process.env.BUILD_TARGET === 'client';
  const isSPA = process.env.BUILD_TARGET === 'spa';
  const isSSG = process.env.BUILD_TARGET === 'ssg';

  console.log('isSPA:', isSPA, isClient);

  const outDir = isSSR
    ? '../dist/server'
    : isClient
      ? '../dist/client'
      : isSSG
        ? '../dist/ssg'
        : '../dist';

  return {
    base: './',
    define: {
      'process.env.isSSR': isSSR,
      'process.env.isSSG': isSSG,
    },
    plugins: [
      ...(isClient || isSPA || isSSG
        ? [
            createHtmlPlugin({
              inject: {
                data: {
                  title: 'Monika Tools',
                },
              },
            }),
          ]
        : []),
      react(),
      commonjs(),
      VitePWA(PwaConfig),
    ],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@config': path.resolve(__dirname, './src/config'),
        '@seo': path.resolve(__dirname, './src/seo'),
        '@utils': path.resolve(__dirname, './src/utils'),
        buffer: 'buffer',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@styles/variables.scss";`,
        },
      },
    },
    build: {
      sourcemap: mode === 'development',
      // sourcemap: true,
      // minify: false,
      outDir,
      assetsDir: '.',
      ssrManifest: isClient || isSPA || isSSG ? true : undefined,
      manifest: isClient || isSPA || isSSG ? true : undefined,
      emptyOutDir: true,
      rollupOptions: {
        input: isSSG
          ? {
              index: resolve(__dirname, 'index.html'), // index.html 入口
              server: './src/entry-server.tsx', // entry-server 入口
            }
          : isSSR
            ? './src/entry-server.tsx'
            : isSPA
              ? resolve(__dirname, 'index.html')
              : './src/entry-client.tsx',
        output: {
          dir: outDir,
          entryFileNames: isSSR ? '[name].js' : undefined,
          chunkFileNames: '[name]-[hash].js',
        },
        preserveEntrySignatures: 'strict',
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
        },
        mangle: false,
      },
      commonjsOptions: {
        // 确保支持 CommonJS 模块的 require
        include: [/node_modules/], // 确保 node_modules 中的模块都被处理
      },
    },
    ssr: {
      external: ['react', 'react-dom', 'react-router-dom'],
      noExternal: ['react-helmet-async', '@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'natural'],
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
  };
});
