import React, { useState, useCallback } from "react";
import styles from "./index.module.scss";

interface SlideSwitcherProps {
  contentList: string[];
  title: string;
}

const SlideSwitcherComponent: React.FC<SlideSwitcherProps> = ({
  contentList,
  title,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsExpanded(false); // 切换内容时重置展开状态
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className={styles.container}>
      <div className={styles.slides}>
        <div className={styles.title}>{title}</div>
        {contentList.map((content, index) => {
          const shouldShowExpand = content.length > 100; // 判断是否需要显示"展开"
          return (
            <div
              key={index}
              className={`${styles.slide} ${
                index === activeIndex ? styles.active : ""
              }`}
            >
              <div
                className={`${styles.content} ${
                  isExpanded ? styles.expanded : styles.collapsed
                }`}
              >
                {isExpanded || !shouldShowExpand
                  ? content
                  : `${content.slice(0, 300)}...`}
                {shouldShowExpand && (
                  <span className={styles.expandButton} onClick={toggleExpand}>
                    {isExpanded ? "收起" : "展开"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.pagination}>
        {contentList.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export const SlideSwitcher = React.memo(SlideSwitcherComponent);
