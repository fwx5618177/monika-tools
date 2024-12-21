import React from "react";
import styles from "./button.module.scss";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  variant = "primary",
  size = "medium",
  ariaLabel,
  disabled = false,
}) => {
  const isDisabled = disabled || variant === "disabled";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`${styles.customButton} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
