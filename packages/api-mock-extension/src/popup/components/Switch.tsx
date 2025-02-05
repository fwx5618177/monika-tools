import React from 'react';
import styles from '@/popup/styles/Switch.module.scss';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className={styles.switch}>
      {label && <span className={styles.label}>{label}</span>}
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};
