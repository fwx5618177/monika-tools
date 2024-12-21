import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { constants } from "@constants/variable";
import { useDispatch, useSelector } from "react-redux";
import { RootState, updateUserInfo } from "@store/store";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";

const TrainImage: React.FC = () => {
  const webApp = useWebApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(constants.timeLimit);
  const [isDisabled, setIsDisabled] = useState(false);

  // 点击事件处理
  const handleClick = useCallback(() => {
    if (isDisabled) return; // 如果禁用，直接返回

    // 更新点击次数
    setClickCount((prev) => prev + 1);

    // H5 震动效果
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    } else {
      webApp?.HapticFeedback?.impactOccurred("medium");
    }

    // 积分 + points 的动画效果
    const effectElement = document.createElement("div");
    effectElement.className = styles.effect;
    effectElement.innerText = `+${constants.points}`;

    if (containerRef.current) {
      containerRef.current.appendChild(effectElement);

      // 随机设置 + points 的位置
      const containerRect = containerRef.current.getBoundingClientRect();
      const randomX =
        Math.random() * (containerRect.width - 40) + containerRect.left; // 减去40是为了防止溢出容器边界
      const randomY =
        Math.random() * (containerRect.height - 40) + containerRect.top;

      effectElement.style.left = `${randomX - containerRect.left}px`;
      effectElement.style.top = `${randomY - containerRect.top}px`;
    }

    setTimeout(() => {
      effectElement.classList.add(styles.fadeOut);
    }, 1000);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.removeChild(effectElement);
      }
    }, 1500);

    // 添加点击放大缩小的特效
    const trainImage = document.querySelector(`.${styles.trainImage}`);
    if (trainImage) {
      trainImage.classList.add(styles.clickedEffect);
      setTimeout(() => {
        trainImage.classList.remove(styles.clickedEffect);
      }, 100);
    }

    // 更新积分
    if (userInfo) {
      const updatedIntegral = userInfo.integral + constants.points;
      dispatch(updateUserInfo({ ...userInfo, integral: updatedIntegral }));
    }
  }, [isDisabled, userInfo, webApp?.HapticFeedback, dispatch]);

  // 计时器逻辑，限制点击次数
  useEffect(() => {
    if (clickCount >= constants.maxClicks) {
      setIsDisabled(true); // 达到最大点击次数时禁用点击
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsDisabled(false); // 启用点击
          setClickCount(0); // 重置点击次数
          return constants.timeLimit; // 重置计时
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clickCount]);

  // 自动增加积分效果
  useEffect(() => {
    const autoAddInterval = setInterval(() => {
      if (userInfo && !isDisabled) {
        const updatedIntegral = userInfo.integral + constants.points;
        dispatch(updateUserInfo({ ...userInfo, integral: updatedIntegral }));

        // 自动显示积分飘动效果
        const effectElement = document.createElement("div");
        effectElement.className = styles.effect;
        effectElement.innerText = `+${constants.points}`;

        if (containerRef.current) {
          containerRef.current.appendChild(effectElement);

          const containerRect = containerRef.current.getBoundingClientRect();
          const randomX =
            Math.random() * (containerRect.width - 40) + containerRect.left;
          const randomY =
            Math.random() * (containerRect.height - 40) + containerRect.top;

          effectElement.style.left = `${randomX - containerRect.left}px`;
          effectElement.style.top = `${randomY - containerRect.top}px`;
        }

        setTimeout(() => {
          effectElement.classList.add(styles.fadeOut);
        }, 1000);

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.removeChild(effectElement);
          }
        }, 1500);
      }
    }, constants.autoAddPointsInterval);

    return () => clearInterval(autoAddInterval);
  }, [dispatch, userInfo, isDisabled]);

  return (
    <>
      <div ref={containerRef} className={styles.trainContainer}>
        <span className={styles.counter}>
          {constants.maxClicks - clickCount}/{timeLeft} Sec
        </span>
        <div className={styles.outerCircle} onClick={handleClick}>
          <img
            src={isDisabled ? "/train_shader.png" : "/train.svg"}
            alt="Train"
            className={styles.trainImage}
          />
        </div>
      </div>
    </>
  );
};

export default TrainImage;
