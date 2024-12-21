import { FC } from "react";
import CircleHover from "../CircleHover";
import styles from "./index.module.scss";

interface StepSectionProps {
  title?: string;
  subtitle?: string;
  text?: string;
  seqTitle?: string;
}

const StepSection: FC<StepSectionProps> = (props) => {
  return (
    <section className={styles.step}>
      <CircleHover />
      <div className={styles.content}>
        <div className={styles.title}>1111</div>
        <div className={styles.subtitle}>1111</div>
        <div className={styles.text}>1111</div>

        <div className={styles.seqTitle}>
          <div className={styles.miniCircle}></div>
          111
        </div>
        <div className={styles.seqTitle}>
          <div className={styles.miniCircle}></div>
          111
        </div>
        <div className={styles.seqTitle}>
          <div className={styles.miniCircle}></div>
          111
        </div>
        <div className={styles.seqTitle}>
          <div className={styles.miniCircle}></div>
          111
        </div>
        <div className={styles.seqTitle}>
          <div className={styles.miniCircle}></div>
          111
        </div>
      </div>
    </section>
  );
};

export default StepSection;
