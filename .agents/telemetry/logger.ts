import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AgentEvent } from './types.js';

// Resolve the root `.agents` directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AGENTS_DIR = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(AGENTS_DIR, 'logs', 'orchestration');

/**
 * Appends a structured telemetry event to a partitioned JSONL file.
 * The file is partitioned by Year-Month to keep scale manageable.
 */
export async function appendTelemetryEvent(event: AgentEvent): Promise<void> {
    try {
        // Ensure the logs directory exists
        if (!fs.existsSync(LOGS_DIR)) {
            fs.mkdirSync(LOGS_DIR, { recursive: true });
        }

        const date = new Date();
        const yearMonth = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
        const filePath = path.join(LOGS_DIR, `${yearMonth}.jsonl`);

        // Inject ISO timestamp
        const finalEvent = {
            timestamp: date.toISOString(),
            ...event,
        };

        const jsonlLine = JSON.stringify(finalEvent) + '\n';

        // Append asynchronously
        await fs.promises.appendFile(filePath, jsonlLine, 'utf-8');
    } catch (error) {
        console.error('Failed to write telemetry event:', error);
    }
}
