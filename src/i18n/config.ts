import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en';
import ja from './translations/ja';
import zh from './translations/zh';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
    },
    lng: 'en', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    // 初始化完成
    console.log('i18n initialized');
  });

export default i18n;
