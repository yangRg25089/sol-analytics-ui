import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { mockTransactions } from '../mock/transactionsData';
import { TransactionData } from '../types/solana';

interface TransactionsProps {
  walletAddress: string;
}

const getTypeColor = (type: TransactionData['type']) => {
  switch (type) {
    case 'SOL_TRANSFER':
      return 'primary';
    case 'TOKEN_TRANSFER':
      return 'secondary';
    case 'NFT_TRADE':
      return 'success';
    case 'SWAP':
      return 'warning';
    default:
      return 'default';
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

const Transactions: React.FC<TransactionsProps> = ({ walletAddress }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>(
    '7d',
  );
  const [chartType, setChartType] = useState<'value' | 'count'>('value');

  // 添加鼠标移动事件处理
  const handleMouseMove = (e: React.MouseEvent) => {
    const tooltip = document.querySelector(
      '.group:hover .fixed',
    ) as HTMLElement;
    if (tooltip) {
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 计算最佳位置
      let x = e.clientX + 10;
      let y = e.clientY + 10;

      // 如果工具提示会超出右边界，则显示在鼠标左侧
      if (x + rect.width > viewportWidth) {
        x = e.clientX - rect.width - 10;
      }

      // 如果工具提示会超出下边界，则显示在鼠标上方
      if (y + rect.height > viewportHeight) {
        y = e.clientY - rect.height - 10;
      }

      // 确保不会超出左边界和上边界
      x = Math.max(10, x);
      y = Math.max(10, y);

      tooltip.style.setProperty('--tooltip-x', `${x}px`);
      tooltip.style.setProperty('--tooltip-y', `${y}px`);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // 在开发环境中使用模拟数据
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
          setTransactions(mockTransactions);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.TRANSACTIONS}/${walletAddress}`,
        );
        setTransactions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err as AxiosError);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  const getChartData = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label:
              chartType === 'value'
                ? t('transactions.valueChart')
                : t('transactions.countChart'),
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      };
    }

    // 根据时间范围过滤数据
    const now = new Date();
    const filteredTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp);
      const diffHours = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60);

      switch (timeRange) {
        case '24h':
          return diffHours <= 24;
        case '7d':
          return diffHours <= 24 * 7;
        case '30d':
          return diffHours <= 24 * 30;
        default:
          return true;
      }
    });

    // 根据时间范围确定日期格式
    const dateFormat = timeRange === '24h' ? 'HH:mm' : 'MM-dd';

    // 按时间范围分组数据
    const grouped = filteredTransactions.reduce(
      (acc, tx) => {
        const date = format(new Date(tx.timestamp), dateFormat);
        if (!acc[date]) {
          acc[date] = { total: 0, count: 0 };
        }
        acc[date].total += tx.usdValue || 0;
        acc[date].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    // 确保数据点按时间排序
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(
        timeRange === '24h' ? `2024-01-01 ${a}` : `2024-${a}`,
      );
      const dateB = new Date(
        timeRange === '24h' ? `2024-01-01 ${b}` : `2024-${b}`,
      );
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sortedDates;
    const data = sortedDates.map((date) =>
      chartType === 'value' ? grouped[date].total : grouped[date].count,
    );

    return {
      labels,
      datasets: [
        {
          label:
            chartType === 'value'
              ? t('transactions.valueChart')
              : t('transactions.countChart'),
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // 更新图表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center p-4">
        {t('transactions.error')}: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 添加标题卡片 */}
      <Card className="bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
        <CardBody>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-6 w-full">
              <div className="flex items-center gap-2">
                <p className="text-xl">{t('transactions.volume')}:</p>
                <p className="text-3xl font-bold">
                  {formatNumber(
                    transactions.reduce(
                      (sum, tx) => sum + (tx.usdValue || 0),
                      0,
                    ),
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p>{t('transactions.dailyVolume')}:</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(
                      transactions
                        .filter((tx) => {
                          const txDate = new Date(tx.timestamp);
                          const now = new Date();
                          return (
                            txDate.getDate() === now.getDate() &&
                            txDate.getMonth() === now.getMonth() &&
                            txDate.getFullYear() === now.getFullYear()
                          );
                        })
                        .reduce((sum, tx) => sum + (tx.usdValue || 0), 0),
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p>{t('transactions.count')}:</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="w-full h-full" onMouseMove={handleMouseMove}>
        <CardHeader className="flex justify-between">
          <h2 className="text-xl font-bold">{t('transactions.title')}</h2>
          <div className="flex gap-4">
            <Tabs
              selectedKey={timeRange}
              onSelectionChange={(key) => setTimeRange(key as any)}
            >
              <Tab key="24h">{t('transactions.timeRange.24h')}</Tab>
              <Tab key="7d">{t('transactions.timeRange.7d')}</Tab>
              <Tab key="30d">{t('transactions.timeRange.30d')}</Tab>
              <Tab key="all">{t('transactions.timeRange.all')}</Tab>
            </Tabs>
            <Tabs
              selectedKey={chartType}
              onSelectionChange={(key) => setChartType(key as any)}
            >
              <Tab key="value">{t('transactions.chartType.value')}</Tab>
              <Tab key="count">{t('transactions.chartType.count')}</Tab>
            </Tabs>
          </div>
        </CardHeader>
        <CardBody>
          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.chartType.value')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Line data={getChartData()} options={chartOptions} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.chartType.count')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Bar data={getChartData()} options={chartOptions} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.typeDistribution')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Pie
                    data={{
                      labels: Object.keys(
                        transactions.reduce(
                          (acc, tx) => {
                            acc[tx.type] = (acc[tx.type] || 0) + 1;
                            return acc;
                          },
                          {} as Record<string, number>,
                        ),
                      ).map((type) =>
                        t(`transactions.types.${type.toLowerCase()}`),
                      ),
                      datasets: [
                        {
                          data: Object.values(
                            transactions.reduce(
                              (acc, tx) => {
                                acc[tx.type] = (acc[tx.type] || 0) + 1;
                                return acc;
                              },
                              {} as Record<string, number>,
                            ),
                          ),
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                          ],
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'right' as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t('transactions.statusDistribution')}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="h-80">
                  <Pie
                    data={{
                      labels: [
                        t('transactions.status.success'),
                        t('transactions.status.failed'),
                      ],
                      datasets: [
                        {
                          data: [
                            transactions.filter((tx) => tx.isSuccess).length,
                            transactions.filter((tx) => !tx.isSuccess).length,
                          ],
                          backgroundColor: [
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                          ],
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'right' as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">{t('transactions.recent')}</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Transactions">
            <TableHeader>
              <TableColumn>{t('transactions.table.type')}</TableColumn>
              <TableColumn>{t('transactions.table.amount')}</TableColumn>
              <TableColumn>{t('transactions.table.time')}</TableColumn>
              <TableColumn>{t('transactions.table.status')}</TableColumn>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.signature} className="group cursor-pointer">
                  <TableCell>
                    <div className="relative">
                      <Chip color={getTypeColor(tx.type)}>
                        {t(`transactions.types.${tx.type.toLowerCase()}`)}
                      </Chip>
                      <div
                        className="fixed w-64 p-3 bg-default-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                        style={{
                          left: 'var(--tooltip-x, 0px)',
                          top: 'var(--tooltip-y, 0px)',
                        }}
                      >
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">
                              {t('transactions.details.from')}:
                            </span>{' '}
                            {tx.from}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">
                              {t('transactions.details.to')}:
                            </span>{' '}
                            {tx.to}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">
                              {t('transactions.details.signature')}:
                            </span>{' '}
                            {tx.signature}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">
                              {t('transactions.details.timestamp')}:
                            </span>{' '}
                            {format(new Date(tx.timestamp), 'PPpp')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tx.amount} {tx.tokenSymbol || 'SOL'}
                    {tx.usdValue && (
                      <span className="text-sm text-default-400">
                        {' '}
                        (${tx.usdValue.toFixed(2)})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(tx.timestamp), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    <Chip color={tx.isSuccess ? 'success' : 'danger'}>
                      {tx.isSuccess
                        ? t('transactions.status.success')
                        : t('transactions.status.failed')}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Transactions;
