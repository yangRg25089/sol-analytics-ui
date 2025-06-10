import { NFTMetadata, TokenBalance } from '../types/solana';

export const mockTokenBalances: TokenBalance[] = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    amount: 1000000000, // 1 SOL
    usdPrice: 123.45,
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
  {
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    amount: 5000000, // 5 USDC
    usdPrice: 1.0,
    logoUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  },
  {
    mint: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    name: 'Samoyedcoin',
    symbol: 'SAMO',
    decimals: 9,
    amount: 10000000000, // 10 SAMO
    usdPrice: 0.0123,
    logoUrl:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png',
  },
  {
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    name: 'Bonk',
    symbol: 'BONK',
    decimals: 5,
    amount: 1000000000, // 10,000 BONK
    usdPrice: 0.00000123,
    logoUrl: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
  },
];

export const mockNFTs: NFTMetadata[] = [
  {
    mint: 'NFT1',
    name: 'Solana Monkey Business #1234',
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    collection: 'Solana Monkey Business',
  },
  {
    mint: 'NFT2',
    name: 'DeGods #5678',
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    collection: 'DeGods',
  },
  {
    mint: 'NFT3',
    name: 'Okay Bears #9012',
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png',
    collection: 'Okay Bears',
  },
];

export const mockPerformanceMetrics = {
  totalValue: 1234.56,
  valueChange24h: 123.45,
  percentageChange24h: 10.5,
  valueChange7d: 234.56,
  percentageChange7d: 20.5,
};
