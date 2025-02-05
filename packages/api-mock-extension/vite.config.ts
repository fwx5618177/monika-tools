import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { copyFileSync, statSync, mkdirSync } from 'fs';

// 复制文件函数
const copyFiles = (files: { from: string; to: string }[]) => {
  files.forEach(({ from, to }) => {
    const fromFile = path.join(__dirname, from);
    const toFile = path.join(__dirname, to);

    // 确保目标目录存在
    const dir = path.dirname(toFile);
    if (!statSync(dir, { throwIfNoEntry: false })) {
      mkdirSync(dir, { recursive: true });
    }

    copyFileSync(fromFile, toFile);

    const stats = statSync(toFile);
    if (stats.isFile()) {
      console.log(`copy ${from} to ${to} success`);
    } else {
      console.log(`copy ${from} to ${to} fail`);
      throw new Error(`copy ${from} to ${to} fail`);
    }
  });
};

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const outDir = 'dist';

  return {
    define: {
      'process.env': {
        NODE_ENV: isDevelopment ? 'development' : 'production',
      },
    },
    base: './',
    publicDir: false,
    build: {
      outDir,
      emptyOutDir: true,
      minify: !isDevelopment,
      sourcemap: isDevelopment,
      modulePreload: false,
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'index.html'),
          background: resolve(__dirname, 'src/background/index.ts'),
          content: resolve(__dirname, 'src/content/index.ts'),
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === 'background') {
              return 'background.js';
            }
            if (chunk.name === 'content') {
              return 'content.js';
            }
            if (chunk.name === 'popup') {
              return 'assets/[name].js';
            }
            return 'assets/[name].js';
          },
          chunkFileNames: 'assets/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'assets/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
          inlineDynamicImports: false,
        },
      },
      watch: isDevelopment ? {} : null,
      target: 'es2020',
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        scopeBehaviour: 'local',
        generateScopedName: isDevelopment
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:color";
            @use "@/styles/variables" as *;
            @use "@/styles/mixins" as *;
          `,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      {
        name: 'copy-extension-files',
        apply: 'build',
        closeBundle() {
          copyFiles([
            { from: 'manifest.json', to: `${outDir}/manifest.json` },
            { from: 'rules.json', to: `${outDir}/rules.json` },
            {
              from: 'public/icons/icon16.png',
              to: `${outDir}/icons/icon16.png`,
            },
            {
              from: 'public/icons/icon48.png',
              to: `${outDir}/icons/icon48.png`,
            },
            {
              from: 'public/icons/icon128.png',
              to: `${outDir}/icons/icon128.png`,
            },
          ]);
        },
      },
      {
        name: 'watch-extension',
        apply: 'serve',
        configureServer(server) {
          server.watcher.on('change', (file) => {
            if (file.includes('src') || file.includes('manifest.json')) {
              console.log('Rebuilding extension...');
              server.restart();
            }
          });
        },
      },
    ],
    server: {
      open: true,
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
  };
});
