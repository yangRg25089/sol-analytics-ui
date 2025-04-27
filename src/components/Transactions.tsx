import {
  Card,
  CardBody,
  CardHeader,
  Chip,
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
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
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

const Transactions: React.FC<TransactionsProps> = ({ walletAddress }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>(
    '7d',
  );
  const [chartType, setChartType] = useState<'value' | 'count'>('value');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.TRANSACTIONS}/${walletAddress}`,
        );
        // 确保数据是数组格式
        setTransactions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err as AxiosError);
        // 发生错误时设置空数组
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
    // 添加防御性检查
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label:
              chartType === 'value'
                ? 'Transaction Value (USD)'
                : 'Transaction Count',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      };
    }

    const grouped = transactions.reduce(
      (acc, tx) => {
        const date = format(new Date(tx.timestamp), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = { total: 0, count: 0 };
        }
        acc[date].total += tx.usdValue || 0;
        acc[date].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const labels = Object.keys(grouped);
    const data = labels.map((date) =>
      chartType === 'value' ? grouped[date].total : grouped[date].count,
    );

    return {
      labels,
      datasets: [
        {
          label:
            chartType === 'value'
              ? 'Transaction Value (USD)'
              : 'Transaction Count',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: chartType === 'value' ? 'Value (USD)' : 'Count',
            },
          },
        },
      },
    };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching transactions: {error.message}</div>;

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <h2 className="text-xl font-bold">{t('transactions.title')}</h2>
        <div className="flex gap-4">
          <Tabs
            selectedKey={timeRange}
            onSelectionChange={(key) => setTimeRange(key as any)}
          >
            <Tab key="24h">24H</Tab>
            <Tab key="7d">7D</Tab>
            <Tab key="30d">30D</Tab>
            <Tab key="all">All</Tab>
          </Tabs>
          <Tabs
            selectedKey={chartType}
            onSelectionChange={(key) => setChartType(key as any)}
          >
            <Tab key="value">Value</Tab>
            <Tab key="count">Count</Tab>
          </Tabs>
        </div>
      </CardHeader>
      <CardBody>
        {/* Chart Section */}
        <div className="h-80 mb-6">
          {chartType === 'value' ? (
            <Line data={getChartData()} />
          ) : (
            <Bar data={getChartData()} />
          )}
        </div>

        {/* Transactions Table */}
        <Table aria-label="Transactions">
          <TableHeader>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.signature}>
                <TableCell>
                  <Chip color={getTypeColor(tx.type)}>{tx.type}</Chip>
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
                <TableCell>{format(new Date(tx.timestamp), 'PPpp')}</TableCell>
                <TableCell>
                  <Chip color={tx.isSuccess ? 'success' : 'danger'}>
                    {tx.isSuccess ? 'Success' : 'Failed'}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Transactions;
