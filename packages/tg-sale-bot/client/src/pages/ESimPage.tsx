import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "@styles/esim.module.scss";
import NavBar from "@components/navbar";
import SimInfo from "@components/SimInfo";
import CurrentPoints from "@components/CurrentPoints";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, updateUserPackageInfo } from "@store/store";
import { getUserPackagesInfo } from "@apis/request_api";
import NoData from "@components/NoData";
import DataLoading from "@components/DataLoading";

const ESimPage: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, userPackageInfo } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchUserPackageInfoList = useCallback(async () => {
    setIsLoading(true);
    const list = await getUserPackagesInfo();
    setIsLoading(false);
    dispatch(updateUserPackageInfo(list));
  }, [dispatch]);

  useEffect(() => {
    fetchUserPackageInfoList();
  }, [fetchUserPackageInfoList]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>

      <CurrentPoints balance={userInfo?.integral} />

      <div className={styles.info}>
        {isLoading ? (
          <DataLoading />
        ) : userPackageInfo && userPackageInfo?.length > 0 ? (
          userPackageInfo?.map((simInfo, index) => (
            <SimInfo
              key={index}
              orderId={simInfo?.orderId || simInfo?.id}
              startTime={simInfo.startTime}
              packageId={simInfo.packageId}
              phoneNumber={simInfo.phoneNumber}
              packageName={simInfo.packageName}
              roamingData={simInfo.roamingData}
              usedData={simInfo.usedData}
              endTime={simInfo.endTime}
              status={simInfo.status}
              supportArea={simInfo?.supportRegion}
              region={simInfo.region}
              cardExisted={simInfo.cardExisted}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>

      <NavBar fixed />
    </div>
  );
};

export default ESimPage;
