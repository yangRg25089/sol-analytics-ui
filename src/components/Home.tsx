import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';

interface TokenMarketData {
  token_address: string;
  symbol: string;
  name: string;
  image: string;
  price_usd: number;
  market_cap: number;
  price_change_24h: number;
  volume_24h: number;
}

const Home: React.FC = () => {
  const [tokens, setTokens] = useState<TokenMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [currency, setCurrency] = useState<'USD' | 'JPY' | 'CNY'>('USD');
  const [total, setTotal] = useState(0);
  const { authState, login } = useAuth();
  const { t } = useTranslation();

  const rowsPerPage = useMemo(
    () => [
      { label: '20', value: '20' },
      { label: '40', value: '40' },
      { label: '60', value: '60' },
      { label: '80', value: '80' },
      { label: '100', value: '100' },
    ],
    [],
  );

  const currencies = useMemo(
    () => [
      { label: 'USD ($)', value: 'USD' },
      { label: 'JPY (¥)', value: 'JPY' },
      { label: 'CNY (¥)', value: 'CNY' },
    ],
    [],
  );

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/tokens/market-list/`,
        {
          page,
          per_page: perPage,
          vs_currency: currency,
        },
      );
      console.log('API response:', response.data);
      setTokens(response.data.tokens || []);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, currency]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const formatPrice = (price_usd: number) => {
    switch (currency) {
      case 'USD':
        return `$${price_usd.toFixed(2)}`;
      case 'JPY':
        return `¥${price_usd.toFixed(0)}`;
      case 'CNY':
        return `¥${price_usd.toFixed(2)}`;
    }
  };

  if (loading || !Array.isArray(tokens)) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {!authState.isAuthenticated && (
        <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
          <CardBody>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Welcome to Sol Analytics</h2>
                <p className="text-default-500">
                  Login to manage your tokens and track your portfolio
                </p>
              </div>
              <Button
                color="primary"
                onClick={login}
                className="bg-gradient-to-tr from-primary-500 to-secondary-500"
              >
                Login with Google
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('home.title')}</h1>
          <div className="flex gap-4">
            <Select
              size="sm"
              label={t('home.perPage')}
              selectedKeys={[perPage.toString()]}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {rowsPerPage.map((row) => (
                <SelectItem key={row.value} value={row.value}>
                  {row.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              label={t('home.currency')}
              selectedKeys={[currency]}
              onChange={(e) =>
                setCurrency(e.target.value as 'USD' | 'JPY' | 'CNY')
              }
            >
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          {tokens.length === 0 ? (
            <div className="text-center py-4">No tokens found</div>
          ) : (
            <>
              <Table aria-label="Market tokens">
                <TableHeader>
                  <TableColumn>TOKEN</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>24H CHANGE</TableColumn>
                  <TableColumn>MARKET CAP</TableColumn>
                  <TableColumn>VOLUME</TableColumn>
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
                      <TableCell>{formatPrice(token.price_usd)}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            token.price_change_24h >= 0 ? 'success' : 'danger'
                          }
                          variant="flat"
                        >
                          {token.price_change_24h.toFixed(2)}%
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {formatPrice(token.market_cap / 1e6)}M
                      </TableCell>
                      <TableCell>
                        {formatPrice(token.volume_24h / 1e6)}M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <span className="text-small text-default-400">
                  {t('home.totalItems', { total })}
                </span>
                <Pagination
                  total={Math.ceil(total / perPage)}
                  initialPage={1}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
