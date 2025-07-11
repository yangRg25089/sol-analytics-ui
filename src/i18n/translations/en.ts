const translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    submit: 'Submit',
    analyze: 'Analyze',
    cancel: 'Cancel',
    create: 'Create',
  },
  dashboard: {
    title: 'Solana Analytics',
    enterWallet: 'Enter Solana Wallet Address',
    statistics: 'Statistics Overview',
    selectWallet: 'Select Wallet',
    selectWalletPlaceholder: 'Select a wallet to analyze',
  },
  transactions: {
    title: 'Transaction History',
    amount: 'Amount',
    recent: 'Recent Transactions',
    all: 'View All',
    error: 'Failed to load transaction history',
    valueChart: 'Transaction Value (USD)',
    countChart: 'Transaction Count',
    timeRange: {
      '24h': '24 Hours',
      '7d': '7 Days',
      '30d': '30 Days',
      all: 'All',
    },
    chartType: {
      value: 'Value',
      count: 'Count',
    },
    table: {
      type: 'Type',
      amount: 'Amount',
      time: 'Time',
      status: 'Status',
    },
    types: {
      sol_transfer: 'SOL Transfer',
      token_transfer: 'Token Transfer',
      nft_trade: 'NFT Trade',
      swap: 'Swap',
    },
    status: {
      success: 'Success',
      failed: 'Failed',
    },
    details: {
      from: 'From',
      to: 'To',
      signature: 'Transaction Signature',
      timestamp: 'Transaction Time',
    },
    volume: 'Volume',
    dailyVolume: 'Daily Volume',
    count: 'Transaction Count',
    typeDistribution: 'Transaction Type Distribution',
    statusDistribution: 'Transaction Status Distribution',
  },
  assets: {
    tokens: 'Token Assets',
    nfts: 'NFT Assets',
    collection: 'Collection',
    title: 'Asset Holdings',
    overview: 'Portfolio Overview',
    totalValue: 'Total Value',
    change24h: '24h Change',
    change7d: '7d Change',
    balance: 'Balance',
    value: 'Value',
    total: 'Total',
    transfer: 'Transfer',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    noAssets: 'No assets found',
    loading: 'Loading...',
    error: 'Loading error',
    distribution: 'Asset Distribution',
  },
  language: {
    title: 'Language',
    en: 'English',
    zh: '中文',
    ja: '日本語',
  },
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    assets: 'Assets',
    tokenManagement: 'Token Management',
  },
  home: {
    title: 'Market Overview',
    subtitle: 'Real-time market data and token analytics',
    currency: 'Currency',
    marketTokens: 'Market Tokens',
    token: 'Token',
    price: 'Price',
    change: '24h Change',
    marketCap: 'Market Cap',
    volume: '24h Volume',
    ath: 'ATH',
    atl: 'ATL',
    lastUpdated: 'Last Updated',
    noMoreTokens: 'No more tokens to load',
    perPage: 'Per Page',
    totalItems: 'Total {{total}} items',
    welcome: 'Welcome to Sol Analytics',
    loginPrompt: 'Login to manage tokens and track your portfolio',
    managePrompt: 'Manage tokens and track your portfolio',
    circulatingSupply: 'Circulating Supply',
    marketCapRank: 'Market Cap Rank',
    priceRange: 'Price Range',
    rank: 'Rank',
    total: 'Total',
    high: 'High',
    low: 'Low',
    supplyPercentage: 'Supply Percentage',
  },
  tokenManagement: {
    title: 'Token Management',
    createToken: 'Create Token',
    name: 'Name',
    symbol: 'Symbol',
    totalSupply: 'Total Supply',
    actions: 'Actions',
    mint: 'Mint',
    burn: 'Burn',
    createNewToken: 'Create New Token',
    holders: 'Holders',
    marketCap: 'Market Cap',
    price: 'Price',
    change24h: '24h Change',
    status: 'Status',
    decimals: 'Decimals',
    description: 'Description',
    website: 'Website',
    socialLinks: 'Social Links',
    details: 'Details',
    freeze: 'Freeze',
    pause: 'Pause',
    activate: 'Activate',
    mintTokens: 'Mint Tokens',
    burnTokens: 'Burn Tokens',
    enterAmount: 'Enter Amount',
    tokenDetails: 'Token Details',
    close: 'Close',
    noDescription: 'No description',
    noWebsite: 'No website',
    tokenInfo: 'Token Information',
    totalTokens: 'Total Tokens',
    totalMarketCap: 'Total Market Cap',
    totalHolders: 'Total Holders',
    statusTypes: {
      active: 'Active',
      paused: 'Paused',
      frozen: 'Frozen',
    },
    confirmMint: 'Are you sure you want to mint tokens?',
    confirmBurn: 'Are you sure you want to burn tokens?',
    confirmPause: 'Are you sure you want to pause the token?',
    confirmActivate: 'Are you sure you want to activate the token?',
    confirmFreeze: 'Are you sure you want to freeze the token?',
    success: {
      mint: 'Successfully minted tokens',
      burn: 'Successfully burned tokens',
      pause: 'Successfully paused token',
      activate: 'Successfully activated token',
      freeze: 'Successfully froze token',
      create: 'Successfully created token',
    },
    error: {
      mint: 'Failed to mint tokens',
      burn: 'Failed to burn tokens',
      pause: 'Failed to pause token',
      activate: 'Failed to activate token',
      freeze: 'Failed to freeze token',
      create: 'Failed to create token',
    },
  },
  token: {
    transferTitle: 'Transfer',
    balance: 'Balance',
    toAddress: 'To Address',
    amount: 'Amount',
    confirmTransfer: 'Confirm Transfer',
    enterAddress: 'Enter Solana Address',
    enterAmount: 'Enter Amount',
    maxAmount: 'Max Amount',
  },
  auth: {
    processing: 'Processing...',
    loginWithGoogle: 'Login with Google',
    signedInAs: 'Signed in as',
    role: 'Role',
    type: 'Type',
    logout: 'Logout',
  },
  app: {
    title: 'Solana Analytics',
  },
  theme: {
    title: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    purple: 'Purple',
    blue: 'Blue',
    green: 'Green',
    pink: 'Pink',
    yellow: 'Yellow',
    red: 'Red',
    orange: 'Orange',
  },
};

export default translations;
