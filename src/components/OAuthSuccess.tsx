import { Card, CardBody, Spinner } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { API_BASE_URL } from '../config/constants';

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  user_type: string;
  tokens: {
    access: string;
    refresh: string;
    access_expires_in: number;
  };
}

export const OAuthSuccess: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    function updateUserInterface(userData: UserData) {
      // 更新用户名显示
      const userNameElement = document.querySelector<HTMLElement>('.user-name');
      if (userNameElement) {
        userNameElement.textContent = userData.name;
      }

      // 更新头像显示
      const avatarElement =
        document.querySelector<HTMLImageElement>('.user-avatar');
      if (avatarElement) {
        avatarElement.src = userData.avatar_url;
        avatarElement.alt = userData.name;
      }
    }

    function handleError(errorCode: string, errorMessage?: string) {
      // 显示错误消息
      const errorElement =
        document.querySelector<HTMLElement>('.error-message');
      if (errorElement) {
        errorElement.textContent =
          errorMessage || 'An error occurred during authentication';
        errorElement.style.display = 'block';
      }

      // 重定向到登录页面
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }

    const handleOAuthSuccess = async () => {
      try {
        // 在 oauth-success 页面
        const params = new URLSearchParams(location.search);
        const encodedData = params.get('data');
        const encodedError = params.get('error');

        if (encodedData) {
          try {
            // 解码用户信息
            const userData = JSON.parse(atob(encodedData)) as UserData;
            console.log('userData', userData);

            // 存储 token
            localStorage.setItem('access_token', userData.tokens.access);

            // 获取用户信息
            const response = await axios.get(`${API_BASE_URL}/api/auth/me/`, {
              headers: {
                Authorization: `Bearer ${userData.tokens.access}`,
                'Content-Type': 'application/json',
              },
            });
            console.log('response', response);

            // 存储用户信息
            localStorage.setItem(
              'user_info',
              JSON.stringify({
                id: response.id,
                email: response.email,
                name: response.name,
                avatar_url: response.avatar_url,
                role: response.role,
                user_type: response.user_type,
              }),
            );

            // 存储 token 过期时间
            localStorage.setItem(
              'token_expires_at',
              String(Date.now() + userData.tokens.access_expires_in * 1000),
            );

            // 更新 UI 显示用户信息
            updateUserInterface(userData);

            // 重定向到主页或仪表板
            window.location.href = '/';
          } catch (error) {
            console.error('Error processing user data:', error);
            handleError('data_processing_error', 'Failed to process user data');
          }
        } else if (encodedError) {
          try {
            // 解码错误信息
            const errorData = JSON.parse(atob(encodedError));
            handleError(errorData.code, errorData.message);
          } catch (error) {
            console.error('Error processing error data:', error);
            handleError(
              'error_processing_error',
              'Failed to process error data',
            );
          }
        }
      } catch (error) {
        console.error('OAuth error:', error);
        handleError('oauth_error', 'Authentication failed');
      }
    };

    handleOAuthSuccess();
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardBody className="flex flex-col items-center justify-center p-8">
          <Spinner size="lg" />
          <p className="mt-4 text-center text-default-500">
            {t('auth.processing')}
          </p>
          <p className="error-message mt-4 text-center text-danger hidden"></p>
        </CardBody>
      </Card>
    </div>
  );
};
