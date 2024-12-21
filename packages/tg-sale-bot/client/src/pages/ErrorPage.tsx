import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import styles from "@styles/error.module.scss";
import { useTranslation } from "react-i18next";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaChevronLeft className={styles.backIcon} onClick={handleBackClick} />
        <h1>{t("error-title")}</h1>
      </div>
      <p>{t("error-description")}</p>
      <Button onClick={() => navigate("/")}>{t("back-to-home")}</Button>
    </div>
  );
};

export default ErrorPage;
