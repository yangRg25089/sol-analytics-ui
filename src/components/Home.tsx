import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
  User,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';
import { useAuth } from '../contexts/AuthContext';
import { TokenMarketData } from '../types/market';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  user_type: string;
}

const Home: React.FC = () => {
  const [tokens, setTokens] = useState<TokenMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'JPY' | 'CNY'>('USD');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const { authState, login } = useAuth();
  const { t } = useTranslation();

  // 初始化检查登录状态
  useEffect(() => {
    setIsAuthenticated(checkAuthStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次

  const checkAuthStatus = () => {
    const storedUserInfo = localStorage.getItem('user_info');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');
    console.log('storedUserInfo)', storedUserInfo);
    console.log('tokenExpiresAt)', tokenExpiresAt);

    if (!storedUserInfo || !tokenExpiresAt) {
      return false;
    }
    const isExpired = Date.now() >= parseInt(tokenExpiresAt, 10);
    if (isExpired) {
      handleLogout();
      return false;
    }
    setUserInfo(JSON.parse(storedUserInfo));
    console.log('JSON.parse(storedUserInfo)', JSON.parse(storedUserInfo));

    return true;
  };

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
      const scrollThreshold = 50; // 降低触发阈值

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

  const handleLogout = () => {
    localStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires_at');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
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
                onPress={login}
                className="bg-gradient-to-tr from-primary-500 to-secondary-500"
              >
                Login with Google
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
          <CardBody>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Welcome to Sol Analytics</h2>
                <p className="text-default-500">
                  Manage your tokens and track your portfolio
                </p>
              </div>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: userInfo?.avatar_url,
                    }}
                    className="transition-transform"
                    description={userInfo?.email}
                    name={userInfo?.name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Info">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{userInfo?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="role">
                    <p className="font-semibold">Role: {userInfo?.role}</p>
                  </DropdownItem>
                  <DropdownItem key="type">
                    <p className="font-semibold">Type: {userInfo?.user_type}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('home.title')}</h1>
          <Select
            size="sm"
            label={t('home.currency')}
            selectedKeys={[currency]}
            onChange={(e) => setCurrency(e.target.value as any)}
          >
            {currencies.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </Select>
        </CardHeader>
        <CardBody>
          <div
            ref={tableRef}
            className="relative"
            onScroll={handleScroll}
            style={{
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
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
                        variant="flat"
                        color={
                          token.price_change_24h >= 0 ? 'success' : 'danger'
                        }
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
            {loading && (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            )}
            {!hasMore && (
              <div className="text-center py-4 text-default-500">
                No more tokens
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
