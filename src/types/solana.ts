export interface AccountInfo {
  address: string;
  balance: number;
  createdAt: string;
  isNative: boolean;
}

export interface TokenBalance {
  mint: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  usdPrice: number;
  logoUrl?: string;
}

export interface NFTMetadata {
  mint: string;
  name: string;
  image: string;
  collection?: string;
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
  valueChange24h: number;
  percentageChange24h: number;
  valueChange7d: number;
  percentageChange7d: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenFavorite {
  id: string;
  userId: string;
  tokenId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  tokenId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  googleId: string;
  solanaAddress?: string;
  createdAt: string;
  updatedAt: string;
  isSuperUser: boolean;
}
