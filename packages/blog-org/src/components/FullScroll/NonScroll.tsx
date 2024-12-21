"use client";

import React, { useState } from "react";
import styles from "@/styles/home.module.scss";

const NonScroll = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    if (scrollY === 0) {
      setScrollY(window.innerHeight);
    } else {
      setScrollY(0);
    }
  };

  return (
    <div
      className={styles.container}
      style={{ transform: `translateY(-${scrollY}px)` }}
    >
      <div
        className={`${styles["full-page"]} ${styles["bg-image"]}`}
        onClick={handleScroll}
      >
        <div className={styles.arrow}></div>
      </div>
      <div className={`${styles["top-header"]} ${styles["bg-image-small"]}`}>
        {/* This is where your small header decoration is */}
      </div>
      {/* Rest of the content */}
    </div>
  );
};

export default NonScroll;
