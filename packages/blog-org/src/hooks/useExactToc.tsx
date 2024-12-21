import { useMemo } from "react";

const useExactToc = (parsedContent: string) => {
  const extractTitles = useMemo(() => {
    const titleRegex = /<h([1-6]).+?href=\"(.*?)\".+?<\/h[1-6]>/g;
    const titles = [];
    let match: string[];

    while ((match = titleRegex.exec(parsedContent)) !== null) {
      // 获取标题的级别和文本内容
      const level = match[1];
      const href = match[2]
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[:]/g, "");
      const text = href.replace(/[\W|\s|\D]/, "");
      // 将提取的标题信息添加到数组中
      titles.push({
        key: `h${level}-${href}`,
        level: parseInt(level, 10),
        text: text,
        href,
      });
    }

    return titles;
  }, [parsedContent]);

  return extractTitles;
};

export default useExactToc;
