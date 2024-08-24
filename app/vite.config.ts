import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

import { PwaConfig } from './scripts/pwa';

export default defineConfig(({ mode, command }) => {
  const isSSR = command === 'build' && process.env.BUILD_TARGET === 'server';
  const isClient = command === 'build' && process.env.BUILD_TARGET === 'client';
  console.log('mode:', mode);

  const outDir = isSSR
    ? '../dist/server'
    : isClient
      ? '../dist/client'
      : '../dist';

  return {
    define: {
      'process.env.VITE_APP_TITLE': JSON.stringify(process.env.VITE_APP_TITLE),
    },
    plugins: [
      react(),
      VitePWA(PwaConfig),
      createHtmlPlugin({
        inject: {
          data: {
            title: 'Monika Tools',
          },
        },
      }),
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
      sourcemap: mode === 'development',
      outDir,
      assetsDir: '.',
      ssrManifest: isClient ? true : undefined,
      emptyOutDir: true,
      rollupOptions: {
        input: isSSR ? './src/entry-server.tsx' : './src/entry-client.tsx',
        output: {
          // manualChunks: {
          //   react: ['react'],
          //   'react-dom': ['react-dom'],
          //   'react-router-dom': ['react-router-dom'],
          // },
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
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:5000",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
