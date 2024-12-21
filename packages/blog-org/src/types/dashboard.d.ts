declare module "Dashboard" {
  import { ReactNode } from "react";
  import { ArticleListResponse } from "Response";

  interface QueryLocalPostListResponse {
    data: ArticleListResponse;
  }

  interface EditableTagGroupProps {
    value: string[];
    onChange: (newTags: string[]) => void;
  }

  type MarkdownEditorProps = {
    value: string;
    onChange: (newTags: string) => void;
  };

  type ImageShowProps = {
    value: string;
    onChange: (value: string) => void;
  };

  type SynchronizedIDProps = {
    value: string;
    onChange: (value: string) => void;
  };

  // 定义Tag类型
  type TagType = string;

  // 表单提交的数据格式
  interface PostEditFormProps {
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
    slug?: string;
    id: string;
  }

  interface UseTagsProps {
    tags: TagType[];
    setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
    color?: string;
  }

  interface PostStatusProps {
    id: string;
    title: string;
    slug: string;
  }
}
