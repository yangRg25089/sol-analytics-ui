import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (key: string | number) => {
    // 验证语言代码的类型安全性
    if (typeof key === 'string' && ['en', 'zh', 'ja'].includes(key)) {
      i18n.changeLanguage(key);
      localStorage.setItem('preferredLanguage', key);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm">
          {t(`language.${i18n.language}`)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Language selection" 
        onAction={changeLanguage}
      >
        <DropdownItem key="en">{t('language.en')}</DropdownItem>
        <DropdownItem key="zh">{t('language.zh')}</DropdownItem>
        <DropdownItem key="ja">{t('language.ja')}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSelector;
