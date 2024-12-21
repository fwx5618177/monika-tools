import React, { useState } from "react";
import styles from "./index.module.scss";
import VerifyStatus from "@components/VerifyStatus";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useUserOrder } from "@hooks/useUserOrder";
import { useTranslation } from "react-i18next";
import QRCodeModal from "@components/QRCodeModal";
import NoData from "@components/NoData";
import { formatDate } from "@utils/formatDate";

const SettingInfo: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { orderList, getOrderDetail, orderDetail } = useUserOrder();

  const handleQRCodeClick = async (orderId: string) => {
    await getOrderDetail(orderId);

    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <div className={styles.personalInfo}>
      <div className={styles.avatar}>
        <div className={styles.user}>
          <img src="/invite_user.png" alt="avatar" />
        </div>
        <div className={styles.name}>{userInfo?.username}</div>
        <div className={styles.status}>
          <VerifyStatus />
        </div>
      </div>

      <div className={styles.orderList}>
        {orderList?.length > 0 ? (
          orderList?.map((item, index) => (
            <div className={styles.info} key={index}>
              <div className={styles.infoBox}>
                <div className={styles.item}>
                  <div className={styles.itemName}>{t("esim")}</div>
                  <div className={styles.itemValue}>{item?.phoneNumber}</div>
                </div>

                <div className={styles.item}>
                  <div className={styles.itemName}>
                    {t("home-sim-card-info-created-time")}
                  </div>
                  <div className={styles.itemValue}>
                    {formatDate(item?.createTime, '')}
                  </div>
                </div>

                <div className={styles.item}>
                  <div className={styles.itemName}>
                    {t("home-sim-card-info-active-time")}
                  </div>
                  <div className={styles.itemValue}>
                    {formatDate(item?.activeTime, '未激活')}
                  </div>
                </div>
              </div>

              {item && (
                <img
                  className={styles.qrCode}
                  src="/qr_code.svg"
                  alt="qr code"
                  onClick={() => handleQRCodeClick(item?.orderId)}
                />
              )}
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>

      <QRCodeModal
        visible={visible}
        onClose={closeModal}
        orderDetail={orderDetail}
      />
    </div>
  );
};

export default SettingInfo;
