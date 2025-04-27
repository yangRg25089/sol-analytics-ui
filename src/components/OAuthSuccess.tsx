import { Card, CardBody, Spinner } from '@nextui-org/react';
import { addScaleCorrector } from 'framer-motion';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

export const OAuthSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // 获取 URL 参数
        const token = new URLSearchParams(location.search).get('token');

        if (token) {
          // 调用后端 API 验证授权码
          const response = await fetch('/api/auth/google_login', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Backend API Response:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          });

          if (response.ok) {
            const data = await response.json();
            console.log('OAuth Success - User Data:', data);
            // 登录成功，跳转到仪表板
            // navigate('/dashboard');
          } else {
            const errorData = await response.json().catch(() => null);
            console.error('OAuth verification failed:', errorData);
            // navigate('/');
          }
        } else {
          console.error('Missing OAuth parameters:', { token });
          //   navigate('/');
        }
      } catch (error) {
        console.error('OAuth error:', error);
        // navigate('/');
      }
    };

    handleOAuthSuccess();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardBody className="flex flex-col items-center justify-center p-8">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">{t('auth.verifying')}</p>
        </CardBody>
      </Card>
    </div>
  );
};
