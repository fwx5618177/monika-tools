import React, { FC } from "react";
import styles from "./index.module.scss";
import Status from "./status";

interface OrderStatusProps {
  status?: "success" | "pending" | "failed" | "canceled";
}

const OrderStatus: FC<OrderStatusProps> = ({ status = "canceled" }) => {
  return (
    <div className={`${styles.status} ${styles[status]}`}>
      <Status className={styles.icon} />
      <span className={styles.label}>{status}</span>
    </div>
  );
};

export default OrderStatus;
