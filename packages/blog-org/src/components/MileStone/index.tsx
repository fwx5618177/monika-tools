import StepSection from "../StepSection";
import styles from "./index.module.scss";

const MileStone = () => {
  return (
    <section className={styles.mileStone}>
      <StepSection />
      <StepSection />
      <StepSection />
      <StepSection />
    </section>
  );
};

export default MileStone;
