import { Cache } from './cache.js';
import { TemplateData } from "@/scripts/extract-docs.js";

import { readFile } from "node:fs/promises";
import {DOC_FILE_NAME, EXTRACTED_COMPONENTS_DATA_PATH, EXTRACTED_COMPONENTS_LIST_PATH} from "@/constants/path.js";
import { join } from "node:path";
import { existsSync } from 'node:fs';
interface CatchData {
    [key: string]: unknown;
    templateList: TemplateData[];
    templateExample: Record<string, string>;
}
const templateCatch = new Cache<CatchData>();


// 加载模板列表
export const loadTemplateList =async ()=>{
     try{
          const catchtemplates=  templateCatch.get("templateList");
          if(catchtemplates){
              return catchtemplates;
          }
          const templateList =  await readFile(EXTRACTED_COMPONENTS_LIST_PATH, "utf-8");
          const templateListJson = JSON.parse(templateList) as TemplateData[];
          templateCatch.set("templateList", templateListJson);
          return templateListJson;
     }catch(err){
            console.error("加载模板列表时出错:", err);
     }
};

// 根据模板名称获取模板信息
export const findTemplayteByName = async (templateName: string)=>{
     const templateList = await loadTemplateList();
   
    return templateList.find(
    (c) =>
      c.name.toLowerCase() === templateName.toLowerCase() ||
      c.dirName.toLowerCase() === templateName.toLowerCase(),
  );
};

// 获取特定模板示例
export const getTemplateExampleCode = async (templateName: string) => {
      
      const template = await findTemplayteByName(templateName);
      if(!template) {
          return ` "${templateName}" 组件文档不存在`;
      }
      try{   
            // 尝试从缓存中获取模板示例
            const templateExample = templateCatch.get("templateExample")||{};
            if(templateExample[templateName]){
                return templateExample[templateName];
            };
             // 模板代码目录
            const templatePath = join(EXTRACTED_COMPONENTS_DATA_PATH,template.dirName);
            const templateCodePath = join(templatePath, DOC_FILE_NAME);
            const subComponentsPath = template?.subDocsName?.map((subdocName) =>{
            const formatSubdocName = subdocName+ (subdocName.endsWith(".md") ? "" : ".md");
            return join(templatePath, formatSubdocName)});
            if(existsSync(templatePath)){
                let  templateExampleCode = '';
                const templateExampleMainCode = await readFile(templateCodePath, "utf-8"); 
                templateExampleCode += templateExampleMainCode+ '\n\n';
                if(subComponentsPath && subComponentsPath.length > 0){
                    for(const subComponentPath of subComponentsPath){
                        if(existsSync(subComponentPath)){
                            const subComponentCode = await readFile(subComponentPath, "utf-8");
                            templateExampleCode += subComponentCode + '\n\n';
                        }
                    }
                }
                // 缓存模板示例
                templateExample[templateName] = templateExampleCode;
                
                templateCatch.set("templateExample", templateExample);
                return templateExampleCode;
            } 

      } catch (err){
         console.error("获取模板示例时出错:", err);
      }
      
}

