import React, { FC } from "react";
import styles from "@styles/topup.module.scss";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import TopBuy from "@components/TopBuy";

const list = [
  {
    itemName: "Data Only",
    itemVolume: "1.3 GB",
    priceUSD: 9.9,
    priceGold: "999,99",
  },
  {
    itemName: "Voice + Data",
    itemVolume: "256 MB",
    priceUSD: 19.9,
    priceGold: "1,499,99",
  },
  {
    itemName: "Unlimited Plan",
    itemVolume: "1 GB",
    priceUSD: 29.9,
    priceGold: "2,199,99",
  },
  {
    itemName: "Voice + Data",
    itemVolume: "256 MB",
    priceUSD: 19.9,
    priceGold: "1,499,99",
  },
  {
    itemName: "Unlimited Plan",
    itemVolume: "1 GB",
    priceUSD: 29.9,
    priceGold: "2,199,99",
  },
];

const TopUp: FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backIcon} onClick={handleBackClick}>
          <FaChevronLeft />
        </div>

        <h2 className={styles.title}>Top Up</h2>
      </div>

      <div className={styles.info}>
        <div className={styles.topInfo}>
          <div className={styles.content}>
            <p>You are topping up eSIM1</p>
            <p>SIM Card number：+12309988777</p>
          </div>

          <div className={styles.toggle}>Toggle</div>
        </div>

        <div className={styles.section}>
          <img src="/filter.svg" alt="filter" className={styles.filter} />
          <div className={styles.list}>
            {list.map((item, index) => (
              <TopBuy
                key={index}
                itemName={item.itemName}
                itemVolume={item.itemVolume}
                priceUSD={item.priceUSD}
                priceGold={item.priceGold}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
