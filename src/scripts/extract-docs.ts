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
  EXTRACTED_COMPONENTS_DATA_CHANGELOG_PATH,
  EXTRACTED_COMPONENTS_DATA_PATH,
  EXTRACTED_COMPONENTS_LIST_PATH,
  EXTRACTED_DATA_DIR,
  EXTRACTED_METADATA_PATH,
} from "../constants/path.js";
import {
  extractSection,
  removeFrontmatter,
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
export interface TemplateData {
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
  subDocs?: Record<string, string>;
  subDocsName?: string[];
}

/**
 * 提取的组件索引
 */
export type ComponentIndex = Pick<
  TemplateData,
  "name" | "dirName" | "description" | "name_zh" | "category"| "subDocsName"
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

  const templateData: TemplateData = {
    name: codeTemplateName,
    dirName: dirName.slice(0, -3),
    documentation: "",
    category: "",
    name_zh: "",
    description: "",
    subDocs: {}, // 存放嵌入文档内容
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
      .split("\n")
      .map((line) => {
        // 如果行以 "- " 开头且包含 <code> 标签，则保留这一行
        if (line.trim().startsWith("-") && line.includes("<code")) {
          return line;
        }
        // 否则，移除该行中的 <code> 标签
        return line.replace(/<code.*?<\/code>/g, "");
      })
      .join("\n")
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

        await extractNestedComponentsData(examplePath, templateData.subDocs, 10);
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
  const codeTemplatesDataMap: Record<string, TemplateData> = {};
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
    ({ name, dirName, name_zh, category, description, subDocs }) => ({
      name,
      dirName,
      name_zh,
      category,
      description,
      subDocsName: Object.keys(subDocs).length > 0 ? Object.keys(subDocs) : undefined,
    }),
  );

  // 将组件数据写入索引文件
  await writeJsonFile(EXTRACTED_COMPONENTS_LIST_PATH, componentsIndex);

  await writeJsonFile(EXTRACTED_METADATA_PATH, metaDataResult);

  await writeExtractedInfoToReadme(metaDataResult);

  // 创建组件目录
  await mkdir(EXTRACTED_COMPONENTS_DATA_PATH, { recursive: true });

  // 将组件数据写入对应目录
  for (const componentData of Object.values(codeTemplatesDataMap)) {
    /** 组件内容目录 */
    const componentDir = join(EXTRACTED_COMPONENTS_DATA_PATH, componentData.dirName);
    await mkdir(componentDir, { recursive: true });

    // 写入文档
    await writeFile(join(componentDir, DOC_FILE_NAME), componentData.documentation);
    // 写入嵌入的子文档
    for (const [subDocName, subDocContent] of Object.entries(componentData.subDocs)) {
        const subDocFilename = subDocName + (subDocName.endsWith('.md') ? '' : '.md');
        const subDocPath = join(componentDir, subDocFilename);
      await writeFile(subDocPath, subDocContent);
    }
  }

  console.log(`🎉 文档提取完成！数据已保存到 ${EXTRACTED_DATA_DIR}`);
}

/**
 * 提取嵌套组件数据
 * @param rootContentPath 模版存放目录
 * @param filePath 文件路径
 * @param maxCount 最大递归次数
 */
