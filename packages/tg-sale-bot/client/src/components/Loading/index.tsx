import React from "react";
import { FaSpinner } from "react-icons/fa";
import SeoPage from "@components/SeoPage";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import Logo from "@components/Logo";
import ProgressBar from "@components/Progressbar";

interface LoadingProps {
  type?: "logo" | "circle" | "atom" | "spinner";
}

const Loading: React.FC<LoadingProps> = ({ type = "logo" }) => {
  const { t } = useTranslation();

  const display = () => {
    switch (type) {
      case "logo":
        return <Logo size="medium" />;
      case "circle":
        return (
          <div className={styles.circle}>
            <img src="/circle.gif" alt="circle" className={styles.image} />
          </div>
        );
      case "atom":
        return (
          <div className={styles.atom}>
            <img src="/atom.gif" alt="atom" className={styles.image} />
          </div>
        );
      case "spinner":
      default:
        return <FaSpinner className={styles.spinner} />;
    }
  };

  return (
    <div className={styles.container}>
      <SeoPage
        title={t("seo:loading-title")}
        description={t("seo:loading-description")}
        keywords={t("seo:loading-keywords")}
        imageUrl="https://my-website.com/images/loading-page.jpg"
      />

      <div className={styles.content}>
        {display()}
        <h3 className={styles.brand}>{t("common:loading-brand-name")}</h3>
        <div className={styles.loading}>
          <h3 className={styles.loading}>{t("common:loading-title")}</h3>
          <p className={styles.desc}>{t("common:loading-description")}</p>
        </div>
        <ProgressBar progress={100} />
      </div>
    </div>
  );
};

export default Loading;
