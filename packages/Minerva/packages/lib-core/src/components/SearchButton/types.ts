export interface SearchButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  shape?: "circle" | "square" | "rounded";
  variant?: "primary" | "warning" | "error" | "success" | "info";
  animation?: "none" | "expand" | "shrink" | "shake";
  size?: "small" | "medium" | "large" | "xlarge";
  iconColor?: string;
  bgColor?: string;
  children?: React.ReactNode;
}
