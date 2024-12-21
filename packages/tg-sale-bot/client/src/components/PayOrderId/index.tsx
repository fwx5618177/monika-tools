import React, { FC } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { FaCopy } from "react-icons/fa";
import { message } from "@components/MessageProvider";

export interface PayOrderIdProps {
  payOrderId: string;
}

const PayOrderId: FC<PayOrderIdProps> = ({ payOrderId }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.esimOrder}>
      <span>{t("order-esim-purchase-esim-order-mention")}</span>
      <span>
        {payOrderId}
        <CopyToClipboard
          text={payOrderId}
          onCopy={() => message.success(t("copied"))}
        >
          <FaCopy color="#0198E9" />
        </CopyToClipboard>
      </span>
    </div>
  );
};

export default PayOrderId;
