// index.js

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { makeApiRequest } from "./utilities/httpClient.js"; // Import the new utility

const server = new McpServer({
  name: "AzureDevOpsMCP",
  version: "1.0.0",
});

const ListProjectsInput = z.object({}); // Remains empty

server.tool(
  "listProjects",
  "Tool to list the projects from an azure devOps Org",
  ListProjectsInput,
  async ({}) => {
    const projectEndpoint = "projects?api-version=7.1";

    const projectsData = await makeApiRequest({
      endpoint: projectEndpoint,
      method: "GET",
    });

    return {
      type: "text",
      text: JSON.stringify(projectsData, null, 2),
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AzureDevOpsMCP server is running over STDIO");
}

main().catch((error) => {
  console.error("Fatal error in server:", error);
  process.exit(1);
});
