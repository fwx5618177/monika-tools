import { FC, MouseEventHandler, ReactNode } from 'react';
import styles from './index.module.scss';

const Button: FC<{
  children: ReactNode;
  onClick: MouseEventHandler<HTMLDivElement> | (() => void) | undefined;
}> = ({ children, onClick }) => {
  return (
    <div className={styles.button} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;
