import React, { FC } from "react";
import { SimCardType } from "@interfaces/api";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

interface SelectSimCardTypeProps {
  onSelect: (type: SimCardType) => void;
}

const SelectSimCardType: FC<SelectSimCardTypeProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.box}>
      <button
        className={styles.button}
        onClick={() => onSelect(SimCardType.SIM)}
      >
        {t("order-payment-sim-card-buy-sim")}
      </button>
      <button
        className={styles.button}
        onClick={() => onSelect(SimCardType.eSIM)}
      >
        {t("order-payment-sim-card-buy-esim")}
      </button>
    </div>
  );
};

export default SelectSimCardType;
