import { z } from "zod";
import { makeApiRequest } from "../utilities/httpClient.js";

const ListProjectsInput = z.object({}); // Remains empty

export function registerProjectTools(server) {
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
  // Add other project-related tools here if needed
}
