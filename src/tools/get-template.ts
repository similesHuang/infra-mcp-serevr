import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { getTemplateExampleCode } from "@/utils/templates.js";

/** 获取 Ant Design 特定组件示例 */
const registryTool = (server: McpServer) => {
 server.tool(
       "get-template",
       `获取 Infra UI  特定模板组件的代码示例
适用场景：
1. 用户询问特定模板组件的示例时
2. 用户想要实现某个功能时直接告知可使用的例子
3. 生成页面或代码前需要获取模板组件的示例代码。`,
{ templateName:z.string()},
       async ({templateName}) => {
         const templateExampleCode = await getTemplateExampleCode(templateName);
         return {
           content: [
             {
               type: "text",
               text: `${templateName}模板组件的示例代码文档：${templateExampleCode ||"暂无该模板组件示例代码"}`,
             },
           ],
         };
       },
     );
};

export default registryTool;