import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import Input from "@components/Input";
import styles from "@styles/forgotPassword.module.scss";
import { message } from "@components/MessageProvider";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  sendResetPasswordEmail,
  verifyResetPasswordCode,
  resetPassword,
} from "@apis/request_api";
import { useTranslation } from "react-i18next";
import { constants } from "@constants/variable";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { debounceClick } from "@utils/debounce";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "verify" | "reset" | "success">(
    "email"
  );
  const [clientVerifyCode, setClientVerifyCode] = useState<string>(""); // 保存验证码用于后续验证
  const [username, setUsername] = useState<string | null>(null); // 存储用户名
  const [resetCredential, setResetCredential] = useState<string>("");

  // 不同步骤的 Yup 验证模式
  const emailSchema = yup.object({
    email: yup
      .string()
      .email(t("invalid-email-address"))
      .required(t("email-required")),
  });

  const verifySchema = yup.object({
    code: yup.string().required(t("verify-code-required")),
  });

  const resetSchema = yup.object({
    password: yup
      .string()
      .required(t("password-required"))
      .min(6, t("password-length")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], t("password-must-match"))
      .required(t("confirm-password-required")),
  });

  // 根据步骤动态设置验证模式
  const validationSchema =
    step === "email"
      ? emailSchema
      : step === "verify"
        ? verifySchema
        : resetSchema;

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: false, // 禁用每次更改时的验证
    validateOnBlur: false, // 禁用每次失焦时的验证
    onSubmit: debounceClick(async (values) => {
      try {
        if (step === "email") {
          const response = await sendResetPasswordEmail({
            email: encodeToBase64(values.email),
          });
          if (response.success) {
            message.success(t("verification-code-sent"));
            setClientVerifyCode(response.clientVerifyCode); // 存储验证码以供验证
            setStep("verify");
          } else throw new Error("Failed to send reset email");
        } else if (step === "verify") {
          const response = await verifyResetPasswordCode({
            email: encodeToBase64(values.email),
            code: values.code,
            clientVerifyCode,
          });
          if (response.success) {
            setUsername(response.username || ""); // 设置用户名
            setResetCredential(response.resetCredential); //设置重置凭据
            setStep("reset");
          } else throw new Error("Invalid verification code");
        } else if (step === "reset") {
          const response = await resetPassword({
            email: encodeToBase64(values.email),
            password: encodeToBase64(values.password),
            confirmPassword: encodeToBase64(values.confirmPassword),
            resetCredential: resetCredential,
          });
          if (response.success) {
            setStep("success");
            setTimeout(
              () => navigate("/login"),
              constants.skipNavigateDuration
            );
          } else throw new Error("Reset password failed");
        }
      } catch (error: any) {
        console.error(error);
      }
    }),
  });

  return (
    <div className={styles.container}>
      <div className={styles.backIcon} onClick={() => navigate(-1)}>
        <FaChevronLeft />
      </div>

      {step === "email" && (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("forgot-password-title")}</p>
          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <Input
              name="email"
              placeholder={t("forget-placeholder")}
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={formik.touched.email && !!formik.errors.email}
              error={formik.errors.email}
            />
            <p className={styles.note}>
              {t("verification-code-email-sent", {
                time: 10,
              })}
            </p>
            <button type="submit" className={styles.submitButton}>
              {t("send-reset-link")}
            </button>
          </form>
        </>
      )}

      {step === "verify" && (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("enter-verification-code")}</p>
          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <Input
              name="code"
              placeholder={t("verify-code-placeholder")}
              type="text"
              value={formik.values.code}
              onChange={formik.handleChange}
              isInvalid={formik.touched.code && !!formik.errors.code}
              error={formik.errors.code}
            />
            <button type="submit" className={styles.submitButton}>
              {t("verify-code")}
            </button>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("reset-password-title")}</p>
          {username && (
            <div className={styles.usernameDisplay}>
              <p>
                {t("username")}: {username}
              </p>
            </div>
          )}
          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <Input
              name="password"
              placeholder={t("enter-password")}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              isInvalid={formik.touched.password && !!formik.errors.password}
              error={formik.errors.password}
            />
            <Input
              name="confirmPassword"
              placeholder={t("enter-confirm-password")}
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
              error={formik.errors.confirmPassword}
            />
            <button type="submit" className={styles.submitButton}>
              {t("reset-password")}
            </button>
          </form>
        </>
      )}

      {step === "success" && (
        <>
          <Logo size="medium" />
          <img
            src="/invite_success.svg"
            alt="Operation success"
            className={styles.successIcon}
          />
          <div className={styles.successText}>
            <h2 className={styles.title}>{t("password-reset-success")}</h2>
            <p className={styles.text}>{t("you-can-now-login")}</p>
          </div>
        </>
      )}

      {step !== "success" && (
        <div className={styles.cancelButton} onClick={() => navigate(-1)}>
          {t("cancel")}
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
