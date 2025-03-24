export const STUB_MODE = process.env.REACT_APP_STUB_MODE === 'true';

export const STUB_DATA = {
  userRoles: {
    normal: {
      id: 'stub-user-1',
      email: 'user@example.com',
      is_token_issuer: false,
    },
    tokenIssuer: {
      id: 'stub-issuer-1',
      email: 'issuer@example.com',
      is_token_issuer: true,
    }
  },
  tokens: [
    // stub token data
  ],
  transactions: [
    // stub transaction data
  ]
};
