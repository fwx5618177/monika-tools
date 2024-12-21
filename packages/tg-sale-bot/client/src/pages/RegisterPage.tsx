import React, { useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import Input from "@components/Input";
import styles from "@styles/register.module.scss";
import { message } from "@components/MessageProvider";
import * as yup from "yup";
import { useFormik } from "formik";
import { register } from "@apis/request_api";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { useTranslation } from "react-i18next";
import { getQueryParams } from "@utils/getQueryParams";
import Terms, { TermsProps } from "@components/Terms";
import { constants } from "@constants/variable";

const RegisterPage: React.FC = () => {
  const termsRef = useRef<TermsProps>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlParams = getQueryParams<{ inviteCode: string; address: string }>();
  const [status, setStatus] = useState<"logo" | "success" | "fail">("logo");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      inviteCode: urlParams?.inviteCode || "", // 使用最新的 inviteCode
      address: urlParams?.address || "", // 使用最新的连接地址
    },
    enableReinitialize: true, // 当 inviteCode 变化时重新初始化
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), ""], "Passwords must match")
        .required("Confirm password is required"),
      inviteCode: yup.string(), // 可选邀请码
    }),
    onSubmit: async (values) => {
      try {
        // 对密码进行 Base64 加密
        const encodedPassword = encodeToBase64(values.password);
        const encodedConfirmPassword = encodeToBase64(values.confirmPassword);

        const response = await register({
          ...values,
          password: encodedPassword,
          confirmPassword: encodedConfirmPassword,
        });

        if (response.success) {
          setStatus("success");
          setTimeout(() => navigate("/login"), constants.skipNavigateDuration);
        } else throw new Error("Registration failed");
      } catch (error) {
        setStatus("fail");
        formik.setFieldError(
          "username",
          "Registration failed. Please try again."
        );
        message.error("Registration failed. Please try again.");
      }
    },
  });

  const handleSubmit = () => {
    if (termsRef.current) {
      const isValid = termsRef.current.validate();
      if (!isValid) {
        return;
      }
    }
    formik.handleSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.backIcon} onClick={() => navigate(-1)}>
        <FaChevronLeft />
      </div>

      {status === "logo" && (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("register-title")}</p>
        </>
      )}

      {status === "fail" && (
        <>
          <img
            src="/invite_fail.svg"
            alt="Registration failed"
            className={styles.failIcon}
          />
          <p className={styles.text}>{t("register-failed")}</p>
        </>
      )}
      {status === "success" && (
        <>
          <img
            src="/invite_success.svg"
            alt="Registration success"
            className={styles.successIcon}
          />
          <div className={styles.successText}>
            <h2 className={styles.title}>{t("congrats")}</h2>
            <p className={styles.text}>{t("register-success")}</p>
          </div>
        </>
      )}

      {status !== "success" && (
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <Input
            name="username"
            placeholder="Enter your username"
            value={formik.values.username}
            onChange={formik.handleChange}
            isInvalid={formik.touched.username && !!formik.errors.username}
            error={formik.errors.username}
          />
          <Input
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={formik.touched.email && !!formik.errors.email}
            error={formik.errors.email}
          />
          <Input
            name="password"
            placeholder="Enter your password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isInvalid={formik.touched.password && !!formik.errors.password}
            error={formik.errors.password}
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            isInvalid={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            error={formik.errors.confirmPassword}
          />
          {/* 邀请码输入框 */}
          {urlParams?.inviteCode ? (
            <Input
              name="inviteCode"
              placeholder="Invite Code"
              value={urlParams?.inviteCode}
              onChange={() => {}}
              isInvalid={false}
              error=""
              type="text"
              disabled={true} // 如果有邀请码则不可编辑
            />
          ) : (
            <Input
              name="inviteCode"
              placeholder="Enter your invite code (optional)"
              value={formik.values.inviteCode}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.inviteCode && !!formik.errors.inviteCode
              }
              error={formik.errors.inviteCode}
            />
          )}

          {urlParams?.address && (
            <Input
              name="address"
              placeholder="Connect Address"
              value={urlParams?.address}
              isInvalid={false}
              error=""
              type="text"
              disabled={true}
            />
          )}
        </form>
      )}

      <Terms ref={termsRef} />

      {status !== "success" && (
        <div className={styles.toggle}>
          <span onClick={() => navigate("/login")}>
            {t("has-account-login")}
          </span>
        </div>
      )}

      <div
        className={styles.submitButton}
        onClick={status === "success" ? () => navigate("/login") : handleSubmit}
      >
        {status === "success" ? "Login" : "Register"}
      </div>

      {status !== "success" && (
        <>
          <div className={styles.cancelButton} onClick={() => navigate(-1)}>
            {t("cancel")}
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
