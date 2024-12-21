import React, { FC } from "react";
import styles from "./index.module.scss";
import { calculateRemainingTime } from "@utils/calculateRemainingTime";
import { useTranslation } from "react-i18next";
import { encodeToBase64 } from "@utils/encodeToBase64";

interface PackageCardProps {
  startTime: string;
  packageId: string;
  endTime: string;
  totalVolume: string;
  usedData: string;
  phoneNumber: string;
  packageName: string;
  merchanId: string;
  isSelected: boolean;
  onSelect: (packageId: string, merchanId: string) => void;
}

const PackageCard: FC<PackageCardProps> = ({
  startTime,
  packageId,
  endTime,
  usedData,
  phoneNumber,
  packageName,
  merchanId,
  isSelected,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { isRemaining, remainingDays, remainingHours, remainingMinutes } =
    calculateRemainingTime(startTime, endTime);

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={() => {
        onSelect(packageId, encodeToBase64(merchanId));
      }}
    >
      {!isRemaining && (
        <div className={styles.banner}>{t("expired")}</div>
      )}
      <div className={styles.item}>
        <span className={styles.itemPackageName}>{packageName}</span>
        <span>{phoneNumber}</span>
      </div>

      <div className={styles.item}>
        <span className={styles.itemName}>
          {t("order-payment-sim-card-package")}
        </span>
        <span>{packageName}</span>
      </div>

      {isRemaining && (
        <div className={styles.item}>
          <span className={styles.itemName}>
            {t("order-payment-sim-card-used-flow")}
          </span>
          <span>{usedData} MB</span>
        </div>
      )}

      <div className={styles.footer}>
        {
          startTime === '' && (
            <>
            {t("esim-package-notactivied")}
            </>
          )
        }
        {isRemaining && startTime !== '' && (
          <>
            {t("order-payment-sim-card-remaining-time", {
              days: remainingDays,
              hours: remainingHours,
              minutes: remainingMinutes,
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
