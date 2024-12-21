import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import MessagePortal from '@/components/MessagePortal';
import { constants } from '@/constants/variable';
import {
  MessageContextType,
  MessagePosition,
  MessageProps,
  MessageType,
} from '@/types/message';

const MessageContext = createContext<MessageContextType | undefined>(undefined);

let messageId = 0;
let addMessage: (
  type: MessageType,
  content: string,
  position?: MessagePosition,
  duration?: number
) => void;

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const removeMessage = useCallback((id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  }, []);

  const showMessage = useCallback(
    (
      type: MessageType,
      content: string,
      position: MessagePosition = 'top-right',
      duration: number = 8000
    ) => {
      const id = messageId++;
      const newMessage = { id, type, content, position, duration };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    []
  );

  // 将 showMessage 赋值给全局的 addMessage，确保全局调用有效
  addMessage = showMessage;

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      <MessagePortal messages={messages} removeMessage={removeMessage} />
    </MessageContext.Provider>
  );
};

// 定义 useMessage 钩子，允许在 React 组件中访问上下文
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

// 直接暴露全局 message 对象，像 antd 的 message.error 一样调用
export const message = {
  success: (
    content: string,
    position: MessagePosition = 'top-right',
    duration: number = constants.successMessageDuration
  ) => addMessage && addMessage('success', content, position, duration),
  error: (
    content: string,
    position: MessagePosition = 'top-right',
    duration: number = constants.failMessageDuration
  ) => addMessage && addMessage('error', content, position, duration),
  warn: (
    content: string,
    position: MessagePosition = 'top-right',
    duration: number = constants.warnMessageDuration
  ) => addMessage && addMessage('warn', content, position, duration),
  info: (
    content: string,
    position: MessagePosition = 'top-right',
    duration: number = constants.infoMessageDuration
  ) => addMessage && addMessage('info', content, position, duration),
};
