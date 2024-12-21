import fs from "fs/promises";
import crypto from "crypto";
import matter, { GrayMatterFile } from "gray-matter";
import { DashBoardDetailModifyProps } from "Response";
import { PostStatusProps } from "Dashboard";

class MarkdownUpdater {
  private static instance: MarkdownUpdater;
  private markdownFilePath: string;

  private constructor(markdownFilePath: string) {
    this.markdownFilePath = markdownFilePath;
  }

  public static getInstance(markdownFilePath: string): MarkdownUpdater {
    // TODO: remove singleton
    // if (!MarkdownUpdater.instance) {
    //   MarkdownUpdater.instance = new MarkdownUpdater(markdownFilePath);
    // }

    // MarkdownUpdater.instance.markdownFilePath = markdownFilePath;
    // return MarkdownUpdater.instance;

    return new MarkdownUpdater(markdownFilePath);
  }

  public async insertLocalMarkDownID(updatedData: PostStatusProps) {
    try {
      // 读取本地Markdown文件
      const markdownContent = await this.readMarkdownFile();
      // 解析Markdown文件的前置元数据
      const matterData = matter(markdownContent);
      const localId = matterData?.data?.id;

      if (localId === updatedData?.id) {
        throw new Error("Markdown文件已经更新过");
      }

      // 更新每个字段
      const updatedMatterData = {
        ...matterData,
        data: {
          ...matterData.data,
          id: updatedData?.id,
          title: updatedData?.title,
          slug: updatedData?.slug,
        },
      };

      // 生成更新后的Markdown内容
      const updatedMarkdownContent = matter.stringify(updatedMatterData, {});

      await this.writeMarkdownFile(updatedMarkdownContent);

      return { message: "Markdown文件已更新", id: updatedData?.id };
    } catch (error) {
      throw new Error("处理文件出错" + error?.message);
    }
  }

  public async updateIfChanged(
    updatedData: DashBoardDetailModifyProps
  ): Promise<{ message: string }> {
    try {
      // 读取本地Markdown文件
      const markdownContent = await this.readMarkdownFile();

      // 解析Markdown文件的前置元数据
      const matterData = matter(markdownContent);

      // 更新每个字段
      const updatedMatterData = this.updateFields(updatedData, matterData);

      // 生成更新后的Markdown内容
      const updatedMarkdownContent = matter.stringify(updatedMatterData, {});

      // 计算MD5或SHA256哈希值
      const hash = this.calculateHash(updatedMarkdownContent);
      const localHash = this.calculateHash(markdownContent);

      // 比较哈希值
      if (hash !== localHash) {
        // 如果哈希值不同，更新本地Markdown文件
        await this.writeMarkdownFile(updatedMarkdownContent);
        return { message: "Markdown文件已更新" };
      } else {
        return { message: "Markdown文件未修改" };
      }
    } catch (error) {
      console.error("处理文件出错：", error);
      throw new Error("处理文件出错");
    }
  }

  private async readMarkdownFile(): Promise<string> {
    try {
      const markdownContent = await fs.readFile(this.markdownFilePath, "utf-8");
      return markdownContent;
    } catch (error) {
      console.error("读取Markdown文件时出错：", error);
      throw new Error("无法读取Markdown文件");
    }
  }

  private async writeMarkdownFile(content: string): Promise<void> {
    try {
      await fs.writeFile(this.markdownFilePath, content, "utf-8");
    } catch (error) {
      console.error("写入Markdown文件时出错：", error);
      throw new Error("无法写入Markdown文件");
    }
  }

  private calculateHash(content: string): string {
    return crypto.createHash("md5").update(content).digest("hex");
  }

  private updateFields(
    updatedData: DashBoardDetailModifyProps | PostStatusProps,
    matterData: GrayMatterFile<string>
  ): GrayMatterFile<string> {
    const updatedMatterData = { ...matterData.data };

    for (const key in updatedData) {
      if (key === "content" || key === "localPath") continue;
      else if (
        updatedData[key] !== undefined &&
        updatedData[key] !== matterData.data[key]
      ) {
        updatedMatterData[key] = updatedData[key];
      }
    }

    return {
      ...matterData,
      data: updatedMatterData,
      content: updatedData["content"],
    };
  }
}

export default MarkdownUpdater;
