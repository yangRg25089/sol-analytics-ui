import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  User,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import Assets from './components/Assets';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import LanguageSelector from './components/LanguageSelector';
import { OAuthSuccess } from './components/OAuthSuccess';
import ThemeSelector from './components/ThemeSelector';
import { TokenManagement } from './components/TokenManagement';
import Transactions from './components/Transactions';
import { API_BASE_URL, SUPPORTED_LANGUAGES } from './config/constants';
import { useAuth } from './contexts/AuthContext';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  user_type: string;
}

const App: React.FC = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { authState, login } = useAuth();

  useEffect(() => {
    const setPreferredLanguage = () => {
      const preferredLanguage = localStorage.getItem('preferredLanguage');
      if (
        preferredLanguage &&
        SUPPORTED_LANGUAGES.includes(
          preferredLanguage as (typeof SUPPORTED_LANGUAGES)[number],
        )
      ) {
        i18n.changeLanguage(preferredLanguage);
      }
    };
    setPreferredLanguage();
  }, [i18n]);

  useEffect(() => {
    setIsAuthenticated(checkAuthStatus());
  }, []);

  const checkAuthStatus = () => {
    const storedUserInfo = localStorage.getItem('user_info');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    if (!storedUserInfo || !tokenExpiresAt) {
      return false;
    }
    const isExpired = Date.now() >= parseInt(tokenExpiresAt, 10);
    if (isExpired) {
      handleLogout();
      return false;
    }
    setUserInfo(JSON.parse(storedUserInfo));
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires_at');
    window.location.reload();
  };

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
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google/callback`,
        {
          code,
          state,
        },
      );
      // 处理登录成功
      console.log('Google auth success:', response.data);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full">
        <Navbar isBordered maxWidth="full" className="px-4">
          <NavbarBrand>
            <Link to="/">
              <h1 className="text-xl font-bold">{t('app.title')}</h1>
            </Link>
          </NavbarBrand>

          <div className="flex-1 flex justify-center">
            <NavbarContent className="hidden sm:flex gap-4">
              <NavbarItem>
                <Link to="/assets">{t('nav.assets')}</Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/transactions">{t('nav.transactions')}</Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/dashboard">{t('nav.dashboard')}</Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/token-management">{t('nav.tokenManagement')}</Link>
              </NavbarItem>
            </NavbarContent>
          </div>

          <div className="flex items-center gap-10 ml-auto">
            <ThemeSelector />
            <LanguageSelector />
            {!isAuthenticated ? (
              <Button
                color="primary"
                onPress={login}
                className="bg-gradient-to-tr from-primary-500 to-secondary-500"
              >
                {t('auth.loginWithGoogle')}
              </Button>
            ) : (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: userInfo?.avatar_url,
                    }}
                    className="transition-transform"
                    description={userInfo?.email}
                    name={userInfo?.name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Info">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">{t('auth.signedInAs')}</p>
                    <p className="font-semibold">{userInfo?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="role">
                    <p className="font-semibold">
                      {t('auth.role')}: {userInfo?.role}
                    </p>
                  </DropdownItem>
                  <DropdownItem key="type">
                    <p className="font-semibold">
                      {t('auth.type')}: {userInfo?.user_type}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    {t('auth.logout')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>

          <NavbarMenu>
            <NavbarMenuItem>
              <Link to="/dashboard">{t('nav.dashboard')}</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link to="/transactions">{t('nav.transactions')}</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link to="/assets">{t('nav.assets')}</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link to="/token-management">{t('nav.tokenManagement')}</Link>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </div>
      <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/transactions"
            element={<Transactions walletAddress="demo-wallet" />}
          />
          <Route
            path="/assets"
            element={<Assets walletAddress="demo-wallet" />}
          />
          <Route path="/token-management" element={<TokenManagement />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
