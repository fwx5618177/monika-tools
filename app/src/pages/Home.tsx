import { useSeo } from '@seo/useSeo';
import styles from './Home.module.scss';
import TxtUpload from '@components/TxtUpload';

const HomePage = () => {
  const SeoComponent = useSeo('home');

  return (
    <div className={styles.container}>
      {SeoComponent}
      <div className={styles.topSection}>
        <div className={styles.leftColumn}>
          <h1>这是Tool</h1>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.rightLeftColumn}>
            <TxtUpload />
          </div>
          <div className={styles.rightRightColumn}>{/* 右栏右侧内容 */}</div>
        </div>
      </div>
      <div className={styles.bottomSection}>{/* 下部分内容 */}</div>
    </div>
  );
};

export default HomePage;
