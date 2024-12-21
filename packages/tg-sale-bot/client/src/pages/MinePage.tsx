import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "@styles/mine.module.scss";
import SettingInfo from "@components/SettingInfo";
import Modal from "@components/Modal";
import NavBar from "@components/navbar";
import { useAuth } from "@providers/AuthProvider";

const MinePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { i18n, t } = useTranslation();
  const [isSettingModalVisible, setSettingModalVisible] = useState(false);
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);

  // 跳转到历史页面
  const handleHistory = () => {
    navigate("/history");
  };

  // 切换语言设置
  const handleSetting = () => {
    setSettingModalVisible(true);
  };

  // 联系客户服务
  const handleService = () => {
    setServiceModalVisible(true);
  };

  // 退出登录
  const handleExit = () => {
    logout();
  };

  // 关闭模态框
  const closeModal = () => {
    setSettingModalVisible(false);
    setServiceModalVisible(false);
  };

  // 切换语言
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    closeModal();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("title")}</h2>

      <SettingInfo />

      <div className={styles.settings}>
        <div className={styles.setItem} onClick={handleHistory}>
          <div className={styles.left}>
            <img src="/history.svg" alt="history" className={styles.icon} />
            <span>{t("order-history")}</span>
          </div>
          <img
            src="/right_arrow.svg"
            className={styles.icon}
            alt="right arrow"
          />
        </div>

        <div className={styles.setItem} onClick={handleSetting}>
          <div className={styles.left}>
            <img src="/settings.svg" alt="settings" className={styles.icon} />
            <span>{t("Toggle language settings")}</span>
          </div>
          <img
            src="/right_arrow.svg"
            className={styles.icon}
            alt="right arrow"
          />
        </div>

        <div className={styles.setItem} onClick={handleService}>
          <div className={styles.left}>
            <img src="/service.svg" alt="service" className={styles.icon} />
            <span>{t("Contact customer service")}</span>
          </div>
          <img
            src="/right_arrow.svg"
            className={styles.icon}
            alt="right arrow"
          />
        </div>

        <div className={styles.setItem} onClick={handleExit}>
          <div className={styles.left}>
            <img src="/settings.svg" alt="settings" className={styles.icon} />
            <span>{t("exit")}</span>
          </div>
        </div>
      </div>

      <NavBar fixed />

      {/* 语言设置模态框 */}
      <Modal
        visible={isSettingModalVisible}
        onClose={closeModal}
        title={t("Language Settings")}
      >
        <div className={styles.modalContent}>
          <p>{t("Select your preferred language")}:</p>
          <div className={styles.languageList}>
            <span onClick={() => changeLanguage("en")}>
              {t("setting-english")}
            </span>
            <span onClick={() => changeLanguage("zh")}>
              {t("setting-chinese")}
            </span>
            <span onClick={() => changeLanguage("tw")}>
              {t("setting-chinese-traditional")}
            </span>
            <span onClick={() => changeLanguage("es")}>
              {t("setting-espanol")}
            </span>
            <span onClick={() => changeLanguage("jp")}>
              {t("setting-japanese")}
            </span>
          </div>
        </div>
      </Modal>

      {/* 客户服务模态框 */}
      <Modal
        visible={isServiceModalVisible}
        onClose={closeModal}
        title={t("Customer Service")}
      >
        <div className={styles.modalContent}>
          <p>{t("If you need help, please contact us at")}:</p>
          <p>{t("support-email")}</p>
        </div>
      </Modal>
    </div>
  );
};

export default MinePage;
