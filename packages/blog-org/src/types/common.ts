export const enum PostStatusEnum {
  PUBLISHED = "published",
  DRAFT = "draft",
  ARCHIVED = "archived",
  UPLOAD = "upload",
}

export const PostStatusDisplay = {
  [PostStatusEnum.PUBLISHED]: "已上传",
  [PostStatusEnum.DRAFT]: "草稿",
  [PostStatusEnum.ARCHIVED]: "已归档",
  [PostStatusEnum.UPLOAD]: "待上传",
};
