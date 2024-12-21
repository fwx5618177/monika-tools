import React, { FC, useState } from "react";
import styles from "@styles/earn.module.scss";
import NavBar from "@components/navbar";
import TaskCard from "@components/TaskCard";
import InviteCard from "@components/InviteCard";
import CurrentPoints from "@components/CurrentPoints";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { constants } from "@constants/variable";

const EarnPage: FC = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [showFooter, setShowFooter] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>

      <header className={styles.header}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t("airdrop-title")}</h1>
          <p className={styles.description}>{t("airdrop-description")}</p>
        </div>
        <img src="/gift.svg" alt="gift" className={styles.gift} />
      </header>

      <div className={styles.pointsCard}>
        <img src="/gift_box.svg" alt="gift box" className={styles.giftBox} />
        <div className={styles.airdropNotice}>
          {t("airdrop-notice")}
          <a className={styles.follow} href={constants.twitterUrl}>
            {t("follow")}
          </a>
        </div>
      </div>

      <CurrentPoints balance={userInfo?.integral} title />

      {userInfo?.inviteCode && <InviteCard inviteCode={userInfo?.inviteCode} />}

      <TaskCard showModal={(value) => setShowFooter(value)} />
      {showFooter && <NavBar fixed />}
    </div>
  );
};

export default EarnPage;
