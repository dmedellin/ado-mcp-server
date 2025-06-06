import { z } from "zod";
import { adoProxy } from "../utilities/adoProxy.js";

// --- Input Schemas ---
const CreateWorkItemInput = {
  project: z.string(),
  type: z.string(),
  fields: z.record(z.any()),
};

const GetWorkItemInput = {
  id: z.union([z.string(), z.number()]),
  expand: z.string().optional(),
};

const UpdateWorkItemInput = {
  id: z.union([z.string(), z.number()]),
  fields: z.record(z.any()),
  revision: z.number().optional(),
};

const DeleteWorkItemInput = {
  id: z.union([z.string(), z.number()]),
};

const ListWorkItemsInput = {
  ids: z.array(z.union([z.string(), z.number()])),
  fields: z.array(z.string()).optional(),
  asOf: z.string().optional(),
  expand: z.string().optional(),
};

const QueryWorkItemsInput = {
  project: z.string(),
  filter: z.object({
    assignedTo: z.string().nullable().optional(),
    workItemTypes: z.array(z.string()).optional(),
    states: z.array(z.string()).optional(),
    top: z.number().optional(),
    // Add more filter fields as needed
  }),
};

// --- Tool Registration ---
export function registerWorkItemTools(server) {
  // Create Work Item
  server.tool(
    "createWorkItem",
    "Create a new Azure DevOps work item.",
    CreateWorkItemInput,
    async ({ project, type, fields }) => {
      const endpoint = `_apis/wit/workitems/$${type}?api-version=7.2-preview`;
      const ops = Object.entries(fields).map(([key, value]) => ({
        op: "add",
        path: `/fields/${key}`,
        value,
      }));
      const response = await adoProxy({
        endpoint,
        method: "POST",
        body: ops,
        contentType: "application/json-patch+json",
        project,
      });
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

  // Get Work Item
  server.tool(
    "getWorkItem",
    "Get a work item by ID.",
    GetWorkItemInput,
    async ({ id, expand }) => {
      let endpoint = `_apis/wit/workitems/${id}?api-version=7.2-preview`;
      if (expand) endpoint += `&$expand=${expand}`;
      const response = await adoProxy({ endpoint, method: "GET" });
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

  // Update Work Item
  server.tool(
    "updateWorkItem",
    "Update fields on a work item.",
    UpdateWorkItemInput,
    async ({ id, fields, revision }) => {
      let endpoint = `_apis/wit/workitems/${id}?api-version=7.2-preview`;
      if (revision) endpoint += `&revision=${revision}`;
      const ops = Object.entries(fields).map(([key, value]) => ({
        op: "add",
        path: `/fields/${key}`,
        value,
      }));
      const response = await adoProxy({
        endpoint,
        method: "PATCH",
        body: ops,
      });
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

  // Delete Work Item
  server.tool(
    "deleteWorkItem",
    "Delete a work item by ID.",
    DeleteWorkItemInput,
    async ({ id }) => {
      const endpoint = `_apis/wit/workitems/${id}?api-version=7.2-preview`;
      const response = await adoProxy({ endpoint, method: "DELETE" });
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

  // List Work Items (by IDs)
  server.tool(
    "listWorkItems",
    "Get multiple work items by IDs.",
    ListWorkItemsInput,
    async ({ ids, fields, asOf, expand }) => {
      let endpoint = `_apis/wit/workitemsbatch?api-version=7.2-preview`;
      const body = {
        ids,
        fields,
        asOf,
        $expand: expand,
      };
      const response = await adoProxy({
        endpoint,
        method: "POST",
        body,
      });
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

  // Query Work Items by filter
  server.tool(
    "queryWorkItems",
    "Query work items in a project using filter criteria (e.g., assignedTo, workItemTypes, states).",
    QueryWorkItemsInput,
    async ({ project, filter }) => {
      // Build WIQL query
      let whereClauses = [
        `[System.TeamProject] = '${project}'`,
        `[System.ChangedDate] > @today - 180`,
        `[System.WorkItemType] <> ''`,
        `[System.State] <> ''`,
      ];
      if (filter.assignedTo === null || filter.assignedTo === "") {
        whereClauses.push("[System.AssignedTo] = ''");
      } else if (filter.assignedTo) {
        whereClauses.push(`[System.AssignedTo] = '${filter.assignedTo}'`);
      }
      if (filter.workItemTypes && filter.workItemTypes.length > 0) {
        const types = filter.workItemTypes.map((t) => `'${t}'`).join(", ");
        whereClauses.push(`[System.WorkItemType] IN (${types})`);
      }
      if (filter.states && filter.states.length > 0) {
        const states = filter.states.map((s) => `'${s}'`).join(", ");
        whereClauses.push(`[System.State] IN (${states})`);
      }
      const where =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
      const top = filter.top || 100;
      const wiql = {
        query: `SELECT [System.Id],[System.WorkItemType],[System.Title],[System.AssignedTo],[System.State],[System.Tags] FROM WorkItems ${where}`,
      };
      // Use the correct endpoint for WIQL queries (no leading slash, no project name)
      const endpoint = `_apis/wit/wiql?api-version=7.2-preview.2`;
      const response = await adoProxy({
        endpoint,
        method: "POST",
        body: wiql,
        project,
      });
      // Optionally, fetch work item details if needed
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

  // Additional endpoints (query, revisions, comments, attachments, relations, batch, etc.)
  // can be added here following the same pattern.
}
