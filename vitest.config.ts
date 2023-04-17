import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.{test,unit,integration}.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html", "lcov"],
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 80,
    },
  },
})
