import React, { FC, useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import Modal from "@components/Modal";
import Input from "@components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import { message } from "@components/MessageProvider";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useVerifyEmail } from "@hooks/useVerifyEmail";
import { useTranslation } from "react-i18next";
import { debounceClick } from "@utils/debounce";

const VerifyStatus: FC = () => {
  const { t } = useTranslation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { sentVerifyCode, verify, verifyData } = useVerifyEmail();
  const [isVerifyModalVisible, setVerifyModalVisible] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSend, setCodeSend] = useState(false);

  const type = userInfo?.isVerifiedEmail ? "verified" : "pending";

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: yup.object({
      code: yup.string().required(t("activation-code-required")),
    }),
    onSubmit: async (values) => {
      await confirmEmailVerification(values.code);
    },
  });

  const handleVerifyEmail = useCallback(() => {
    setVerifyModalVisible(true);
  }, []);

  const confirmEmailVerification = debounceClick(
    useCallback(
      async (code: string) => {
        const result = await verify({ email: userInfo?.email || "", code });

        if (result) {
          message.success(t("mine-verify-message-success"));
          setVerifyModalVisible(false);
        } else {
          message.error(t("mine-verify-message-error"));
        }
      },
      [t, userInfo?.email, verify]
    )
  );

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (countdown > 0 || isSendingCode) return;

    setIsSendingCode(true);
    try {
      await sentVerifyCode({ email: userInfo?.email || "" });
      if (!verifyData) {
        message.success(t("mine-verify-message-success"));
        setCodeSend(true);
      } else {
        message.error(t("mine-verify-message-error"));
      }

      setCountdown(180); // 开始倒计时
    } catch (error) {
      message.error(t("mine-verify-message-error"));
    } finally {
      setIsSendingCode(false);
    }
  }, [
    countdown,
    isSendingCode,
    sentVerifyCode,
    t,
    userInfo?.email,
    verifyData,
  ]);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return (
    <>
      <span
        className={`${styles.status} ${styles[type]}`}
        onClick={type === "pending" ? handleVerifyEmail : undefined}
      >
        {type}
      </span>

      <Modal
        visible={isVerifyModalVisible}
        onClose={() => {
          setVerifyModalVisible(false);
          formik.resetForm();
        }}
        title={t("mine-verify-modal-title")}
      >
        <div className={styles.content}>
          <p>{t("mine-verify-description")}</p>
          <form onSubmit={formik.handleSubmit}>
            {userInfo?.email && (
              <span className={styles.email}>{userInfo?.email}</span>
            )}
            <Input
              name="code"
              placeholder={t("activation-code-placeholder")}
              value={formik.values.code}
              onChange={formik.handleChange}
              isInvalid={formik.touched.code && !!formik.errors.code}
              error={formik.errors.code}
            />
            <div className={styles.verificationActions}>
              <button
                type="button"
                className={`${styles.sendCodeButton} ${
                  countdown > 0 ? styles.disabled : ""
                }`}
                onClick={debounceClick(handleSendCode)}
                disabled={isSendingCode || countdown > 0}
              >
                {countdown > 0
                  ? t("mine-verify-cutdown-seconds", {
                      countdown,
                    })
                  : t("send-code")}
              </button>
              <button
                type="submit"
                className={styles.confirm}
                disabled={codeSend === false}
              >
                {t("confirm")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default VerifyStatus;
