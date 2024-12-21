import { PageSet } from "Components";
import { useCallback, useEffect, useState } from "react";

const usePagination = ({ currentPage, pageSize, totalPages, onPageChange }) => {
  const [page, setPage] = useState<PageSet>({
    page: currentPage,
    pageSize,
    total: totalPages,
  });

  useEffect(() => {
    setPage({
      page: currentPage,
      pageSize,
      total: totalPages,
    });
  }, [currentPage, pageSize, totalPages]);

  const updatePage = useCallback(
    (newPage: number) => {
      setPage((cur) => ({ ...cur, page: newPage }));
      onPageChange(newPage, page.pageSize, page.total);
    },
    [onPageChange, page.pageSize, page.total]
  );

  const updatePageSize = useCallback(
    (newPageSize: number) => {
      setPage((cur) => ({ ...cur, pageSize: newPageSize }));
      onPageChange(1, newPageSize, page.total);
    },
    [onPageChange, page.total]
  );

  return { page, updatePage, updatePageSize };
};

export default usePagination;
