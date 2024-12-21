import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import Input from "@components/Input";
import styles from "@styles/login.module.scss";
import { message } from "@components/MessageProvider";
import * as yup from "yup";
import { useFormik } from "formik";
import Modal from "@components/Modal";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { loginAccount, checkWalletAccount } from "@apis/request_api";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { useAuth } from "@providers/AuthProvider";
import { useDispatch } from "react-redux";
import { updateTonAddress } from "@store/store";
import { useTranslation } from "react-i18next";
import Terms, { TermsProps } from "@components/Terms";
import { constants } from "@constants/variable";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const termsRef = useRef<TermsProps>(null);

  const [status, setStatus] = useState<"logo" | "success" | "fail">("logo");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { logout, login } = useAuth();
  const dispatch = useDispatch();
  const tonAddress = useTonAddress();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required(t("login-required-username")),
      password: yup.string().required(t("login-required-password")),
    }),
    onSubmit: async (values) => {
      try {
        const encodedPassword = encodeToBase64(values.password);
        const response = await loginAccount({
          ...values,
          password: encodedPassword,
        });

        if (response.success) {
          login(response.token, response.timestamp, response.userInfo);

          setStatus("success");
          setTimeout(() => navigate("/home"), constants.skipNavigateDuration);
        } else {
          setStatus("fail");
          formik.setFieldError("username", t("login-filed-incorrect"));
          formik.setFieldError("password", t("login-filed-incorrect"));
        }
      } catch (error) {
        setStatus("fail");
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

  // Ton Connect 钱包连接后的处理逻辑
  const handleTonConnect = useCallback(async () => {
    if (!tonAddress) return;

    setWalletConnected(true); // 设置钱包已连接
    setIsModalVisible(true); // 当 TonConnect 连接时，显示 Modal

    dispatch(updateTonAddress(tonAddress));
  }, [tonAddress, dispatch]);

  // 同意使用钱包地址登录
  const handleAgreeLogin = async () => {
    setLoading(true);
    try {
      // 发送请求检查是否有账户
      const response = await checkWalletAccount(tonAddress!);
      if (response.exists) {
        // 有账号，自动登录
        const loginResponse = await loginAccount({
          walletAddress: tonAddress,
          username: response.username,
        });
        if (loginResponse.success) {
          login(
            loginResponse.token,
            loginResponse.timestamp,
            loginResponse.userInfo
          );

          setStatus("success");
          // setTimeout(() => navigate("/home"), constants.skipNavigateDuration);
        } else {
          message.error(t("login-failed"));
        }
      } else {
        // 无账号，跳转到注册页面
        navigate(`/register?address=${tonAddress}`);
      }
    } catch (error) {
      console.error(error);
      navigate(`/register?address=${tonAddress}`);
    } finally {
      setLoading(false);
      setIsModalVisible(false); // 隐藏 Modal
    }
  };

  // 拒绝登录，断开钱包连接并关闭 Modal
  const handleRejectLogin = () => {
    logout(); // 登出

    setIsModalVisible(false); // 隐藏 Modal
    setWalletConnected(false); // 设置钱包未连接状态
  };

  useEffect(() => {
    if (tonAddress) {
      handleTonConnect();
    }
  }, [handleTonConnect, tonAddress]);

  return (
    <div className={styles.container}>
      <div className={styles.backIcon} onClick={() => navigate(-1)}>
        <FaChevronLeft />
      </div>

      {status === "logo" && (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("fill-invitation-code")}</p>
        </>
      )}

      {status === "fail" && (
        <>
          <img
            src="/invite_fail.svg"
            alt="invite fail"
            className={styles.failIcon}
          />
          <p className={styles.text}>{t("invitation-code-fail")}</p>
        </>
      )}
      {status === "success" && (
        <>
          <img
            src="/invite_success.svg"
            alt="invite success"
            className={styles.successIcon}
          />
          <div className={styles.successText}>
            <h2 className={styles.title}>{t("congrats")}</h2>
            <p className={styles.text}>{t("register-success")}</p>
          </div>
        </>
      )}

      {!walletConnected && status !== "success" && (
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <Input
            name="username"
            placeholder={t("login-form-user-placeholder")}
            value={formik.values.username}
            onChange={formik.handleChange}
            isInvalid={formik.touched.username && !!formik.errors.username}
            error={formik.errors.username}
          />
          <Input
            name="password"
            placeholder={t("login-form-password-placeholder")}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isInvalid={formik.touched.password && !!formik.errors.password}
            error={formik.errors.password}
          />
        </form>
      )}

      <Terms ref={termsRef} />

      {status !== "success" && (
        <div className={styles.toggle}>
          <span onClick={() => navigate("/register")}>{t("register")}</span>
          <span onClick={() => navigate("/invite")}>
            {t("have-invite-code")}
          </span>
          <span onClick={() => navigate("/forgot-password")}>
            {t("forgot-password-title")}
          </span>
        </div>
      )}

      {status !== "success" && (
        <TonConnectButton className={styles.tonConnectButton} />
      )}

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          onClose={handleRejectLogin}
          title="Login Confirmation"
        >
          <div className={styles.modalContent}>
            <p>{t("login-by-wallet")}</p>
            <div className={styles.modalActions}>
              <button onClick={handleAgreeLogin} className={styles.confirm}>
                {t("confirm")}
              </button>
              <button onClick={handleRejectLogin} className={styles.cancel}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div
        className={styles.submitButton}
        onClick={
          status === "success" || walletConnected
            ? () => navigate("/home")
            : handleSubmit
        }
      >
        {loading
          ? t("is-connecting")
          : status === "success" || walletConnected
            ? t("home")
            : t("submit")}
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

export default LoginPage;
