export interface MarketListParams {
  page: number;
  per_page: number;
  vs_currency: 'USD' | 'JPY' | 'CNY';
}

export interface MarketListResponse {
  data: TokenMarketData[];
  total: number;
  current_page: number;
  total_pages: number;
}

export interface TokenMarketData {
  token_address: string;
  symbol: string;
  name: string;
  image: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  last_updated: string;
  ath: number;
  atl: number;
}
