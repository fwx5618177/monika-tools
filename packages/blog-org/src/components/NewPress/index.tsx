import React, { ReactNode } from "react";
import InfoBox from "@/components/InfoBox";
import styles from "./index.module.scss";
import Image from "next/image";
import { NewPressProps } from "Components";
import moment from "moment";

// 文章列表组件
const NewPress: React.FC<NewPressProps> = ({ title, articles }) => {
  return (
    <InfoBox height={320} scrollable>
      <div className={styles.articleList}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.articles}>
          {articles?.map((article, index) => (
            <div key={index} className={styles.articleItem}>
              <div className={styles.imageContainer}>
                <Image
                  width={60}
                  height={60}
                  src={article.imageUrl}
                  alt={article.title}
                  className={styles.articleImage}
                />
              </div>
              <div className={styles.articleContent}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <time className={styles.articleDate}>
                  {moment(article.date).format("YYYY-MM-DD")}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfoBox>
  );
};

export default NewPress;
