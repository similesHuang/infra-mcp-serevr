import { readFile, writeFile } from "node:fs/promises";
import {
  README_MATCH_FIELD,
  README_PATH,
  README_ZH_CN_PATH,
  README_ZH_CN_MATCH_FIELD,
} from "../constants/path.js";
import type { MetaDataResult } from "../scripts/extract-docs.js";

/** 写入压缩后的 JSON */
export const writeJsonFile = async (filePath: string, data: unknown) => {
  return writeFile(filePath, JSON.stringify(data));
};

/**
 * 将提取的组件信息写入到 README.md 中
 * @param params 提取的信息
 * @returns
 */
export const writeExtractedInfoToReadme = async ({ infraVersion, extractedAt }: MetaDataResult) => {
  if (!process.env.IS_BUILD) {
    await Promise.all(
      [
        {
          path: README_ZH_CN_PATH,
          match: README_ZH_CN_MATCH_FIELD,
        },
        {
          path: README_PATH,
          match: README_MATCH_FIELD,
        },
      ].map(async ({ path, match }) => {
        return writeFile(
          path,
          await readFile(path, "utf-8").then((content: string) =>
            content.replace(
              match,
              `\`Infra UI V${infraVersion} ${new Date(extractedAt).toLocaleDateString("zh-CN")}\``,
            ),
          ),
        );
      }),
    );

    console.log(`✅ README.md 中预处理版本信息已更新`);
  }
  return null;
};
