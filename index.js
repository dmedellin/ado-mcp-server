// index.js

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";      // MCP server base class 
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // STDIO transport for local testing 
import { z } from "zod";                                                    // Input validation  [oai_citation:9‡GitHub](https://github.com/colinhacks/zod/discussions/2814?utm_source=chatgpt.com) [oai_citation:10‡Answer Overflow](https://www.answeroverflow.com/m/1041283959063068773?utm_source=chatgpt.com)

// ----------------------------------------------------------------------------
// 1. Instantiate the MCP server
// ----------------------------------------------------------------------------
const server = new McpServer({
  name: "AzureDevOpsMCP",
  version: "1.0.0"
});

// ----------------------------------------------------------------------------
// 2. Define the input schema for 'listProjects' as OPTIONAL strings.
//    This allows MCP Inspector to submit empty strings, which we then
//    overwrite with ENV values in the handler logic if needed.
// ----------------------------------------------------------------------------
const ListProjectsInput = z.object({
  token: z.string().optional(),         // Accepts string or undefined  [oai_citation:11‡StudyRaid](https://app.studyraid.com/en/read/11289/352190/handling-default-values?utm_source=chatgpt.com)
  organization: z.string().optional()   // Accepts string or undefined  [oai_citation:12‡StudyRaid](https://app.studyraid.com/en/read/11289/352190/handling-default-values?utm_source=chatgpt.com)
});

// ----------------------------------------------------------------------------
// 3. Register the 'listProjects' tool.
//    - We read 'token' and 'organization' from the parsed payload.
//    - If empty or missing, fallback to process.env.*
// ----------------------------------------------------------------------------
server.tool(
  "listProjects",         // Tool name
  ListProjectsInput,      // Input schema (optional strings)  [oai_citation:13‡StudyRaid](https://app.studyraid.com/en/read/11289/352190/handling-default-values?utm_source=chatgpt.com)
  async ({ token, organization }) => {
    // 3a. Merge client-provided token with ENV fallback:
    const finalToken =
      token && token.trim() !== "" ? token : process.env.token;
    if (!finalToken || finalToken.trim() === "") {
      console.error(
        "[listProjects] Error: No token provided. " +
        "Client payload was empty or missing, and process.env.token is unset."
      );
      throw new Error(
        "Token is required but was not provided to listProjects tool."
      );
    }

    // 3b. Merge client-provided organization with ENV fallback:
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

    // 3c. Log masked token and organization for debugging (never log full PAT)  [oai_citation:14‡Stack Overflow](https://stackoverflow.com/questions/72768172/zod-create-a-primitive-object-from-defaults?utm_source=chatgpt.com)
    console.log(
      `[listProjects] Using token: '${finalToken.substring(0, 5)}...'`
    );
    console.log(`[listProjects] Using organization: '${finalOrg}'`);

    // 3d. Construct the Azure DevOps REST API URL to list projects 
    const apiUrl = `https://dev.azure.com/${encodeURIComponent(
      finalOrg
    )}/_apis/projects?api-version=7.1`;

    // 3e. Build Basic Auth header from the PAT  [oai_citation:15‡GitHub](https://github.com/colinhacks/zod/discussions/2814?utm_source=chatgpt.com)
    const authHeader =
      "Basic " + Buffer.from(`:${finalToken}`).toString("base64");

    // 3f. Perform the HTTP GET request to Azure DevOps 
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader
      }
    });

    // 3g. If HTTP status not OK, log the raw body and throw for MCP client  [oai_citation:16‡GitHub](https://github.com/colinhacks/zod/discussions/2814?utm_source=chatgpt.com)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[listProjects] Azure DevOps API Error (${response.status}): ${errorText}`
      );
      throw new Error(
        `Azure DevOps API returned ${response.status}: ${response.statusText}. ` +
        `Response body: ${errorText}`
      );
    }

    // 3h. Read full response as text (for debugging if JSON is invalid)  [oai_citation:17‡GitHub](https://github.com/colinhacks/zod/discussions/2814?utm_source=chatgpt.com)
    const responseBodyText = await response.text();

    try {
      // 3i. Parse JSON and return the 'value' array (project list)  [oai_citation:18‡GitHub](https://github.com/colinhacks/zod/discussions/2814?utm_source=chatgpt.com)
      const json = JSON.parse(responseBodyText);
      return json.value;
    } catch (parseError) {
      console.error(
        `[listProjects] Failed to parse JSON. Status: ${response.status}. ` +
        `Body: ${responseBodyText}`
      );
      throw new Error(
        `Failed to parse JSON from Azure DevOps API. Status: ${response.status}. ` +
        `Error: ${parseError.message}. Response body: ${responseBodyText}`
      );
    }
  }
);

// ----------------------------------------------------------------------------
// 4. Main entrypoint: connect via STDIO transport
//    - VS Code’s MCP integration or Inspector will spawn this process
//      and pipe STDIN/STDOUT for JSON-RPC messages.
// ----------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport(); // STDIO-based transport 
  await server.connect(transport);
  console.error("AzureDevOpsMCP server is running over STDIO");
}

main().catch((error) => {
  console.error("Fatal error in server:", error);
  process.exit(1);
});