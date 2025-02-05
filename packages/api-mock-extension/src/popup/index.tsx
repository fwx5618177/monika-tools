import React, { useState } from 'react';
import { RuleForm } from './components/RuleForm';
import { RuleList } from './components/RuleList';
import { Switch } from './components/Switch';
import { useMockRules } from './hooks/useMockRules';
import styles from './styles/Popup.module.scss';

interface Feature {
  id: string;
  name: string;
  icon: string;
  disabled?: boolean;
}

const FEATURES: Feature[] = [
  {
    id: 'api-mock',
    name: 'API Mock',
    icon: '🚀',
    disabled: false,
  },
  {
    id: 'request-log',
    name: '请求日志',
    icon: '📊',
    disabled: true,
  },
  {
    id: 'settings',
    name: '设置',
    icon: '⚙️',
    disabled: true,
  },
];

const Popup: React.FC = () => {
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
  const [activeFeature, setActiveFeature] = useState<string>(FEATURES[0].id);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const renderContent = () => {
    switch (activeFeature) {
      case 'api-mock':
        return (
          <>
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
              <div className={styles.empty}>
                暂无规则。点击"添加规则"创建新规则。
              </div>
            )}
          </>
        );

      case 'request-log':
        return (
          <div className={styles.empty}>请求日志功能即将上线，敬请期待...</div>
        );

      case 'settings':
        return (
          <div className={styles.empty}>设置功能即将上线，敬请期待...</div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.popup}>
      <nav className={styles.nav}>
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            className={`${styles.navButton} ${
              activeFeature === feature.id ? styles.active : ''
            }`}
            onClick={() => !feature.disabled && setActiveFeature(feature.id)}
            disabled={feature.disabled}
          >
            <span className={styles.icon}>{feature.icon}</span>
            {feature.name}
          </button>
        ))}
      </nav>

      <main className={styles.main}>{renderContent()}</main>
    </div>
  );
};

export default Popup;
