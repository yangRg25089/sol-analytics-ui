import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, Image, Chip, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { TokenBalance, NFTMetadata, PerformanceMetrics } from '../types/solana';
import { useTranslation } from 'react-i18next';
import { TokenFavorite } from './TokenFavorite';
import { TokenTransfer } from './TokenTransfer';

interface AssetsProps {
  walletAddress: string;
}

const Assets: React.FC<AssetsProps> = ({ walletAddress }) => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [performance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [tokensRes, nftsRes, favoritesRes] = await Promise.all([
          axios.get(`/api/tokens/${walletAddress}`),
          axios.get(`/api/nfts/${walletAddress}`),
          axios.get('/api/tokens/favorites')
        ]);
        setTokens(tokensRes.data);
        setNfts(nftsRes.data);
        setFavorites(new Set(favoritesRes.data.map((f: any) => f.tokenId)));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchAssets();
    }
  }, [walletAddress]);

  const handleToggleFavorite = (tokenId: string) => {
    setFavorites(prev => {
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
    // 重新获取代币列表以更新余额
    try {
      const tokensRes = await axios.get(`/api/tokens/${walletAddress}`);
      setTokens(tokensRes.data);
    } catch (err) {
      console.error('Error refreshing tokens:', err);
    }
  };

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets: {error.message}</div>;

  const totalValue = tokens.reduce((sum, token) => 
    sum + (token.amount * token.usdPrice / Math.pow(10, token.decimals)), 0
  );

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {performance && (
        <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
          <CardBody className="flex flex-row justify-between">
            <div>
              <p className="text-xl">Total Value</p>
              <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p>24h Change</p>
                <Chip color={performance.valueChange24h > 0 ? "success" : "danger"}>
                  {performance.percentageChange24h.toFixed(2)}%
                </Chip>
              </div>
              <div>
                <p>7d Change</p>
                <Chip color={performance.valueChange7d > 0 ? "success" : "danger"}>
                  {performance.percentageChange7d.toFixed(2)}%
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Token List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">{t('assets.tokens')}</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {tokens.map(token => (
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
                    <p className="text-sm text-default-400">{token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {(token.amount / Math.pow(10, token.decimals)).toFixed(4)}
                    </p>
                    <p className="text-sm text-default-400">
                      ${(token.usdPrice * token.amount / Math.pow(10, token.decimals)).toFixed(2)}
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
        </CardBody>
      </Card>

      {/* NFT Grid */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">{t('assets.nfts')}</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nfts.map(nft => (
              <Card key={nft.mint}>
                <Image
                  src={nft.image}
                  alt={nft.name}
                  className="object-cover h-48 w-full"
                />
                <CardBody>
                  <p className="font-medium">{nft.name}</p>
                  {nft.collection && (
                    <p className="text-sm text-default-400">{nft.collection}</p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Assets;
