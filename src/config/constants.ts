export const API_BASE_URL = 'http://127.0.0.1:8081';

export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions',
  ASSETS: '/api/assets',
  ACCOUNT: '/api/account',
  PERFORMANCE: '/api/performance',
  TOKENS: '/api/market/tokens',
};

export const SUPPORTED_LANGUAGES = ['en', 'zh', 'ja'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];