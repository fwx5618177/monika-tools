import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import '@styles/global.scss';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { BrowserRouter } from 'react-router-dom';
import { MessageProvider } from '@components/MessageProvider';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AuthProvider } from '@providers/AuthProvider';
import { Provider } from 'react-redux';
import store, { persistor } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';

const manifest =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/tonconnect-manifest.dev.json'
    : 'https://tg-sale-bot.vercel.app/tonconnect-manifest.prod.json';

const lng = localStorage.getItem('language') || 'en';
i18n.changeLanguage(lng);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WebAppProvider
    options={{
      smoothButtonsTransition: true,
    }}
  >
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <HelmetProvider>
          <TonConnectUIProvider
            manifestUrl={manifest}
            actionsConfiguration={{
              twaReturnUrl: 'https://t.me/MaronaresBot/start',
            }}
          >
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AuthProvider>
                  <MessageProvider>
                    <App />
                  </MessageProvider>
                </AuthProvider>
              </PersistGate>
            </Provider>
          </TonConnectUIProvider>
        </HelmetProvider>
      </BrowserRouter>
    </I18nextProvider>
  </WebAppProvider>
);
