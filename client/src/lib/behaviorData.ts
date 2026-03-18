/*
 * LUCIA ATTRIBUTION — USER BEHAVIOR DATA
 * Web3 on-chain behavior + Web2 digital behavior sample data
 */

// ─── Web3 Behavior ────────────────────────────────────────────────────────────

export interface Web3PlatformUsage {
  platform: string;
  category: string;
  weeklyActiveUsers: number;
  avgSessionsPerWeek: number;
  avgTxPerMonth: number;
  pct: number;
  color: string;
}

export interface TopAsset {
  asset: string;
  symbol: string;
  chain: string;
  holdersCount: number;
  avgHoldingUsd: number;
  pctOfUsers: number;
  trend: 'up' | 'down' | 'flat';
  trendPct: number;
}

export interface DeFiCategory {
  category: string;
  description: string;
  users: number;
  tvlUsd: number;
  avgPositionUsd: number;
  pct: number;
  color: string;
  protocols: string[];
}

export interface WalletActivity {
  month: string;
  swaps: number;
  bridgeTx: number;
  nftTrades: number;
  stakingDeposits: number;
  lendingActions: number;
}

export interface ChainDistribution {
  chain: string;
  users: number;
  txCount: number;
  avgGasUsd: number;
  pct: number;
  color: string;
}

// ─── Web2 Behavior ────────────────────────────────────────────────────────────

export interface ShoppingPreference {
  category: string;
  users: number;
  avgOrderValue: number;
  purchaseFrequency: string;
  topPlatforms: string[];
  pct: number;
  color: string;
}

export interface SocialMediaActivity {
  platform: string;
  dailyActiveUsers: number;
  avgMinutesPerDay: number;
  contentType: string;
  engagementRate: number;
  pct: number;
  color: string;
}

export interface ContentConsumption {
  type: string;
  users: number;
  avgHoursPerWeek: number;
  pct: number;
  color: string;
}

export interface BehaviorTrend {
  week: string;
  web3Sessions: number;
  web2Sessions: number;
  crossPlatformUsers: number;
  walletConnections: number;
}

// ─── Campaign Funnel (per link) ───────────────────────────────────────────────

export interface FunnelStage {
  stage: string;
  users: number;
  pct: number;
  dropOff: number;
  dropOffPct: number;
  avgTimeSpent: number; // seconds
  topDropOffReason: string;
}

export interface ConversionPath {
  path: string[];
  users: number;
  conversionRate: number;
  avgRevenue: number;
  color: string;
}

export interface DropOffPath {
  exitPage: string;
  users: number;
  pct: number;
  avgTimeBeforeExit: number;
  topReason: string;
}

