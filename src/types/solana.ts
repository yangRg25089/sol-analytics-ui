export interface AccountInfo {
  address: string;
  balance: number;
  createdAt: string;
  isNative: boolean;
}

export interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdPrice: number;
  logoUrl?: string;
}

export interface NFTMetadata {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  collection?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface TransactionData {
  signature: string;
  timestamp: string;
  type: 'SOL_TRANSFER' | 'TOKEN_TRANSFER' | 'NFT_TRADE' | 'SWAP' | 'OTHER';
  amount: number;
  from: string;
  to: string;
  tokenSymbol?: string;
  usdValue?: number;
  isSuccess: boolean;
}

export interface PerformanceMetrics {
  totalValue: number;
  valueChange24h: number;
  valueChange7d: number;
  percentageChange24h: number;
  percentageChange7d: number;
}
