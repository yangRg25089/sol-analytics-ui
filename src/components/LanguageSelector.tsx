import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (key: string | number) => {
    if (typeof key === 'string' && ['en', 'zh', 'ja'].includes(key)) {
      i18n.changeLanguage(key);
      localStorage.setItem('preferredLanguage', key);
      document.documentElement.lang = key;
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm">
          {t(`language.${i18n.language}`)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Language selection" onAction={changeLanguage}>
        <DropdownItem key="en">{t('language.en')}</DropdownItem>
        <DropdownItem key="zh">{t('language.zh')}</DropdownItem>
        <DropdownItem key="ja">{t('language.ja')}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSelector;
