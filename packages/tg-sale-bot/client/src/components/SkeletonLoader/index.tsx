import React from "react";
import styles from "./index.module.scss";

const SkeletonLoader: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonFlag}></div>
    <div className={styles.skeletonText}></div>
  </div>
);

export default SkeletonLoader;
