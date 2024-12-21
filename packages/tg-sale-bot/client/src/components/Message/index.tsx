import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface MessageProps {
  message: {
    id: number;
    type: "error" | "success" | "warn" | "info";
    content: string;
    position: "top-left" | "top-right" | "center";
    duration: number;
  };
  onComplete: (id: number) => void;
}

const Message: React.FC<MessageProps> = ({ message, onComplete }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete(message.id);
    }, message.duration);

    const intervalDuration = message.duration / 100;
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, intervalDuration);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [message.duration, message.id, onComplete]);

  const messageTypeClass = `${styles.message} ${styles[message.type]}`;

  return (
    <div className={`${messageTypeClass}`}>
      <div className={styles.content}>{message.content}</div>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Message;
