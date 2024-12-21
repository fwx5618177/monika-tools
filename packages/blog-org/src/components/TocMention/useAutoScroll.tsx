import { MutableRefObject, useEffect } from "react";

const useAutoScroll = (
  ref: MutableRefObject<any>,
  currentTitle: string,
  selectName: string
) => {
  useEffect(() => {
    const activeElement = ref.current?.querySelector(selectName);

    if (activeElement && ref.current) {
      const elementPosition = activeElement.offsetTop;
      ref.current.scrollTo({
        top: elementPosition - ref.current.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [currentTitle, ref, selectName]);
};

export default useAutoScroll;
