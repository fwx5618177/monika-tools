import React, { FC, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { getMonthsAgo } from "@utils/getMonthsAgo";
import { useInviteData } from "@hooks/useInviteData";
import NoData from "@components/NoData";
import DataLoading from "@components/DataLoading";
import { message } from "@components/MessageProvider";

interface InviteCardProps {
  inviteCode: string;
}

const InviteCard: FC<InviteCardProps> = ({ inviteCode }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { data, loading } = useInviteData();
  const link = `${window.location.origin}/invite?inviteCode=${inviteCode}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    link
  )}&text=${t("airdrop-share-text")}&title=${t("share-title")}`;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.inviteCard}>
      <div className={styles.inviteHeader}>
        <span>{t("airdrop-earn-points-invite-title")}</span>
        <FaRegQuestionCircle size={16} color="#0198E9" />
      </div>

      <div className={styles.invite}>
        <div className={styles.invitationCode}>
          {t("airdrop-earn-invite-code-title")}
        </div>
        <div className={styles.invitationLink}>
          <span>{inviteCode}</span>
          <CopyToClipboard
            text={`${window.location.origin}/invite?inviteCode=${inviteCode}`}
          >
            <a target="_blank" href={shareUrl}>
              <img src="/link.svg" alt="link" className={styles.link} />
            </a>
          </CopyToClipboard>
        </div>
      </div>

      <div className={styles.inviteButtonBox}>
        <a target="_blank" href={shareUrl} className={styles.inviteButton}>
          {t("airdrop-earn-invite-code-title")}
        </a>
        <div className={styles.copy}>
          <CopyToClipboard text={inviteCode}>
            <img
              src="/copy.svg"
              alt="copy"
              onClick={() => {
                message.success(t("airdrop-earn-copied-success"));
              }}
            />
          </CopyToClipboard>
        </div>
      </div>

      <div className={styles.inviteStats}>
        <div className={styles.item}>
          <span>{t("airdrop-earn-invite-friends-number")}</span>
          <span>{data?.count}</span>
        </div>
        {/* TODO: get the real number */}
        {/* <div className={styles.item}>
          <span>{t("airdrop-earn-recharge-feedback")}</span>
          <span>100MB</span>
        </div> */}
        <div className={styles.item}>
          <span>{t("airdrop-earn-points")}</span>
          <span>{data?.integralTotal}</span>
        </div>
      </div>

      <div className={styles.invitedFriends}>
        <header className={styles.friendHeader}>
          <span>{t("airdrop-earn-invited-friends")}</span>
          <img
            src="/top_arrow.svg"
            alt="top arrow"
            className={`${styles.arrowIcon} ${
              isExpanded ? styles.expanded : ""
            }`}
            onClick={toggleExpanded}
          />
        </header>

        {isExpanded && (
          <div className={styles.recharge}>
            <div className={styles.rechargeHeader}>
              <span>{t("airdrop-earn-table-header-name")}</span>
              <span>{t("airdrop-earn-table-header-points")}</span>
              <span>{t("airdrop-earn-table-header-add-time")}</span>
            </div>
            <div className={styles.rechargeContent}>
              {loading ? (
                <DataLoading />
              ) : (
                <>
                  {data?.records?.length ? (
                    <>
                      {data?.records?.map((recharge, index) => (
                        <div
                          key={index + "_recharge_invite"}
                          className={styles.rechargeRow}
                        >
                          <span>{recharge.inviteeName}</span>
                          <span>{recharge.rewardIntegral}</span>
                          <span>
                            {t("airdrop-earn-invite-time-ago", {
                              month: getMonthsAgo(recharge.inviteTime),
                            })}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <NoData />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteCard;
