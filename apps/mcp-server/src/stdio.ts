import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCalculateZakat } from "./tools/calculate_zakat.js";
import { registerParseBlob } from "./tools/parse_blob.js";
import { registerInteractiveTools } from "./tools/interactive.js";
import { registerAgentProtocol } from "./tools/agent_protocol.js";

// Initialize MCP Server
const mcp = new McpServer({
    name: "ZakatFlow MCP Server (Stdio)",
    version: "1.0.0"
});

// Register Tools
registerCalculateZakat(mcp);
registerParseBlob(mcp);
registerInteractiveTools(mcp);
registerAgentProtocol(mcp);

// Connect via Stdio
async function main() {
    const transport = new StdioServerTransport();
    await mcp.connect(transport);
    console.error("ZakatFlow MCP Server (Stdio) running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
