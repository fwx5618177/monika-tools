export type MessageType = 'error' | 'success' | 'warn' | 'info';
export type MessagePosition = 'top-left' | 'top-right' | 'center';

export interface MessageProps {
  id: number;
  type: MessageType;
  content: string;
  position: MessagePosition;
  duration: number;
}

export interface MessageContextType {
  showMessage: (
    type: MessageType,
    content: string,
    position?: MessagePosition,
    duration?: number
  ) => void;
}
