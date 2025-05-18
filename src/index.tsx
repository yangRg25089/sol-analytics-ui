import './i18n/config'; // 确保这行在 App 导入之前
import './index.css';

import { NextUIProvider } from '@nextui-org/react';
import { Chart, registerables } from 'chart.js';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';

Chart.register(...registerables);

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/*" element={<App />} />),
  {
    basename: '/',
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </NextUIProvider>
    </NextThemesProvider>
  </React.StrictMode>,
);
