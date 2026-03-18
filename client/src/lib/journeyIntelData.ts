/*
 * Intelligence Command Center data for User Journeys panel
 * Campaign performance, conversion paths, and drop-off analysis
 */

export interface CampaignJourney {
  id: string;
  campaign: string;
  channel: 'twitter' | 'google' | 'meta' | 'email' | 'direct';
  totalUsers: number;
  conversions: number;
  dropOffs: number;
  revenue: number;
  conversionRate: number;
  avgTouchpoints: number;
  color: string;
}

export interface JourneyPath {
  id: string;
  label: string;
  type: 'conversion' | 'dropoff';
  steps: JourneyStep[];
  users: number;
  percentage: number;
}

export interface JourneyStep {
  label: string;
  channel: string;
  action: string;
  timestamp: string;
  usersRemaining: number;
  dropOffCount: number;
}

export interface FunnelStage {
  stage: string;
  users: number;
  dropOff: number;
  conversionRate: number;
}

export const campaignJourneys: CampaignJourney[] = [
  {
    id: 'tw_spring',
    campaign: 'Twitter Spring Launch',
    channel: 'twitter',
    totalUsers: 4820,
    conversions: 892,
    dropOffs: 3928,
    revenue: 132680,
    conversionRate: 18.5,
    avgTouchpoints: 3.4,
    color: '#1DA1F2',
  },
  {
    id: 'goog_brand',
    campaign: 'Google Brand Search',
    channel: 'google',
    totalUsers: 6340,
    conversions: 1584,
    dropOffs: 4756,
    revenue: 245920,
    conversionRate: 24.9,
    avgTouchpoints: 2.1,
    color: '#4285F4',
  },
  {
    id: 'meta_retarget',
    campaign: 'Meta Retargeting Q1',
    channel: 'meta',
    totalUsers: 3150,
    conversions: 756,
    dropOffs: 2394,
    revenue: 98280,
    conversionRate: 24.0,
    avgTouchpoints: 4.2,
    color: '#1877F2',
  },
  {
    id: 'email_nurture',
    campaign: 'Email Nurture Series',
    channel: 'email',
    totalUsers: 2890,
    conversions: 924,
    dropOffs: 1966,
    revenue: 156080,
    conversionRate: 31.9,
    avgTouchpoints: 5.8,
    color: '#10b981',
  },
  {
    id: 'direct_organic',
    campaign: 'Direct / Organic',
    channel: 'direct',
    totalUsers: 5420,
    conversions: 1192,
    dropOffs: 4228,
    revenue: 189600,
    conversionRate: 22.0,
    avgTouchpoints: 1.6,
    color: '#8b5cf6',
  },
];

export const conversionPaths: JourneyPath[] = [
  {
    id: 'path_1',
    label: 'Twitter → Organic Return → Purchase',
    type: 'conversion',
    users: 412,
    percentage: 28.4,
    steps: [
      { label: 'Twitter Ad Click', channel: 'Twitter', action: 'Clicked promoted tweet', timestamp: 'Day 1', usersRemaining: 4820, dropOffCount: 0 },
      { label: 'Landing Page View', channel: 'Website', action: 'Viewed product page', timestamp: 'Day 1', usersRemaining: 3614, dropOffCount: 1206 },
      { label: 'Session Expired', channel: 'Drop-off', action: 'Left without action', timestamp: 'Day 1-3', usersRemaining: 1446, dropOffCount: 2168 },
      { label: 'Direct Return Visit', channel: 'Organic', action: 'Typed URL directly', timestamp: 'Day 5', usersRemaining: 892, dropOffCount: 554 },
      { label: 'Add to Cart', channel: 'Website', action: 'Added product to cart', timestamp: 'Day 5', usersRemaining: 614, dropOffCount: 278 },
      { label: 'Purchase Complete', channel: 'Website', action: 'Completed checkout', timestamp: 'Day 5', usersRemaining: 412, dropOffCount: 202 },
    ],
  },
  {
    id: 'path_2',
    label: 'Google Ad → Email Signup → Nurture → Purchase',
    type: 'conversion',
    users: 684,
    percentage: 47.2,
    steps: [
      { label: 'Google Ad Click', channel: 'Google', action: 'Clicked search ad', timestamp: 'Day 1', usersRemaining: 6340, dropOffCount: 0 },
      { label: 'Landing Page', channel: 'Website', action: 'Viewed pricing page', timestamp: 'Day 1', usersRemaining: 5072, dropOffCount: 1268 },
      { label: 'Email Signup', channel: 'Website', action: 'Subscribed to newsletter', timestamp: 'Day 1', usersRemaining: 2028, dropOffCount: 3044 },
      { label: 'Email Open', channel: 'Email', action: 'Opened nurture email #3', timestamp: 'Day 8', usersRemaining: 1420, dropOffCount: 608 },
      { label: 'Return Visit', channel: 'Email', action: 'Clicked CTA in email', timestamp: 'Day 8', usersRemaining: 982, dropOffCount: 438 },
      { label: 'Purchase Complete', channel: 'Website', action: 'Completed checkout', timestamp: 'Day 8', usersRemaining: 684, dropOffCount: 298 },
    ],
  },
  {
    id: 'path_3',
    label: 'Meta Ad → Browse → Abandon Cart → Retarget → Purchase',
    type: 'conversion',
    users: 356,
    percentage: 24.5,
    steps: [
      { label: 'Meta Ad Impression', channel: 'Meta', action: 'Viewed carousel ad', timestamp: 'Day 1', usersRemaining: 3150, dropOffCount: 0 },
      { label: 'Ad Click', channel: 'Meta', action: 'Clicked through to site', timestamp: 'Day 1', usersRemaining: 1890, dropOffCount: 1260 },
      { label: 'Product Browse', channel: 'Website', action: 'Viewed 3+ products', timestamp: 'Day 1', usersRemaining: 1134, dropOffCount: 756 },
      { label: 'Cart Abandoned', channel: 'Website', action: 'Added to cart, left', timestamp: 'Day 1', usersRemaining: 680, dropOffCount: 454 },
      { label: 'Retarget Ad Click', channel: 'Meta', action: 'Clicked retargeting ad', timestamp: 'Day 4', usersRemaining: 476, dropOffCount: 204 },
      { label: 'Purchase Complete', channel: 'Website', action: 'Completed checkout', timestamp: 'Day 4', usersRemaining: 356, dropOffCount: 120 },
    ],
  },
];