export interface CampaignFunnelData {
  linkId: string;
  linkName: string;
  shortCode: string;
  color: string;
  totalClicks: number;
  totalConversions: number;
  overallConvRate: number;
  avgRevenuePerConversion: number;
  funnel: FunnelStage[];
  topConversionPaths: ConversionPath[];
  topDropOffPaths: DropOffPath[];
  channelFunnels: { channel: string; clicks: number; conversions: number; convRate: number; color: string }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Web3 Platform Usage ──────────────────────────────────────────────────────
export const web3PlatformUsage: Web3PlatformUsage[] = [
  { platform: 'Uniswap', category: 'DEX', weeklyActiveUsers: 38400, avgSessionsPerWeek: 4.2, avgTxPerMonth: 11, pct: 26, color: '#ff007a' },
  { platform: 'OpenSea', category: 'NFT Marketplace', weeklyActiveUsers: 24800, avgSessionsPerWeek: 3.1, avgTxPerMonth: 4, pct: 17, color: '#2081e2' },
  { platform: 'Aave', category: 'Lending', weeklyActiveUsers: 18600, avgSessionsPerWeek: 2.8, avgTxPerMonth: 6, pct: 13, color: '#b6509e' },
  { platform: 'Blur', category: 'NFT Marketplace', weeklyActiveUsers: 14200, avgSessionsPerWeek: 5.6, avgTxPerMonth: 18, pct: 10, color: '#ff6b35' },
  { platform: 'Lido', category: 'Liquid Staking', weeklyActiveUsers: 12800, avgSessionsPerWeek: 1.4, avgTxPerMonth: 2, pct: 9, color: '#00a3ff' },
  { platform: 'Curve', category: 'DEX / Stableswap', weeklyActiveUsers: 10400, avgSessionsPerWeek: 3.8, avgTxPerMonth: 9, pct: 7, color: '#3a3a3a' },
  { platform: 'dYdX', category: 'Perp DEX', weeklyActiveUsers: 8600, avgSessionsPerWeek: 6.2, avgTxPerMonth: 24, pct: 6, color: '#6966ff' },
  { platform: 'Compound', category: 'Lending', weeklyActiveUsers: 6800, avgSessionsPerWeek: 1.9, avgTxPerMonth: 4, pct: 5, color: '#00d395' },
  { platform: 'Raydium', category: 'Solana DEX', weeklyActiveUsers: 5200, avgSessionsPerWeek: 4.4, avgTxPerMonth: 14, pct: 4, color: '#c200fb' },
  { platform: 'Other', category: 'Various', weeklyActiveUsers: 4400, avgSessionsPerWeek: 2.0, avgTxPerMonth: 5, pct: 3, color: '#64748b' },
];

// ─── Top Assets Held ──────────────────────────────────────────────────────────
export const topAssetsHeld: TopAsset[] = [
  { asset: 'Ethereum', symbol: 'ETH', chain: 'Ethereum', holdersCount: 94200, avgHoldingUsd: 8420, pctOfUsers: 63, trend: 'up', trendPct: 14 },
  { asset: 'Bitcoin', symbol: 'BTC', chain: 'Bitcoin', holdersCount: 82400, avgHoldingUsd: 12800, pctOfUsers: 55, trend: 'up', trendPct: 22 },
  { asset: 'USDC', symbol: 'USDC', chain: 'Multi-chain', holdersCount: 68600, avgHoldingUsd: 4200, pctOfUsers: 46, trend: 'flat', trendPct: 1 },
  { asset: 'Solana', symbol: 'SOL', chain: 'Solana', holdersCount: 42800, avgHoldingUsd: 3600, pctOfUsers: 29, trend: 'up', trendPct: 38 },
  { asset: 'Arbitrum', symbol: 'ARB', chain: 'Arbitrum', holdersCount: 34200, avgHoldingUsd: 1840, pctOfUsers: 23, trend: 'up', trendPct: 12 },
  { asset: 'Chainlink', symbol: 'LINK', chain: 'Ethereum', holdersCount: 28600, avgHoldingUsd: 2200, pctOfUsers: 19, trend: 'up', trendPct: 8 },
  { asset: 'Uniswap', symbol: 'UNI', chain: 'Ethereum', holdersCount: 22400, avgHoldingUsd: 1600, pctOfUsers: 15, trend: 'down', trendPct: -4 },
  { asset: 'Aave', symbol: 'AAVE', chain: 'Ethereum', holdersCount: 18800, avgHoldingUsd: 3400, pctOfUsers: 13, trend: 'up', trendPct: 6 },
  { asset: 'Polygon', symbol: 'MATIC', chain: 'Polygon', holdersCount: 16400, avgHoldingUsd: 980, pctOfUsers: 11, trend: 'down', trendPct: -8 },
  { asset: 'Optimism', symbol: 'OP', chain: 'Optimism', holdersCount: 12800, avgHoldingUsd: 1240, pctOfUsers: 9, trend: 'up', trendPct: 18 },
];

// ─── DeFi Categories ──────────────────────────────────────────────────────────
export const defiCategories: DeFiCategory[] = [
  { category: 'Decentralized Exchanges', description: 'Token swaps and liquidity provision', users: 54200, tvlUsd: 2_840_000, avgPositionUsd: 5240, pct: 36, color: '#3b82f6', protocols: ['Uniswap', 'Curve', 'Balancer', 'dYdX'] },
  { category: 'Lending & Borrowing', description: 'Supply collateral, borrow assets', users: 32800, tvlUsd: 1_920_000, avgPositionUsd: 8600, pct: 22, color: '#10b981', protocols: ['Aave', 'Compound', 'Spark', 'Morpho'] },
  { category: 'Liquid Staking', description: 'Stake ETH/SOL and receive liquid tokens', users: 28400, tvlUsd: 3_120_000, avgPositionUsd: 11000, pct: 19, color: '#8b5cf6', protocols: ['Lido', 'Rocket Pool', 'Jito', 'Frax'] },
  { category: 'NFT Trading', description: 'Buy, sell, and mint NFTs', users: 22600, tvlUsd: 480_000, avgPositionUsd: 2100, pct: 15, color: '#f59e0b', protocols: ['OpenSea', 'Blur', 'Magic Eden', 'Tensor'] },
  { category: 'Yield Farming', description: 'LP incentives and auto-compounding', users: 8400, tvlUsd: 640_000, avgPositionUsd: 7600, pct: 6, color: '#06b6d4', protocols: ['Convex', 'Yearn', 'Beefy', 'Pendle'] },
  { category: 'Perpetuals & Options', description: 'Leveraged trading and derivatives', users: 3600, tvlUsd: 280_000, avgPositionUsd: 4800, pct: 2, color: '#ec4899', protocols: ['dYdX', 'GMX', 'Synthetix', 'Lyra'] },
];

// ─── Wallet Activity Trend ────────────────────────────────────────────────────
export const walletActivityTrend: WalletActivity[] = [
  { month: 'Sep', swaps: 18400, bridgeTx: 4200, nftTrades: 6800, stakingDeposits: 3200, lendingActions: 5400 },
  { month: 'Oct', swaps: 22600, bridgeTx: 5100, nftTrades: 8200, stakingDeposits: 3800, lendingActions: 6200 },
  { month: 'Nov', swaps: 26800, bridgeTx: 6400, nftTrades: 9600, stakingDeposits: 4600, lendingActions: 7400 },
  { month: 'Dec', swaps: 31200, bridgeTx: 7800, nftTrades: 12400, stakingDeposits: 5800, lendingActions: 8600 },
  { month: 'Jan', swaps: 38400, bridgeTx: 9200, nftTrades: 14800, stakingDeposits: 7200, lendingActions: 10200 },
  { month: 'Feb', swaps: 42800, bridgeTx: 10600, nftTrades: 16200, stakingDeposits: 8400, lendingActions: 11800 },
  { month: 'Mar', swaps: 48200, bridgeTx: 12400, nftTrades: 18600, stakingDeposits: 9600, lendingActions: 13400 },
];

// ─── Chain Distribution ───────────────────────────────────────────────────────
export const chainDistribution: ChainDistribution[] = [
  { chain: 'Ethereum', users: 68400, txCount: 284000, avgGasUsd: 4.20, pct: 46, color: '#627eea' },
  { chain: 'Solana', users: 28600, txCount: 142000, avgGasUsd: 0.002, pct: 19, color: '#9945ff' },
  { chain: 'Arbitrum', users: 22400, txCount: 98000, avgGasUsd: 0.18, pct: 15, color: '#28a0f0' },
  { chain: 'Base', users: 14800, txCount: 64000, avgGasUsd: 0.08, pct: 10, color: '#0052ff' },
  { chain: 'Polygon', users: 8600, txCount: 38000, avgGasUsd: 0.01, pct: 6, color: '#8247e5' },
  { chain: 'Optimism', users: 6200, txCount: 26000, avgGasUsd: 0.12, pct: 4, color: '#ff0420' },
];

// ─── Web2 Shopping Preferences ───────────────────────────────────────────────
export const shoppingPreferences: ShoppingPreference[] = [
  { category: 'Electronics & Tech', users: 62400, avgOrderValue: 284, purchaseFrequency: '2.1x / month', topPlatforms: ['Amazon', 'Best Buy', 'Newegg'], pct: 42, color: '#3b82f6' },
  { category: 'Software & SaaS', users: 48600, avgOrderValue: 128, purchaseFrequency: '1.4x / month', topPlatforms: ['App Store', 'Google Play', 'Steam'], pct: 32, color: '#8b5cf6' },
  { category: 'Fashion & Apparel', users: 32400, avgOrderValue: 96, purchaseFrequency: '1.8x / month', topPlatforms: ['ASOS', 'Zara', 'Nike'], pct: 22, color: '#ec4899' },
  { category: 'Food & Grocery', users: 28800, avgOrderValue: 64, purchaseFrequency: '3.4x / month', topPlatforms: ['Instacart', 'DoorDash', 'Uber Eats'], pct: 19, color: '#10b981' },
  { category: 'Travel & Experiences', users: 22600, avgOrderValue: 620, purchaseFrequency: '0.6x / month', topPlatforms: ['Airbnb', 'Booking.com', 'Expedia'], pct: 15, color: '#f59e0b' },
  { category: 'Health & Fitness', users: 18400, avgOrderValue: 74, purchaseFrequency: '1.2x / month', topPlatforms: ['GNC', 'Peloton', 'MyFitnessPal'], pct: 12, color: '#06b6d4' },
  { category: 'Books & Education', users: 12800, avgOrderValue: 42, purchaseFrequency: '1.6x / month', topPlatforms: ['Kindle', 'Audible', 'Coursera'], pct: 9, color: '#f97316' },
];

// ─── Social Media Activity ────────────────────────────────────────────────────
export const socialMediaActivity: SocialMediaActivity[] = [
  { platform: 'X (Twitter)', dailyActiveUsers: 82400, avgMinutesPerDay: 38, contentType: 'News, Crypto, Tech', engagementRate: 4.2, pct: 55, color: '#1d9bf0' },
  { platform: 'YouTube', dailyActiveUsers: 74800, avgMinutesPerDay: 62, contentType: 'Tutorials, Finance, Gaming', engagementRate: 6.8, pct: 50, color: '#ff0000' },
  { platform: 'Reddit', dailyActiveUsers: 58600, avgMinutesPerDay: 44, contentType: 'r/crypto, r/defi, r/investing', engagementRate: 8.4, pct: 39, color: '#ff4500' },
  { platform: 'Discord', dailyActiveUsers: 52400, avgMinutesPerDay: 86, contentType: 'Web3 communities, Gaming', engagementRate: 12.6, pct: 35, color: '#5865f2' },
  { platform: 'LinkedIn', dailyActiveUsers: 38200, avgMinutesPerDay: 22, contentType: 'B2B, Finance, Careers', engagementRate: 3.4, pct: 25, color: '#0a66c2' },
  { platform: 'Instagram', dailyActiveUsers: 34600, avgMinutesPerDay: 28, contentType: 'Lifestyle, NFT Art, Brands', engagementRate: 5.2, pct: 23, color: '#e1306c' },
  { platform: 'TikTok', dailyActiveUsers: 28400, avgMinutesPerDay: 52, contentType: 'Crypto tips, Trends', engagementRate: 9.8, pct: 19, color: '#010101' },
  { platform: 'Telegram', dailyActiveUsers: 24800, avgMinutesPerDay: 34, contentType: 'Alpha groups, DAOs', engagementRate: 7.2, pct: 17, color: '#2ca5e0' },
];

// ─── Content Consumption ──────────────────────────────────────────────────────
export const contentConsumption: ContentConsumption[] = [
  { type: 'Video (YouTube/Streaming)', users: 112400, avgHoursPerWeek: 14.2, pct: 75, color: '#ef4444' },
  { type: 'Newsletters & Blogs', users: 86400, avgHoursPerWeek: 4.8, pct: 58, color: '#3b82f6' },
  { type: 'Podcasts', users: 62800, avgHoursPerWeek: 6.4, pct: 42, color: '#8b5cf6' },
  { type: 'Social Media Feeds', users: 118600, avgHoursPerWeek: 9.6, pct: 79, color: '#10b981' },
  { type: 'Research / Whitepapers', users: 38400, avgHoursPerWeek: 3.2, pct: 26, color: '#f59e0b' },
  { type: 'Live Streams / Spaces', users: 28600, avgHoursPerWeek: 2.8, pct: 19, color: '#06b6d4' },
];

// ─── Behavior Trend (Web2 vs Web3) ───────────────────────────────────────────
export const behaviorTrend: BehaviorTrend[] = [
  { week: 'W1', web3Sessions: 28400, web2Sessions: 86200, crossPlatformUsers: 18600, walletConnections: 4200 },
  { week: 'W2', web3Sessions: 31200, web2Sessions: 88400, crossPlatformUsers: 20400, walletConnections: 4800 },
  { week: 'W3', web3Sessions: 34800, web2Sessions: 91600, crossPlatformUsers: 22800, walletConnections: 5400 },
  { week: 'W4', web3Sessions: 38200, web2Sessions: 94200, crossPlatformUsers: 25200, walletConnections: 6200 },
  { week: 'W5', web3Sessions: 42600, web2Sessions: 96800, crossPlatformUsers: 28400, walletConnections: 7100 },
  { week: 'W6', web3Sessions: 46400, web2Sessions: 98400, crossPlatformUsers: 31600, walletConnections: 8200 },
  { week: 'W7', web3Sessions: 51200, web2Sessions: 102000, crossPlatformUsers: 35400, walletConnections: 9400 },
  { week: 'W8', web3Sessions: 56800, web2Sessions: 106400, crossPlatformUsers: 39200, walletConnections: 10800 },
];

// ─── Campaign Funnel Data (per trackable link) ────────────────────────────────
export const campaignFunnels: CampaignFunnelData[] = [
  {
    linkId: 'tl-001',
    linkName: 'Q1 Product Launch — Widget',
    shortCode: 'WIDGET-Q1',
    color: '#10b981',
    totalClicks: 43200,
    totalConversions: 2938,
    overallConvRate: 6.8,
    avgRevenuePerConversion: 150,
    funnel: [
      { stage: 'Link Click', users: 43200, pct: 100, dropOff: 0, dropOffPct: 0, avgTimeSpent: 0, topDropOffReason: '' },
      { stage: 'Landing Page', users: 38600, pct: 89, dropOff: 4600, dropOffPct: 11, avgTimeSpent: 12, topDropOffReason: 'Slow load time on mobile' },
      { stage: 'Product Page', users: 28400, pct: 66, dropOff: 10200, dropOffPct: 26, avgTimeSpent: 124, topDropOffReason: 'Price not visible immediately' },
      { stage: 'Add to Cart', users: 14800, pct: 34, dropOff: 13600, dropOffPct: 48, avgTimeSpent: 198, topDropOffReason: 'Comparison shopping / left to research' },
      { stage: 'Checkout Start', users: 8600, pct: 20, dropOff: 6200, dropOffPct: 42, avgTimeSpent: 87, topDropOffReason: 'Required account creation' },
      { stage: 'Payment', users: 4200, pct: 10, dropOff: 4400, dropOffPct: 51, avgTimeSpent: 142, topDropOffReason: 'Payment method not supported' },
      { stage: 'Purchase Complete', users: 2938, pct: 7, dropOff: 1262, dropOffPct: 30, avgTimeSpent: 64, topDropOffReason: 'Session timeout' },
    ],
    topConversionPaths: [
      { path: ['Social Media', 'Landing', 'Product', 'Checkout'], users: 1240, conversionRate: 8.4, avgRevenue: 162, color: '#10b981' },
      { path: ['Email', 'Landing', 'Product', 'Cart', 'Checkout'], users: 980, conversionRate: 12.2, avgRevenue: 188, color: '#3b82f6' },
      { path: ['Paid Ad', 'Landing', 'Checkout'], users: 420, conversionRate: 4.8, avgRevenue: 134, color: '#f59e0b' },
      { path: ['Organic', 'Blog', 'Product', 'Checkout'], users: 298, conversionRate: 9.6, avgRevenue: 174, color: '#8b5cf6' },
    ],
    topDropOffPaths: [
      { exitPage: '/products/new-widget', users: 8400, pct: 29, avgTimeBeforeExit: 94, topReason: 'No pricing visible above fold' },
      { exitPage: '/checkout', users: 4400, pct: 15, avgTimeBeforeExit: 142, topReason: 'Payment method not supported' },
      { exitPage: '/landing', users: 4200, pct: 15, avgTimeBeforeExit: 12, topReason: 'Mobile load time > 3s' },
      { exitPage: '/cart', users: 3800, pct: 13, avgTimeBeforeExit: 198, topReason: 'Comparison shopping' },
      { exitPage: '/pricing', users: 2600, pct: 9, avgTimeBeforeExit: 76, topReason: 'No free trial visible' },
    ],
    channelFunnels: [
      { channel: 'Social Media', clicks: 18200, conversions: 1274, convRate: 7.0, color: '#3b82f6' },
      { channel: 'Email', clicks: 12400, conversions: 1488, convRate: 12.0, color: '#10b981' },
      { channel: 'Paid Ads', clicks: 9800, conversions: 588, convRate: 6.0, color: '#f59e0b' },
      { channel: 'Article', clicks: 2800, conversions: 196, convRate: 7.0, color: '#06b6d4' },
    ],
  },
  {
    linkId: 'tl-002',
    linkName: 'Summer Sale 2026 — Homepage',
    shortCode: 'SUMMER26',
    color: '#f59e0b',
    totalClicks: 40000,
    totalConversions: 3120,
    overallConvRate: 7.8,
    avgRevenuePerConversion: 128,
    funnel: [
      { stage: 'Link Click', users: 40000, pct: 100, dropOff: 0, dropOffPct: 0, avgTimeSpent: 0, topDropOffReason: '' },
      { stage: 'Landing Page', users: 36400, pct: 91, dropOff: 3600, dropOffPct: 9, avgTimeSpent: 8, topDropOffReason: 'Ad mismatch — expected discount code' },
      { stage: 'Sale Page', users: 28800, pct: 72, dropOff: 7600, dropOffPct: 21, avgTimeSpent: 142, topDropOffReason: 'Discount not as large as expected' },
      { stage: 'Product View', users: 18400, pct: 46, dropOff: 10400, dropOffPct: 36, avgTimeSpent: 186, topDropOffReason: 'Out of stock items shown' },
      { stage: 'Add to Cart', users: 10200, pct: 26, dropOff: 8200, dropOffPct: 45, avgTimeSpent: 212, topDropOffReason: 'Shipping cost revealed at cart' },
      { stage: 'Checkout', users: 5600, pct: 14, dropOff: 4600, dropOffPct: 45, avgTimeSpent: 118, topDropOffReason: 'Coupon code not working' },
      { stage: 'Purchase Complete', users: 3120, pct: 8, dropOff: 2480, dropOffPct: 44, avgTimeSpent: 58, topDropOffReason: 'Credit card declined' },
    ],
    topConversionPaths: [
      { path: ['Social Media', 'Sale Page', 'Cart', 'Checkout'], users: 1480, conversionRate: 9.2, avgRevenue: 142, color: '#f59e0b' },
      { path: ['Email', 'Sale Page', 'Checkout'], users: 1120, conversionRate: 14.6, avgRevenue: 168, color: '#10b981' },
      { path: ['Influencer', 'Landing', 'Product', 'Checkout'], users: 320, conversionRate: 5.0, avgRevenue: 118, color: '#ec4899' },
      { path: ['Paid Ad', 'Sale Page', 'Cart', 'Checkout'], users: 200, conversionRate: 3.8, avgRevenue: 108, color: '#3b82f6' },
    ],
    topDropOffPaths: [
      { exitPage: '/summer-sale', users: 7600, pct: 26, avgTimeBeforeExit: 142, topReason: 'Discount smaller than advertised' },
      { exitPage: '/cart', users: 6200, pct: 21, avgTimeBeforeExit: 212, topReason: 'Unexpected shipping cost' },
      { exitPage: '/checkout', users: 4600, pct: 16, avgTimeBeforeExit: 118, topReason: 'Coupon code not working' },
      { exitPage: '/products/new-widget', users: 3800, pct: 13, avgTimeBeforeExit: 186, topReason: 'Out of stock' },
      { exitPage: '/landing', users: 3600, pct: 12, avgTimeBeforeExit: 8, topReason: 'Ad mismatch' },
    ],
    channelFunnels: [
      { channel: 'Social Media', clicks: 22400, conversions: 1792, convRate: 8.0, color: '#3b82f6' },
      { channel: 'Email', clicks: 11200, conversions: 1232, convRate: 11.0, color: '#10b981' },
      { channel: 'Influencer', clicks: 6400, conversions: 512, convRate: 8.0, color: '#ec4899' },
    ],
  },
  {
    linkId: 'tl-003',
    linkName: 'Enterprise Upsell — Demo CTA',
    shortCode: 'ENT-DEMO',
    color: '#8b5cf6',
    totalClicks: 12800,
    totalConversions: 550,
    overallConvRate: 4.3,
    avgRevenuePerConversion: 2000,
    funnel: [
      { stage: 'Link Click', users: 12800, pct: 100, dropOff: 0, dropOffPct: 0, avgTimeSpent: 0, topDropOffReason: '' },
      { stage: 'Demo Landing', users: 11400, pct: 89, dropOff: 1400, dropOffPct: 11, avgTimeSpent: 18, topDropOffReason: 'Not decision-maker' },
      { stage: 'Feature Overview', users: 8200, pct: 64, dropOff: 3200, dropOffPct: 28, avgTimeSpent: 312, topDropOffReason: 'Missing specific integration info' },
      { stage: 'Pricing Page', users: 5400, pct: 42, dropOff: 2800, dropOffPct: 34, avgTimeSpent: 224, topDropOffReason: 'Price too high without context' },
      { stage: 'Demo Request Form', users: 2200, pct: 17, dropOff: 3200, dropOffPct: 59, avgTimeSpent: 186, topDropOffReason: 'Form too long (8 fields)' },
      { stage: 'Demo Scheduled', users: 980, pct: 8, dropOff: 1220, dropOffPct: 55, avgTimeSpent: 94, topDropOffReason: 'No available slots' },
      { stage: 'Contract Signed', users: 550, pct: 4, dropOff: 430, dropOffPct: 44, avgTimeSpent: 0, topDropOffReason: 'Budget approval pending' },
    ],
    topConversionPaths: [
      { path: ['Email', 'Demo Landing', 'Pricing', 'Form', 'Demo'], users: 280, conversionRate: 6.8, avgRevenue: 2400, color: '#10b981' },
      { path: ['Paid Ad', 'Demo Landing', 'Features', 'Pricing', 'Form'], users: 160, conversionRate: 3.6, avgRevenue: 1800, color: '#f59e0b' },
      { path: ['Article', 'Case Study', 'Demo Landing', 'Form'], users: 110, conversionRate: 8.2, avgRevenue: 2800, color: '#06b6d4' },
    ],
    topDropOffPaths: [
      { exitPage: '/enterprise/demo-form', users: 3200, pct: 25, avgTimeBeforeExit: 186, topReason: 'Form too long' },
      { exitPage: '/enterprise/pricing', users: 2800, pct: 22, avgTimeBeforeExit: 224, topReason: 'Price without ROI context' },
      { exitPage: '/enterprise/features', users: 2400, pct: 19, avgTimeBeforeExit: 312, topReason: 'Missing integration info' },
      { exitPage: '/enterprise/demo', users: 1400, pct: 11, avgTimeBeforeExit: 18, topReason: 'Not decision-maker' },
      { exitPage: '/case-studies', users: 1200, pct: 9, avgTimeBeforeExit: 387, topReason: 'No relevant industry case study' },
    ],
    channelFunnels: [
      { channel: 'Email', clicks: 6200, conversions: 372, convRate: 6.0, color: '#10b981' },
      { channel: 'Paid Ads', clicks: 4400, conversions: 176, convRate: 4.0, color: '#f59e0b' },
      { channel: 'Article', clicks: 2200, conversions: 88, convRate: 4.0, color: '#06b6d4' },
    ],
  },
];

// ─── Global funnel (all campaigns combined) ───────────────────────────────────
export const globalFunnel = [
  { stage: 'Link Click', users: 96000, pct: 100, dropOff: 0, dropOffPct: 0 },
  { stage: 'Landing Page', users: 86400, pct: 90, dropOff: 9600, dropOffPct: 10 },
  { stage: 'Product / Feature View', users: 65400, pct: 68, dropOff: 21000, dropOffPct: 24 },
  { stage: 'Engagement Action', users: 43600, pct: 45, dropOff: 21800, dropOffPct: 33 },
  { stage: 'Checkout / Form Start', users: 18400, pct: 19, dropOff: 25200, dropOffPct: 58 },
  { stage: 'Payment / Submit', users: 9800, pct: 10, dropOff: 8600, dropOffPct: 47 },
  { stage: 'Conversion Complete', users: 6608, pct: 7, dropOff: 3192, dropOffPct: 33 },
];
