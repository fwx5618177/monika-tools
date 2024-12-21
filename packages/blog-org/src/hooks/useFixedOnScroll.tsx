import { useEffect, RefObject, useCallback } from "react";

const useFixOnScroll = (
  parentRef: RefObject<HTMLElement>,
  componentRef: RefObject<HTMLElement>
) => {
  const handleScroll = useCallback(() => {
    const parentDiv = parentRef.current;
    const componentToFix = componentRef.current;

    if (parentDiv && componentToFix) {
      const parentBottom = parentDiv.getBoundingClientRect().bottom;

      if (parentBottom <= 0) {
        // 父div底部到达或超过视窗顶部
        componentToFix.style.position = "fixed";
        componentToFix.style.top = "0";
        // 添加其他需要的样式，如 width、z-index 等
      } else {
        componentToFix.style.position = "static";
        // 重置其他样式
      }
    }
  }, [componentRef, parentRef]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [componentRef, handleScroll, parentRef]);
};

export default useFixOnScroll;
