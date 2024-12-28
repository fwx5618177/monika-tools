export interface AvatarProps {
  src?: string;
  name?: string;
  isSquare?: boolean;
  className?: string;
  stacked?: boolean;
}

export interface AvatarGroupProps {
  count?: number;
  className?: string;
  children?: React.ReactNode;
}
