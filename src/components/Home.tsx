import {
  Card,
  CardBody,
  Chip,
  Image,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';
import { TokenMarketData } from '../types/market';

const Home: React.FC = () => {
  const [tokens, setTokens] = useState<TokenMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'JPY' | 'CNY'>('USD');
  const tableRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const currencies = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'JPY (¥)', value: 'JPY' },
    { label: 'CNY (¥)', value: 'CNY' },
  ];

  const fetchTokens = useCallback(
    async (offset: number = 0) => {
      if (loading) return;
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/api/tokens/market-list/`,
          {
            offset,
            limit: 10,
            vs_currency: currency,
          },
        );
        const newTokens: TokenMarketData[] = response.data.tokens || [];
        if (newTokens.length === 0) {
          setHasMore(false);
        } else {
          setTokens((prev) =>
            offset === 0 ? newTokens : [...prev, ...newTokens],
          );
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    },
    [currency],
  );

  useEffect(() => {
    setHasMore(true);
    setTokens([]);
    fetchTokens(0);
  }, [currency, fetchTokens]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollThreshold = 50;

      if (
        scrollHeight - scrollTop - clientHeight < scrollThreshold &&
        !loading &&
        hasMore
      ) {
        fetchTokens(tokens.length);
      }
    },
    [loading, hasMore, tokens.length, fetchTokens],
  );

  const formatPrice = (price: number) => {
    if (isNaN(price)) return '-';
    switch (currency) {
      case 'USD':
        return `$${price.toFixed(2)}`;
      case 'JPY':
        return `¥${price.toFixed(0)}`;
      case 'CNY':
        return `¥${price.toFixed(2)}`;
      default:
        return price.toString();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">{t('home.title')}</h2>
                <p className="text-default-500">{t('home.subtitle')}</p>
              </div>
              <Select
                size="sm"
                label={t('home.currency')}
                selectedKeys={[currency]}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-32"
                classNames={{
                  label: 'text-default-500',
                  value: 'text-default-900',
                  trigger: 'bg-default-100/50',
                }}
              >
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="w-full">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div
              ref={tableRef}
              className="relative w-full"
              onScroll={handleScroll}
              style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
            >
              <Table aria-label={t('home.marketTokens')}>
                <TableHeader>
                  <TableColumn>{t('home.token')}</TableColumn>
                  <TableColumn>{t('home.price')}</TableColumn>
                  <TableColumn>{t('home.change')}</TableColumn>
                  <TableColumn>{t('home.marketCap')}</TableColumn>
                  <TableColumn>{t('home.volume')}</TableColumn>
                  <TableColumn>{t('home.ath')}</TableColumn>
                  <TableColumn>{t('home.atl')}</TableColumn>
                  <TableColumn>{t('home.lastUpdated')}</TableColumn>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.token_address}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Image
                            src={token.image}
                            alt={token.name}
                            className="w-6 h-6"
                          />
                          <div>
                            <p className="font-medium">{token.name}</p>
                            <p className="text-small text-default-500">
                              {token.symbol.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatPrice(token.price_usd ?? 0)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Chip
                            variant="flat"
                            color={
                              (token.price_change_24h ?? 0) >= 0
                                ? 'success'
                                : 'danger'
                            }
                          >
                            {(token.price_change_24h ?? 0).toFixed(2)}%
                          </Chip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatPrice((token.market_cap ?? 0) / 1e6)}M</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatPrice((token.volume_24h ?? 0) / 1e6)}M</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatPrice(token.ath ?? 0)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatPrice(token.atl ?? 0)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{new Date(token.last_updated).toLocaleString()}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loading && (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              )}
              {!hasMore && (
                <div className="text-center py-4 text-default-500">
                  {t('home.noMoreTokens')}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
