// itemTypes.js
// Resource for listing Azure DevOps work item types for a given project
import { z } from "zod";
import { adoProxy } from "../utilities/adoProxy.js";

const ListWorkItemTypesInput = {
  project: z.string(),
};

export function registerWorkItemTypeTools(server) {
  server.tool(
    "listWorkItemTypes",
    "List all work item types for a given Azure DevOps project.",
    ListWorkItemTypesInput,
    async ({ project }) => {
      const endpoint = `_apis/wit/workitemtypes?api-version=7.2-preview.2`;
      const response = await adoProxy({ endpoint, method: "GET", project });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );
}
