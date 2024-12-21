import React, { FC } from "react";
import InfoBox from "@/components/InfoBox";
import styles from "./index.module.scss";
import Image from "next/image";
import MetaData from "./MetaData";
import { ArticleDisplayProps } from "Components";
import Link from "next/link";
import ArticleStatus from "../ArticleStatus";
import { PostStatusEnum } from "@/types/common";

const ArticleDisplay: FC<ArticleDisplayProps> = (props) => {
  const {
    imageUrl,
    title,
    description,
    position = "left",
    meta,
    createdDate,
    slug,
    language,
    status,
  } = props;

  return (
    <InfoBox width={866} height={252}>
      <div className={`${styles.articleDisplay} ${styles[position]}`}>
        <div className={styles.imageContainer}>
          <Image
            width={377}
            height={252}
            style={{
              height: 252,
            }}
            src={imageUrl}
            alt={title}
            priority
          />
        </div>
        <div className={styles.contentContainer}>
          <Link href={`/post/${slug}`}>
            <span className={styles.title}>{title}</span>
          </Link>
          <MetaData date={createdDate} {...meta} />
          <p className={styles.description}>{description}</p>
        </div>
        {/* <div className={styles["status"]}>
          {status === PostStatusEnum.UPLOAD && (
            <ArticleStatus
              status={status}
              onStatusChange={(status) => {
                console.log(status, props);
              }}
            />
          )}
        </div> */}
        <div className={styles["language"]}>{language}</div>
      </div>
    </InfoBox>
  );
};

export default React.memo(ArticleDisplay);
