import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const NavBar: FC<{
  fixed?: boolean;
}> = ({ fixed = false }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>("home");

  useEffect(() => {
    const path = location.pathname.split("/")[1]; // 获取路径中的第一部分
    if (path) {
      setSelected(path);
    } else {
      setSelected("home");
    }
  }, []);

  const handleSelect = (item: string) => {
    setSelected(item);
  };

  return (
    <nav
      className={styles.navbar}
      style={{
        position: fixed ? "fixed" : "relative",
        bottom: fixed ? 10 : undefined,
      }}
    >
      <a
        href="/home"
        className={`${styles.navItem} ${
          selected === "home" ? styles.selected : ""
        }`}
        onClick={() => handleSelect("home")}
      >
        <img
          src={selected === "home" ? "/tab_home_active.svg" : "tab_home.svg"}
          alt="home"
          width={30}
          height={30}
        />
        <span>{t("home")}</span>
      </a>
      <a
        href="/esim"
        className={`${styles.navItem} ${
          selected === "esim" ? styles.selected : ""
        }`}
        onClick={() => handleSelect("esim")}
      >
        <img
          src={selected === "esim" ? "/tab_esim_active.svg" : "tab_esim.svg"}
          alt="esim"
          width={30}
          height={30}
        />
        <span>{t("esim")}</span>
      </a>
      <a
        href="/earn"
        className={`${styles.navItem} ${styles.earn} ${
          selected === "earn" ? styles.selected : ""
        }`}
        onClick={() => handleSelect("earn")}
      >
        <div className={styles.earnIcon}>
          <img src="/currency.svg" alt="Earn" className={styles.earnImg} />
          <div className={styles.circle}></div>
        </div>
        <span>Earn</span>
      </a>
      <a
        href="/map"
        className={`${styles.navItem} ${
          selected === "packages" ? styles.selected : ""
        }`}
        onClick={() => handleSelect("map")}
      >
        <img
          src={selected === "map" ? "/tab_task_active.svg" : "tab_task.svg"}
          alt="map"
          width={30}
          height={30}
        />
        <span>{t("packages-title")}</span>
      </a>
      <a
        href="/mine"
        className={`${styles.navItem} ${
          selected === "mine" ? styles.selected : ""
        }`}
        onClick={() => handleSelect("mine")}
      >
        <img
          src={selected === "mine" ? "/tab_mine_active.svg" : "tab_mine.svg"}
          alt="mine"
          width={30}
          height={30}
        />
        <span>Mine</span>
      </a>
    </nav>
  );
};

export default NavBar;
