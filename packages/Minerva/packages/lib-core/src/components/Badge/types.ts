export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  size?: "small" | "medium" | "large";
  className?: string;
  ariaLabel?: string; // 添加 ariaLabel 属性
  bgColor?: string; // 添加自定义背景颜色属性
  textColor?: string; // 添加自定义文字颜色属性
}
