import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import Input from "@components/Input";
import styles from "@styles/invite.module.scss";
import { getQueryParams } from "@utils/getQueryParams";
import { useTranslation } from "react-i18next";
import { validInviteCode } from "@apis/request_api";
import Terms, { TermsProps } from "@components/Terms";

const InvitePage: React.FC = () => {
  const termsRef = useRef<TermsProps>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlParams = getQueryParams<{ inviteCode: string }>();

  const [inviteCode, setInviteCode] = useState(
    urlParams?.inviteCode ? decodeURIComponent(urlParams?.inviteCode) : ""
  );
  const [isInvalid, setIsInvalid] = useState(false);
  const [status, setStatus] = useState<"logo" | "success" | "fail">("logo");

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate(`/register?inviteCode=${inviteCode}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate, inviteCode]);

  const LogoIcon = () => {
    if (status === "logo") {
      return (
        <>
          <Logo size="medium" />
          <p className={styles.text}>{t("fill-invitation-code")}</p>
        </>
      );
    }
    if (status === "fail") {
      return (
        <>
          <img
            src="/invite_fail.svg"
            alt="invite fail"
            className={styles.failIcon}
          />
          <p className={styles.text}>{t("invitation-code-fail")}</p>
        </>
      );
    }
    if (status === "success") {
      return (
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
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
    setIsInvalid(false); // 重置无效状态
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getInviteCodeValid = useCallback(async (inviteCode: string) => {
    const response = await validInviteCode({ inviteCode });

    if (response.valid) {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, []);

  const handleJoinNowClick = async () => {
    if (termsRef.current) {
      const isValid = termsRef.current.validate();
      if (!isValid) {
        return;
      }
    }

    if (!inviteCode) {
      setIsInvalid(true);
    } else {
      await getInviteCodeValid(inviteCode);
      setIsInvalid(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backIcon} onClick={handleBackClick}>
        <FaChevronLeft />
      </div>
      {LogoIcon()}

      {status !== "success" && (
        <Input
          placeholder={t("invite-input-placeholder")}
          value={inviteCode}
          onChange={handleInputChange}
          isInvalid={isInvalid}
        />
      )}

      <Terms ref={termsRef} />

      <div
        className={styles.submitButton}
        onClick={
          status === "success"
            ? () => navigate(`/register?inviteCode=${inviteCode}`)
            : handleJoinNowClick
        }
      >
        {status === "success" ? "Register" : "Submit"}
      </div>

      {status === "success" ? (
        <span className={styles.autoSkip}>
          {t("invite-automatically-redirect", {
            seconds: 3,
          })}
        </span>
      ) : (
        <>
          <div className={styles.cancelButton} onClick={() => navigate(-1)}>
            {t("cancel")}
          </div>
        </>
      )}
    </div>
  );
};

export default InvitePage;
