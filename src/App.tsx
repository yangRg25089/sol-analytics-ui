import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { SUPPORTED_LANGUAGES } from './config/constants';
import Dashboard from './components/Dashboard';
import LanguageSelector from './components/LanguageSelector';
import Assets from './components/Assets';
import Transactions from './components/Transactions';
import Home from './components/Home';
import axios from 'axios';
import { API_BASE_URL } from './config/constants';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const setPreferredLanguage = () => {
      const preferredLanguage = localStorage.getItem('preferredLanguage');
      if (preferredLanguage && SUPPORTED_LANGUAGES.includes(preferredLanguage as typeof SUPPORTED_LANGUAGES[number])) {
        i18n.changeLanguage(preferredLanguage);
      }
    };
    setPreferredLanguage();
  }, [i18n]);

  useEffect(() => {
    // 处理 Google OAuth 回调
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      // 验证 state 并处理授权码
      handleGoogleCallback(code, state);
    }
  }, [location]);

  const handleGoogleCallback = async (code: string, state: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google/callback`, {
        code,
        state
      });
      // 处理登录成功
      console.log('Google auth success:', response.data);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <Link to="/">
            <h1 className="text-xl font-bold">SolPT Analytics</h1>
          </Link>
        </NavbarBrand>
        <NavbarContent>
          <NavbarItem>
            <Link to="/dashboard">Dashboard</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/transactions">Transactions</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/assets">Assets</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent>
          <NavbarItem>
            <LanguageSelector />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions walletAddress="demo-wallet" />} />
        <Route path="/assets" element={<Assets walletAddress="demo-wallet" />} />
      </Routes>
    </>
  );
};

export default App;