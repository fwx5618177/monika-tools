import React from 'react';
import styles from './index.module.scss';

interface LogoProps {
  size?: 'large' | 'medium' | 'small';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  let sizeClass;
  switch (size) {
    case 'large':
      sizeClass = styles.large;
      break;
    case 'small':
      sizeClass = styles.small;
      break;
    case 'medium':
    default:
      sizeClass = styles.medium;
      break;
  }

  return (
    <div className={`${styles.logoContainer} ${sizeClass}`}>
      <img src="/logo.svg" alt="Logo" className={styles.logoImage} />
    </div>
  );
};

export default Logo;
