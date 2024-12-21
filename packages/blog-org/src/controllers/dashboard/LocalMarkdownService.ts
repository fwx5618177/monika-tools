import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";
import { DashBoardDetailModifyProps } from "Response";
import MarkdownUpdater from "./MarkdownUpdater";
import GenerateHash from "../utils/GenerateHash";
import { PostStatusProps } from "Dashboard";

/**
 * 本地Markdown文件服务
 */
class LocalMarkdownService {
  /**
   * 单例
   */
  private static instance: LocalMarkdownService;
  /**
   * Markdown文件所在的目录
   */
  private baseDirectory: string;

  /**
   * 私有构造函数
   * @param baseDirectory Markdown文件所在的目录
   */
  private constructor(baseDirectory: string) {
    this.baseDirectory = baseDirectory;
  }

  /**
   * 获取 LocalMarkdownService 的单例
   * @param baseDirectory Markdown文件所在的目录
   * @returns {LocalMarkdownService} LocalMarkdownService的单例
   */
  public static getInstance(baseDirectory: string): LocalMarkdownService {
    if (!LocalMarkdownService.instance) {
      LocalMarkdownService.instance = new LocalMarkdownService(baseDirectory);
    }
    return LocalMarkdownService.instance;
  }

  async insertLocalMarkDownIDs(data: PostStatusProps[]): Promise<{
    message: string;
    successIds: { id: string; title: string }[];
    failedIds: { id: string; title: string }[];
  }> {
    try {
      const updateTasks = data.map(async (item) => {
        const { id, title, slug } = item;
        const matchingMarkdownFiles = await this.findMatchingMarkdownFiles(
          this.baseDirectory,
          { id, title, slug }
        );

        // 处理每个文件的更新
        const fileUpdateTasks = matchingMarkdownFiles.map(async (filePath) => {
          try {
            const updater = MarkdownUpdater.getInstance(filePath);
            await updater.insertLocalMarkDownID({ id, title, slug });

            return { id, success: true, title };
          } catch (error) {
            console.error(`更新失败：${error.message}，文件路径：${filePath}`);
            return { id, success: false, title };
          }
        });

        // 并行执行所有文件的更新任务
        return Promise.all(fileUpdateTasks);
      });

      // 并行执行所有数据项的更新任务
      const results = await Promise.all(updateTasks);
      const flatResults = results.flat(); // 展平结果

      // 分类成功和失败的ID
      const successIds = flatResults
        .filter((result) => result.success)
        .map((result) => ({
          ...result,
        }));
      const failedIds = flatResults
        .filter((result) => !result.success)
        .map((result) => ({ ...result }));

      return {
        message: "Markdown文件更新完成",
        successIds,
        failedIds,
      };
    } catch (error) {
      throw new Error("Markdown更新失败：" + error.message);
    }
  }

  async insertLocalMarkDownID({ id, title, slug }): Promise<
    {
      message: string;
      id: string;
    }[]
  > {
    try {
      // 递归查找Markdown文件并检查是否匹配数据的标识
      const matchingMarkdownFiles = await this.findMatchingMarkdownFiles(
        this.baseDirectory,
        {
          id,
          title,
          slug,
        }
      );

      // 使用 MarkdownUpdater 更新匹配的Markdown文件
      const promises = matchingMarkdownFiles.map(async (filePath) => {
        const updater = MarkdownUpdater.getInstance(filePath);

        return updater.insertLocalMarkDownID({
          id,
          title,
          slug,
        });
      });

      const result = await Promise.all(promises);

      console.log({
        result,
      });

      return result;
    } catch (error) {
      throw new Error("Markdown更新失败：" + error.message);
    }
  }

