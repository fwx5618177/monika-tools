"use client";

import React, { FC } from "react";
import NonScroll from "@/components/FullScroll/NonScroll";
import BackScroll from "@/components/FullScroll/BackScroll";
import DetailInfo from "./DetailInfo";
import { HomePageProps } from "Components";

const HomePage: FC<HomePageProps> = ({
  imageData,
  list,
  recentArticles,
  tags,
  websiteStats,
  profileInfo,
}) => {
  const isRollBack = true;

  return (
    <>
      {isRollBack ? (
        <BackScroll imageData={imageData}>
          <DetailInfo
            profileInfo={profileInfo}
            data={list}
            recentArticles={recentArticles}
            tags={tags}
            websiteStats={websiteStats}
          />
        </BackScroll>
      ) : (
        <NonScroll />
      )}
    </>
  );
};

export default HomePage;
