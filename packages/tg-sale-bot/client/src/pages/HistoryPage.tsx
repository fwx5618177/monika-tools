import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "@styles/history.module.scss";
import HistoryCard from "@components/HistoryCard";
import { useUserOrder } from "@hooks/useUserOrder";
import { useTranslation } from "react-i18next";
import DataLoading from "@components/DataLoading";
import NoData from "@components/NoData";

const HistoryPage = () => {
  const { t } = useTranslation();
  const { isLoading, historyList } = useUserOrder();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backIcon} onClick={handleBackClick}>
          <FaChevronLeft />
        </div>
        <h2 className={styles.title}>{t("mine-order-title")}</h2>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <DataLoading />
        ) : historyList?.length > 0 ? (
          historyList?.map((order, index) => (
            <HistoryCard
              key={index + "_history"}
              orderId={order?.orderId}
              payType={order?.payType}
              sendingAddress={order?.sendingAddress}
              receivingAddress={order?.receivingAddress}
              phoneNumber={order?.phoneNumber}
              amount={order?.amount}
              createdAt={order?.createdAt}
              validity={order?.validity}
              instructions={order?.instructions}
              packageInfo={order?.packageInfo}
              status={order?.orderStatus}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
