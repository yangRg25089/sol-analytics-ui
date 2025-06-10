import { Select, SelectItem } from '@nextui-org/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
}

interface CommonSelectorProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  translationKey: string;
  className?: string;
  showLabel?: boolean;
}

const CommonSelector: React.FC<CommonSelectorProps> = ({
  options,
  value,
  onChange,
  translationKey,
  className = 'w-32',
  showLabel = false,
}) => {
  const { t } = useTranslation();

  return (
    <Select
      size="sm"
      label={showLabel ? t(translationKey) : undefined}
      selectedKeys={[value]}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      classNames={{
        label: 'text-default-500',
        value: 'text-default-900',
        trigger: 'bg-default-100/50',
      }}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            {options.find((opt) => opt.value === item.key)?.label}
          </div>
        ));
      }}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CommonSelector;
