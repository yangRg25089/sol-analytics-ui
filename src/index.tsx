import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import App from './App';
import './i18n/config';  // 确保这行在 App 导入之前
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <NextUIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
