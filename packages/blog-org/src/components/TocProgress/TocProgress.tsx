import { TocProgressProps } from "Components";
import { FC } from "react";
import numeral from "numeral";
import styles from "./index.module.scss";

const TocProgress: FC<TocProgressProps> = ({ active, total }) => {
  const activeIndex = total.findIndex((title) => title.key === active) + 1;
  const rate = activeIndex / total.length || 0;
  const progress = numeral(rate).multiply(100).format("0");

  return <span className={styles["progress"]}>{progress}</span>;
};

export default TocProgress;
