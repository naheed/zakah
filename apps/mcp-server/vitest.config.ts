import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Node environment for MCP server (no DOM)
        environment: 'node',
        include: ['src/**/*.test.ts'],
        // No global setup file — MCP server tests are self-contained
    },
});
