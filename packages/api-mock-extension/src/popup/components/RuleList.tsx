import React from 'react';
import type { MockRule } from '../../background/interfaces/types';
import styles from '@/popup/styles/RuleList.module.scss';

interface RuleListProps {
  rules: MockRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
}) => {
  return (
    <div className={styles.rulesList}>
      {rules.map((rule) => (
        <div key={rule.id} className={styles.ruleItem}>
          <div className={styles.ruleHeader}>
            <span
              className={`${styles.method} ${styles[rule.method.toLowerCase()]}`}
            >
              {rule.method}
            </span>
            <span className={styles.url}>{rule.url}</span>
            <div className={styles.actions}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => onToggleRule(rule.id)}
                />
                <span className={styles.slider}></span>
              </label>
              <button
                className={styles.deleteButton}
                onClick={() => onDeleteRule(rule.id)}
                title="Delete rule"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.ruleDetails}>
            <div className={styles.statusCode}>
              Status: <span>{rule.statusCode}</span>
            </div>
            <div className={styles.delay}>
              Delay: <span>{rule.delay || 0}ms</span>
            </div>
            <div className={styles.response}>
              <div className={styles.responseHeader}>Response:</div>
              <pre>{JSON.stringify(rule.response, null, 2)}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
