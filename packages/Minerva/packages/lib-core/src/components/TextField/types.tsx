export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  borderColor?: string;
  hideBorder?: boolean;
  minimal?: boolean;
  borderRadius?: string;
  name?: string;
  type?: string;
  showCharCount?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  width?: string;
  disabled?: boolean;
}
