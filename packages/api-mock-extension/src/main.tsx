import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup';
import './popup/styles/global.scss';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
