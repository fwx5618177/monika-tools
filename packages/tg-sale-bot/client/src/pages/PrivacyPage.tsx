import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "@styles/privacy.module.scss";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <div className={styles.container}>
      <div className={styles.backIcon} onClick={handleBackClick}>
        <FaChevronLeft />
      </div>
      <div className={styles.title}>{t("privacy-title")}</div>
      <div className={styles.privacyContent}>
        {/* 隐私政策简介 */}
        <h1>{t("privacy-intro-title")}</h1>
        <p>{t("privacy-intro-content")}</p>

        {/* 收集的信息 */}
        <h2>{t("privacy-collection-title")}</h2>
        <p>{t("privacy-collection-content")}</p>

        {/* 使用信息 */}
        <h2>{t("privacy-use-title")}</h2>
        <p>{t("privacy-use-content")}</p>

        {/* 信息共享 */}
        <h2>{t("privacy-sharing-title")}</h2>
        <p>{t("privacy-sharing-content")}</p>

        {/* 信息安全 */}
        <h2>{t("privacy-security-title")}</h2>
        <p>{t("privacy-security-content")}</p>

        {/* 隐私政策修改 */}
        <h2>{t("privacy-amendments-title")}</h2>
        <p>{t("privacy-amendments-content")}</p>

        {/* 联系我们 */}
        <h2>{t("privacy-contact-title")}</h2>
        <p>{t("privacy-contact-content")}</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
