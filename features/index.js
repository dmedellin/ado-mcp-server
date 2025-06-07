import { registerProjectTools } from "./projects.js";
import { registerWorkItemTools } from "./workItems.js";
import { registerPullRequestTools } from "./pullRequests.js";

export function registerAllTools(server) {
  registerProjectTools(server);
  registerWorkItemTools(server);
  registerPullRequestTools(server);
}
