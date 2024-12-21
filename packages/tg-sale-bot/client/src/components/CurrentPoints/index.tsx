import React, { FC, useEffect, useRef, useState } from "react";
import numeral from "numeral";
import styles from "./index.module.scss";

interface CurrentPointsProps {
  balance?: string;
  points?: string;
  title?: boolean;
  charge?: boolean;
  type?: "balance" | "points";
}

const CurrentPoints: FC<CurrentPointsProps> = ({
  balance,
  points,
  type,
  title = false,
  charge = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prevBalance, setPrevBalance] = useState(Number(balance));

  useEffect(() => {
    const currentBalance = Number(balance);
    const difference = currentBalance - prevBalance;

    // 检查积分是否有变化
    if (difference > 0) {
      let displayedCount = 0;

      // 使用 setInterval 逐个展示
      const intervalId = setInterval(() => {
        if (displayedCount < difference) {
          // 创建 `+1` 效果
          const effectElement = document.createElement("div");
          effectElement.className = styles.effect;
          effectElement.innerText = `+1`;

          if (containerRef.current) {
            containerRef.current.appendChild(effectElement);

            // 随机设置 `+1` 的位置
            const containerRect = containerRef.current.getBoundingClientRect();
            const randomX =
              Math.random() * (containerRect.width - 40) + containerRect.left;
            const randomY =
              Math.random() * (containerRect.height - 40) + containerRect.top;

            effectElement.style.left = `${randomX - containerRect.left}px`;
            effectElement.style.top = `${randomY - containerRect.top}px`;
          }

          // 延迟移除效果
          setTimeout(() => {
            effectElement.classList.add(styles.fadeOut);
          }, 1000);

          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.removeChild(effectElement);
            }
          }, 1500);

          displayedCount++;
        } else {
          clearInterval(intervalId);
        }
      }, 300); // 每300ms展示一个

      // 更新 prevBalance
      setPrevBalance(currentBalance);
    }
  }, [balance, prevBalance]);

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.points} ${charge ? styles.charge : ""}`}
      >
        {title && <span className={styles.current}>Your current points</span>}
        <div className={styles.exactPoint}>
          <img
            src={
              type === "balance"
                ? "/dollar.svg"
                : charge
                ? "/gold.svg"
                : "/coin.svg"
            }
            alt="coin"
            className={styles.coinIcon}
          />
          <span className={styles.pointsValue}>
            {numeral(balance).format("0,0")}
          </span>
        </div>

        {charge && (
          <div className={styles.exactPoint}>
            <img src="/add_coin.svg" alt="Plus" className={styles.coinIcon} />
            <span className={styles.pointsValue}>
              {numeral(points).format("0,0")}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentPoints;
