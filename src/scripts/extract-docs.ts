#!/usr/bin/env node
import { parseMDMatter } from "../utils/matter-parse.js";

/**
 * 此脚本从 Ant Design 仓库中提取组件相关文档，
 * 并将其保存到本地数据目录中供 MCP 服务器使用。
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  DOC_FILE_NAME,
  EXAMPLE_FILE_NAME,
  EXTRACTED_COMPONENTS_DATA_CHANGELOG_PATH,
  EXTRACTED_COMPONENTS_DATA_PATH,
  EXTRACTED_COMPONENTS_LIST_PATH,
  EXTRACTED_DATA_DIR,
  EXTRACTED_METADATA_PATH,
} from "../constants/path.js";
import {
  extractSection,
  removeFrontmatter,
  removeSection,
  toPascalCase,
} from "../utils/md-extract.js";
import { writeExtractedInfoToReadme, writeJsonFile } from "../utils/write.js";

/**
 * 提取的组件示例信息
 */
export interface ExampleInfoList {
  /** 例子名称 */
  name: string;
  /** 例子标题 */
  title: string;
  /** 例子描述 */
  description?: string;
  /** 例子代码 */
  code?: string;
}
/**
 * 提取的组件数据
 */
export interface ComponentData {
  /** 组件名称 */
  name: string;
  name_zh?: string;
  /** 组件目录 */
  dirName: string;
  /** 组件文档 */
  documentation: string;
  /** 组件分类 */
  category?: string;
  description?: string;
}

/**
 * 提取的组件索引
 */
export type ComponentIndex = Pick<
  ComponentData,
  "name" | "dirName" | "description" | "name_zh" | "category"
>[];

/**
 * 提取结果元数据
 */
export interface MetaDataResult {
  /** 提取时间 */
  extractedAt: string;
  /** 提取的组件数量 */
  extractedCount: number;
  /** 组件总数 */
  componentCount: number;
  /** 数据的 infra 版本 */
  infraVersion: string;
}

/**
 * 注入 embed 文档
 * @param markdown
 * @returns
 */
function injectEmbedDoc(markdown: string, componentPath: string) {
  // 快速检查是否存在embed标签，避免不必要的正则匹配
  if (!markdown.includes("<embed")) {
    return markdown;
  }

  // 获取文档中的 embed 文档
  return markdown.replace(/<embed src="(.*)"><\/embed>/g, (_, embedSrc) => {
    try {
      const embedPath = join(componentPath, embedSrc);
      const embedContent = readFileSync(embedPath, "utf-8");
      return embedContent;
    } catch (error) {
      console.error(`❌ 读取embed文件失败: ${embedSrc}`, error);
      return _;
    }
  });
}

/**
 * 处理组件数据
 * @param codeTemplatesPath
 * @param dirName
 * @returns
 */
async function processComponent(codeTemplatesPath: string, dirName: string) {
  const codeTemplateDocPath = join(codeTemplatesPath, dirName);

  // 初始化组件数据
  const codeTemplateName = toPascalCase(dirName.slice(0, -3)); // 去掉最后的 .md 后缀

  console.log(`📝 正在处理 ${codeTemplateName}...`);

  const templateData: ComponentData = {
    name: codeTemplateName,
    dirName: dirName,
    documentation: "",
    category: "",
    name_zh: "",
    description: "",
  };

  try {
    // 解析 frontmatter 以获取元数据
    const yaml = await parseMDMatter(resolve(codeTemplateDocPath));
    templateData.category = yaml?.group?.title;
    templateData.name_zh = yaml?.title;
    // 读取组件文档内容
    const docContent = await readFile(resolve(codeTemplateDocPath), "utf-8");
    const contentWithoutFrontmatter = removeFrontmatter(docContent);

    // 提取描述信息

    const descriptionSection = extractSection(contentWithoutFrontmatter, "#", /<code/g);
    // 使用正则表达式移除所有 <code> 标签
    const formatDescription = descriptionSection
      .replace(/^-\s*.*<code.*?<\/code>.*$/gm, "") // 删除以 - 开头且包含 <code> 的整行
      .replace(/<code.*?<\/code>/gs, "") // 删除其他 <code> 标签
      .trim();

    // 设置描述，并做进一步清理
    const lines = formatDescription.split("\n");
    let processedLines = lines;

    // 检查是否有以 # 开头的行
    const headingLineIndex = lines.findIndex((line) => line.trim().startsWith("#"));
    if (headingLineIndex !== -1) {
      // 如果找到了 # 开头的行，删除它前面的两行
      if (headingLineIndex >= 2) {
        processedLines = [
          ...lines.slice(0, headingLineIndex - 2),
          ...lines.slice(headingLineIndex),
        ];
      }
    }
    templateData.description = processedLines
      .filter((line) => line.trim() !== "") // 移除空行
      .join("\n")
      .trim();

    let processedContent = contentWithoutFrontmatter;
    // 匹配所有的 <code> 标签
    const codeRegex = /<code src="([^"]+)"(?:\s+[^>]*)?>(.*?)<\/code>/g;
    const codeMatches = [...processedContent.matchAll(codeRegex)];

    for (const match of codeMatches) {
      const codePath = match[1];

      try {
        // 根据相对路径获取示例代码
        let examplePath = codePath;
        if (codePath.startsWith("./")) {
          // 获取组件文档所在目录
          const docDir = resolve(codeTemplateDocPath, "..");
          examplePath = join(docDir, codePath);
        } else {
          examplePath = join(codeTemplatesPath, codePath);
        }

        // 读取示例代码
        let code = "";
        if (existsSync(examplePath)) {
          code = await readFile(examplePath, "utf-8");
        } else {
          // 原始路径不存在，尝试添加扩展名
          const extensions = [".tsx", ".jsx", ".ts", ".js"];
          let found = false;
          for (const ext of extensions) {
            const pathWithExt = `${examplePath}${ext}`;
            if (existsSync(pathWithExt)) {
              console.log(`  🔍 找到带扩展名的文件: ${pathWithExt}`);
              code = await readFile(pathWithExt, "utf-8");
              examplePath = pathWithExt; // 更新路径以包含扩展名
              found = true;
              break;
            }
          }
          if (!found) {
            console.warn(`  ⚠️ 示例文件不存在: ${examplePath} (也尝试了添加常见扩展名)`);
            continue; // 跳过当前迭代
          }
        }

        // 确定代码语言类型
        const fileExtension = examplePath.toLowerCase().split(".").pop();
        const codeLanguage =
          fileExtension === "jsx"
            ? "jsx"
            : fileExtension === "tsx"
              ? "tsx"
              : fileExtension === "js"
                ? "javascript"
                : fileExtension === "ts"
                  ? "typescript"
                  : "jsx"; // 默认使用jsx

        // 替换文档中的代码标签为实际代码
        const replacement = `示例代码\n\n\`\`\`${codeLanguage}\n${code}\n\`\`\``;
        processedContent = processedContent.replace(match[0], replacement);
      } catch (err) {
        console.warn(`  ⚠️ 处理示例代码失败 ${codePath}:`, err);
      }
    }

    // 保存处理后的文档
    templateData.documentation = processedContent;

    return templateData;
  } catch (error) {
    console.error(`  ❌ 处理 ${codeTemplateName} 时出错:`, (error as Error).message);
    return null;
  }
}

