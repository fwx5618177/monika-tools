import React from "react";
import styles from "./index.module.scss";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "warning" | "error"; // 类型
  size?: "small" | "medium" | "large" | "xlarge"; // 大小
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  variant = "primary",
  size = "medium",
}) => {
  const variantClass = styles[variant];
  const sizeClass = styles[size];

  return (
    <button
      className={`${styles.customButton} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
