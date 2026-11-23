import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    target: 'es2020',
  },
  server: {
    host: true,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
