import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'EinfachPatho',
        short_name: 'EinfachPatho',
        description:
          'Erfasse Krankheiten per Freitext und erhalte automatisch einen strukturierten DURST-Datensatz mit Quiz.',
        lang: 'de',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        background_color: '#f5f7f7',
        theme_color: '#0e6e66',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App-Shell + gebundelte Assets werden gecacht; API-Aufrufe (Login,
        // Krankheiten, KI-Generierung) laufen bewusst immer live gegen das
        // Django-Backend und werden hier NICHT gecacht.
        globPatterns: ['**/*.{js,css,html,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/icons/'),
            handler: 'CacheFirst',
            options: { cacheName: 'einfachpatho-icons' },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
