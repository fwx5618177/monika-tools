import React, { useState } from 'react';
import IntroAnimation from './components/IntroAnimation';
import IDEContent from './components/IDEContent';

const App: React.FC = () => {
  const [showIDE, setShowIDE] = useState(false);

  const handleAnimationEnd = () => {
    setShowIDE(true); // 动画结束后显示 IDE 内容
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      {showIDE ? <IDEContent /> : <IntroAnimation onEnd={handleAnimationEnd} />}
    </div>
  );
};

export default App;