import React, { FC, useMemo } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import SwitchButton from "@components/SwitchButton";

const ChangeCardNumber: FC<{
  phone: string;
}> = ({ phone }) => {
  const { t } = useTranslation();
  const { userPackageInfo = [] } = useSelector(
    (state: RootState) => state.auth
  );
  const info = userPackageInfo.find((item) => item.phoneNumber === phone);

  const pkgInfo = useMemo(() => {
    return userPackageInfo.map((item) => ({
      userId: item.userId,
      phoneNumber: item.phoneNumber,
      region: item.region,
      supportRegion: item.supportRegion,
    }));
  }, [userPackageInfo]);

  return (
    <>
      {info && (
        <div className={styles.box}>
          <div className={styles.left}>
            <span>
              {t("packages-card-change-number-mobile-sequence", {
                type: info.packageName,
              })}
            </span>
            <span className={styles.phoneNumber}>
              {t("packages-sim-card-number", {
                phone: info.phoneNumber,
              })}
            </span>
          </div>
          <SwitchButton data={pkgInfo} />
        </div>
      )}
    </>
  );
};

export default ChangeCardNumber;
