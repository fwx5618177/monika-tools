import React, { FC, useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./index.module.scss";

interface ModalProps {
  width?: string | number;
  height?: string | number;
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: "bottom" | "center";
}

const Modal: FC<ModalProps> = ({
  width,
  height,
  visible,
  onClose,
  title,
  children,
  type = "center",
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // 处理 Esc 按键关闭
  const handleEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      triggerClose();
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleEsc, visible]);

  // 触发关闭
  const triggerClose = () => {
    setIsClosing(true);
  };

  // 动画结束后关闭
  const handleTransitionEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  // 点击背景关闭 Modal
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      triggerClose();
    }
  };

  // 如果不显示且没有关闭动画则不渲染
  if (!visible && !isClosing) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${
        type === "bottom" ? styles.bottom : ""
      } ${isClosing ? styles.slideDown : ""}`}
      onClick={handleOverlayClick} // 点击背景关闭
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className={`${styles.modalContainer} ${
          type === "bottom" ? styles.slideUp : ""
        }`}
        style={{
          width: width,
          maxWidth: width,
          height: height,
        }}
        onClick={(e) => e.stopPropagation()} // 阻止点击内容区触发关闭
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <FaTimes className={styles.closeButton} onClick={triggerClose} />
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
