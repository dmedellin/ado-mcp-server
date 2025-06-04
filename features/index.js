import { registerProjectTools } from "./projects.js";
import { registerWorkItemTools } from "./workItems.js";

export function registerAllTools(server) {
  registerProjectTools(server);
  registerWorkItemTools(server);
}
