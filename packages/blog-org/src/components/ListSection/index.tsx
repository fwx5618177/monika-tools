import { ListSectionProps, ArticleDisplayProps, PageSet } from "Components";
import Pagination from "@/components/Pagination";
import ArticleDisplay from "@/components/ArticleDisplay";
import React, { useMemo, useState } from "react";
import styles from "./index.module.scss";
import Empty from "@/components/Empty";

const minHeight = "88rem";

const ListSection: React.FC<ListSectionProps> = ({ defaultArticles }) => {
  const pageSet = {
    page: 1,
    pageSize: 5,
    total: Math.ceil(defaultArticles?.length / 5),
  };

  const [page, setPage] = useState<PageSet>(pageSet);
  const [articles, setArticles] = useState(
    defaultArticles.slice(0, page.pageSize)
  );
  const articleList = useMemo(() => {
    return articles?.map((article: ArticleDisplayProps, index: number) => ({
      ...article,
      position: index % 2 === 0 ? "left" : "right",
    }));
  }, [articles]);

  const onPageChange = (page: number, pageSize: number) => {
    queryList({ page, pageSize });
  };

  const queryList = async ({ page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const result = defaultArticles?.slice(start, start + pageSize);
    const total = Math.ceil(defaultArticles?.length / pageSize);

    setArticles(result);
    setPage((cur) => ({
      ...cur,
      page,
      pageSize,
      total,
    }));
  };

  return (
    <>
      <div
        className={styles["list"]}
        style={{
          minHeight: minHeight,
        }}
      >
        {articleList?.length > 0 ? (
          articleList.map((article: ArticleDisplayProps, index: number) => (
            <ArticleDisplay key={index} {...article} />
          ))
        ) : (
          <Empty width="800px" height={minHeight} iconSize={"20rem"} />
        )}
      </div>

      <Pagination
        currentPage={page?.page}
        totalPages={page?.total}
        pageSize={page?.pageSize}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default React.memo(ListSection);
