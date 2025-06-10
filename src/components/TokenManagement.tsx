import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';

interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  ownerId: string;
  createdAt: string;
  status: 'active' | 'paused' | 'frozen';
  holders: number;
  marketCap: number;
  price: number;
  change24h: number;
  decimals: number;
  description?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  logo?: string;
}

// 测试数据
const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Solana Token',
    symbol: 'SOLT',
    totalSupply: 1000000,
    ownerId: 'owner1',
    createdAt: '2024-03-15T10:00:00Z',
    status: 'active',
    holders: 1500,
    marketCap: 5000000,
    price: 5.0,
    change24h: 2.5,
    decimals: 9,
    description: 'The official token of Solana ecosystem',
    website: 'https://solana.com',
    socialLinks: {
      twitter: 'https://twitter.com/solana',
      telegram: 'https://t.me/solana',
    },
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    id: '2',
    name: 'Test Token',
    symbol: 'TEST',
    totalSupply: 500000,
    ownerId: 'owner1',
    createdAt: '2024-03-14T15:30:00Z',
    status: 'active',
    holders: 800,
    marketCap: 2500000,
    price: 5.0,
    change24h: -1.2,
    decimals: 6,
    description: 'A test token for development',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  {
    id: '3',
    name: 'Utility Token',
    symbol: 'UTIL',
    totalSupply: 2000000,
    ownerId: 'owner1',
    createdAt: '2024-03-13T09:15:00Z',
    status: 'paused',
    holders: 2000,
    marketCap: 10000000,
    price: 5.0,
    change24h: 0.8,
    decimals: 8,
    description: 'Utility token for platform services',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
  },
];

