import type{ McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import listComponents from "./list-templates.js";

export default function registryTools(server: McpServer) {
  [listComponents].forEach(
    (registryFn) => {
      registryFn(server);
    },
  );
}
