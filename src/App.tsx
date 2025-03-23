import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { SUPPORTED_LANGUAGES } from './config/constants';
import Dashboard from './components/Dashboard';
import LanguageSelector from './components/LanguageSelector';
import Assets from './components/Assets';
import Transactions from './components/Transactions';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0];
    // 获取存储的首选语言
    const storedLang = localStorage.getItem('preferredLanguage');
    
    // 确定使用哪种语言
    const defaultLang = storedLang || 
      (SUPPORTED_LANGUAGES.includes(browserLang as any) ? browserLang : 'en');
    
    i18n.changeLanguage(defaultLang);
  }, [i18n]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <div className="min-h-screen bg-gradient-to-br from-background to-default-100">
          {/* Navbar */}
          <Navbar 
            maxWidth="xl" 
            position="sticky" 
            className="bg-background/70 backdrop-blur-md"
          >
            <NavbarBrand>
              <p className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {i18n.t('dashboard.title')}
              </p>
            </NavbarBrand>
            <NavbarContent justify="end">
              <LanguageSelector />
            </NavbarContent>
          </Navbar>

          {/* Main Content */}
          <main className="container mx-auto px-6 py-8">
            <div className="space-y-8">
              {/* Wallet Input Section */}
              <section>
                <Dashboard />
              </section>

              {/* Overview Statistics */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">{i18n.t('transactions.title')}</h2>
                  <Transactions walletAddress="demo-wallet" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">{i18n.t('assets.title')}</h2>
                  <Assets walletAddress="demo-wallet" />
                </div>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 px-6 border-t border-divider mt-8">
            <div className="container mx-auto flex justify-between items-center">
              <p className="text-default-500">© 2024 Sol Analytics</p>
              <LanguageSelector />
            </div>
          </footer>
        </div>
      </NextUIProvider>
    </NextThemesProvider>
  );
};

export default App;
