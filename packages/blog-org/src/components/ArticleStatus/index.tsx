import { ArticleStatusType } from "Components";
import { FC } from "react";
import styles from "./index.module.scss";
import { PostStatusEnum } from "@/types/common";

const ArticleStatus: FC<ArticleStatusType> = ({ status, onStatusChange }) => {
  // 根据状态显示不同的按钮样式或文本
  const renderButton = () => {
    switch (status) {
      case PostStatusEnum.PUBLISHED:
        return (
          <button
            className={styles["status-published"]}
            onClick={() => onStatusChange?.(PostStatusEnum.DRAFT)}
          >
            {PostStatusEnum.PUBLISHED}
          </button>
        );
      case PostStatusEnum.DRAFT:
        return (
          <button
            className={styles["status-draft"]}
            onClick={() => onStatusChange?.(PostStatusEnum.PUBLISHED)}
          >
            {PostStatusEnum.DRAFT}
          </button>
        );
      case PostStatusEnum.ARCHIVED:
        return (
          <button
            className={styles["status-archived"]}
            onClick={() => onStatusChange?.(PostStatusEnum.PUBLISHED)}
          >
            {PostStatusEnum.ARCHIVED}
          </button>
        );

      case PostStatusEnum.UPLOAD:
        return (
          <button
            className={styles["status-upload"]}
            onClick={() => onStatusChange?.(PostStatusEnum.UPLOAD)}
          >
            {PostStatusEnum.UPLOAD}
          </button>
        );
      default:
        return null;
    }
  };

  return <div className={styles["article-status"]}>{renderButton()}</div>;
};

export default ArticleStatus;
