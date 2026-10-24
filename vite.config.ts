import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core Framework (React, React-DOM, React-Router)
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/')
            ) {
              return 'vendor-react';
            }
            // UI & Animation Libraries (Framer Motion, Lucide Icons, Canvas Confetti)
            if (
              id.includes('framer-motion') ||
              id.includes('lucide-react') ||
              id.includes('canvas-confetti')
            ) {
              return 'vendor-ui';
            }
            // Backend, Utilities & Supabase Client
            if (id.includes('@supabase')) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
})
