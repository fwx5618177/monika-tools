import { cache } from "react";
import { ssgData } from "@/controllers/post/ssgData";
import { ArticleDisplayProps } from "Components";

export const revalidate = 3600;

/**
 * Get Post Data
 */
export const getDefaultPostData = cache(
  async (slug: string): Promise<ArticleDisplayProps> => {
    const res = await ssgData(slug);

    const data: {
      data: ArticleDisplayProps;
    } = await res.json();

    return data?.data;
  }
);
