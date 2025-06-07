import { z } from "zod";
import { adoProxy } from "../utilities/adoProxy.js";

// --- Input Schemas ---
const ListPullRequestsInput = {
  project: z.string(),
  repoId: z.string(),
  status: z.string().optional(), // e.g., 'active', 'completed', 'abandoned'
  creatorId: z.string().optional(),
  targetRefName: z.string().optional(),
  sourceRefName: z.string().optional(),
};

const GetPullRequestInput = {
  project: z.string(),
  repoId: z.string(),
  pullRequestId: z.union([z.string(), z.number()]),
};

const CreatePullRequestInput = {
  project: z.string(),
  repoId: z.string(),
  sourceRefName: z.string(),
  targetRefName: z.string(),
  title: z.string(),
  description: z.string().optional(),
  reviewers: z.array(z.object({ id: z.string() })).optional(),
};

const UpdatePullRequestInput = {
  project: z.string(),
  repoId: z.string(),
  pullRequestId: z.union([z.string(), z.number()]),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
};

// --- Tool Registration ---
export function registerPullRequestTools(server) {
  // List Pull Requests
  server.tool(
    "listPullRequests",
    "List Azure DevOps Git pull requests for a repository.",
    ListPullRequestsInput,
    async ({ project, repoId, ...params }) => {
      let endpoint = `_apis/git/repositories/${repoId}/pullrequests?api-version=7.2-preview.1`;
      const response = await adoProxy({
        endpoint,
        method: "GET",
        project,
        params,
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

  // Get Pull Request
  server.tool(
    "getPullRequest",
    "Get details for a specific Azure DevOps Git pull request.",
    GetPullRequestInput,
    async ({ project, repoId, pullRequestId }) => {
      let endpoint = `_apis/git/repositories/${repoId}/pullrequests/${pullRequestId}?api-version=7.2-preview.1`;
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

  // Create Pull Request
  server.tool(
    "createPullRequest",
    "Create a new Azure DevOps Git pull request.",
    CreatePullRequestInput,
    async ({ project, repoId, sourceRefName, targetRefName, title, description, reviewers }) => {
      let endpoint = `_apis/git/repositories/${repoId}/pullrequests?api-version=7.2-preview.1`;
      const body = {
        sourceRefName: sourceRefName.startsWith("refs/") ? sourceRefName : `refs/heads/${sourceRefName}`,
        targetRefName: targetRefName.startsWith("refs/") ? targetRefName : `refs/heads/${targetRefName}`,
        title,
        description,
        reviewers,
      };
      const response = await adoProxy({
        endpoint,
        method: "POST",
        body,
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

  // Update Pull Request
  server.tool(
    "updatePullRequest",
    "Update an existing Azure DevOps Git pull request.",
    UpdatePullRequestInput,
    async ({ project, repoId, pullRequestId, ...updateFields }) => {
      let endpoint = `_apis/git/repositories/${repoId}/pullrequests/${pullRequestId}?api-version=7.2-preview.1`;
      const body = { ...updateFields };
      const response = await adoProxy({
        endpoint,
        method: "PATCH",
        body,
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
}
