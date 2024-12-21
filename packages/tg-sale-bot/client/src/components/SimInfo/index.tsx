import React, { FC, useCallback, useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
// import { parseDataValue } from "@utils/parseDataValue";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
// import { formatNumber } from "@utils/formatUnit";
import Modal from "@components/Modal";
import LazyImage from "@components/LazyImage";
import SkeletonLoader from "@components/SkeletonLoader";
import { encodeToBase64 } from "@utils/encodeToBase64";
// import useFetchRegion from "@hooks/useFetchRegion";
import { formatToGB } from "@utils/formatUsedDataVolume";

interface SimInfoProps {
  orderId: string;
  packageId: string;
  phoneNumber: string;
  packageName: string;
  roamingData: string;
  usedData: string;
  endTime: string | number;
  status: number;
  supportArea: string[];
  region: string;
  startTime: string;
  cardExisted: boolean;
}

const SimInfo: FC<SimInfoProps> = ({
  orderId,
  phoneNumber,
  packageName,
  usedData,
  startTime,
  endTime,
  status,
  supportArea,
  region,
  cardExisted,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { handleFetchAllRegions } = useFetchRegion();
  const { countriesInfo, status: fetchStatus } = useSelector(
    (state: RootState) => state.info
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const remainingDays = useMemo(() => {
    const now = moment();
    return moment(endTime).diff(now, "days");
  }, [endTime]);

  const activited = useMemo(() => {
    if (startTime === null || startTime === undefined || startTime === "")
      return false;
    return true;
  }, [startTime]);

  const cardStatus = useMemo(() => {
    if (!cardExisted) return -1;
    if (status === 0 || status === 2 || status === 3 || status === 4) return 0;
    return status;
  }, [status, cardExisted]);

  const usedDataValue = useMemo(() => {
    return formatToGB(usedData);
  }, [usedData]);

  const supportCountries = useMemo(() => {
    return countriesInfo?.filter((country) =>
      supportArea?.includes(country.name)
    );
  }, [countriesInfo, supportArea]);

  // 根据剩余天数返回对应的颜色
  const getColor = useCallback(() => {
    if (remainingDays > 5) return styles.green;
    if (remainingDays >= 3 && remainingDays <= 5) return styles.yellow;
    if (remainingDays > 0 && remainingDays < 3) return styles.red;

    return styles.gray;
  }, [remainingDays]);

  // 页面跳转
  const handleSelect = useCallback(() => {
    const encodedPhoneNumber = encodeToBase64(phoneNumber);
    const encodedCountryCode = encodeToBase64(region);

    navigate(
      `/map${phoneNumber ? `?phoneNumber=${encodedPhoneNumber}` : ""}${
        region ? `&countryCode=${encodedCountryCode}` : ""
      }`
    );
  }, [navigate, phoneNumber, region]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  // const roamingDataValue = useMemo(() => {
  //   if (!roamingData) return "0 MB";

  //   if (parseInt(roamingData) === -1) return "Unlimited";

  //   return roamingData;
  // }, [roamingData]);

  // // 使用 useMemo 计算剩余流量百分比
  // const remainVolume = useMemo(() => {
  //   const roamingValue = parseInt(roamingData);
  //   if (roamingValue === -1)
  //     return {
  //       value: "∞",
  //       type: "string",
  //       raw: 0,
  //     };

  //   const usedValue = parseDataValue(usedData);
  //   const result =
  //     roamingValue > 0 ? ((roamingValue - usedValue) / roamingValue) * 100 : 0;
  //   return {
  //     raw: result,
  //     type: "numeral",
  //     value: formatNumber(result) + "%",
  //   };
  // }, [roamingData, usedData]);

  // const formattedRemainVolume = remainVolume?.value;
  // // 根据剩余流量返回对应的颜色
  // const getRemainVolumeColor = useCallback(() => {
  //   if (remainVolume.type === "string") return styles.green;
  //   if (remainVolume.raw > 50) return styles.green;
  //   if (remainVolume.raw >= 20 && remainVolume.raw <= 50) return styles.yellow;
  //   if (remainVolume.raw > 0 && remainVolume.raw < 20) return styles.red;
  //   return styles.gray;
  // }, [remainVolume]);

  // // 点击时展示 modal
  // const handleSearchCountries = useCallback(() => {
  //   setIsModalVisible(true);
  // }, []);

  // useEffect(() => {
  //   if (!countriesInfo?.length) {
  //     handleFetchAllRegions();
  //   }
  // }, [countriesInfo?.length, handleFetchAllRegions]);

  return (
    <div className={styles.esimCard}>
      <div className={styles.cardHeader}>
        <h2>{t("esim-title")}</h2>
        <span className={styles.phoneNumber}>{phoneNumber || orderId}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.item}>
          <span className={styles.itemName}>{t("esim-status")}</span>
          <div
            className={
              cardStatus === -1
                ? styles.unregister
                : cardStatus === 0
                  ? styles.offline
                  : styles.online
            }
          >
            <div className={styles.circle}></div>
            <span>
              {cardStatus === -1
                ? t("esim-unregister")
                : cardStatus === 0
                  ? t("esim-offline")
                  : t("esim-online")}
            </span>
          </div>
        </div>

        <div className={styles.item}>
          <span className={styles.itemName}>{t("esim-purchase-package")}</span>
          <span>{packageName}</span>
        </div>

        <div className={styles.item}>
          <span className={styles.itemName}>{t("esim-package-validity")}</span>
          <div className={styles.timeSection}>
            <span className={styles.time}>
              {endTime ? moment(endTime).format("YYYY/MM/DD HH:mm:ss") : ""}
            </span>
            <span className={`${styles.leftTime} ${getColor()}`}>
              {activited
                ? remainingDays > 0
                  ? t("esim-package-remaining-days", {
                      remainingDays,
                    })
                  : t("esim-package-expired")
                : t("esim-package-notactivied")}
            </span>
          </div>
        </div>

        {/* <div className={styles.dataInfo}>
          <div className={styles.roaming}>
            <p className={styles.dataName}>{t("esmi-package-roaming-data")}</p>
            <p>{roamingDataValue}</p>
          </div>
          <div className={styles.rightSide}>
            <span onClick={handleSearchCountries}>
              {t("esim-package-coverage-country")}
            </span>
          </div>
        </div> */}

        <div className={styles.dataInfo}>
          <div className={styles.roaming}>
            <p className={styles.dataName}>{t("esim-package-used-data")}</p>
            <p>{usedDataValue}</p>
          </div>
          {/* <div className={styles.rightSide}>
            <p className={styles.dataName}>{t("esim-package-remaining")}</p>
            <span
              className={`${styles.remainedVolume} ${getRemainVolumeColor()}`}
            >
              {formattedRemainVolume}
            </span>
          </div> */}
        </div>

        {cardExisted && (
          <div className={styles.topUp} onClick={handleSelect}>
            {t("esim-package-recharge")}
          </div>
        )}
      </div>
      {/* Modal 组件 */}
      <Modal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={t("esim-package-coverage-country")}
        type="center"
      >
        <div className={styles.countryList}>
          {fetchStatus === "loading" ? (
            Array(2)
              .fill(0)
              .map((_, index) => <SkeletonLoader key={index} />)
          ) : supportCountries?.length ? (
            supportCountries?.map((country, index) => (
              <div key={country.name + index} className={styles.countryItem}>
                <LazyImage src={country.flagUrl} alt={country.name} />
                <span className={styles.countryName}>{country.name}</span>
              </div>
            ))
          ) : (
            <div className={styles.noDataMessage}>
              {t("esim-no-country-data")}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SimInfo;
