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
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
  market_cap_rank: number;
  high_24h: number;
  low_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  total_volume: number;
  description: string;
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
}
