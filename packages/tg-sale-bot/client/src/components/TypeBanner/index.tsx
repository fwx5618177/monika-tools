import React from "react";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { formatValidity } from "@utils/formatValidity";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@utils/formatUnit";
import { CardType, PackageItem } from "@interfaces/api";
import {
  AppDispatch,
  RootState,
  updateSelectedPackagesInfo,
} from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { getQueryParams } from "@utils/getQueryParams";

interface TypeBannerProps {
  id: number;
  countryName: string;
  name: string;
  price: string;
  integralPrice: string;
  description: string;
  engDescription: string;
  packageType: number;

  specification: {
    productId: number;
    validDays: number;
    dataTotal: number;
    zoneDataName: string;
    countryIdList: string;
  };
}

const TypeBanner: React.FC<TypeBannerProps> = (props) => {
  const {
    id,
    packageType,
    name,
    specification,
    price,
    integralPrice,
    countryName,
  } = props;
  const { validDays } = specification;
  const dispatch = useDispatch<AppDispatch>();
  const urlParams = getQueryParams<{ phoneNumber: string }>();
  const { packagesInfo } = useSelector((state: RootState) => state.info);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDetailClick = () => {
    const findDetail = packagesInfo?.find(
      (item) => item.id === id
    ) as PackageItem;
    dispatch(updateSelectedPackagesInfo(findDetail));
    navigate(
      `/orders?merchenId=${encodeToBase64(String(id))}${
        urlParams?.phoneNumber ? "&phoneNumber=" + urlParams?.phoneNumber : ""
      }`
    );
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.type} ${
          packageType === CardType.Daily ? styles.typeSky : styles.typeTotal
        }`}
      >
        {t("packages-card-banner-type", {
          type: packageType === CardType.Daily ? "Daily" : "Mobile",
        })}
      </div>
      <span className={styles.title}>{name}</span>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span>{t("packages-card-banner-title-region")}</span>
            <span>{countryName}</span>
          </div>

          <div className={styles.infoItem}>
            <span>{t("packages-card-banner-title-validity")}</span>
            <span>{formatValidity(validDays)}</span>
          </div>

          <span className={styles.detail} onClick={handleDetailClick}>
            {t("packages-card-banner-title-detail")}
          </span>
        </div>

        <div className={styles.icons}>
          <div className={styles.currency}>
            <img src="/dollar.svg" alt={t("dollar")} />
            <span>{formatNumber(price, "0.00")}</span>
          </div>
          <span className={styles.mention}>{t("or")}</span>
          <div className={styles.currency}>
            <img src="/gold.svg" alt={t("point")} />
            <span>{formatNumber(integralPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeBanner;
