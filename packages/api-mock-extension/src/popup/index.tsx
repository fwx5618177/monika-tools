import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { routes } from './routes';
import styles from './styles/Popup.module.scss';

const ViewModeSwitch: React.FC = () => {
  const [isPanel, setIsPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查当前是否在侧边栏模式
    const mediaQuery = window.matchMedia('(view-type: side-panel)');
    setIsPanel(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsPanel(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleBack = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const toggleViewMode = async () => {
    try {
      const currentWindow = await chrome.windows.getCurrent();
      await chrome.runtime.sendMessage({
        type: 'TOGGLE_VIEW_MODE',
        payload: {
          mode: isPanel ? 'popup' : 'panel',
          windowId: currentWindow.id,
        },
      });
    } catch (error) {
      console.error('Failed to toggle view mode:', error);
    }
  };

  return (
    <header className={styles.header}>
      {location.pathname !== '/' && (
        <button className={styles.backButton} onClick={handleBack}>
          ← 返回
        </button>
      )}
      <div className={styles.viewSwitch}>
        <button className={styles.switchButton} onClick={toggleViewMode}>
          {isPanel ? '切换到弹窗模式' : '切换到侧边栏模式'}
        </button>
      </div>
    </header>
  );
};

const Popup: React.FC = () => {
  return (
    <BrowserRouter>
      <div className={styles.popup}>
        <ViewModeSwitch />
        <main className={styles.main}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Popup;
