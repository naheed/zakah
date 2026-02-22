import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Single HTML file output for MCP Apps resource embedding
        rollupOptions: {
            output: {
                // Inline all JS/CSS into a single HTML file
                manualChunks: undefined,
            },
        },
        // Inline assets under 100KB (most widget assets)
        assetsInlineLimit: 102400,
        // Output to dist/ for the MCP server to read
        outDir: 'dist',
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
