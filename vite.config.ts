import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Root-level Vite config that wraps apps/web for Lovable Cloud builds
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  publicDir: path.resolve(__dirname, "apps/web/public"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/web/src"),
      "@zakatflow/core": path.resolve(__dirname, "packages/core/src/index.ts"),
      "jay-peg": path.resolve(__dirname, "node_modules/jay-peg/dist/index.cjs"),
      "restructure": path.resolve(__dirname, "node_modules/restructure/dist/main.cjs"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./apps/web/src/test/setup.ts",
  },
}));
