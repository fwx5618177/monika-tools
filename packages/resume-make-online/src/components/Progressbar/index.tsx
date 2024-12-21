import React from "react";
import styles from "./index.module.scss";

interface ProgressBarProps {
  progress: number; // 进度百分比 0-100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles.progressBarContainer}>
      <span>{`${progress} %`}</span>
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <div
          className={styles.progressCircle}
          style={{ left: `calc(${progress}% - 15px)` }}
        >
          <div className={styles.innerCircle} />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