/** 处理所有组件并导出数据的主函数 */
async function extractAllData(infraRepoPath: string) {
  // 确保数据目录存在
  await mkdir(EXTRACTED_DATA_DIR, { recursive: true });
  /** 待提取模版代码目录 */
  const codeTemplatesPath = join(infraRepoPath, "/docs/CodeTemplates");
  /** 待提取数据的组件库 packageJson */
  const infraPackageJsonPath = join(infraRepoPath, "package.json");

  console.log(`🔍 从 ${codeTemplatesPath} 抓取文档信息`);

  if (!existsSync(codeTemplatesPath)) {
    console.error(`❌ 错误: 未找到 ${codeTemplatesPath} 目录，请传入正确的 infra ui 目录。`);
    process.exit(1);
  }

  /** 获取所有组件目录 */
  const codeTemplatesEntries = await readdir(codeTemplatesPath, {
    withFileTypes: true,
  });
  /** 有效的组件目录 */
  const codeTemplatesDirs = codeTemplatesEntries.filter(
    (entry) => !entry.isDirectory() && entry.name !== "start.md" && entry.name !== "index.md",
  );
  console.log(`🙈 共找到 ${codeTemplatesDirs.length} 个潜在组件\n`);

  /** 提取的组件数据集合 */
  const codeTemplatesDataMap: Record<string, ComponentData> = {};
  let processedCount = 0;

  for (const entry of codeTemplatesDirs) {
    const componentData = await processComponent(codeTemplatesPath, entry.name);
    if (componentData) {
      codeTemplatesDataMap[componentData.name] = componentData;
      processedCount++;
    }
  }

  console.log(`✅ 成功处理了 ${processedCount} 个组件，共 ${codeTemplatesDirs.length} 个`);

  /** 提取数据的操作结果 */
  const metaDataResult: MetaDataResult = {
    extractedAt: new Date().toISOString(),
    extractedCount: processedCount,
    componentCount: codeTemplatesDirs.length,
    infraVersion:
      (await readFile(infraPackageJsonPath, "utf-8")
        .then((content) => JSON.parse(content).version)
        .catch(() => undefined)) || "5.24.6",
  };

  /** 组件列表索引 */
  const componentsIndex: ComponentIndex = Object.values(codeTemplatesDataMap).map(
    ({ name, dirName, name_zh, category, description }) => ({
      name,
      dirName,
      name_zh,
      category,
      description,
    }),
  );

  await writeJsonFile(EXTRACTED_COMPONENTS_LIST_PATH, componentsIndex);

  await writeJsonFile(EXTRACTED_METADATA_PATH, metaDataResult);

  await writeExtractedInfoToReadme(metaDataResult);

  // 创建组件目录
  await mkdir(EXTRACTED_COMPONENTS_DATA_PATH, { recursive: true });

  // 将组件数据写入对应目录
  for (const componentData of Object.values(componentDataMap)) {
    /** 组件内容目录 */
    const componentDir = join(EXTRACTED_COMPONENTS_DATA_PATH, componentData.dirName);
    await mkdir(componentDir, { recursive: true });

    // 写入文档
    await writeFile(join(componentDir, DOC_FILE_NAME), componentData.documentation);

    // 写入示例
    // 创建带有示例描述的markdown文件
    let examplesMarkdown = `## ${componentData.name} 组件示例\n`;

    componentData.exampleInfoList?.forEach((example) => {
      examplesMarkdown += `### ${example.title}${example.description}
\`\`\`tsx
${example.code}\`\`\`
`;
    });

    await writeFile(join(componentDir, EXAMPLE_FILE_NAME), examplesMarkdown);
  }

  console.log(`🎉 文档提取完成！数据已保存到 ${EXTRACTED_DATA_DIR}`);
}

export default extractAllData;
