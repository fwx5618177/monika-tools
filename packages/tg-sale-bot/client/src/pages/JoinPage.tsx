import React, { useState, useRef } from "react";
import { SlideSwitcher } from "@components/SlideSwitcher";
import styles from "@styles/join.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import InviteUserInfo from "@components/InviteUserInfo";
import { useTranslation } from "react-i18next";
import Terms, { TermsProps } from "@components/Terms";

const contentList = [
  "Want to stay seamlessly connected while traveling?...".repeat(100),
  "Want to stay seamlessly connected while traveling?...",
  "Want to stay seamlessly connected while traveling?...",
];

const title = "AISIM – Connect to the world and enjoy";

const JoinPage: React.FC = () => {
  const termsRef = useRef<TermsProps>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(location.search);
  const inviteCode = queryParams.get("inviteCode");
  const [showInviteUserInfo, setShowInviteUserInfo] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleJoinNowClick = (type: "login" | "invite") => {
    if (termsRef.current) {
      const isValid = termsRef.current.validate();
      if (!isValid) {
        return;
      }
    }

    if (type === "invite") {
      navigate(`/invite?inviteCode=${inviteCode ? inviteCode : ""}`);
    } else {
      navigate("/login");
    }
  };

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX.current > 50) {
      setShowInviteUserInfo(false);
    }
  };

  return (
    <div
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.topBg}>
        <div className={styles.leftBg}></div>
        <div className={styles.bottomBg}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          {t("welcome-to-join")}
          <div className={styles.highlight}>{t("title")}</div>
        </div>
        <SlideSwitcher title={title} contentList={contentList} />
      </div>

      {inviteCode && showInviteUserInfo ? (
        <>
          <InviteUserInfo />
          <div className={styles.actions}>
            <div
              className={styles.joinButton}
              onClick={() => handleJoinNowClick("invite")}
            >
              {t("join-button-join")}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.actions}>
            <div
              className={styles.joinButton}
              onClick={() => handleJoinNowClick("login")}
            >
              {t("join-button-join")}
            </div>
            <div
              className={styles.inviteButton}
              onClick={() => handleJoinNowClick("invite")}
            >
              {t("invite-code")}
            </div>
          </div>
        </>
      )}

      <Terms ref={termsRef} />
    </div>
  );
};

export default JoinPage;
