import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setup-vitest.ts', // Optional: for global setup like @testing-library/jest-dom
    globals: true, // Optional: if you want to use global functions like `describe`, `it`, `expect`
  },
});
