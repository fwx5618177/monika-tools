import React, { memo, forwardRef } from "react";
import styles from "./index.module.scss"; // 引入 CSS Module
import { InfoBoxProps } from "Components";

const InfoBox = forwardRef(
  (
    {
      width = 290,
      height = 300,
      scrollable = false,
      children,
      infoBoxStyle,
    }: InfoBoxProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={styles.infoBox}
        style={{
          width,
          height,
          overflow: scrollable ? "auto" : "hidden",
          boxSizing: "content-box",
          ...infoBoxStyle,
        }}
      >
        {children}
      </div>
    );
  }
);

InfoBox.displayName = "InfoBox";

export default memo(InfoBox);
