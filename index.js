// index.js

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "AzureDevOpsMCP",
  version: "1.0.0",
});

const ListProjectsInput = z.object({
  token: z.string().optional(), // Accepts string or undefined  [oai_citation:11‡StudyRaid](https://app.studyraid.com/en/read/11289/352190/handling-default-values?utm_source=chatgpt.com)
  organization: z.string().optional(), // Accepts string or undefined  [oai_citation:12‡StudyRaid](https://app.studyraid.com/en/read/11289/352190/handling-default-values?utm_source=chatgpt.com)
});

server.tool(
  "listProjects",
  "Tool to list the projects from an azure devOps Org",
  ListProjectsInput,
  async ({ token, organization }) => {
    const finalToken = token && token.trim() !== "" ? token : process.env.token;
    if (!finalToken || finalToken.trim() === "") {
      console.error(
        "[listProjects] Error: No token provided. " +
          "Client payload was empty or missing, and process.env.token is unset."
      );
      throw new Error(
        "Token is required but was not provided to listProjects tool."
      );
    }
    const finalOrg =
      organization && organization.trim() !== ""
        ? organization
        : process.env.organization;
    if (!finalOrg || finalOrg.trim() === "") {
      console.error(
        "[listProjects] Error: No organization provided. " +
          "Client payload was empty or missing, and process.env.organization is unset."
      );
      throw new Error(
        "Organization is required but was not provided to listProjects tool."
      );
    }
    const apiUrl = `https://dev.azure.com/${encodeURIComponent(
      finalOrg
    )}/_apis/projects?api-version=7.1`;

    const authHeader =
      "Basic " + Buffer.from(`:${finalToken}`).toString("base64");

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const projectsData = await response.json();

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
