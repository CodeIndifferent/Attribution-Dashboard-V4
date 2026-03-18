/*
 * Web3 data structure: wallet addresses, DeFi platforms, token holdings
 */

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  chain: string;
  contractAddress: string;
  lastUpdated: string;
}

export interface DeFiPosition {
  platform: string;
  protocol: string;
  type: 'lending' | 'liquidity' | 'staking' | 'farming' | 'vault';
  tokens: Token[];
  totalValue: number;
  apy?: number;
  riskLevel: 'low' | 'medium' | 'high';
  startedAt: string;
}

export interface Wallet {
  walletAddress: string;
  chain: string;
  chainId: number;
  label: string;
  verified: boolean;
  firstTransaction: string;
  lastTransaction: string;
  totalTransactions: number;
  totalVolume: number;
  tokens: Token[];
  defiPositions: DeFiPosition[];
  totalAssetValue: number;
}

export interface Web3Profile {
  userId: string;
  wallets: Wallet[];
  totalWeb3Value: number;
  favoriteChain: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  defiExperience: 'beginner' | 'intermediate' | 'advanced';
}

export const web3Data: Record<string, Web3Profile> = {
  USR_001: {
    userId: 'USR_001',
    totalWeb3Value: 45230.50,
    favoriteChain: 'Ethereum',
    riskProfile: 'moderate',
    defiExperience: 'advanced',
    wallets: [
      {
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bEd',
        chain: 'Ethereum',
        chainId: 1,
        label: 'Primary Wallet',
        verified: true,
        firstTransaction: '2023-06-15',
        lastTransaction: '2024-03-15',
        totalTransactions: 247,
        totalVolume: 1250000,
        totalAssetValue: 35420.75,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', balance: 12.5, value: 31250, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 5000, value: 5000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
          { symbol: 'DAI', name: 'Dai Stablecoin', balance: 2500, value: 2500, chain: 'Ethereum', contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F', lastUpdated: '2024-03-16' },
          { symbol: 'AAVE', name: 'Aave', balance: 45.2, value: 4521, chain: 'Ethereum', contractAddress: '0x7Fc66500c84A76Ad7e9c93437E434122A1f9AcDd', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Aave',
            protocol: 'Lending',
            type: 'lending',
            tokens: [
              { symbol: 'ETH', name: 'Ethereum', balance: 5, value: 12500, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
              { symbol: 'USDC', name: 'USD Coin', balance: 3000, value: 3000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 15500,
            apy: 3.2,
            riskLevel: 'low',
            startedAt: '2023-08-20',
          },
          {
            platform: 'Uniswap',
            protocol: 'DEX',
            type: 'liquidity',
            tokens: [
              { symbol: 'ETH', name: 'Ethereum', balance: 3.5, value: 8750, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
              { symbol: 'USDC', name: 'USD Coin', balance: 2000, value: 2000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 10750,
            apy: 0.85,
            riskLevel: 'medium',
            startedAt: '2023-10-05',
          },
        ],
      },
      {
        walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        chain: 'Polygon',
        chainId: 137,
        label: 'Secondary Wallet',
        verified: true,
        firstTransaction: '2023-09-10',
        lastTransaction: '2024-03-14',
        totalTransactions: 89,
        totalVolume: 450000,
        totalAssetValue: 9809.75,
        tokens: [
          { symbol: 'MATIC', name: 'Polygon', balance: 2500, value: 1250, chain: 'Polygon', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 8000, value: 8000, chain: 'Polygon', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', lastUpdated: '2024-03-16' },
          { symbol: 'AAVE', name: 'Aave', balance: 5.5, value: 559.75, chain: 'Polygon', contractAddress: '0xD6DF932326C8541454908B562933452641d3B109', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Aave (Polygon)',
            protocol: 'Lending',
            type: 'lending',
            tokens: [
              { symbol: 'USDC', name: 'USD Coin', balance: 5000, value: 5000, chain: 'Polygon', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', lastUpdated: '2024-03-16' },
              { symbol: 'MATIC', name: 'Polygon', balance: 1000, value: 500, chain: 'Polygon', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
            ],
            totalValue: 5500,
            apy: 4.1,
            riskLevel: 'low',
            startedAt: '2023-11-12',
          },
        ],
      },
    ],
  },
  USR_002: {
    userId: 'USR_002',
    totalWeb3Value: 12450.00,
    favoriteChain: 'Ethereum',
    riskProfile: 'conservative',
    defiExperience: 'beginner',
    wallets: [
      {
        walletAddress: '0x1234567890123456789012345678901234567890',
        chain: 'Ethereum',
        chainId: 1,
        label: 'Main Wallet',
        verified: true,
        firstTransaction: '2024-01-10',
        lastTransaction: '2024-03-15',
        totalTransactions: 45,
        totalVolume: 125000,
        totalAssetValue: 12450.00,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', balance: 3.5, value: 8750, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 3700, value: 3700, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Compound',
            protocol: 'Lending',
            type: 'lending',
            tokens: [
              { symbol: 'USDC', name: 'USD Coin', balance: 3000, value: 3000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 3000,
            apy: 2.8,
            riskLevel: 'low',
            startedAt: '2024-01-15',
          },
        ],
      },
    ],
  },
  USR_003: {
    userId: 'USR_003',
    totalWeb3Value: 78900.25,
    favoriteChain: 'Ethereum',
    riskProfile: 'aggressive',
    defiExperience: 'advanced',
    wallets: [
      {
        walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        chain: 'Ethereum',
        chainId: 1,
        label: 'Trading Wallet',
        verified: true,
        firstTransaction: '2023-03-20',
        lastTransaction: '2024-03-16',
        totalTransactions: 512,
        totalVolume: 5200000,
        totalAssetValue: 78900.25,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', balance: 25.3, value: 63250, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 10000, value: 10000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
          { symbol: 'USDT', name: 'Tether', balance: 5000, value: 5000, chain: 'Ethereum', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', lastUpdated: '2024-03-16' },
          { symbol: 'UNI', name: 'Uniswap', balance: 150, value: 650.25, chain: 'Ethereum', contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Uniswap V3',
            protocol: 'DEX',
            type: 'liquidity',
            tokens: [
              { symbol: 'ETH', name: 'Ethereum', balance: 15, value: 37500, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
              { symbol: 'USDC', name: 'USD Coin', balance: 7500, value: 7500, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 45000,
            apy: 12.5,
            riskLevel: 'high',
            startedAt: '2023-05-10',
          },
          {
            platform: 'Yearn Finance',
            protocol: 'Yield Optimizer',
            type: 'vault',
            tokens: [
              { symbol: 'USDC', name: 'USD Coin', balance: 2500, value: 2500, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 2500,
            apy: 8.2,
            riskLevel: 'medium',
            startedAt: '2023-07-22',
          },
        ],
      },
    ],
  },
  USR_004: {
    userId: 'USR_004',
    totalWeb3Value: 5200.00,
    favoriteChain: 'Ethereum',
    riskProfile: 'conservative',
    defiExperience: 'beginner',
    wallets: [
      {
        walletAddress: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
        chain: 'Ethereum',
        chainId: 1,
        label: 'Hodl Wallet',
        verified: true,
        firstTransaction: '2024-02-01',
        lastTransaction: '2024-03-10',
        totalTransactions: 12,
        totalVolume: 25000,
        totalAssetValue: 5200.00,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', balance: 1.5, value: 3750, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 1450, value: 1450, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [],
      },
    ],
  },
  USR_005: {
    userId: 'USR_005',
    totalWeb3Value: 125680.50,
    favoriteChain: 'Ethereum',
    riskProfile: 'moderate',
    defiExperience: 'advanced',
    wallets: [
      {
        walletAddress: '0x9876543210987654321098765432109876543210',
        chain: 'Ethereum',
        chainId: 1,
        label: 'Main Portfolio',
        verified: true,
        firstTransaction: '2023-01-05',
        lastTransaction: '2024-03-16',
        totalTransactions: 1203,
        totalVolume: 12500000,
        totalAssetValue: 98420.50,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', balance: 45.2, value: 113000, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 15000, value: 15000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
          { symbol: 'AAVE', name: 'Aave', balance: 120, value: 12000, chain: 'Ethereum', contractAddress: '0x7Fc66500c84A76Ad7e9c93437E434122A1f9AcDd', lastUpdated: '2024-03-16' },
          { symbol: 'UNI', name: 'Uniswap', balance: 500, value: 2170.50, chain: 'Ethereum', contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Aave',
            protocol: 'Lending',
            type: 'lending',
            tokens: [
              { symbol: 'ETH', name: 'Ethereum', balance: 20, value: 50000, chain: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
              { symbol: 'USDC', name: 'USD Coin', balance: 8000, value: 8000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
            ],
            totalValue: 58000,
            apy: 3.5,
            riskLevel: 'low',
            startedAt: '2023-02-14',
          },
          {
            platform: 'Curve Finance',
            protocol: 'DEX',
            type: 'liquidity',
            tokens: [
              { symbol: 'USDC', name: 'USD Coin', balance: 5000, value: 5000, chain: 'Ethereum', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', lastUpdated: '2024-03-16' },
              { symbol: 'DAI', name: 'Dai Stablecoin', balance: 5000, value: 5000, chain: 'Ethereum', contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F', lastUpdated: '2024-03-16' },
            ],
            totalValue: 10000,
            apy: 2.1,
            riskLevel: 'low',
            startedAt: '2023-04-03',
          },
        ],
      },
      {
        walletAddress: '0x1111111111111111111111111111111111111111',
        chain: 'Polygon',
        chainId: 137,
        label: 'Polygon Portfolio',
        verified: true,
        firstTransaction: '2023-06-20',
        lastTransaction: '2024-03-15',
        totalTransactions: 234,
        totalVolume: 1200000,
        totalAssetValue: 27260.00,
        tokens: [
          { symbol: 'MATIC', name: 'Polygon', balance: 8000, value: 4000, chain: 'Polygon', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
          { symbol: 'USDC', name: 'USD Coin', balance: 20000, value: 20000, chain: 'Polygon', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', lastUpdated: '2024-03-16' },
          { symbol: 'AAVE', name: 'Aave', balance: 50, value: 3260, chain: 'Polygon', contractAddress: '0xD6DF932326C8541454908B562933452641d3B109', lastUpdated: '2024-03-16' },
        ],
        defiPositions: [
          {
            platform: 'Aave (Polygon)',
            protocol: 'Lending',
            type: 'lending',
            tokens: [
              { symbol: 'USDC', name: 'USD Coin', balance: 15000, value: 15000, chain: 'Polygon', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', lastUpdated: '2024-03-16' },
              { symbol: 'MATIC', name: 'Polygon', balance: 3000, value: 1500, chain: 'Polygon', contractAddress: '0x0000000000000000000000000000000000000000', lastUpdated: '2024-03-16' },
            ],
            totalValue: 16500,
            apy: 4.3,
            riskLevel: 'low',
            startedAt: '2023-07-10',
          },
        ],
      },
    ],
  },
};

export function getWeb3Profile(userId: string): Web3Profile | null {
  return web3Data[userId] || null;
}
