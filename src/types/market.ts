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
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
  price: {
    USD: number;
    JPY: number;
    CNY: number;
  };
}