async function extractNestedComponentsData(
  filePath: string,
  subDocs: Record<string, string> = {},
  maxCount = 10,
) {
  if (maxCount <= 0) {
    console.warn(`⚠️ 达到最大递归次数，停止处理: ${filePath}`);
    return;
  }

  try {
    // 读取文件内容
    const fileContent = await readFile(filePath, "utf-8");

    // 使用正则表达式匹配所有 import 语句（包括静态和动态 import）
    const staticImportRegex =
      /import\s+(?:(?:{[\s\w,]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

    // 合并所有 import 匹配结果
    const importMatches = [
      ...fileContent.matchAll(staticImportRegex),
      ...fileContent.matchAll(dynamicImportRegex),
    ];
    // 处理每个 import 匹配
    for (const match of importMatches) {
      const importPath = match[1];
      // 只处理相对路径的导入
      if (importPath.startsWith(".")) {
        // 先获取当前文件所在目录
        const currentDir = resolve(filePath, "..");
        let fullPath = resolve(currentDir, importPath);

        // 检查文件是否存在，如果不存在尝试添加常见扩展名
        if (!existsSync(fullPath)) {
          const extensions = [".tsx", ".jsx", ".ts", ".js", ".less", ".css", ".scss"];
          let foundExtension = false;

          for (const ext of extensions) {
            if (existsSync(`${fullPath}${ext}`)) {
              fullPath = `${fullPath}${ext}`;
              foundExtension = true;
              break;
            }
          }

          // 尝试查找 index 文件
          if (!foundExtension && existsSync(`${fullPath}/index.tsx`)) {
            fullPath = `${fullPath}/index.tsx`;
            foundExtension = true;
          } else if (!foundExtension && existsSync(`${fullPath}/index.jsx`)) {
            fullPath = `${fullPath}/index.jsx`;
            foundExtension = true;
          } else if (!foundExtension && existsSync(`${fullPath}/index.js`)) {
            fullPath = `${fullPath}/index.js`;
            foundExtension = true;
          } else if (!foundExtension && existsSync(`${fullPath}/index.ts`)) {
            fullPath = `${fullPath}/index.ts`;
            foundExtension = true;
          }

          if (!foundExtension) {
            console.warn(`  ⚠️ 无法找到导入文件: ${importPath}`);
            continue;
          }
        }

        // 读取导入的文件内容
        let importedContent = await readFile(fullPath, "utf-8");

        // 获取文件类型
        const fileExtension = fullPath.toLowerCase().split(".").pop() || "";

        // 获取导入文件的基本名称，移除路径和扩展名

        // 获取导入文件的基本名称，移除路径和扩展名
        let baseName =
          fullPath
            .split(/[\/\\]/)
            .pop()
            ?.replace(/\.\w+$/, "") || "imported";
        //如果是 index 文件，向前取一位作为名称，并加上文件类型后缀
        if (baseName === "index") {
          const pathParts = fullPath.split(/[\/\\]/);
          if (pathParts.length >= 2) {
            // 取倒数第二个路径段作为基础名称，并加上文件扩展名
            const dirName = pathParts[pathParts.length - 2];
            baseName = `${dirName}-${fileExtension}`;
          }
        } else {
          // 对于非 index 文件，也可以考虑加上扩展名以避免潜在冲突
          baseName = `${baseName}-${fileExtension}`;
        }

        console.log("filepath", filePath);
        console.log("fullPath", fullPath);
        console.log("baseName", baseName);
        console.log("\n");
        // 检查是否已经处理过这个文件（避免重复处理）
        if (subDocs[baseName]) {
          console.log(`  ⚠️ 文件 ${baseName} 已存在，跳过处理`);
          continue;
        }

        // 准备 Markdown 内容
        let mdContent = `//${baseName}\n\n`;

        // 根据文件类型添加适当的代码块
        if (["tsx", "jsx", "ts", "js"].includes(fileExtension)) {
          mdContent += `源文件: \`${importPath}\`\n\n\`\`\`${fileExtension}\n${importedContent}\n\`\`\`\n`;
        } else if (["less", "css", "scss"].includes(fileExtension)) {
          mdContent += `样式文件: \`${importPath}\`\n\n\`\`\`${fileExtension}\n${importedContent}\n\`\`\`\n`;
        } else {
          mdContent += `未知类型文件: \`${importPath}\`\n\n\`\`\`\n${importedContent}\n\`\`\`\n`;
        }

        subDocs[baseName] = mdContent;

        await extractNestedComponentsData(fullPath, subDocs, maxCount - 1);
      }
    }
  } catch (error) {
    console.error(`❌ 读取或处理文件失败: ${filePath}`, error);
  }
}

export default extractAllData;
