import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(rawId) {
          const id = rawId.replace(/\\/g, '/');
          if (!id.includes('node_modules/')) return undefined;

          // 1a. ProseMirror Core Engine
          if (
            id.includes('/prosemirror-') ||
            id.includes('/orderedmap/') ||
            id.includes('/rope-sequence/') ||
            id.includes('/w3c-keyname/') ||
            id.includes('/crelt/')
          ) {
            return 'vendor-prosemirror';
          }

          // 1b. TipTap Extensions & React Wrapper (checked BEFORE /react/)
          if (id.includes('/@tiptap/') || id.includes('/linkifyjs/')) {
            return 'vendor-tiptap';
          }

          // 2a. Chart State & Toolkit (Redux Toolkit, Immer, Reselect, es-toolkit used by Recharts 3)
          if (
            id.includes('/react-redux/') ||
            id.includes('/@reduxjs/toolkit/') ||
            id.includes('/redux/') ||
            id.includes('/reselect/') ||
            id.includes('/immer/') ||
            id.includes('/es-toolkit/')
          ) {
            return 'vendor-chart-state';
          }

          // 2b. D3 Math, Scales & Shapes
          if (
            id.includes('/d3-') ||
            id.includes('/internmap/') ||
            id.includes('/victory-vendor/') ||
            id.includes('/decimal.js-light/') ||
            id.includes('/eventemitter3/')
          ) {
            return 'vendor-d3';
          }

          // 2c. Recharts UI Components
          if (id.includes('/recharts/')) {
            return 'vendor-recharts';
          }

          // 3. Drag & Drop (@dnd-kit)
          if (id.includes('/@dnd-kit/')) {
            return 'vendor-dnd';
          }

          // 4. Animation Engine (Framer Motion)
          if (
            id.includes('/framer-motion/') ||
            id.includes('/motion-dom/') ||
            id.includes('/motion-utils/')
          ) {
            return 'vendor-motion';
          }

          // 5. Icon System (Lucide React)
          if (id.includes('/lucide-react/')) {
            return 'vendor-icons';
          }

          // 6. Backend & Auth (Supabase SDK)
          if (id.includes('/@supabase/')) {
            return 'vendor-supabase';
          }

          // 7. Sanitization & Security Utilities (DOMPurify, Confetti)
          if (id.includes('/dompurify/') || id.includes('/canvas-confetti/')) {
            return 'vendor-security';
          }

          // 8. Routing (React Router)
          if (
            id.includes('/react-router/') ||
            id.includes('/react-router-dom/') ||
            id.includes('/@remix-run/')
          ) {
            return 'vendor-router';
          }

          // 9. Core React Runtime (React + ReactDOM + Scheduler)
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }

          return undefined;
        },
      },
    },
  },
})
