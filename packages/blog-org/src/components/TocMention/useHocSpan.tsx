import { TocTypes } from "Components";
import { useEffect, useState } from "react";

const useHocSpan = (
  toc: TocTypes[],
  currentTitle: string,
  minLevel: number
): TocTypes[] => {
  const [tocSpans, setTocSpans] = useState([]);

  useEffect(() => {
    const currentIndex = toc.findIndex((item) => item.key === currentTitle);
    if (currentIndex !== -1) {
      // 获取当前项的level，同时确保不小于minLevel
      const currentLevel = Math.max(toc[currentIndex].level, minLevel);

      // 查找开始和结束索引
      let startIndex = toc.findIndex(
        (item, index) => index > currentIndex && item.level === currentLevel
      );
      let endIndex = toc.findIndex(
        (item, index) => index > startIndex && item.level === currentLevel
      );

      startIndex = startIndex === -1 ? currentIndex : startIndex;
      endIndex = endIndex === -1 ? undefined : endIndex;

      setTocSpans(toc.slice(startIndex, endIndex));
    }
  }, [toc, currentTitle, minLevel]);

  return tocSpans;
};

export default useHocSpan;
