import React from "react";
import Modal from "@components/Modal";
import styles from "./index.module.scss";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { message } from "@components/MessageProvider";
import { useTranslation } from "react-i18next";
import { GetUserOrderDetailResponse } from "@interfaces/api";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  orderDetail?: GetUserOrderDetailResponse;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  orderDetail,
}) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} onClose={onClose} title={t("qr-code")}>
      <div className={styles.box}>
        <div className={styles.modalQrCode}>
          <img src={orderDetail?.qrcodeImage} alt="QR Code Image" />
        </div>

        <div className={styles.downloadHint}>{t("mine-qr-download")}</div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <h3>{t("instructions.howToBindESIM")}</h3>
          <p>{t("instructions.step1")}</p>
          <p>{t("instructions.step2")}</p>
          <p>{t("instructions.step3")}</p>
          <p>{t("instructions.step4")}</p>
          <p>{t("instructions.step5")}</p>
          <p>{t("instructions.step6")}</p>
          <br />
          <h3>{t("instructions.manualBinding")}</h3>
          <p>{t("instructions.manualStep1")}</p>
          <p>{t("instructions.manualStep2")}</p>
          <p>{t("instructions.manualStep3")}</p>
          <p>{t("instructions.manualStep4")}</p>
          <p>{t("instructions.manualStep5")}</p>
        </div>

        {/* Activation code section */}
        <div className={styles.activationCodeBox}>
          <div className={styles.inputBox}>
            <span>
              {t("mine-sm-dp", {
                address: orderDetail?.smdpAddress,
              })}
            </span>
            <CopyToClipboard
              text={orderDetail?.smdpAddress || ""}
              onCopy={() => message.success(t("copied"))}
            >
              <img src="/copy.svg" alt="copy" className={styles.copyIcon} />
            </CopyToClipboard>
          </div>

          <div className={styles.inputBox}>
            <span>
              {t("mine-active-code", {
                code: orderDetail?.activeCode,
              })}
            </span>
            <CopyToClipboard
              text={orderDetail?.activeCode || ""}
              onCopy={() => message.success(t("copied"))}
            >
              <img src="/copy.svg" alt="copy" className={styles.copyIcon} />
            </CopyToClipboard>
          </div>
        </div>

        {/* Confirm Button */}
        <button className={styles.confirmButton} onClick={onClose}>
          {t("confirm")}
        </button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
