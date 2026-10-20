import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Same-origin /api in dev, like the Vercel rewrite in production.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
