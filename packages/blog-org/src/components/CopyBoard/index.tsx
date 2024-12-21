import ClipboardJS from "clipboard";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { FcOk, FcHighPriority } from "react-icons/fc";
import { message } from "antd";

type CopyBoardProps = {
  text: string;
  onCopy?: (value: string) => void;
  children: React.ReactNode | string;
};

const CopyBoard: FC<CopyBoardProps> = ({ text, onCopy, children }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = () => {
    const clipboard = new ClipboardJS(btnRef.current as any, {
      text: () => text,
    });

    clipboard.on("success", () => {
      onCopy?.(text);

      message.success("Copied!");
      clipboard.destroy();
    });

    clipboard.on("error", () => {
      message.error("Copied failed!");
      clipboard.destroy();
    });
  };

  useEffect(() => {
    btnRef.current?.click();
  }, []);

  return (
    <button className={styles.copied} ref={btnRef} onClick={handleCopy}>
      {children}
    </button>
  );
};

export default CopyBoard;
