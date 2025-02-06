import React, { useState } from 'react';
import { RuleForm } from '../components/RuleForm';
import { RuleList } from '../components/RuleList';
import { Switch } from '../components/Switch';
import { useMockRules } from '../hooks/useMockRules';
import styles from '../styles/pages/ApiMockPage.module.scss';

export const ApiMockPage: React.FC = () => {
  const {
    config,
    loading,
    error,
    toggleEnabled,
    addRule,
    deleteRule,
    toggleRule,
  } = useMockRules();
  const [isAddingRule, setIsAddingRule] = useState(false);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Switch
          checked={config.enabled}
          onChange={toggleEnabled}
          label="启用模拟"
        />
        <button
          className={styles.addButton}
          onClick={() => setIsAddingRule(true)}
        >
          添加规则
        </button>
      </div>

      {isAddingRule && (
        <div className={styles.formWrapper}>
          <RuleForm
            onSubmit={(rule) => {
              addRule(rule);
              setIsAddingRule(false);
            }}
            onCancel={() => setIsAddingRule(false)}
          />
        </div>
      )}

      {config.rules.length > 0 ? (
        <RuleList
          rules={config.rules}
          onToggleRule={toggleRule}
          onDeleteRule={deleteRule}
        />
      ) : (
        <div className={styles.empty}>暂无规则。点击"添加规则"创建新规则。</div>
      )}
    </div>
  );
};
