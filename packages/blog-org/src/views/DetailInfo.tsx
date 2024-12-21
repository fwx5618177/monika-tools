"use client";

import React, { FC } from "react";
import styles from "@/styles/detailInfo.module.scss";
import ProfileCard from "../components/ProfileCard";
import NewPress from "@/components/NewPress";
import { FaHistory } from "react-icons/fa";
import WebsiteStats from "@/components/WebsiteStats";
import TagCloud from "@/components/TagCloud";
import ListSection from "@/components/ListSection";
import { DetailInfoProps } from "Components";
import SubscribeButtons from "@/components/SubscribeForm";

const DetailInfo: FC<DetailInfoProps> = ({
  data,
  recentArticles,
  tags,
  websiteStats,
  profileInfo,
  isHomeList = true,
  children,
}) => {
  return (
    <div className={styles["detail-container"]}>
      <div className={styles["info-section"]}>
        <ProfileCard
          avatarUrl={profileInfo?.avatarUrl}
          name={profileInfo?.name}
          description={profileInfo?.description}
          articlesCount={profileInfo?.articlesCount}
          tagsCount={profileInfo?.tagsCount}
          categoriesCount={profileInfo?.categoriesCount}
          qqLink={profileInfo?.qqLink}
          emailLink={profileInfo?.emailLink}
          githubLink={profileInfo?.githubLink}
        />

        <NewPress
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <FaHistory color="#4c4948" />
              <span
                style={{
                  marginLeft: 5,
                }}
              >
                最新文章
              </span>
            </div>
          }
          articles={recentArticles}
        />

        <TagCloud tags={tags} title={"热门标签"} />

        <WebsiteStats
          articleCount={websiteStats?.articleCount}
          totalWordCount={websiteStats?.totalVisitors}
          totalVisitors={websiteStats?.totalVisitors}
          totalVisits={websiteStats?.totalVisits}
          lastUpdated={websiteStats?.lastUpdated}
        />

        <SubscribeButtons />
      </div>

      <div className={styles["line"]}></div>

      <div className={styles["list-section"]}>
        {isHomeList ? <ListSection defaultArticles={data} /> : children}
      </div>
    </div>
  );
};

export default DetailInfo;
