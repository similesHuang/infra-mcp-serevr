import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import listTemplates from "./list-templates.js";
import getTemplateExample from "./get-template.js";
export default function registryTools(server: McpServer) {
  [listTemplates,getTemplateExample].forEach((registryFn) => {
    registryFn(server);
  });
}
