import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadTemplateList } from "../utils/templates.js";

/** 列出所有可用的模版组件 */
const registryTool = (server: McpServer) => {
  server.tool(
    "list-templates",
    `当用户请求一个新的前端页面（UI可以是图片，figma链接等）或询问有哪些模版组件时使用此工具。
  此工具仅返回可用的模版组件列表。
  调用此工具后，你可以根据模板组件列表获取合适的模板组件。`,
    async () => {
      const components = await loadTemplateList();
      return {
        content: [
          {
            type: "text",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            text: `以下是可用的模版组件：${JSON.stringify(components.map(({ dirName, ...restProps }) => restProps))}`,
          },
        ],
      };
    },
  );
};

export default registryTool;
