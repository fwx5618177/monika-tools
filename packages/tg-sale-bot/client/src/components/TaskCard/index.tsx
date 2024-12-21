import React, { FC, useState } from "react";
import { FaRegQuestionCircle, FaSpinner } from "react-icons/fa";
import Modal from "@components/Modal";
import styles from "./index.module.scss";
import CurrentPoints from "@components/CurrentPoints";
import { useTranslation } from "react-i18next";
import { useEarnIntergral } from "@hooks/useEarnIntergral";
import { message } from "@components/MessageProvider";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { constants } from "@constants/variable";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  updateDailyTask,
  updateFollowTask,
} from "@store/store";
import TaskStatus from "@components/TaskStatus";
import moment from "moment";
import { isSameUtcNaturalDay } from "@utils/isSameUtcNaturalDay";

export interface TaskCardProps {
  showModal: (value: boolean) => void;
}

const TaskCard: FC<TaskCardProps> = ({ showModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { auth } = useSelector((state: RootState) => state);
  const { isLoading, checkInIntegral, handleCheckIn, handleFollowPoints } =
    useEarnIntergral();
  const [showDailyCheckModal, setShowDailyCheckModal] =
    useState<boolean>(false);
  const [showTwitterModal, setShowTwitterModal] = useState<boolean>(false);
  const telegram = useWebApp();

  const handleDailyCheckOut = () => {
    setShowDailyCheckModal(!showDailyCheckModal);
    showModal(false);
  };

  const handleCheckout = async () => {
    setShowDailyCheckModal(false);
    showModal(true);

    try {
      const result = await handleCheckIn();
      if (result?.checkInSucceed) {
        message.success(t("check-in-success"));
        dispatch(updateDailyTask(moment().toString()));
      } else {
        message.error(t("check-in-fail"));
      }
    } catch (error) {
      message.error(t("check-in-fail"));
    }
  };

  const handleTwitter = async () => {
    window.open(constants.twitterUrl, "_blank");

    console.log("telegram:", telegram);

    // 显示主按钮，用户返回 Mini App 后更新状态
    // telegram.MainButton.setText(t("airdrop-twitter-return-message"));
    // telegram.MainButton.show();

    setShowTwitterModal(false);
    showModal(true);

    try {
      const result = await handleFollowPoints();
      if (result?.isVerified) {
        message.success(t("follow-success"));
        dispatch(updateFollowTask(true));
      } else {
        message.error(t("check-in-fail"));
      }
    } catch (error) {
      message.error(t("check-in-fail"));
    }
  };

  return (
    <div className={styles.tasksCard}>
      <div className={styles.tasksHeader}>
        <span>{t("airdrop-daily-mission")}</span>
        <FaRegQuestionCircle size={16} color="#0198E9" />
      </div>

      <div className={styles.taskName}>
        <img src="/celebrate.svg" alt="celebrate" />
        <span>{t("airdrop-daily-task")}</span>
        <FaRegQuestionCircle size={16} color="#0198E9" />
      </div>

      <div className={styles.taskItem}>
        <div className={styles.itemTitle} onClick={handleDailyCheckOut}>
          <img src="/date.svg" alt="date" />
          {t("airdrop-daily-task-check-in")}
          <TaskStatus
            status={isSameUtcNaturalDay(auth?.userInfo?.lastCheckInDate)}
          />
        </div>

        <div>
          <img src="/gold.svg" alt="coin" />
          <span>
            {t("earn-points", {
              points: checkInIntegral.CheckInIntegral,
            })}
          </span>
        </div>
      </div>

      <div className={styles.taskName}>
        <img src="/others_task.svg" alt="celebrate" />
        <span>{t("airdrop-daily-other-task")}</span>
      </div>

      <div className={styles.taskItem}>
        <div
          className={styles.itemTitle}
          onClick={() => {
            setShowTwitterModal(true);
            showModal(false);
          }}
        >
          <img src="/x.svg" alt="x" />
          <span>
            {t("airdrop-follow-platform", {
              platform: "x",
            })}
          </span>

          <TaskStatus status={!!auth?.userInfo?.twitterFollowed} />
        </div>

        <div>
          <img src="/gold.svg" alt="coin" />
          <span>
            {t("earn-points", {
              points: checkInIntegral.FollowTwitter,
            })}
          </span>
        </div>
      </div>

      {/* 签到 */}
      <Modal
        width={600}
        visible={showDailyCheckModal}
        onClose={() => {
          setShowDailyCheckModal(false);
          showModal(true);
        }}
        title={t("airdrop-daily-checkout-title")}
        type="center"
      >
        <div className={styles.box}>
          <CurrentPoints balance={checkInIntegral.CheckInIntegral} />
          {isLoading ? (
            <FaSpinner />
          ) : (
            <button className={styles.submitButton} onClick={handleCheckout}>
              {t("airdrop-daily-task-check-in")}
            </button>
          )}
        </div>
      </Modal>

      {/* 关注 */}
      <Modal
        width={600}
        visible={showTwitterModal}
        onClose={() => {
          setShowTwitterModal(false);
          showModal(true);
        }}
        title={t("airdrop-twitter-title")}
        type="center"
      >
        <div className={styles.box}>
          <CurrentPoints balance={checkInIntegral.FollowTwitter} />
          {isLoading ? (
            <FaSpinner />
          ) : (
            <button className={styles.submitButton} onClick={handleTwitter}>
              {t("follow")}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TaskCard;
