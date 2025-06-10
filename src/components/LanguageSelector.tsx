import React from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '../config/constants';
import CommonSelector from './CommonSelector';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('preferredLanguage', value);
  };

  return (
    <CommonSelector
      options={SUPPORTED_LANGUAGES.map((lang) => ({
        label: t(`language.${lang}`),
        value: lang,
      }))}
      value={i18n.language}
      onChange={handleLanguageChange}
      translationKey="language.title"
      showLabel={false}
    />
  );
};

export default LanguageSelector;
