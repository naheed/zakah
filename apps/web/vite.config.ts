import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Look for .env in the monorepo root where Lovable Cloud auto-manages it
  envDir: path.resolve(__dirname, "../.."),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "jay-peg": path.resolve(__dirname, "../../node_modules/jay-peg/dist/index.cjs"),
      "restructure": path.resolve(__dirname, "../../node_modules/restructure/dist/main.cjs"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
}));
