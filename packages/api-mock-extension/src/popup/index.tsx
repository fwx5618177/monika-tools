import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { routes } from './routes';
import styles from './styles/Popup.module.scss';

const ViewModeSwitch: React.FC = () => {
  const [isPanel, setIsPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 检查当前是否在侧边栏模式
    const checkViewMode = async () => {
      try {
        const sidePanel = await chrome.sidePanel.getOptions({});
        setIsPanel(!!sidePanel?.enabled);
      } catch (error) {
        console.error('Failed to get side panel options:', error);
        setIsPanel(false);
      }
    };
    checkViewMode();
  }, []);

  const toggleViewMode = async () => {
    try {
      if (isPanel) {
        // 从侧边栏切换到弹窗
        await chrome.runtime.sendMessage({
          type: 'TOGGLE_VIEW_MODE',
          payload: { mode: 'popup' },
        });
        setIsPanel(false);
      } else {
        // 从弹窗切换到侧边栏
        const [currentWindow] = await chrome.windows.getAll({
          windowTypes: ['normal'],
          populate: false,
        });
        if (!currentWindow?.id) {
          console.error('No valid window found');
          return;
        }
        await chrome.runtime.sendMessage({
          type: 'TOGGLE_VIEW_MODE',
          payload: {
            mode: 'panel',
            windowId: currentWindow.id,
          },
        });
        setIsPanel(true);
        window.close(); // 只在切换到侧边栏时关闭弹窗
      }
    } catch (error) {
      console.error('Failed to toggle view mode:', error);
    }
  };

  return (
    <>
      <div className={styles.viewSwitch}>
        <button
          className={styles.switchButton}
          onClick={toggleViewMode}
          title={isPanel ? '切换到弹窗模式' : '切换到侧边栏模式'}
        >
          {isPanel ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
        {location.pathname !== '/' && (
          <button
            className={styles.backButton}
            onClick={() => navigate('/')}
            title="返回首页"
          >
            <FaArrowLeft />
          </button>
        )}
      </div>
    </>
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
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Popup;
