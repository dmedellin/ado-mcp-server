import { registerProjectTools } from "./projects.js";
import { registerWorkItemTools } from "./workItems.js";
import { registerBranchTools } from "./branches.js";
import { registerCloneRepoTool } from "./cloneRepo.js";

export function registerAllTools(server) {
  registerProjectTools(server);
  registerWorkItemTools(server);
  registerBranchTools(server);
  registerCloneRepoTool(server);
}
