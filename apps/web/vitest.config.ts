
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        include: [
            'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
            'tests/integration/**/*.{test,spec}.{ts,tsx}'
        ], // Logic and integration tests within src/
        css: false, // Disable CSS processing
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
