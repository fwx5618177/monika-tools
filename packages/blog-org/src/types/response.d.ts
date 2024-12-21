declare module "Response" {
  import { AxiosRequestConfig } from "axios";
  import { CODE_CONFIG } from "@/utils/code.config";

  interface ResponseConfig<U> extends AxiosRequestConfig {
    data: {
      code: CODE_CONFIG;
      message: string;
      data: U;
    };
  }

  interface SSGHomeImageResponse {
    id: string;
    link: string;
    small: string;
    welcome: string;
  }

  interface AuthorResponse {
    name: string;
    avatarUrl: string;
    description: string;
    url: string;
  }

  interface MetaDataResponse {
    isSticky: boolean;
    type: string; // 文章的类型
    date: string | Date | number;
    readCount: string | number;
    wordCount: string | number;
    readTimeCost: string | number;
  }

  interface RelativeArticleResponse {
    title: string;
    updatedDate: string | number | Date;
    imageUrl: string;
    type: "pre" | "next" | string;
    slug: string;
  }

  type RelativeArticleList = RelativeArticleResponse[];

  interface BaseLocalDataResponse {
    title: string;
    date: string | Date | number;
    author: string;
    tags: string[];
    description: string;
    excerpt: string;
    addition: string[];
    type: string; // 文章的类型
    language: string; // 文章的语言
    id?: string;
    isSticky?: boolean;
  }

  interface DetailArticleDisplayResponse
    extends Omit<BaseLocalDataResponse, "author" | "date"> {
    id: string;
    slug: string;
    localPath?: string;
    imageUrl: string;
    createdDate: string | Date | number;
    publishedDate: string | Date | number;
    updatedDate: string | Date | number;
    content: string;
    // position: "left" | "right"; // front 使用
    meta: MetaDataResponse;
    websiteStats: WebsiteStatsResponse;
    author: AuthorResponse;
    readCount: number;
    commentsCount: number;
    status: PostStatusEnum;
    relatives?: RelativeArticleList;
  }

  type ArticleListResponse = DetailArticleDisplayResponse[];

  interface RecentArticleResponse {
    title: string;
    date: string;
    imageUrl: string;
  }

  type RecentArticleListResponse = RecentArticleResponse[];

  interface TagCloudResponse {
    name: string;
    count: number;
    key: string;
  }

  type TagCloudListResponse = TagCloudResponse[];

  interface WebsiteStatsResponse {
    articleCount: number;
    totalWordCount: number;
    totalVisitors: number;
    totalVisits: number;
    lastUpdated: string | Date | number;
  }

  interface ProfileCardResponse {
    avatarUrl: string;
    name: string;
    description: string;
    articlesCount: number;
    tagsCount: number;
    categoriesCount: number;
    qqLink: string;
    emailLink: string;
    githubLink: string;
  }

  type HomeResponse = {
    imageData: SSGHomeImageResponse;
    list: ArticleListResponse;
    recentArticles: RecentArticleListResponse;
    tags: TagCloudListResponse;
    websiteStats: WebsiteStatsResponse;
    profileInfo: ProfileCardResponse;
  };

  interface LoginSettingResponse {
    backgroundImage: string;
  }

  interface LoginResponse {
    token: string;
  }

  interface DashBoardDetailModifyProps {
    isSticky: boolean;
    title: string;
    cover: string;
    status: string;
    type: string;
    language: string;
    description: string;
    excerpt: string;
    name: string;
    tags: string[];
    addition: string[];
    content: string;
    slug: string;
    id: string;
  }

  interface LocalPostStatus {
    id: string;
    isExist: boolean;
  }
  interface LocalAllPostStatus {
    message: string;
    successIds: string[];
    failedIds: string[];
  }
}
