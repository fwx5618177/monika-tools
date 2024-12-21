// src/components/PointsManager.tsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, updateStatus } from "@store/store";
import { submitPoints } from "@store/submitPoints";
import { constants } from "@constants/variable";

const PointsManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, status } = useSelector((state: RootState) => state.auth);

  // 使用 useRef 存储上一次的积分，避免不必要的 re-render
  const previousIntegralRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userInfo) return;

    // 初始化 previousIntegralRef
    if (previousIntegralRef.current === null) {
      previousIntegralRef.current = userInfo.integral;
    }

    // 定时检查积分是否发生变化
    const intervalId = setInterval(() => {
      console.log("Checking points...", status);

      if (
        status === "idle" &&
        previousIntegralRef.current !== userInfo.integral
      ) {
        dispatch(submitPoints()); // 提交积分
        previousIntegralRef.current = userInfo.integral; // 更新 ref 中的积分
      }
    }, constants.submitPointsInterval);

    return () => clearInterval(intervalId); // 清除定时器
  }, [dispatch, status, userInfo]);

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      const resetTimeout = setTimeout(() => {
        dispatch(updateStatus("idle")); // 重置状态为 "idle"
      }, constants.submitPointsInterval);

      return () => clearTimeout(resetTimeout);
    }
  }, [status, dispatch]);

  return null;
};

export default PointsManager;
