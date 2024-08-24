import { VitePWAOptions } from 'vite-plugin-pwa';

export const PwaConfig: VitePWAOptions = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Monika Tools - PWA',
    short_name: 'App',
    description: 'Monika Tools description',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  workbox: {
    // Workbox configuration for advanced caching
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.origin === 'https://example.com',
        handler: 'CacheFirst',
        options: {
          cacheName: 'example-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
  injectRegister: null,
  minify: true,
  injectManifest: {},
  includeManifestIcons: false,
  disable: false,
};
