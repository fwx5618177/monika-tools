import { FaCalendar, FaFile, FaClock, FaEye } from "react-icons/fa";
import styles from "./index.module.scss";
import moment from "moment";
import { FC } from "react";
import { HeaderTitleProps } from "Components";

const HeaderTitle: FC<HeaderTitleProps> = ({
  title,
  publishedDate,
  updatedDate,
  readCount,
  wordCount,
  readTimeCost,
  type,
}) => {
  return (
    <div className={styles["header-title-container"]}>
      <h1 className={styles["header-title"]}>{title}</h1>
      <div className={styles["header-subtitle"]}>
        <div>
          <span>
            <FaCalendar /> 发表于
            {moment(publishedDate).format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <span className={styles["header-separator"]}>|</span>
          <span>
            <FaCalendar /> 更新于
            {moment(updatedDate).format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <span className={styles["header-separator"]}>|</span>
          <span>{type || "默认类型"}</span>
        </div>

        <div>
          <span>
            <FaFile /> 字数统计: {wordCount ?? 0} 字
          </span>
          <span className={styles["header-separator"]}>|</span>
          <span>
            <FaClock /> 阅读时长 {readTimeCost ?? 0} 分钟
          </span>
          <span className={styles["header-separator"]}>|</span>
          <span>
            <FaEye /> 阅读量 {readCount ?? 0} 次
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderTitle;
