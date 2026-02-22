export interface AgentEvent {
    /** The correlation ID tying together an entire workflow run (e.g., 'orc-1234') */
    run_id: string;

    /** The persona that generated this event (e.g., '/product-manager', '/ui-designer') */
    active_agent: string;

    /** What the agent decided to do (e.g., 'ESCALATE', 'TOOL_CALL', 'ROUTE') */
    action: string;

    /** Why this action was taken (e.g., 'Out of bounds: requires database migration') */
    reason: string;

    /** Number of context tokens consumed */
    context_tokens_used?: number;

    /** Number of redundant file reads detected during this phase */
    redundant_file_reads?: number;

    /** Whether the agent detected its own prior hallucination/error during self-reflection */
    hallucination_detected?: boolean;

    /** Execution duration in milliseconds (computed automatically) */
    duration_ms?: number;

    /** Number of files modified during this execution (computed automatically) */
    files_modified?: number;
}