export const dropOffPaths: JourneyPath[] = [
  {
    id: 'drop_1',
    label: 'Twitter → Landing → Bounce (No Return)',
    type: 'dropoff',
    users: 2168,
    percentage: 44.9,
    steps: [
      { label: 'Twitter Ad Click', channel: 'Twitter', action: 'Clicked promoted tweet', timestamp: 'Day 1', usersRemaining: 4820, dropOffCount: 0 },
      { label: 'Landing Page View', channel: 'Website', action: 'Viewed for <10 seconds', timestamp: 'Day 1', usersRemaining: 3614, dropOffCount: 1206 },
      { label: 'Bounce', channel: 'Exit', action: 'Left immediately', timestamp: 'Day 1', usersRemaining: 0, dropOffCount: 2168 },
    ],
  },
  {
    id: 'drop_2',
    label: 'Google → Pricing → Sticker Shock Exit',
    type: 'dropoff',
    users: 1824,
    percentage: 28.8,
    steps: [
      { label: 'Google Ad Click', channel: 'Google', action: 'Clicked search ad', timestamp: 'Day 1', usersRemaining: 6340, dropOffCount: 0 },
      { label: 'Landing Page', channel: 'Website', action: 'Viewed product page', timestamp: 'Day 1', usersRemaining: 5072, dropOffCount: 1268 },
      { label: 'Pricing Page', channel: 'Website', action: 'Navigated to pricing', timestamp: 'Day 1', usersRemaining: 3044, dropOffCount: 2028 },
      { label: 'Exit', channel: 'Exit', action: 'Left after viewing pricing', timestamp: 'Day 1', usersRemaining: 0, dropOffCount: 1824 },
    ],
  },
  {
    id: 'drop_3',
    label: 'Meta → Cart → Checkout Abandon',
    type: 'dropoff',
    users: 454,
    percentage: 14.4,
    steps: [
      { label: 'Meta Ad Click', channel: 'Meta', action: 'Clicked carousel ad', timestamp: 'Day 1', usersRemaining: 1890, dropOffCount: 0 },
      { label: 'Product Browse', channel: 'Website', action: 'Browsed products', timestamp: 'Day 1', usersRemaining: 1134, dropOffCount: 756 },
      { label: 'Add to Cart', channel: 'Website', action: 'Added item to cart', timestamp: 'Day 1', usersRemaining: 680, dropOffCount: 454 },
      { label: 'Checkout Abandon', channel: 'Exit', action: 'Left during checkout', timestamp: 'Day 1', usersRemaining: 0, dropOffCount: 454 },
    ],
  },
];

export const globalFunnel: FunnelStage[] = [
  { stage: 'Impression / Click', users: 22620, dropOff: 0, conversionRate: 100 },
  { stage: 'Landing Page View', users: 17262, dropOff: 5358, conversionRate: 76.3 },
  { stage: 'Engagement (>30s)', users: 9844, dropOff: 7418, conversionRate: 43.5 },
  { stage: 'Signup / Email Capture', users: 5420, dropOff: 4424, conversionRate: 24.0 },
  { stage: 'Return Visit', users: 3892, dropOff: 1528, conversionRate: 17.2 },
  { stage: 'Add to Cart', users: 2614, dropOff: 1278, conversionRate: 11.6 },
  { stage: 'Checkout Started', users: 1842, dropOff: 772, conversionRate: 8.1 },
  { stage: 'Purchase Complete', users: 1452, dropOff: 390, conversionRate: 6.4 },
];
