import { read } from "to-vfile";
import { matter } from "vfile-matter";

interface GroupInfo {
  title: string;
  order: number;
}

interface InfraMatter {
  group: GroupInfo;
  title: string;
}

/** 解析 markdown的 meta 信息 */
export const parseMDMatter = async (filePath: string): Promise<InfraMatter | undefined> => {
  try {
    const file = await read(filePath);
    matter(file);
    return file.data.matter as InfraMatter;
  } catch (error) {
    return undefined;
  }
};
