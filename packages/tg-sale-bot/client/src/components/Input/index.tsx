import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  name?: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  error?: string;
  disabled?: boolean; // 新增支持 disabled 属性
}

const Input: React.FC<InputProps> = ({
  name = "inviteCode",
  placeholder,
  type = "text",
  value,
  onChange,
  isInvalid = false,
  error,
  disabled = false, // 默认不禁用
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInvalid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  }, [isInvalid]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.box}>
      <div
        className={`${styles.inputContainer} ${
          isInvalid ? styles.invalid : ""
        } ${shake ? styles.shake : ""} ${disabled ? styles.disabled : ""}`} // 禁用状态的样式
      >
        {name === "username" ? (
          <FaUser className={styles.icon} />
        ) : (
          <img src="/lock.svg" className={styles.icon} alt="lock" />
        )}
        <input
          name={name}
          type={type === "password" && isOpen ? "text" : type}
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          ref={inputRef}
          disabled={disabled} // 根据传入的属性决定是否禁用
        />
        {type === "password" &&
          !disabled && ( // 密码输入框在禁用时不显示切换图标
            <div className={styles.eyeIcon} onClick={handleOpen}>
              {isOpen ? <FaEyeSlash /> : <FaEye />}
            </div>
          )}
      </div>
      <div className={styles.errorText}>{error}</div>
    </div>
  );
};

export default Input;
