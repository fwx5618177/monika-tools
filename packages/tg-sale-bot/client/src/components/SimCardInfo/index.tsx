import React, { useMemo } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { formatToGB } from "@utils/formatUsedDataVolume";

interface SimCardInfoProps {
  id: string; // 唯一标识符
  phoneNumber: string;
  packageName: string;
  usedData: string;
  onDelete: (id: string) => void; // 删除该信息的回调方法
}

const SimCardInfo: React.FC<SimCardInfoProps> = ({
  //id,
  phoneNumber,
  packageName,
  usedData,
  //onDelete,
}) => {
  const { t } = useTranslation("common");

  const usedDataValue = useMemo(() => {
    return formatToGB(usedData);
  }, [usedData]);

  return (
    <div className={styles.simCardInfo}>
      <div className={styles.infoBox}>
        <div className={styles.infoBlock}>
          <strong>{t("home-sim-card-info-esim")}</strong>
          <p>{phoneNumber}</p>
        </div>
        <div className={styles.infoBlock}>
          <strong>{t("home-sim-card-info-used")}</strong>
          <p>{usedDataValue}</p>
        </div>
        <div className={styles.infoBlock}>
          <strong>{t("packages-title")}</strong>
          <p>{packageName}</p>
        </div>
      </div>
      {/* <button className={styles.deleteButton} onClick={() => onDelete(id)}>
        {t("delete")}
      </button> */}
    </div>
  );
};

export default SimCardInfo;
