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
            <header className={styles.header}>
              <h1>API Mock</h1>
              <Switch
                checked={config.enabled}
                onChange={toggleEnabled}
                label="启用模拟"
              />
            </header>

            <main className={styles.main}>
              <div className={styles.actions}>
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
            </main>
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
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Monika Tools</div>
        <ul className={styles.menu}>
          {FEATURES.map((feature) => (
            <li key={feature.id}>
              <a
                href="#"
                className={activeFeature === feature.id ? styles.active : ''}
                onClick={(e) => {
                  e.preventDefault();
                  if (!feature.disabled) {
                    setActiveFeature(feature.id);
                  }
                }}
                style={{
                  opacity: feature.disabled ? 0.5 : 1,
                  cursor: feature.disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span className={styles.icon}>{feature.icon}</span>
                {feature.name}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default Popup;
