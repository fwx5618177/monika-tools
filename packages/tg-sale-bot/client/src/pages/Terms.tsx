import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "@styles/terms.module.scss";

const TermsPage: React.FC = () => {
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
      <div className={styles.title}>{t("terms-title")}</div>
      <div className={styles.termsContent}>
        {/* 简介 */}
        <h1>{t("terms-intro-title")}</h1>
        <p>{t("terms-intro-content")}</p>

        {/* 接受条款 */}
        <h2>{t("terms-acceptance-title")}</h2>
        <p>{t("terms-acceptance-content")}</p>

        {/* 服务描述 */}
        <h2>{t("terms-services-title")}</h2>
        <p>{t("terms-services-content")}</p>

        {/* 用户责任 */}
        <h2>{t("terms-user-responsibility-title")}</h2>
        <p>{t("terms-user-responsibility-content")}</p>

        {/* 隐私条款 */}
        <h2>{t("terms-privacy-title")}</h2>
        <p>{t("terms-privacy-content")}</p>

        {/* 风险声明 */}
        <h2>{t("terms-risks-title")}</h2>
        <p>{t("terms-risks-content")}</p>

        {/* 责任限制 */}
        <h2>{t("terms-liability-title")}</h2>
        <p>{t("terms-liability-content")}</p>

        {/* 修改条款 */}
        <h2>{t("terms-amendments-title")}</h2>
        <p>{t("terms-amendments-content")}</p>

        {/* 保修声明 */}
        <h2>{t("terms-warranty-title")}</h2>
        <p>{t("terms-warranty-content")}</p>

        {/* 联系方式 */}
        <h2>{t("terms-contact-title")}</h2>
        <p>{t("terms-contact-content")}</p>
      </div>
    </div>
  );
};

export default TermsPage;
