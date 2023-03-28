import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,unit,integration}.{ts,tsx}'],
    environment: "jsdom",
    setupFiles: ['<rootDir>/vitest.setup.ts'],
    coverage: {
      all: true,
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 80,
    },
  },
})
