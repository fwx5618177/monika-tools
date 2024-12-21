import { randomUUID } from "crypto";
import matter from "gray-matter";
import path from "path";
import fs from "fs";
import {
  ArticleListResponse,
  BaseLocalDataResponse,
  DetailArticleDisplayResponse,
} from "Response";
import { PostStatusEnum } from "@/types/common";
import GenerateHash from "../utils/GenerateHash";

export class LocalPostActions {
  static postsDirectory = path.join(process.cwd(), "posts");

  /**
   * Parse markdown content of a post and extract metadata and content
   * @param fileName FileName
   * @param markdownContent The markdown content of the post
   * @returns The Post object
   */
  static parsePost(
    markdownContent: string,
    options?: {
      fileName: string;
      fileCreationDate: string;
      updateDate: string;
      filePath: string;
    }
  ): DetailArticleDisplayResponse {
    const { data, content } = matter(markdownContent);

    // 使用title生成一个特殊的slug值
    const slug = GenerateHash.generateId(
      data?.title || markdownContent || options?.fileName
    );

    // 读取的本地文件数据
    const {
      title,
      date,
      author,
      tags,
      description,
      excerpt,
      addition,
      type,
      language,
      id,
      isSticky,
    } = data as BaseLocalDataResponse;
    const wordCount = content.split(/\s+/gu).length;
    const readTimeCost = Math.ceil(wordCount / 200);

    // 数据组合
    const metadata: DetailArticleDisplayResponse = {
      id: id || randomUUID(),
      type: type || "article",
      slug: slug,
      localPath: options?.filePath,
      imageUrl: "https://picsum.photos/950/300",
      title: title || options?.fileName || "Untitled",
      language: language || "中文",
      createdDate:
        date || options?.fileCreationDate || new Date().toISOString(),
      publishedDate: null,
      updatedDate: options?.updateDate || new Date().toISOString(),
      content: content || "",
      excerpt: excerpt || "",
      author: {
        name: author,
        url: "",
        avatarUrl: "",
        description: "",
      },
      tags: tags || [],
      readCount: 0,
      commentsCount: 0,
      status: PostStatusEnum.UPLOAD,
      description: description || "",
      websiteStats: {
        articleCount: 0,
        totalWordCount: 0,
        totalVisitors: 0,
        totalVisits: 0,
        lastUpdated: new Date().toISOString(),
      },
      meta: {
        isSticky: isSticky || false,
        type: data?.meta?.type || "article",
        date: new Date().toISOString(),
        readCount: 0,
        wordCount,
        readTimeCost,
      },
      addition: addition || [],
    };

    return metadata;
  }

  /**
   * 递归读取目录下的所有文件。一边扫描一边处理文件
   * @param dirPath 目录路径
   * @param callback 回调函数-读取到文件后的处理
   */
  static readDirRecursively(
    dirPath: string,
    callback: (filePath: string) => void
  ): void {
    fs.readdirSync(dirPath).forEach((file) => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat && stat.isDirectory()) {
        LocalPostActions.readDirRecursively(fullPath, callback);
      } else if (fullPath.endsWith(".md")) {
        callback(fullPath);
      }
    });
  }

  /**
   * 处理目录下的文件内容
   * @param filePath 目录路径
   * @param type 文件类型
   * @returns
   */
  static processFile(filePath: string, type = ".md") {
    try {
      const fileName = path.basename(filePath, type);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const stats = fs.statSync(filePath);
      const fileCreationDate = stats.birthtime.toISOString();
      const updateDate = stats.mtime.toISOString();

      return this.parsePost(fileContents, {
        fileName,
        fileCreationDate,
        updateDate,
        filePath,
      });
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * 获取所有文章的数据
   * @returns {ArticleListResponse} An array of Post objects
   */
  static getAllPostsData(): ArticleListResponse {
    const allPostsData: ArticleListResponse = [];

    this.readDirRecursively(this.postsDirectory, (filePath) => {
      const postData = this.processFile(filePath);

      if (postData) {
        allPostsData.push(postData);
      }
    });

    const stickyPosts = allPostsData
      .filter(
        (post): post is DetailArticleDisplayResponse => post?.meta?.isSticky
      )
      .sort(
        (a, b) =>
          new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
      );

    const normalPosts = allPostsData
      .filter(
        (post): post is DetailArticleDisplayResponse => !post?.meta?.isSticky
      )
      .sort(
        (a, b) =>
          new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
      );

    return [...stickyPosts, ...normalPosts];
  }

  /**
   * Get a list of markdown file slugs from the posts directory
   * @returns {fileName[]} An array of fileName derived from the file names
   */
  static getListOfSlugs(): string[] {
    const filenames = fs.readdirSync(LocalPostActions.postsDirectory);
    const fileName = filenames
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => filename.replace(/\.md$/, ""));
    return fileName;
  }
}