export const TokenManagement: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [newToken, setNewToken] = useState({
    name: '',
    symbol: '',
    totalSupply: 0,
    decimals: 9,
    description: '',
    website: '',
  });
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
  const [isTokenDetailsModalOpen, setIsTokenDetailsModalOpen] = useState(false);

  // 模拟加载数据
  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        // 在实际环境中，这里应该是API调用
        // const response = await axios.get(`${API_BASE_URL}/api/tokens/`);
        // setTokens(response.data);

        // 使用测试数据
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTokens(mockTokens);
      } catch (error) {
        setError('Failed to load tokens');
        console.error('Error loading tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  const handleCreateToken = async () => {
    try {
      // 在实际环境中，这里应该是API调用
      // const response = await axios.post(`${API_BASE_URL}/api/tokens/`, newToken);
      // const token = response.data;

      // 模拟API响应
      const mockResponse: Token = {
        ...newToken,
        id: Date.now().toString(),
        ownerId: 'owner1',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        holders: 0,
        marketCap: 0,
        price: 0,
        change24h: 0,
      };

      setTokens([...tokens, mockResponse]);
      onClose();
      setNewToken({
        name: '',
        symbol: '',
        totalSupply: 0,
        decimals: 9,
        description: '',
        website: '',
      });
    } catch (error) {
      console.error('Error creating token:', error);
    }
  };

  const handleMintToken = async (tokenId: string, amount: number) => {
    try {
      // 在实际环境中，这里应该是API调用
      // const response = await axios.post(`${API_BASE_URL}/api/tokens/${tokenId}/manage/`, { action: 'mint', amount });
      // const updatedToken = response.data;

      // 模拟更新
      const updatedTokens = tokens.map((token) => {
        if (token.id === tokenId) {
          return {
            ...token,
            totalSupply: token.totalSupply + amount,
          };
        }
        return token;
      });

      setTokens(updatedTokens);
      setIsMintModalOpen(false);
      setMintAmount('');
    } catch (error) {
      console.error('Error minting token:', error);
    }
  };

  const handleBurnToken = async (tokenId: string, amount: number) => {
    try {
      // 在实际环境中，这里应该是API调用
      // const response = await axios.post(`${API_BASE_URL}/api/tokens/${tokenId}/manage/`, { action: 'burn', amount });
      // const updatedToken = response.data;

      // 模拟更新
      const updatedTokens = tokens.map((token) => {
        if (token.id === tokenId) {
          return {
            ...token,
            totalSupply: Math.max(0, token.totalSupply - amount),
          };
        }
        return token;
      });

      setTokens(updatedTokens);
      setIsBurnModalOpen(false);
      setBurnAmount('');
    } catch (error) {
      console.error('Error burning token:', error);
    }
  };

  const handlePauseToken = async (tokenId: string) => {
    try {
      const updatedTokens = tokens.map((token) => {
        if (token.id === tokenId) {
          return {
            ...token,
            status:
              token.status === 'active'
                ? ('paused' as const)
                : ('active' as const),
          };
        }
        return token;
      });

      setTokens(updatedTokens);
    } catch (error) {
      console.error('Error pausing token:', error);
    }
  };

  const handleFreezeToken = async (tokenId: string) => {
    try {
      const updatedTokens = tokens.map((token) => {
        if (token.id === tokenId) {
          return {
            ...token,
            status: 'frozen' as const,
          };
        }
        return token;
      });

      setTokens(updatedTokens);
    } catch (error) {
      console.error('Error freezing token:', error);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'frozen':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* 添加标题卡片 */}
      <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-6 w-full">
              <div className="flex items-center gap-2">
                <p className="text-xl">{t('tokenManagement.totalTokens')}:</p>
                <p className="text-3xl font-bold">{tokens.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p>{t('tokenManagement.totalMarketCap')}:</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(
                      tokens.reduce((sum, token) => sum + token.marketCap, 0),
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p>{t('tokenManagement.totalHolders')}:</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(
                      tokens.reduce((sum, token) => sum + token.holders, 0),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('tokenManagement.title')}</h1>
        <Button color="primary" onPress={onOpen}>
          {t('tokenManagement.createToken')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-danger text-center p-4">{error}</div>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <Card key={token.id} className="p-4">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-default-100 flex items-center justify-center">
                      {token.logo ? (
                        <img
                          src={token.logo}
                          alt={token.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-default-400">
                          {token.symbol.slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.name')}
                        </p>
                        <p className="font-medium">{token.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.symbol')}
                        </p>
                        <p className="font-medium">{token.symbol}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.totalSupply')}
                        </p>
                        <p className="font-medium">
                          {token.totalSupply.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.holders')}
                        </p>
                        <p className="font-medium">
                          {token.holders.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.marketCap')}
                        </p>
                        <p className="font-medium">
                          {formatNumber(token.marketCap)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.price')}
                        </p>
                        <p className="font-medium">
                          {formatNumber(token.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.change24h')}
                        </p>
                        <p
                          className={`font-medium ${token.change24h >= 0 ? 'text-success' : 'text-danger'}`}
                        >
                          {formatPercentage(token.change24h)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          {t('tokenManagement.status')}
                        </p>
                        <Chip color={getStatusColor(token.status)}>
                          {t(`tokenManagement.statusTypes.${token.status}`)}
                        </Chip>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-default-200">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => {
                            setSelectedToken(token);
                            setIsMintModalOpen(true);
                          }}
                        >
                          {t('tokenManagement.mint')}
                        </Button>
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          onPress={() => {
                            setSelectedToken(token);
                            setIsBurnModalOpen(true);
                          }}
                        >
                          {t('tokenManagement.burn')}
                        </Button>
                        <Button
                          size="sm"
                          color="secondary"
                          variant="flat"
                          onPress={() => handlePauseToken(token.id)}
                        >
                          {token.status === 'active'
                            ? t('tokenManagement.pause')
                            : t('tokenManagement.activate')}
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleFreezeToken(token.id)}
                        >
                          {t('tokenManagement.freeze')}
                        </Button>
                        <Button
                          size="sm"
                          color="default"
                          variant="flat"
                          onPress={() => {
                            setSelectedToken(token);
                            setIsTokenDetailsModalOpen(true);
                          }}
                        >
                          {t('tokenManagement.details')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('tokenManagement.createNewToken')}</ModalHeader>
          <ModalBody>
            <Input
              label={t('tokenManagement.name')}
              value={newToken.name}
              onChange={(e) =>
                setNewToken({ ...newToken, name: e.target.value })
              }
              placeholder={t('tokenManagement.name')}
            />
            <Input
              label={t('tokenManagement.symbol')}
              value={newToken.symbol}
              onChange={(e) =>
                setNewToken({ ...newToken, symbol: e.target.value })
              }
              placeholder={t('tokenManagement.symbol')}
            />
            <Input
              type="number"
              label={t('tokenManagement.totalSupply')}
              value={newToken.totalSupply.toString()}
              onChange={(e) =>
                setNewToken({
                  ...newToken,
                  totalSupply: parseInt(e.target.value) || 0,
                })
              }
              placeholder={t('tokenManagement.totalSupply')}
            />
            <Input
              type="number"
              label={t('tokenManagement.decimals')}
              value={newToken.decimals.toString()}
              onChange={(e) =>
                setNewToken({
                  ...newToken,
                  decimals: parseInt(e.target.value) || 9,
                })
              }
              placeholder={t('tokenManagement.decimals')}
            />
            <Input
              label={t('tokenManagement.description')}
              value={newToken.description}
              onChange={(e) =>
                setNewToken({ ...newToken, description: e.target.value })
              }
              placeholder={t('tokenManagement.description')}
            />
            <Input
              label={t('tokenManagement.website')}
              value={newToken.website}
              onChange={(e) =>
                setNewToken({ ...newToken, website: e.target.value })
              }
              placeholder={t('tokenManagement.website')}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onPress={handleCreateToken}
              isDisabled={
                !newToken.name || !newToken.symbol || newToken.totalSupply <= 0
              }
            >
              {t('common.create')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isMintModalOpen} onClose={() => setIsMintModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t('tokenManagement.mintTokens')}</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              label={t('tokenManagement.enterAmount')}
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder={t('tokenManagement.enterAmount')}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsMintModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onPress={() =>
                selectedToken &&
                handleMintToken(selectedToken.id, parseInt(mintAmount) || 0)
              }
              isDisabled={!mintAmount || parseInt(mintAmount) <= 0}
            >
              {t('tokenManagement.mint')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isBurnModalOpen} onClose={() => setIsBurnModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t('tokenManagement.burnTokens')}</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              label={t('tokenManagement.enterAmount')}
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder={t('tokenManagement.enterAmount')}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsBurnModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onPress={() =>
                selectedToken &&
                handleBurnToken(selectedToken.id, parseInt(burnAmount) || 0)
              }
              isDisabled={!burnAmount || parseInt(burnAmount) <= 0}
            >
              {t('tokenManagement.burn')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isTokenDetailsModalOpen}
        onClose={() => setIsTokenDetailsModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>{t('tokenManagement.tokenDetails')}</ModalHeader>
          <ModalBody>
            {selectedToken && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedToken.name}
                  </h3>
                  <p className="text-sm text-default-500">
                    {selectedToken.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-500">
                    {t('tokenManagement.description')}
                  </p>
                  <p>
                    {selectedToken.description ||
                      t('tokenManagement.noDescription')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-500">
                    {t('tokenManagement.website')}
                  </p>
                  <a
                    href={selectedToken.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    {selectedToken.website || t('tokenManagement.noWebsite')}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-default-500">
                    {t('tokenManagement.socialLinks')}
                  </p>
                  <div className="flex gap-2">
                    {selectedToken.socialLinks?.twitter && (
                      <a
                        href={selectedToken.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        Twitter
                      </a>
                    )}
                    {selectedToken.socialLinks?.telegram && (
                      <a
                        href={selectedToken.socialLinks.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        Telegram
                      </a>
                    )}
                    {selectedToken.socialLinks?.discord && (
                      <a
                        href={selectedToken.socialLinks.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        Discord
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-default-500">
                    {t('tokenManagement.tokenInfo')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm">
                        {t('tokenManagement.totalSupply')}
                      </p>
                      <p>{selectedToken.totalSupply.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm">{t('tokenManagement.decimals')}</p>
                      <p>{selectedToken.decimals}</p>
                    </div>
                    <div>
                      <p className="text-sm">{t('tokenManagement.holders')}</p>
                      <p>{selectedToken.holders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm">
                        {t('tokenManagement.marketCap')}
                      </p>
                      <p>{formatNumber(selectedToken.marketCap)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => setIsTokenDetailsModalOpen(false)}
            >
              {t('tokenManagement.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
