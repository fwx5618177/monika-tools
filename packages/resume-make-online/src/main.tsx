import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { MessageProvider } from '@/providers/MessageProvider';

import App from './App';
import i18n from './i18n';

import '@/styles/global.scss';

import '@minerva/lib-core/dist/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <HelmetProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </HelmetProvider>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
);
