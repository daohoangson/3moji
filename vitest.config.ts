import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // Mock server-only for tests (it throws outside Next.js server context)
      "server-only": path.resolve(__dirname, "./lib/__mocks__/server-only.ts"),
    },
  },
});
