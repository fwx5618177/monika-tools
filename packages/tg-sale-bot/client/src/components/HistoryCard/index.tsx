import React, { FC, useState } from "react";
import styles from "./index.module.scss";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import OrderStatus from "@components/OrderStatus";
import {
  PackageInfo,
  UserOrderPayType,
  UserOrderStatus,
} from "@interfaces/api";
import { formatNumber } from "@utils/formatUnit";
import { formatDate } from "@utils/formatDate";
import { useTranslation } from "react-i18next";

export interface HistoryCardProps {
  orderId: string; // 订单号
  payType?: UserOrderPayType; // 区分货币类型
  sendingAddress?: string; // 发送地址
  receivingAddress?: string; // 接收地址
  phoneNumber: string; // SIM 卡号
  amount: string; // 支付金额
  createdAt: string; // 订单创建时间
  validity: string; // 有效期
  instructions: string; // 说明
  packageInfo?: PackageInfo;
  status?: UserOrderStatus; // 订单状态
}

const switchStatus = (status: UserOrderStatus) => {
  switch (status) {
    case UserOrderStatus.NOT_PAID:
    case UserOrderStatus.NOT_VERIFY:
      return "pending";
    case UserOrderStatus.CANCELED:
      return "canceled";
    case UserOrderStatus.EXPRESS:
    case UserOrderStatus.COMPLETED:
    case UserOrderStatus.PAID:
      return "success";
    case UserOrderStatus.APPLY_REFUND:
    case UserOrderStatus.REFUNDED:
    default:
      return "failed";
  }
};

const HistoryCard: FC<HistoryCardProps> = ({
  orderId,
  payType,
  sendingAddress = "N/A",
  receivingAddress = "N/A",
  phoneNumber,
  amount,
  createdAt,
  validity,
  instructions,
  packageInfo,
  status,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false); // 控制地址显示

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.card}>
      <OrderStatus status={switchStatus(status!)} />
      <h2 className={styles.cardTitle}>{packageInfo?.packageName}</h2>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-package-validity-time")}</div>
        <div className={styles.right}>{formatDate(validity, '未激活')}</div>
      </div>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-instruction")}</div>
        <div className={`${styles.right} ${styles.instructions}`}>
          {instructions}
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-id")}</div>
        <div className={styles.right}>{orderId}</div>
      </div>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-sim-card-number")}</div>
        <div className={styles.right}>{phoneNumber}</div>
      </div>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-create-time")}</div>
        <div className={styles.right}>{formatDate(createdAt, '')}</div>
      </div>

      <div className={styles.item}>
        <div className={styles.left}>{t("order-paid")}</div>
        <div className={`${styles.right} ${styles.paid}`}>
          <img
            src={
              payType === UserOrderPayType.INTEGRAL
                ? "/gold.svg"
                : "/dollar.svg"
            }
            alt="currency"
          />
          <span>
            {payType === UserOrderPayType.INTEGRAL
              ? `${formatNumber(amount)} points`
              : `$${formatNumber(amount)}`}
          </span>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className={styles.item}>
            <div className={styles.left}>{t("order-send-address")}</div>
            <div className={`${styles.right} ${styles.address}`}>
              {sendingAddress}
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.left}>{t("order-recv-address")}</div>
            <div className={`${styles.right} ${styles.address}`}>
              {receivingAddress}
            </div>
          </div>
        </>
      )}

      <div className={styles.toggle} onClick={toggleExpand}>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </div>
  );
};

export default HistoryCard;
