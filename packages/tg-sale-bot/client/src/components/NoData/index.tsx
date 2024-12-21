import React from "react";
import styles from "./index.module.scss";
import { FaBoxOpen } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface NoDataProps {
  message?: string;
}

const NoData: React.FC<NoDataProps> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.noDataContainer}>
      <FaBoxOpen className={styles.noDataIcon} />
      <p className={styles.noDataMessage}>{message || t("no-data")}</p>
    </div>
  );
};

export default NoData;
