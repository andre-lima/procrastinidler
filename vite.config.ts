import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './', // optionally give a base path, useful for itch.io to serve relative instead of the default absolute
  plugins: [react()],
  server: {
    host: true, // or use '0.0.0.0'
    port: 5173, // default port
  },
  build: {
    cssCodeSplit: false,
  },
});
