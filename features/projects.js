import { z } from "zod";
import { makeApiRequest } from "../utilities/httpClient.js";

const ListProjectsInput = z.object({
  $skip: z.number().optional(),
  $top: z.number().optional(),
  continuationToken: z.string().optional(),
  getDefaultTeamImageUrl: z.boolean().optional(),
  stateFilter: z.string().optional(),
});

export function registerProjectTools(server) {
  server.tool(
    "listProjects",
    "Tool to list the projects from an azure devOps Org",
    ListProjectsInput,
    async ({ $skip, $top, continuationToken, getDefaultTeamImageUrl, stateFilter }) => {
      let projectEndpoint = "projects?api-version=7.2";

      const queryParams = [];
      if ($skip !== undefined) {
        queryParams.push(`$skip=${$skip}`);
      }
      if ($top !== undefined) {
        queryParams.push(`$top=${$top}`);
      }
      if (continuationToken !== undefined) {
        queryParams.push(`continuationToken=${continuationToken}`);
      }
      if (getDefaultTeamImageUrl !== undefined) {
        queryParams.push(`getDefaultTeamImageUrl=${getDefaultTeamImageUrl}`);
      }
      if (stateFilter !== undefined) {
        queryParams.push(`stateFilter=${stateFilter}`);
      }

      if (queryParams.length > 0) {
        projectEndpoint += `&${queryParams.join("&")}`;
      }

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
  // Add other project-related tools here if needed
}
