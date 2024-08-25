import path, { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

import { PwaConfig } from './scripts/pwa';

export default defineConfig(({ mode, command }) => {
  const isSSR = process.env.BUILD_TARGET === 'server';
  const isClient = process.env.BUILD_TARGET === 'client';
  const isSPA = process.env.BUILD_TARGET === 'spa';
  const isSSG = process.env.BUILD_TARGET === 'ssg';

  const outDir = isSSR
    ? '../dist/server'
    : isClient
      ? '../dist/client'
      : isSSG
        ? '../dist/ssg'
        : '../dist/ssg';

  return {
    define: {
      'process.env.VITE_APP_TITLE': JSON.stringify(process.env.VITE_APP_TITLE),
      'process.env.isSSR': isSSR,
      'process.env.isSSG': isSSG,
    },
    plugins: [
      react(),
      VitePWA(PwaConfig),
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
      },
    },
    build: {
      // sourcemap: mode === 'development',
      sourcemap: true,
      minify: false,
      outDir,
      assetsDir: '.',
      ssrManifest: isClient || isSPA || isSSG ? true : undefined,
      emptyOutDir: true,
      rollupOptions: {
        input: isSSR
          ? './src/entry-server.tsx'
          : isSPA || isSSG
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
    },
    ssr: {
      external: ['react', 'react-dom', 'react-router-dom'],
      noExternal: ['react-helmet-async'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
