import { TocTypes } from "Components";
import { useState, useEffect } from "react";

const useScrollSpy = (titles: TocTypes[]) => {
  const [currentTitle, setCurrentTitle] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let newCurrentTitle = null;
      // 遍历所有标题
      for (let title of titles) {
        const element = document.getElementById(title.text);

        if (element && window.scrollY >= element.offsetTop - 100) {
          newCurrentTitle = title.key;
        } else {
          break;
        }
      }
      if (newCurrentTitle !== currentTitle) {
        setCurrentTitle(newCurrentTitle);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [titles, currentTitle]);

  return currentTitle;
};

export default useScrollSpy;
