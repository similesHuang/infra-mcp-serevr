import { config } from "dotenv";
import { createHttpServer, createServer, createStdioServer } from "./server.js";
import extractAllData from "./scripts/extract-docs.js";
import { resolve } from "path";

// 注入环境变量
config();

export const run = async () => {
  if (process.argv.includes("--extract")) {
    // 获取antd组件库路径,路径为最后一个参数
    const antdRepoArg = resolve(process.argv[process.argv.length - 1]);

    extractAllData(antdRepoArg).catch((error) => {
      console.error("提取组件数据失败:", error);
      process.exit(1);
    });
    return;
  } else {
    const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");
    const server = createServer();

    if (isStdioMode) {
      createStdioServer(server);
    } else {
      console.log("Server is running in HTTP mode");
      await createHttpServer(Number(process.env.port) || 3000, server);
    }
  }
};

if (process.argv[1]) {
  run().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
