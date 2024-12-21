import React from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

interface DataLoadingProps {
  message?: string;
}

const DataLoading: React.FC<DataLoadingProps> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.loadingContainer}>
      <FaSpinner className={styles.loadingSpinner} />
      <p className={styles.loadingMessage}>{message || t("loading-title")}</p>
    </div>
  );
};

export default DataLoading;
