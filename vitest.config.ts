import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      include: ["src/**/*"],
      exclude: ["**/__tests__/**/*", "**/*.test.ts"],
    },
    exclude: ["node_modules", "dist", ".git", ".cache"],
  },
});
