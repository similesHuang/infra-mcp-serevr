import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Server } from "http";
import Koa, { Context } from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import registerTools from "./tools/index.js";
import registryPrompts from "./prompts/index.js";
// 初始化McpServer
export const createServer = () => {
  const server = new McpServer(
    {
      name: "INFRA MCP Server",
      version: process.env.VERSION || "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
      instructions: `
      你是一个专业的Infra UI 模版组件专家助手，具有以下能力：
      1. 可以查询所有可用模版组件列表
      2. 根据需求图片或描述生成业务组件代码
      3. 根据模版组件代码文档生成完整的业务组件代码
      4. 没有合适的模版组件时，可以参考antd组件库生成业务组件代码
 
      使用规则：
      - 严格遵循以下工具使用优先级：
        1. 首先检查当前对话上下文是否已包含所需信息
        2. 只有当上下文确实缺少必要信息时才调用工具
        3. 对于完全相同的组件查询参数，禁止重复调用工具
      - 对专业术语保持准确，不自行编造组件属性
      - 代码示例要完整可运行，并注明所需版本
      - 当用户询问"显示XXX模版组件文档"时，如果上下文已有该组件信息，直接展示而不再调用工具`,
    },
  );

  /** 注册工具 */
  registerTools(server);

  /** 注册 prompt */
  registryPrompts(server);
  return server;
};

// stdio传输
export const createStdioServer = async (mcpServer: McpServer) => {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
};

// 支持http、sse传输
let httpServer: Server | null = null;

// 存储活跃连接的传输对象
const transports: {
  streamable: Record<string, StreamableHTTPServerTransport>;
  sse: Record<string, SSEServerTransport>;
} = {
  streamable: {},
  sse: {},
};

export const createHttpServer = async (port: number, mcpServer: McpServer) => {
  const app = new Koa();
  const router = new Router();

  // StreamableHttp传输
  router.post("/mcp", bodyParser(), async (ctx: Context) => {
    console.log("收到StreamableHTTP request");
    const sessionId = ctx.request.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;
    if (sessionId && transports.streamable[sessionId]) {
      console.log("Reusing existing StreamableHTTP transport for sessionId", sessionId);
      transport = transports.streamable[sessionId];
    } else if (!sessionId && isInitializeRequest(ctx.request.body)) {
      console.log("New initialization request for StreamableHTTP sessionId", sessionId);
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          transports.streamable[sessionId] = transport;
        },
      });
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports.streamable[transport.sessionId];
        }
      };
      await mcpServer.connect(transport);
    } else {
      console.log("无效的请求", ctx.request.body);
      ctx.status = 400;
      ctx.body = {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      };
      return;
    }

    let progressInterval: NodeJS.Timeout | null = null;
    const body = ctx.request.body as { params?: { _meta?: { progressToken?: string } } };
    const progressToken = body?.params?._meta?.progressToken;
    let progress = 0;
    if (progressToken) {
      console.log(
        `Setting up progress notifications for token ${progressToken} on session ${sessionId}`,
      );
      progressInterval = setInterval(async () => {
        console.log("Sending progress notification", progress);
        await mcpServer.server.notification({
          method: "notifications/progress",
          params: {
            progress,
            progressToken,
          },
        });
        progress++;
      }, 1000);
    }

    console.log("Handling StreamableHTTP request");
    await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);

    if (progressInterval) {
      clearInterval(progressInterval);
    }
    console.log("StreamableHTTP request handled");
    ctx.respond = false; // 让底层的transport处理响应
  });

  // 处理GET和DELETE请求的会话
  const handleSessionRequest = async (ctx: Context) => {
    const sessionId = ctx.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.streamable[sessionId]) {
      ctx.status = 400;
      ctx.body = "Invalid or missing session ID";
      return;
    }

    console.log(`Received session request for session ${sessionId}`);

    try {
      const transport = transports.streamable[sessionId];
      await transport.handleRequest(ctx.req, ctx.res);
      ctx.respond = false; // 让底层的transport处理响应
    } catch (error) {
      console.error("Error handling session request:", error);
      if (!ctx.headerSent) {
        ctx.status = 500;
        ctx.body = "Error processing session request";
      }
    }
  };

  router.get("/mcp", handleSessionRequest);
  router.delete("/mcp", handleSessionRequest);

  // SSE连接端点
  router.get("/sse", async (ctx: Context) => {
    console.log("Establishing new SSE connection");
    const transport = new SSEServerTransport("/messages", ctx.res);
    console.log(`New SSE connection established for sessionId ${transport.sessionId}`);

    transports.sse[transport.sessionId] = transport;
    ctx.res.on("close", () => {
      delete transports.sse[transport.sessionId];
    });

    await mcpServer.connect(transport);
    ctx.respond = false; // 让底层的transport处理响应
  });

  // SSE消息端点
  router.post("/messages", async (ctx: Context) => {
    const sessionId = ctx.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      console.log(`Received SSE message for sessionId ${sessionId}`);
      await transport.handlePostMessage(ctx.req, ctx.res);
      ctx.respond = false; // 让底层的transport处理响应
    } else {
      ctx.status = 400;
      ctx.body = `No transport found for sessionId ${sessionId}`;
    }
  });

  app.use(router.routes());
  // 启动服务器
  httpServer = app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
    console.log(`SSE endpoint available at http://localhost:${port}/sse`);
    console.log(`Message endpoint available at http://localhost:${port}/messages`);
    console.log(`StreamableHTTP endpoint available at http://localhost:${port}/mcp`);
  });

  // 处理进程终止信号
  process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    // 关闭所有活跃的传输连接，清理资源
    await closeTransports(transports.sse);
    await closeTransports(transports.streamable);

    httpServer.close();
    console.log("Server shutdown complete");
    process.exit(0);
  });

  return httpServer;
};

async function closeTransports(
  transports: Record<string, SSEServerTransport | StreamableHTTPServerTransport>,
) {
  for (const sessionId in transports) {
    try {
      await transports[sessionId]?.close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
}

export async function stopHttpServer(): Promise<void> {
  if (!httpServer) {
    throw new Error("HTTP server is not running");
  }

  return new Promise((resolve, reject) => {
    httpServer!.close((err: Error | undefined) => {
      if (err) {
        reject(err);
        return;
      }
      httpServer = null;
      const closing = Object.values(transports.sse).map((transport) => {
        return transport.close();
      });
      Promise.all(closing).then(() => {
        resolve();
      });
    });
  });
}
