import { PageSet, PaginationProps } from "Components";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import usePagination from "./usePagination";

const PageSizeOptions = [5, 10, 20, 50];

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  pageSize = PageSizeOptions[0],
  totalPages = 0,
  onPageChange,
}) => {
  const { page, updatePage, updatePageSize } = usePagination({
    currentPage,
    pageSize,
    totalPages,
    onPageChange,
  });

  // 生成页码数组
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, page?.total);

    // 如果当前页码接近最后一页，调整起始和结束
    if (currentPage + 1 === page?.total) {
      start = page?.total - 2;
    }

    // 避免产生负值
    start = Math.max(start, 1);

    const paginationGroup = [];
    for (let i = start; i <= end; i++) {
      paginationGroup.push(i);
    }
    return paginationGroup;
  };

  return (
    <div className={styles["pagination"]}>
      <button onClick={() => updatePage(1)} disabled={currentPage === 1}>
        首页
      </button>

      {/* 上一页 */}
      <button
        onClick={() => {
          updatePage(currentPage - 1);
        }}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 页码 */}
      {getPaginationGroup().map((item) => (
        <button
          key={item}
          onClick={() => {
            updatePage(item);
          }}
          className={currentPage === item ? styles["active"] : null}
        >
          {item}
        </button>
      ))}

      {/* 省略号 */}
      {currentPage < page?.total - 1 && <span>...</span>}

      {/* 总页数 */}
      <span className={styles["total-page"]}>
        共 {page?.total} 页 {totalPages} 条
      </span>

      {/* 下一页 */}
      <button
        onClick={() => {
          updatePage(currentPage + 1);
        }}
        disabled={currentPage === page?.total}
      >
        &gt;
      </button>

      {/* 尾页 */}
      <button
        onClick={() => {
          updatePage(page?.total);
        }}
        disabled={currentPage === page?.total}
      >
        尾页
      </button>

      {/* 跳转至 */}
      <input
        type="number"
        value={page?.page}
        onChange={(e) => {
          updatePage(Number(e.target.value));
        }}
      />

      {/* 每页显示数量 */}
      <select
        value={page?.pageSize}
        onChange={(e) => {
          updatePageSize(Number(e.target.value));
        }}
      >
        {PageSizeOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
