
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        include: ['src/lib/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // Focus on logic tests
        css: false, // Disable CSS processing
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
