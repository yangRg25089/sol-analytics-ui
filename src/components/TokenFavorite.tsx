import { Button } from '@nextui-org/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
      const response = await fetch(`/api/tokens/${tokenId}/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onToggleFavorite(tokenId);
      }
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
