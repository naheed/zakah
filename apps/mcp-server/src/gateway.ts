/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * MCP Gateway Client
 *
 * Routes privileged Supabase operations through the mcp-gateway edge function
 * instead of using the service role key directly. This keeps the service key
 * isolated in the Supabase backend.
 *
 * Required env vars:
 *   SUPABASE_URL        — Supabase project URL
 *   MCP_GATEWAY_SECRET  — Shared secret for X-MCP-Secret header
 */

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const MCP_GATEWAY_SECRET = process.env.MCP_GATEWAY_SECRET || '';

/**
 * Check if the gateway is configured.
 */
export function isGatewayConfigured(): boolean {
    return !!(SUPABASE_URL && MCP_GATEWAY_SECRET);
}

/**
 * Call the mcp-gateway edge function.
 *
 * @param action - One of: find_or_create_user, save_session, get_sessions,
 *                 delete_user_data, track_calculation, update_aggregates
 * @param payload - Action-specific payload fields
 * @returns The `data` field from the gateway response
 * @throws Error if the gateway returns an error or is unreachable
 */
export async function callGateway<T = unknown>(
    action: string,
    payload: Record<string, unknown> = {}
): Promise<T> {
    if (!isGatewayConfigured()) {
        throw new Error('MCP Gateway not configured (missing SUPABASE_URL or MCP_GATEWAY_SECRET)');
    }

    const url = `${SUPABASE_URL}/functions/v1/mcp-gateway`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MCP-Secret': MCP_GATEWAY_SECRET,
        },
        body: JSON.stringify({ action, ...payload }),
        signal: AbortSignal.timeout(10_000), // 10s timeout
    });

    const body = await res.json() as { success: boolean; data?: unknown; error?: string };

    if (!body.success) {
        throw new Error(body.error || `Gateway action "${action}" failed with status ${res.status}`);
    }

    return body.data as T;
}
