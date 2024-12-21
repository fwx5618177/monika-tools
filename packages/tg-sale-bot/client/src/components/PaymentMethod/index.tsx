import React, { FC, useState } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import LazyImage from "@components/LazyImage";
import CurrentPoints from "@components/CurrentPoints";

export type SelectMethod = "creditCard" | "integral" | "ton" | "tether";

export interface PaymentMethodProps {
  packageName: string;
  points: string;
  allowCreditCard?: boolean;
  allowDigitalWallet?: boolean;
  allowPoints?: boolean;
  onClose: () => void;
  onSelect: (method: SelectMethod) => void;
}

const digital = [
  {
    name: "ton",
    url: "/ton.svg",
  },
  {
    name: "tether",
    url: "/tether.svg",
  },
];

const PaymentMethod: FC<PaymentMethodProps> = ({
  packageName,
  points = "0",
  allowCreditCard = false,
  allowDigitalWallet = false,
  allowPoints = false,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<SelectMethod | null>(
    null
  );

  const handleSelect = (method: SelectMethod) => {
    setSelectedMethod(method); // 选择支付方式
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
    }
  };

  return (
    <div className={styles.box}>
      <h4>{t("order-payment-method-type")}</h4>
      <p>{packageName}</p>

      {allowCreditCard && (
        <div
          className={`${styles.paymentItem} ${
            selectedMethod === "creditCard" ? styles.selected : ""
          }`}
          onClick={() => handleSelect("creditCard")}
        >
          <h4>{t("order-payment-credit-card")}</h4>
        </div>
      )}

      {/* 数字钱包 */}
      {allowDigitalWallet && (
        <div className={styles.payment}>
          <h4>{t("order-payment-digital-wallet")}</h4>
          <div className={styles.imgList}>
            {digital?.map((item) => (
              <div
                key={item.name}
                className={`${styles.paymentItem} ${
                  selectedMethod === item.name ? styles.selected : ""
                }`}
                onClick={() => handleSelect(item?.name as "ton" | "tether")}
              >
                <LazyImage src={item.url} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 积分支付 */}
      {allowPoints && (
        <div className={styles.payment}>
          <h4>{t("order-payment-points")}</h4>
          <div
            className={styles.paymentItem}
            onClick={() => handleSelect("integral")}
          >
            <span
              className={`${styles.pointsContent} ${
                selectedMethod === "integral" ? styles.selected : ""
              }`}
            >
              <CurrentPoints balance={points} />
            </span>
          </div>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          className={styles.confirmButton}
          disabled={!selectedMethod}
          onClick={handleConfirm}
        >
          {t("confirm")}
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
