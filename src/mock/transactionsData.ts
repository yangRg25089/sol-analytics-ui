import { TransactionData } from '../types/solana';

// 生成随机时间戳
const getRandomTimestamp = (hoursAgo: number) => {
  const now = new Date();
  const randomHours = Math.random() * hoursAgo;
  return new Date(now.getTime() - randomHours * 60 * 60 * 1000).toISOString();
};

// 生成随机金额
const getRandomAmount = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

export const mockTransactions: TransactionData[] = [
  // 24小时内的交易
  {
    signature: 'tx1',
    timestamp: getRandomTimestamp(12), // 12小时内
    type: 'SOL_TRANSFER',
    amount: getRandomAmount(0.1, 5),
    from: 'wallet1',
    to: 'wallet2',
    tokenSymbol: 'SOL',
    usdValue: getRandomAmount(10, 500),
    isSuccess: true,
  },
  {
    signature: 'tx2',
    timestamp: getRandomTimestamp(6), // 6小时内
    type: 'TOKEN_TRANSFER',
    amount: getRandomAmount(10, 1000),
    from: 'wallet1',
    to: 'wallet3',
    tokenSymbol: 'USDC',
    usdValue: getRandomAmount(10, 1000),
    isSuccess: true,
  },
  // 7天内的交易
  {
    signature: 'tx3',
    timestamp: getRandomTimestamp(48), // 2天前
    type: 'NFT_TRADE',
    amount: 1,
    from: 'wallet1',
    to: 'wallet4',
    tokenSymbol: 'NFT',
    usdValue: getRandomAmount(100, 1000),
    isSuccess: true,
  },
  {
    signature: 'tx4',
    timestamp: getRandomTimestamp(72), // 3天前
    type: 'SWAP',
    amount: getRandomAmount(1, 100),
    from: 'wallet1',
    to: 'wallet5',
    tokenSymbol: 'SAMO',
    usdValue: getRandomAmount(0.1, 10),
    isSuccess: false,
  },
  // 30天内的交易
  {
    signature: 'tx5',
    timestamp: getRandomTimestamp(240), // 10天前
    type: 'SOL_TRANSFER',
    amount: getRandomAmount(1, 10),
    from: 'wallet2',
    to: 'wallet1',
    tokenSymbol: 'SOL',
    usdValue: getRandomAmount(100, 1000),
    isSuccess: true,
  },
  {
    signature: 'tx6',
    timestamp: getRandomTimestamp(480), // 20天前
    type: 'TOKEN_TRANSFER',
    amount: getRandomAmount(100, 2000),
    from: 'wallet3',
    to: 'wallet1',
    tokenSymbol: 'USDC',
    usdValue: getRandomAmount(100, 2000),
    isSuccess: true,
  },
  // 更早的交易
  {
    signature: 'tx7',
    timestamp: getRandomTimestamp(720), // 30天前
    type: 'NFT_TRADE',
    amount: 1,
    from: 'wallet4',
    to: 'wallet1',
    tokenSymbol: 'NFT',
    usdValue: getRandomAmount(500, 2000),
    isSuccess: true,
  },
  {
    signature: 'tx8',
    timestamp: getRandomTimestamp(1440), // 60天前
    type: 'SWAP',
    amount: getRandomAmount(10, 1000),
    from: 'wallet5',
    to: 'wallet1',
    tokenSymbol: 'SAMO',
    usdValue: getRandomAmount(1, 100),
    isSuccess: true,
  },
];