  /**
   * 更新Markdown文件
   * @param data 更新的数据
   * @returns {Promise<{ message: string }>} 返回更新的结果
   */
  async updateMarkdown(
    data: DashBoardDetailModifyProps
  ): Promise<{ message: string }[]> {
    try {
      // 递归查找Markdown文件并检查是否匹配数据的标识
      const matchingMarkdownFiles = await this.findMatchingMarkdownFiles(
        this.baseDirectory,
        data
      );

      // 使用 MarkdownUpdater 更新匹配的Markdown文件
      const promises = matchingMarkdownFiles.map(async (filePath) => {
        const updater = MarkdownUpdater.getInstance(filePath);

        return updater.updateIfChanged(data);
      });

      const result = await Promise.all(promises);

      return result;
    } catch (error) {
      console.error("Markdown更新失败：", error);
      throw new Error("Markdown更新失败：" + error.message);
    }
  }

  private async findAllFiles(directory: string): Promise<string[]> {
    const allFiles: string[] = [];
    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // 如果是目录，则递归查找
        const subDirectoryFiles = await this.findAllFiles(filePath);
        allFiles.push(...subDirectoryFiles);
      } else {
        // 直接添加文件路径
        allFiles.push(filePath);
      }
    }

    return allFiles;
  }

  /**
   * 递归查找Markdown文件并检查是否匹配数据的标识
   * @param directory 目录
   * @param data 更新的数据
   * @returns {Promise<string[]>} 匹配的文件列表
   */
  private async findMatchingMarkdownFiles(
    directory: string,
    data: PostStatusProps
  ): Promise<string[]> {
    const matchingFiles: string[] = [];
    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        // 如果是目录，则递归查找
        const subDirectoryMatchingFiles = await this.findMatchingMarkdownFiles(
          filePath,
          data
        );
        matchingFiles.push(...subDirectoryMatchingFiles);
      } else if (filePath.endsWith(".md")) {
        // 如果是Markdown文件，检查是否匹配数据的标识
        const markdownContent = await fs.readFile(filePath, "utf-8");
        const isSameFilePath = this.isSameFilePath(filePath, data.title);
        const isSameID = this.isSameId(markdownContent, data.id);
        const isMarkdownMatchingData = this.isMarkdownMatchingData(
          markdownContent,
          data
        );

        if (isSameID || isSameFilePath || isMarkdownMatchingData) {
          matchingFiles.push(filePath);
        }
      }
    }

    return matchingFiles;
  }

  /**
   * 检查Markdown文件是否匹配数据的标识
   * @param content Markdown文件的内容
   * @param id 数据的标识
   * @returns {boolean} 返回是否匹配
   */
  private isSameId(content: string, id: string): boolean {
    const parsedData = matter(content);
    const dataId = parsedData.data.id;

    return dataId === id;
  }

  /**
   * 根据标题检查Markdown文件是否匹配文件路径
   * @param filePath Markdown文件的路径
   * @param title Markdown文件的标题
   * @returns {boolean} 返回是否匹配
   */
  private isSameFilePath(filePath: string, title: string): boolean {
    const basename = path.basename(filePath);
    const fileNameHash = GenerateHash.generateId(basename);
    const titleHash = GenerateHash.generateId(title);

    // 如果文件名的SHA256值匹配，直接返回 true
    if (fileNameHash === titleHash) {
      return true;
    }

    return false;
  }

  /**
   * 检查Markdown文件是否匹配数据的标识 - title, slug
   * @param markdownContent Markdown文件的内容
   * @param data 更新的数据
   * @returns {boolean} 返回是否匹配
   */
  private isMarkdownMatchingData(
    markdownContent: string,
    data: PostStatusProps
  ): boolean {
    // 解析Markdown内容，获取title字段的值
    const parsedData = matter(markdownContent);
    const title = parsedData.data.title;
    const updateDataSlugHash = data.slug;

    // 如果title的SHA256值匹配，返回 true
    if (title) {
      const titleHash = GenerateHash.generateId(title);

      if (titleHash === updateDataSlugHash) {
        return true;
      }
    }

    // 对整个Markdown内容进行SHA256计算
    const contentHash = GenerateHash.generateId(markdownContent);

    return contentHash === updateDataSlugHash;
  }
}

export default LocalMarkdownService;
