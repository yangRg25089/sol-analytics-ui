import React from 'react';
import { useTranslation } from 'react-i18next';

import CommonSelector from './CommonSelector';

const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
  { label: 'Purple', value: 'purple' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Pink', value: 'pink' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Red', value: 'red' },
  { label: 'Orange', value: 'orange' },
];

const ThemeSelector: React.FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = React.useState('system');

  const handleThemeChange = (value: string) => {
    setTheme(value);
    document.documentElement.classList.remove(
      'light',
      'dark',
      'purple',
      'blue',
      'green',
      'pink',
      'yellow',
      'red',
      'orange',
    );

    if (value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(value);
    }
  };

  return (
    <CommonSelector
      options={themes.map((theme) => ({
        label: t(`theme.${theme.value}`),
        value: theme.value,
      }))}
      value={theme}
      onChange={handleThemeChange}
      translationKey="theme.title"
      showLabel={false}
    />
  );
};

export default ThemeSelector;
