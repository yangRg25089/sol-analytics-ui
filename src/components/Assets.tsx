import { Card, CardBody, CardHeader, Chip, Image } from '@nextui-org/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  mockNFTs,
  mockPerformanceMetrics,
  mockTokenBalances,
} from '../mock/assetsData';
import { NFTMetadata, PerformanceMetrics, TokenBalance } from '../types/solana';
import { TokenFavorite } from './TokenFavorite';
import { TokenTransfer } from './TokenTransfer';

interface AssetsProps {
  walletAddress: string;
}

const Assets: React.FC<AssetsProps> = ({ walletAddress }) => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [performance] = useState<PerformanceMetrics | null>(
    mockPerformanceMetrics,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 使用假数据
    setTokens(mockTokenBalances);
    setNfts(mockNFTs);
    setLoading(false);
  }, [walletAddress]);

  const handleToggleFavorite = (tokenId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tokenId)) {
        newFavorites.delete(tokenId);
      } else {
        newFavorites.add(tokenId);
      }
      return newFavorites;
    });
  };

  const handleTransfer = async () => {
    // 模拟转账后的刷新
    setTokens(mockTokenBalances);
  };

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets: {error.message}</div>;

  const totalValue = tokens.reduce(
    (sum, token) =>
      sum + (token.amount * token.usdPrice) / Math.pow(10, token.decimals),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {performance && (
        <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center items-center gap-6 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xl">{t('assets.totalValue')}:</p>
                  <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <p>{t('assets.change24h')}:</p>
                    <Chip
                      color={
                        performance.valueChange24h > 0 ? 'success' : 'danger'
                      }
                    >
                      {performance.percentageChange24h.toFixed(2)}%
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>{t('assets.change7d')}:</p>
                    <Chip
                      color={
                        performance.valueChange7d > 0 ? 'success' : 'danger'
                      }
                    >
                      {performance.percentageChange7d.toFixed(2)}%
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Token List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-center w-full">
            {t('assets.tokens')}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            {tokens.length === 0 ? (
              <p className="text-center text-default-500">
                {t('assets.noAssets')}
              </p>
            ) : (
              <div className="w-full space-y-4">
                {tokens.map((token) => (
                  <motion.div
                    key={token.mint}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-default-100"
                  >
                    <div className="flex items-center gap-4">
                      {token.logoUrl && (
                        <Image
                          src={token.logoUrl}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-default-400">
                          {token.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {t('assets.total')}:{' '}
                          {(
                            token.amount / Math.pow(10, token.decimals)
                          ).toFixed(4)}
                        </p>
                        <p className="text-sm text-default-400">
                          {t('assets.value')}: $
                          {(
                            (token.usdPrice * token.amount) /
                            Math.pow(10, token.decimals)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <TokenFavorite
                          tokenId={token.mint}
                          isFavorite={favorites.has(token.mint)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                        <TokenTransfer
                          tokenId={token.mint}
                          balance={token.amount / Math.pow(10, token.decimals)}
                          onTransfer={handleTransfer}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* NFT Grid */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-center w-full">
            {t('assets.nfts')}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            {nfts.length === 0 ? (
              <p className="text-center text-default-500">
                {t('assets.noAssets')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {nfts.map((nft) => (
                  <Card key={nft.mint} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-default-100 flex items-center justify-center">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        className="max-w-full max-h-full object-contain"
                        fallbackSrc="https://via.placeholder.com/300x300?text=No+Image"
                        loading="lazy"
                        removeWrapper
                      />
                    </div>
                    <CardBody className="p-4">
                      <p className="font-medium truncate text-center">
                        {nft.name}
                      </p>
                      {nft.collection && (
                        <p className="text-sm text-default-400 truncate text-center">
                          {nft.collection}
                        </p>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Assets;
