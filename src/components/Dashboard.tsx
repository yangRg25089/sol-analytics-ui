import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../contexts/AuthContext';
import Assets from './Assets';
import Transactions from './Transactions';

// 注册 Chart.js 组件
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
);

interface DashboardProps {
  defaultWallet?: string;
}

interface OverviewData {
  totalValue: number;
  change24h: number;
  change7d: number;
  transactionCount: number;
  assetCount: number;
  assetDistribution: {
    labels: string[];
    values: number[];
  };
  transactionTypes: {
    labels: string[];
    values: number[];
  };
  dailyVolume: {
    labels: string[];
    values: number[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ defaultWallet = '' }) => {
  const { t } = useTranslation();
  const [selectedWallet, setSelectedWallet] = useState<string>(defaultWallet);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData>({
    totalValue: 0,
    change24h: 0,
    change7d: 0,
    transactionCount: 0,
    assetCount: 0,
    assetDistribution: {
      labels: [],
      values: [],
    },
    transactionTypes: {
      labels: [],
      values: [],
    },
    dailyVolume: {
      labels: [],
      values: [],
    },
  });
  const { publicKey, connected, wallets } = useWallet();
  const { authState } = useAuth();

  // 获取已连接的钱包列表
  const connectedWallets = [
    // 添加测试钱包
    {
      label: 'Test Wallet 1',
      value: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    },
    {
      label: 'Test Wallet 2',
      value: '8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    },
    {
      label: 'Test Wallet 3',
      value: '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    },
    // 添加实际连接的钱包，使用 Set 去重
    ...Array.from(
      new Set(
        wallets
          .filter(
            (wallet) =>
              wallet.readyState === 'Installed' ||
              wallet.readyState === 'Loadable',
          )
          .map((wallet) => wallet.adapter.name),
      ),
    ).map((name) => {
      const wallet = wallets.find((w) => w.adapter.name === name);
      return {
        label: name,
        value: wallet?.adapter.publicKey?.toBase58() || '',
      };
    }),
  ];

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();
      setSelectedWallet(walletAddress);
      fetchOverviewData(walletAddress);
    } else if (connectedWallets.length > 0) {
      // 如果没有连接的钱包，选择第一个测试钱包
      setSelectedWallet(connectedWallets[0].value);
      fetchOverviewData(connectedWallets[0].value);
    }
  }, [publicKey]);

  const handleWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWallet = e.target.value;
    setSelectedWallet(newWallet);
    fetchOverviewData(newWallet);
  };

  const fetchOverviewData = async (walletAddress: string) => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);
    try {
      // 在开发环境中使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOverviewData({
          totalValue: 12345.67,
          change24h: 5.2,
          change7d: -2.1,
          transactionCount: 156,
          assetCount: 8,
          assetDistribution: {
            labels: ['SOL', 'USDC', 'SAMO', 'NFT'],
            values: [5000, 3000, 2000, 2345.67],
          },
          transactionTypes: {
            labels: ['Transfer', 'Swap', 'NFT Trade', 'Other'],
            values: [45, 30, 15, 10],
          },
          dailyVolume: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [1200, 1900, 1500, 2100, 1800, 2400, 2000],
          },
        });
        return;
      }

      // TODO: 实现实际的API调用
      // const response = await axios.get(`${API_BASE_URL}/overview/${walletAddress}`);
      // setOverviewData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load overview data',
      );
    } finally {
      setIsLoading(false);
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card
        className="bg-gradient-to-br from-primary-900/20 to-secondary-900/20 backdrop-blur-sm border-none"
        shadow="sm"
      >
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-6 w-full">
              <span className="text-xl font-bold">{t('dashboard.title')}</span>
              <Select
                label={t('dashboard.selectWallet')}
                placeholder={t('dashboard.selectWalletPlaceholder')}
                selectedKeys={[selectedWallet]}
                onChange={handleWalletChange}
                className="max-w-xs"
                classNames={{
                  label: 'text-default-500',
                  value: 'text-default-900',
                  trigger: 'bg-default-100/50',
                }}
              >
                {connectedWallets.map((wallet) => (
                  <SelectItem key={wallet.value} value={wallet.value}>
                    {wallet.label}
                  </SelectItem>
                ))}
              </Select>
              <Button
                color="primary"
                className="bg-gradient-to-tr from-primary-500 to-secondary-500"
                onClick={() => fetchOverviewData(selectedWallet)}
                isDisabled={!selectedWallet}
              >
                {t('common.analyze')}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {selectedWallet && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">{t('dashboard.statistics')}</h2>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="text-danger text-center p-4">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="bg-default-50">
                    <CardBody>
                      <p className="text-sm text-default-500">
                        {t('assets.totalValue')}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(overviewData.totalValue)}
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50">
                    <CardBody>
                      <p className="text-sm text-default-500">
                        {t('assets.change24h')}
                      </p>
                      <p
                        className={`text-2xl font-bold ${overviewData.change24h >= 0 ? 'text-success' : 'text-danger'}`}
                      >
                        {formatPercentage(overviewData.change24h)}
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50">
                    <CardBody>
                      <p className="text-sm text-default-500">
                        {t('assets.change7d')}
                      </p>
                      <p
                        className={`text-2xl font-bold ${overviewData.change7d >= 0 ? 'text-success' : 'text-danger'}`}
                      >
                        {formatPercentage(overviewData.change7d)}
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50">
                    <CardBody>
                      <p className="text-sm text-default-500">
                        {t('transactions.title')}
                      </p>
                      <p className="text-2xl font-bold">
                        {overviewData.transactionCount}
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="bg-default-50">
                    <CardBody>
                      <p className="text-sm text-default-500">
                        {t('assets.title')}
                      </p>
                      <p className="text-2xl font-bold">
                        {overviewData.assetCount}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              )}
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('assets.distribution')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Doughnut
                    data={{
                      labels: overviewData.assetDistribution.labels,
                      datasets: [
                        {
                          data: overviewData.assetDistribution.values,
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                          ],
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.title')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Pie
                    data={{
                      labels: overviewData.transactionTypes.labels,
                      datasets: [
                        {
                          data: overviewData.transactionTypes.values,
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                          ],
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </CardBody>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.dailyVolume')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: overviewData.dailyVolume.labels,
                      datasets: [
                        {
                          label: t('transactions.volume'),
                          data: overviewData.dailyVolume.values,
                          backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Transactions walletAddress={selectedWallet} />
            <Assets walletAddress={selectedWallet} />
          </div>
        </div>
      )}

      {authState.user?.is_token_issuer && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">{t('tokenManagement.title')}</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4">
              <Button color="primary">
                {t('tokenManagement.createToken')}
              </Button>
              <Button color="secondary">
                {t('tokenManagement.manageTokens')}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
