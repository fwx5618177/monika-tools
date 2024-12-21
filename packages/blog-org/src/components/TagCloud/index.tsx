import React from "react";
import styles from "./index.module.scss";
import { TagCloudProps } from "Components";
import InfoBox from "../InfoBox";
import { FaTags } from "react-icons/fa";

const TagCloud: React.FC<TagCloudProps> = ({ tags, title }) => {
  return (
    <InfoBox height={300}>
      <div className={styles["info-box"]}>
        <div className={styles["info-box-title"]}>
          <FaTags />
          {title}
        </div>
        <div className={styles["tags-container"]}>
          {tags?.map((tag, index) => (
            <span key={index} className={styles["tag"]}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </InfoBox>
  );
};

export default TagCloud;
