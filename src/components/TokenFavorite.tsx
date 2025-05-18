import { Button } from '@nextui-org/react';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';

interface TokenFavoriteProps {
  tokenId: string;
  isFavorite: boolean;
  onToggleFavorite: (tokenId: string) => void;
}

export const TokenFavorite: React.FC<TokenFavoriteProps> = ({
  tokenId,
  isFavorite,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  const handleToggleFavorite = async () => {
    try {
      const endpoint = isFavorite ? 'unfavorite' : 'favorite';
      const response = await axios.post(
        `${API_BASE_URL}/api/tokens/${tokenId}/${endpoint}/`,
      );
      onToggleFavorite(tokenId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Button
      size="sm"
      color={isFavorite ? 'warning' : 'default'}
      variant={isFavorite ? 'solid' : 'bordered'}
      onPress={handleToggleFavorite}
    >
      {isFavorite ? t('token.favorite') : t('token.unfavorite')}
    </Button>
  );
};
