import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vitest/config';

import manifest from './manifest.config';

export default defineConfig({
  plugins: [crx({ manifest })],
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/types/**'],
    },
  },
});
