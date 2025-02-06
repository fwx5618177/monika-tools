import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import styles from '../styles/pages/SettingsPage.module.scss';
import classNames from 'classnames';

const SettingsPage: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2>主题设置</h2>
        <div className={styles.themeGrid}>
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={classNames(styles.themeButton, {
                [styles.active]: currentTheme.id === theme.id,
              })}
              onClick={() => setTheme(theme.id)}
            >
              <div className={styles.themePreview}>
                <div
                  className={styles.themeColor}
                  style={{ background: theme.colors.primary }}
                />
              </div>
              <span className={styles.themeName}>{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>全局设置</h2>
        <div className={styles.settingsList}>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <span>自动保存</span>
              <input type="checkbox" defaultChecked />
            </label>
            <p className={styles.settingDesc}>自动保存所有的更改</p>
          </div>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              <span>显示请求日志</span>
              <input type="checkbox" defaultChecked />
            </label>
            <p className={styles.settingDesc}>在控制台显示请求日志</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>关于</h2>
        <div className={styles.about}>
          <p>Monika Tools v1.0.0</p>
          <p>一个强大的API调试工具，帮助你更高效地开发和测试API。</p>
          <div className={styles.links}>
            <a
              href="https://github.com/yourusername/monika-tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              文档
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              反馈
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
