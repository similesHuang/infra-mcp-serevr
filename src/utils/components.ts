import { readFile } from "node:fs/promises";
import {
  DOC_FILE_NAME,
  EXTRACTED_COMPONENTS_DATA_PATH,
  EXTRACTED_COMPONENTS_LIST_PATH,
} from "../constants/path.js";
import { Cache } from "./cache.js";
import { join } from "node:path";
import { existsSync } from "node:fs";

import type { ComponentData } from "../scripts/extract-docs.js";

interface CacheData {
  componentsList: ComponentData[];
  componentsChangelog: Record<string, ComponentChangelogItem[]>;
  componentsDoc: Record<string, string>;
  componentApi: Record<string, string>;
  componentExample: Record<string, string>;
}

const componentCache = new Cache<CacheData>();

/** 加载组件列表 */
export async function loadComponentsList() {
  try {
    const cacheComponentList = componentCache.get("componentsList");
    if (cacheComponentList) {
      return cacheComponentList;
    }

    const componentList = await readFile(EXTRACTED_COMPONENTS_LIST_PATH, "utf-8");

    const componentListJson = JSON.parse(componentList) as ComponentData[];

    componentCache.set("componentsList", componentListJson);

    return componentListJson;
  } catch (error) {
    console.error(`加载组件列表错误: ${(error as Error).message}`);
    return [];
  }
}

/** 根据组件名称查找组件 */
export async function findComponentByName(componentName: string) {
  const components = await loadComponentsList();
  return components.find(
    (c) =>
      c.name.toLowerCase() === componentName.toLowerCase() ||
      c.dirName.toLowerCase() === componentName.toLowerCase(),
  );
}

/** 获取 infra-ui 特定组件文档 */
export const getComponentDocumentation = async (componentName: string) => {
  const component = await findComponentByName(componentName);

  if (!component) {
    return ` "${componentName}" 组件文档不存在`;
  }

  const docPath = join(EXTRACTED_COMPONENTS_DATA_PATH, component.dirName, DOC_FILE_NAME);

  try {
    const cacheComponentDoc = componentCache.get("componentsDoc") || {};
    if (cacheComponentDoc?.[component.name]) {
      return cacheComponentDoc[component.name];
    }

    if (existsSync(docPath)) {
      const docResult = await readFile(docPath, "utf-8");

      cacheComponentDoc[component.name] = docResult;
      componentCache.set("componentsDoc", cacheComponentDoc);

      return docResult;
    }

    return `${component.name} 组件文档不存在`;
  } catch (error) {
    console.error(`获取 ${component.name} 组件文档错误: ${(error as Error).message}`);
    return `获取 ${component.name} 组件文档错误: ${(error as Error).message}`;
  }
};


interface ComponentChangelogItem {
  version: string;
  changelog: string;
  refs: string[];
  releaseDate: string;
  contributors: string[];
}

