"use client";

import React from "react";
import { WebsiteStatsProps } from "Components";
import styles from "./index.module.scss";
import InfoBox from "../InfoBox";
import { FaChartLine } from "react-icons/fa";
import moment from "moment";

const WebsiteStats: React.FC<WebsiteStatsProps> = ({
  articleCount,
  totalWordCount,
  totalVisitors,
  totalVisits,
  lastUpdated,
}) => {
  return (
    <InfoBox height={230}>
      <div className={styles["website-stats"]}>
        <div className={styles["website-header"]}>
          <FaChartLine />
          <span>网站资讯</span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-title"]}>文章数目：</span>
          <span className={styles["stat-value"]}>{articleCount}</span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-title"]}>本站总字数：</span>
          <span className={styles["stat-value"]}>
            {totalWordCount?.toLocaleString()}k
          </span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-title"]}>本站访客数：</span>
          <span className={styles["stat-value"]}>
            {totalVisitors?.toLocaleString()}k
          </span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-title"]}>本站总访问量：</span>
          <span className={styles["stat-value"]}>
            {totalVisits?.toLocaleString()}
          </span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-title"]}>最后更新时间：</span>
          <span className={styles["stat-value"]}>
            {moment(lastUpdated)?.format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
      </div>
    </InfoBox>
  );
};

export default React.memo(WebsiteStats);
