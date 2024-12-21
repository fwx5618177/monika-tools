import React, { FC, useCallback, useEffect } from "react";
import styles from "@styles/map.module.scss";
import NavBar from "@components/navbar";
import CurrentPoints from "@components/CurrentPoints";
import CountrySelection from "@components/CountrySelection";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  updatePackageInfo,
  updateUserPackageInfo,
} from "@store/store";
import ChangeCardNumber from "@components/ChangeCardNumber";
import { getPackagesInfo, getUserPackagesInfo } from "@apis/request_api";
import { getQueryParams } from "@utils/getQueryParams";
import { decodeFromBase64 } from "@utils/decodeFromBase64";

const MapPage: FC = () => {
  const { t } = useTranslation();
  const urlParams = getQueryParams<{ phoneNumber: string }>();
  const phone = decodeFromBase64(urlParams?.phoneNumber);
  const { userInfo, packageInfo } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const fetchUserPackageInfoList = useCallback(async () => {
    const list = await getPackagesInfo();
    const userList = await getUserPackagesInfo();
    dispatch(updatePackageInfo(list));
    dispatch(updateUserPackageInfo(userList));
  }, [dispatch]);

  useEffect(() => {
    if (!packageInfo?.length) {
      fetchUserPackageInfoList();
    }
  }, [fetchUserPackageInfoList, packageInfo?.length]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>

      <CurrentPoints balance={userInfo?.integral} />

      <ChangeCardNumber phone={phone} />

      <header className={styles.header}>
        <span className={styles.region}>
          {t("packages-region-select-title")}
        </span>
        <span className={styles.desc}>
          {t("packages-region-select-description")}
        </span>
      </header>

      <CountrySelection />

      <NavBar fixed />
    </div>
  );
};

export default MapPage;
