import React, { FC } from "react";
import styles from "./index.module.scss";
import numeral from "numeral";

// Props interface definition
interface TopBuyProps {
  itemName: string;
  itemVolume: string;
  priceUSD: string | number;
  priceGold: string;
}

const TopBuy: FC<TopBuyProps> = ({
  itemName,
  itemVolume,
  priceUSD,
  priceGold,
}) => {
  const formattedUSD = numeral(priceUSD).format("0,0.0");
  const formattedGold = numeral(priceGold).format("0,0.0");

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <p className={styles.itemName}>{itemName}</p>
        <span className={styles.itemVolume}>{itemVolume || "0 MB"}</span>
      </div>
      <div className={styles.right}>
        <div className={styles.currency}>
          <img src="/dollar.svg" alt="dollar" />
          <span>${formattedUSD}</span>
        </div>
        <span className={styles.mention}>or</span>
        <div className={styles.currency}>
          <img src="/gold.svg" alt="gold" />
          <span>{formattedGold}</span>
        </div>
        <div className={styles.buy}>Buy</div>
      </div>
    </div>
  );
};

export default TopBuy;
