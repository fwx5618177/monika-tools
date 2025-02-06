import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../routes';
import styles from '../styles/pages/HomePage.module.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = routes.filter((route) => route.showInHome);

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1>Monika Tools</h1>
        <p>开发者工具集</p>
      </header>

      <div className={styles.menuGrid}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={styles.menuItem}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.description}>{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
