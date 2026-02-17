/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import { registerCalculateZakat } from "./tools/calculate_zakat.js";
import { registerParseBlob } from "./tools/parse_blob.js";
import { registerInteractiveTools } from "./tools/interactive.js";
import { registerAgentProtocol } from "./tools/agent_protocol.js";
import { registerMarketTools } from "./tools/market.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerReportingTools } from "./tools/reporting.js";

const app = express();
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// Transport Management (Map of transports for message routing)
const sessions = new Map<string, { mcp: McpServer, transport: SSEServerTransport }>();

const handleMcpConnection = async (req: express.Request, res: express.Response) => {
    console.log("New MCP/SSE connection established");

    // Create a fresh server instance for this session to handle isolation and SDK constraints
    const mcp = new McpServer({
        name: "ZakatFlow MCP Server",
        version: "1.0.0"
    });

    // Register all tools to this fresh instance
    registerCalculateZakat(mcp);
    registerParseBlob(mcp);
    registerInteractiveTools(mcp);
    registerAgentProtocol(mcp);
    registerMarketTools(mcp);
    registerDiscoveryTools(mcp);
    registerReportingTools(mcp);

    const transport = new SSEServerTransport("/messages", res);
    const sessionId = transport.sessionId;

    console.log(`Session created: ${sessionId}`);
    sessions.set(sessionId, { mcp, transport });

    transport.onclose = () => {
        console.log("SSE connection closed", sessionId);
        sessions.delete(sessionId);
    };

    await mcp.connect(transport);
};

// Standard MCP path
app.get("/mcp", handleMcpConnection);
app.get("/sse", handleMcpConnection);

app.get("/", (req, res) => {
    res.send("<h1>ZakatFlow MCP Server is running</h1><p>Point ChatGPT to <code>/mcp</code></p>");
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    console.log(`[Current Sessions]: ${Array.from(sessions.keys()).join(', ')}`);
    console.log(`[POST /messages] SessionId: ${sessionId}`);

    if (!sessionId) {
        console.error("Missing sessionId");
        res.status(400).send("Missing sessionId");
        return;
    }

    const session = sessions.get(sessionId);
    if (session) {
        await session.transport.handlePostMessage(req, res);
    } else {
        console.error(`Session not found: ${sessionId}`);
        res.status(404).send("Session not found");
    }
});

// Explicitly handle POST /mcp to debug/catch
app.post("/mcp", (req, res) => {
    console.error(`[Unexpected] POST /mcp received. Query: ${JSON.stringify(req.query)}`);
    res.status(404).send("MCP POST should go to /messages?sessionId=...");
});

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`MCP Server running on port ${PORT}`);
});
