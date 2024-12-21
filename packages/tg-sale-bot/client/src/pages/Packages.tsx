import React, { useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "@styles/packages.module.scss";
import CurrentPoints from "@components/CurrentPoints";
import TypeBanner from "@components/TypeBanner";
import { useTranslation } from "react-i18next";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { getQueryParams } from "@utils/getQueryParams";
import { decodeFromBase64 } from "@utils/decodeFromBase64";
import { CardType } from "@interfaces/api";
import { useSupportRegionPackages } from "@hooks/useSupportRegionPackages";

const Packages = () => {
  const { t } = useTranslation();
  const urlParams = getQueryParams<{
    phoneNumber: string;
    countryCode: string;
    countryName: string;
  }>();
  const { auth } = useSelector((state: RootState) => state);
  const [activePlans, setActivePlans] = useState<CardType[]>([
    CardType.Daily,
    CardType.Mobile,
  ]);
  const navigate = useNavigate();
  const { list, loading } = useSupportRegionPackages();
  const packageDataList = useMemo(() => {
    return list?.filter((item) => activePlans.includes(item.packageType));
  }, [activePlans, list]);

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
  };

  const handleButtonClick = (plan: CardType) => {
    setActivePlans(
      (prevPlans) =>
        prevPlans.includes(plan)
          ? prevPlans.filter((p) => p !== plan) // Remove if already selected
          : [...prevPlans, plan] // Add if not selected
    );
  };

  const personalInfo = useMemo(() => {
    return {
      phoneNumber: decodeFromBase64(urlParams?.phoneNumber),
      countryName: decodeFromBase64(urlParams?.countryName),
    };
  }, [urlParams?.countryName, urlParams?.phoneNumber]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backIcon} onClick={handleBackClick}>
          <FaChevronLeft />
        </div>
        <h2 className={styles.title}>{t("packages-select-title")}</h2>
      </div>

      <CurrentPoints balance={auth?.userInfo?.integral} />

      <div className={styles.region}>
        <h2>{personalInfo?.countryName}</h2>
        <span>
          {t("packages-card-type-select-description", {
            phone: personalInfo?.phoneNumber,
          })}
        </span>
      </div>

      {/* 按钮选择 Sky Card 或 Total Card */}
      <div className={styles.planCard}>
        <span
          className={`${styles.planButtonItem} ${
            activePlans.includes(CardType.Daily) ? styles.active : ""
          }`}
          onClick={() => handleButtonClick(CardType.Daily)}
        >
          {t("packages-daily-card-name")}
        </span>
        <span
          className={`${styles.planButtonItem} ${
            activePlans.includes(CardType.Mobile) ? styles.active : ""
          }`}
          onClick={() => handleButtonClick(CardType.Mobile)}
        >
          {t("packages-mobile-card-name")}
        </span>
      </div>

      {/* 描述文字 */}
      <div className={styles.desc}>
        <div className={styles.item}>
          <span>*</span>
          {t("packages-card-select-mention-calculation")}
        </div>
        <div className={styles.item}>
          <span>**</span>
          {t("packages-card-select-mention-amount")}
        </div>
        <div className={styles.item}>
          <span>***</span>
          {t("packages-card-select-mention-support")}
        </div>
      </div>

      {/* 通过过滤的数据进行渲染 */}
      <div className={styles.plans}>
        {loading ? (
          <div className={styles.noPlans}>{t("packages-loading-data")}</div>
        ) : packageDataList.length > 0 ? (
          packageDataList?.map((item) => (
            <TypeBanner
              countryName={personalInfo?.countryName}
              key={item.id}
              {...item}
            />
          ))
        ) : (
          <div className={styles.noPlans}>
            {t("packages-no-packages-available-select")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
