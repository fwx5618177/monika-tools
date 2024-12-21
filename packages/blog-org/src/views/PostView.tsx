"use client";

import styles from "@/styles/postView.module.scss";
import Header from "@/components/Header/header";
import PostPage from "@/components/PostPage";
import ProfileCard from "@/components/ProfileCard";
import NewPress from "@/components/NewPress";
import { FaHistory } from "react-icons/fa";
import { FC, useRef } from "react";
import { PostViewProps } from "Components";
import TagCloud from "@/components/TagCloud";
import WebsiteStats from "@/components/WebsiteStats";
import { useLocalFetchDetailData } from "@/services/Local/hooks";
import TocProvider from "@/contexts/TocContext";
import TocMention from "@/components/TocMention";
import useFixOnScroll from "@/hooks/useFixedOnScroll";

const PostView: FC<PostViewProps> = ({ defaultData, postData }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const { recentArticles, imageData, websiteStats, profileInfo, tags } =
    defaultData;
  const { small } = imageData;
  const { data } = useLocalFetchDetailData<{
    slug: string | number;
  }>({
    slug: postData?.slug,
  });

  useFixOnScroll(parentRef, tocRef);

  return (
    <TocProvider>
      <main className={styles["detail-post"]}>
        <Header small={small} height={400} isPost postData={postData} />

        <div className={styles["detail-container"]}>
          <div className={styles["info-section"]} ref={parentRef}>
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

            <TocMention title={"目录"} innerRef={tocRef} />

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
          </div>
          <div className={styles["list-section"]}>
            <PostPage
              content={data?.content}
              title={data?.title}
              updatedDate={data?.updatedDate}
              author={data?.author}
              type={data?.type}
              slug={data?.slug}
              relatives={data?.relatives}
              excerpt={data?.excerpt}
              addition={data?.addition}
            />
          </div>
        </div>
      </main>
    </TocProvider>
  );
};

export default PostView;
