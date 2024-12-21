import React from 'react';
import ReactDOM from 'react-dom';
import Message from '@/components/Message';
import { MessageProps } from '@/types/message';
import styles from './index.module.scss';

interface MessagePortalProps {
  messages: MessageProps[];
  removeMessage: (id: number) => void;
}

const MessagePortal: React.FC<MessagePortalProps> = ({
  messages,
  removeMessage,
}) => {
  return ReactDOM.createPortal(
    ['top-left', 'top-right', 'center'].map((pos) => (
      <div key={pos} className={`${styles.messageContainer} ${styles[pos]}`}>
        {messages
          .filter((msg) => msg.position === pos)
          .map((msg) => (
            <Message key={msg.id} message={msg} onComplete={removeMessage} />
          ))}
      </div>
    )),
    document.body
  );
};

export default MessagePortal;
