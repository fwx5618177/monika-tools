import React from 'react';
import styles from './index.module.scss';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }}>
        <span className={styles.progressText}>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
