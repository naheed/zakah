import { parseArgs } from 'util';
import { appendTelemetryEvent } from './logger.js';
import { AgentEvent } from './types.js';

const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
        run_id: { type: 'string' },
        agent: { type: 'string' },
        action: { type: 'string' },
        reason: { type: 'string' },
        context: { type: 'string' },
        redundant_reads: { type: 'string' },
        hallucination: { type: 'boolean' }
    }
});

async function main() {
    if (!values.run_id || !values.agent || !values.action || !values.reason) {
        console.error("Missing required arguments: --run_id, --agent, --action, --reason");
        console.error("Usage: npx tsx cli.ts --run_id=\"orc-123\" --agent=\"/ui-designer\" --action=\"COMPLETED\" --reason=\"Finished task\"");
        process.exit(1);
    }

    const event: AgentEvent = {
        run_id: values.run_id,
        active_agent: values.agent,
        action: values.action,
        reason: values.reason,
        context_tokens_used: values.context ? parseInt(values.context, 10) : undefined,
        redundant_file_reads: values.redundant_reads ? parseInt(values.redundant_reads, 10) : undefined,
        hallucination_detected: values.hallucination
    };

    await appendTelemetryEvent(event);
    console.log(`[Telemetry] Successfully appended event for ${values.run_id} / ${values.agent}`);
}

main().catch((err) => {
    console.error('[Telemetry] Failed to log event:', err);
    process.exit(1);
});
