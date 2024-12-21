import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import styles from "@styles/payment.module.scss";
import { message } from "@components/MessageProvider";
import { useTonPayment } from "@hooks/useTonPayment";
import { getQueryParams } from "@utils/getQueryParams";
import { decodeFromBase64 } from "@utils/decodeFromBase64";
import { TonConnectButton } from "@tonconnect/ui-react";
import { SelectMethod } from "@components/PaymentMethod";
import { sendPaymentTx } from "@apis/request_api";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { useNavigate } from "react-router-dom";
import { AppDispatch, updatePayOrderId } from "@store/store";
import { useDispatch } from "react-redux";

export type PaymentStatus = "pending" | "success" | "fail";
const PaymentStatusIcon: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  switch (status) {
    case "pending":
      return <FaHourglassHalf className={`${styles.icon} ${styles.pending}`} />;
    case "success":
      return <FaCheckCircle className={`${styles.icon} ${styles.success}`} />;
    case "fail":
      return <FaTimesCircle className={`${styles.icon} ${styles.fail}`} />;
    default:
      return null;
  }
};
const PayPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const urlParams = useMemo(() => {
    const params = getQueryParams<{
      payType: SelectMethod;
      orderId: string;
      status: PaymentStatus;
    }>();

    return {
      payType: decodeFromBase64(params.payType) as SelectMethod,
      orderId: decodeFromBase64(params.orderId),
      status: decodeFromBase64(params.status) as PaymentStatus,
    };
  }, []);
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>(
    urlParams?.status || "pending"
  );
  const { sendPayment, isConnected } = useTonPayment();

  const processPayment = useCallback(async () => {
    if (!isConnected && urlParams.payType === "ton") return;

    setStatus("pending");
    try {
      const succeed_url = `${
        window.location.origin
      }/payment?status=${encodeToBase64("success")}&orderId=${encodeToBase64(
        urlParams.orderId
      )}&payType=${encodeToBase64(urlParams.payType)}`;

      // const timeout_url = `${
      //   window.location.origin
      // }/payment?status=${encodeToBase64("fail")}&orderId=${encodeToBase64(
      //   urlParams.orderId
      // )}&payType=${encodeToBase64(urlParams.payType)}`;

      const timeout_url = `${
        window.location.origin
      }/payment?status=${encodeToBase64("success")}&orderId=${encodeToBase64(
        urlParams.orderId
      )}&payType=${encodeToBase64(urlParams.payType)}`;

      if (urlParams.payType === "ton") {
        const paymentSuccess = await sendPayment();

        if (paymentSuccess === null) {
          message.error(t("payment-failed"));

          setStatus("fail");
          return;
        }

        // 发送交易记录
        await sendPaymentTx({
          orderId: encodeToBase64(urlParams.orderId),
          payType: urlParams.payType,
          succeed_url,
          timeout_url,
          ton_hx: paymentSuccess?.txHash,
          ton_amount: paymentSuccess?.amount,
          ton_recipientAddress: paymentSuccess?.recipientAddress,
        });

        message.success(
          `${t("payment-success")}, txHash: ${paymentSuccess?.txHash}`
        );
        setStatus("success");

        return;
      }

      const result = await sendPaymentTx({
        orderId: encodeToBase64(urlParams.orderId),
        payType: urlParams.payType === "integral" ? "integral" : "tether",
        succeed_url,
        timeout_url,
      });

      if (result?.payUrl) {
        window.location.href = result.payUrl;
      }

      if (urlParams.payType === "integral") {
        setStatus("success");
      }
    } catch (error: any) {
      console.log("error", error);
      setStatus("fail");
      message.error(`${t("payment-failed")}, ${error.message}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendPayment, t, urlParams.orderId, urlParams.payType]);

  useEffect(() => {
    if (status === "success") {
      message.success(t("payment-success"));
      dispatch(updatePayOrderId(""));
      setStatus("success");
    } else if (status === "fail") {
      message.error(t("payment-failed"));
      setStatus("fail");
      dispatch(updatePayOrderId(urlParams?.orderId));
    } else if (status === "pending") {
      processPayment();
      dispatch(updatePayOrderId(urlParams?.orderId));
    }
  }, [dispatch, processPayment, status, t, urlParams?.orderId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t("payment-title")}</h2>
      </div>

      <div className={styles.statusContainer}>
        <PaymentStatusIcon status={status} />
        <p className={styles.statusMessage}>
          {status === "pending" && t("payment-pending")}
          {status === "success" && t("payment-success")}
          {status === "fail" && t("payment-failed")}
        </p>
      </div>

      <div className={styles.paymentInfo}>
        <p>
          {t("payment-selected-method", {
            method: urlParams?.payType,
          })}
        </p>

        {
          status === "success" &&
          <p className={styles.paymentHint}>
          {t("payment-succeed-hint")}
        </p>
        }

        {status !== "success" &&
          urlParams?.payType === "ton" &&
          !isConnected && (
            <>
              <TonConnectButton />
              <button
                onClick={processPayment}
                className={styles.retryButton}
                disabled={status !== "fail"}
              >
                {t("payment-retry")}
              </button>
            </>
          )}

        {status !== "success" && urlParams?.payType !== "ton" && (
          <button
            onClick={processPayment}
            className={styles.retryButton}
            disabled={status !== "fail"}
          >
            {t("payment-retry")}
          </button>
        )}

        <button
          onClick={() => navigate("/mine")}
          className={styles.retryButton}
        >
          {t("payment-back-to-home")}
        </button>
      </div>
    </div>
  );
};

export default PayPage;
