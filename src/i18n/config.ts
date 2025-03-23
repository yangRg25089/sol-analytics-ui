import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import zh from './translations/zh';
import ja from './translations/ja';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
