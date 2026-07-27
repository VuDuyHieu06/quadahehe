import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API -> backend :4000 để khỏi CORS trong dev
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
