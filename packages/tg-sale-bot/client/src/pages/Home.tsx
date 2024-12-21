import React, { useState, useEffect } from "react";
import styles from "@styles/home.module.scss";
import SeoPage from "@components/SeoPage";
import NavBar from "@components/navbar";
import PersonalInfo from "@components/PersonalInfo";
import CurrentPoints from "@components/CurrentPoints";
import { useTranslation } from "react-i18next";
import TrainImage from "@components/TrainImage";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import PointsManager from "@components/PointsManager";
import Modal from "@components/Modal";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gainedPoints, setGainedPoints] = useState(0);

  // TODO: change it to real
  // 模拟用户离开和返回时计算获得的积分
  useEffect(() => {
    const lastVisitTime = localStorage.getItem("lastVisitTime");
    const currentVisitTime = new Date().getTime();

    if (lastVisitTime) {
      // 假设每分钟获得5积分
      const timeDifference =
        (currentVisitTime - parseInt(lastVisitTime)) / 6000;
      const pointsGained = Math.floor(timeDifference * 5);
      setGainedPoints(pointsGained);

      // 显示 modal
      setIsModalVisible(true);
    }

    // 更新最后访问时间
    localStorage.setItem("lastVisitTime", currentVisitTime.toString());
  }, []);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <SeoPage
        title="Home - My Website"
        description="Welcome to my website. This is the home page where you can find the latest updates."
        keywords="home, my website, updates"
        imageUrl="https://my-website.com/images/home-page.jpg"
      />

      <h1 className={styles.title}>{t("title")}</h1>

      <PersonalInfo />

      <CurrentPoints balance={String(userInfo?.integral)} />

      <PointsManager />
      <TrainImage />

      <NavBar fixed />

      <Modal
        width={"80%"}
        height={100}
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={t("home-points-modal-title")}
        type="center"
      >
        <p>
          {t("home-points-modal-content", {
            points: gainedPoints,
          })}
        </p>
      </Modal>
    </div>
  );
};

export default Home;
