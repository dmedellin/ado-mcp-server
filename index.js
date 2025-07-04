// index.js

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./features/index.js"; // Import the new tool registration utility

const server = new McpServer({
  name: "AzureDevOpsMCP",
  version: "1.0.0",
});

// Register all tools in the features directory
registerAllTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AzureDevOpsMCP server is running over STDIO");
}

main().catch((error) => {
  console.error("Fatal error in server:", error);
  process.exit(1);
});
