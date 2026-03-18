/*
 * COMPREHENSIVE SAMPLE DATA FOR ALL DASHBOARD COMPONENTS
 * Provides detailed analytics data for campaigns, users, journeys, and attribution
 */

// Campaign Overview Data
export const campaignOverviewData = {
  totalCampaigns: 24,
  activeCampaigns: 18,
  totalSpend: 125400,
  totalRevenue: 487250,
  averageROI: 3.88,
  topCampaign: 'Q1 Product Launch',
  topCampaignROI: 5.8,
};

// KPI Cards Data
export const kpiMetrics = [
  {
    title: 'Total Identities',
    value: '284.7K',
    change: '+12.5%',
    trend: 'up',
    icon: 'Users',
    color: 'blue',
  },
  {
    title: 'Resolution Rate',
    value: '84.9%',
    change: '+2.3%',
    trend: 'up',
    icon: 'Target',
    color: 'green',
  },
  {
    title: 'Avg Confidence',
    value: '91.2%',
    change: '+1.8%',
    trend: 'up',
    icon: 'CheckCircle',
    color: 'purple',
  },
  {
    title: 'Graph Nodes',
    value: '1.2M',
    change: '+8.4%',
    trend: 'up',
    icon: 'Network',
    color: 'orange',
  },
];

// Campaign Performance Data
export const campaignPerformanceData = [
  {
    id: 'camp-001',
    name: 'Q1 Product Launch',
    status: 'Active',
    channels: 4,
    spend: 25000,
    revenue: 145000,
    conversions: 2847,
    roi: 5.8,
    cpa: 8.79,
    roas: 5.8,
    trend: '+18%',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
  },
  {
    id: 'camp-002',
    name: 'Summer Sale 2026',
    status: 'Active',
    channels: 4,
    spend: 32000,
    revenue: 156800,
    conversions: 3124,
    roi: 4.9,
    cpa: 10.24,
    roas: 4.9,
    trend: '+22%',
    startDate: '2026-02-01',
    endDate: '2026-08-31',
  },
  {
    id: 'camp-003',
    name: 'Enterprise Upsell',
    status: 'Active',
    channels: 3,
    spend: 18500,
    revenue: 98700,
    conversions: 1245,
    roi: 5.3,
    cpa: 14.86,
    roas: 5.3,
    trend: '+15%',
    startDate: '2026-02-15',
    endDate: '2026-06-30',
  },
  {
    id: 'camp-004',
    name: 'Holiday Campaign',
    status: 'Planning',
    channels: 5,
    spend: 0,
    revenue: 0,
    conversions: 0,
    roi: 0,
    cpa: 0,
    roas: 0,
    trend: 'Pending',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
  },
];

// User Sessions Data
export const userSessionsData = [
  {
    userId: 'user-001',
    email: 'sarah.k@example.com',
    name: 'Sarah K.',
    location: 'San Francisco, CA',
    device: 'iPhone 14 Pro',
    browser: 'Safari',
    lastActive: '2026-03-16 14:32:00',
    sessions: 12,
    conversions: 3,
    revenue: 450,
    status: 'Active',
    tags: ['VIP', 'Repeat Customer'],
  },
  {
    userId: 'user-002',
    email: 'marcus.t@example.com',
    name: 'Marcus T.',
    location: 'New York, NY',
    device: 'MacBook Pro',
    browser: 'Chrome',
    lastActive: '2026-03-16 13:15:00',
    sessions: 8,
    conversions: 2,
    revenue: 320,
    status: 'Active',
    tags: ['Enterprise'],
  },
  {
    userId: 'user-003',
    email: 'priya.m@example.com',
    name: 'Priya M.',
    location: 'Austin, TX',
    device: 'Samsung Galaxy S21',
    browser: 'Chrome',
    lastActive: '2026-03-15 09:45:00',
    sessions: 5,
    conversions: 1,
    revenue: 180,
    status: 'Inactive',
    tags: ['Mobile First'],
  },
  {
    userId: 'user-004',
    email: 'james.r@example.com',
    name: 'James R.',
    location: 'London, UK',
    device: 'iPad Air',
    browser: 'Safari',
    lastActive: '2026-03-16 11:20:00',
    sessions: 15,
    conversions: 5,
    revenue: 875,
    status: 'Active',
    tags: ['High Value', 'International'],
  },
  {
    userId: 'user-005',
    email: 'elena.v@example.com',
    name: 'Elena V.',
    location: 'Toronto, Canada',
    device: 'Windows PC',
    browser: 'Firefox',
    lastActive: '2026-03-14 16:30:00',
    sessions: 3,
    conversions: 0,
    revenue: 0,
    status: 'Inactive',
    tags: ['Prospect'],
  },
];

// User Fingerprints Data
export const userFingerprintsData = [
  {
    fingerprintId: 'fp-001',
    userId: 'user-001',
    devices: [
      { id: 'dev-001', type: 'iPhone 14 Pro', os: 'iOS 16', lastSeen: '2026-03-16' },
      { id: 'dev-002', type: 'iPad Air', os: 'iOS 16', lastSeen: '2026-03-14' },
    ],
    channels: ['Email', 'Social Media', 'Organic Search'],
    firstSeen: '2025-11-20',
    lastSeen: '2026-03-16',
    totalSessions: 12,
    totalConversions: 3,
    confidence: 94.2,
    status: 'Verified',
  },
  {
    fingerprintId: 'fp-002',
    userId: 'user-002',
    devices: [
      { id: 'dev-003', type: 'MacBook Pro', os: 'macOS Ventura', lastSeen: '2026-03-16' },
      { id: 'dev-004', type: 'iPhone 13', os: 'iOS 16', lastSeen: '2026-03-15' },
    ],
    channels: ['Paid Ads', 'Email', 'Direct'],
    firstSeen: '2025-12-05',
    lastSeen: '2026-03-16',
    totalSessions: 8,
    totalConversions: 2,
    confidence: 89.7,
    status: 'Verified',
  },
  {
    fingerprintId: 'fp-003',
    userId: 'user-003',
    devices: [
      { id: 'dev-005', type: 'Samsung Galaxy S21', os: 'Android 12', lastSeen: '2026-03-15' },
    ],
    channels: ['Mobile App', 'Social Media'],
    firstSeen: '2026-02-10',
    lastSeen: '2026-03-15',
    totalSessions: 5,
    totalConversions: 1,
    confidence: 76.3,
    status: 'Verified',
  },
];

// User Journey Data
export const userJourneyData = [
  {
    journeyId: 'journey-001',
    userId: 'user-001',
    startDate: '2025-11-20',
    endDate: '2026-03-16',
    touchpoints: [
      { date: '2025-11-20', channel: 'Organic Search', action: 'Page View', value: 0 },
      { date: '2025-11-21', channel: 'Email', action: 'Email Open', value: 0 },
      { date: '2025-11-22', channel: 'Email', action: 'Click', value: 0 },
      { date: '2025-11-25', channel: 'Paid Ads', action: 'Ad Click', value: 0 },
      { date: '2025-11-28', channel: 'Social Media', action: 'Post Engagement', value: 0 },
      { date: '2025-12-05', channel: 'Email', action: 'Conversion', value: 150 },
      { date: '2026-01-10', channel: 'Direct', action: 'Conversion', value: 200 },
      { date: '2026-03-16', channel: 'Email', action: 'Conversion', value: 100 },
    ],
    totalValue: 450,
    status: 'Active',
  },
  {
    journeyId: 'journey-002',
    userId: 'user-004',
    startDate: '2025-12-01',
    endDate: '2026-03-16',
    touchpoints: [
      { date: '2025-12-01', channel: 'Paid Ads', action: 'Ad Click', value: 0 },
      { date: '2025-12-02', channel: 'Organic Search', action: 'Page View', value: 0 },
      { date: '2025-12-05', channel: 'Email', action: 'Email Open', value: 0 },
      { date: '2025-12-10', channel: 'Email', action: 'Conversion', value: 175 },
      { date: '2026-01-15', channel: 'Direct', action: 'Conversion', value: 200 },
      { date: '2026-02-20', channel: 'Social Media', action: 'Post Engagement', value: 0 },
      { date: '2026-03-05', channel: 'Email', action: 'Conversion', value: 300 },
      { date: '2026-03-16', channel: 'Direct', action: 'Conversion', value: 200 },
    ],
    totalValue: 875,
    status: 'Active',
  },
];

// Attribution Models Data
export const attributionModelsData = [
  {
    model: 'First Touch',
    organic: 45000,
    email: 32000,
    paidAds: 78000,
    social: 28000,
    direct: 35000,
    other: 15000,
  },
  {
    model: 'Last Touch',
    organic: 62000,
    email: 48000,
    paidAds: 65000,
    social: 42000,
    direct: 52000,
    other: 12000,
  },
  {
    model: 'Linear',
    organic: 54000,
    email: 42000,
    paidAds: 71000,
    social: 36000,
    direct: 44000,
    other: 14000,
  },
  {
    model: 'Time Decay',
    organic: 58000,
    email: 45000,
    paidAds: 68000,
    social: 39000,
    direct: 48000,
    other: 13000,
  },
];

// Geographic Distribution Data
export const geographicData = [
  {
    country: 'United States',
    users: 145000,
    sessions: 456000,
    conversions: 18900,
    revenue: 285000,
    roi: 4.2,
  },
  {
    country: 'Canada',
    users: 32000,
    sessions: 98000,
    conversions: 3850,
    revenue: 58000,
    roi: 3.8,
  },
  {
    country: 'United Kingdom',
    users: 28000,
    sessions: 84000,
    conversions: 3200,
    revenue: 48000,
    roi: 3.5,
  },
  {
    country: 'Australia',
    users: 18000,
    sessions: 52000,
    conversions: 1950,
    revenue: 29000,
    roi: 3.2,
  },
  {
    country: 'Germany',
    users: 15000,
    sessions: 42000,
    conversions: 1600,
    revenue: 24000,
    roi: 3.0,
  },
  {
    country: 'France',
    users: 12000,
    sessions: 35000,
    conversions: 1200,
    revenue: 18000,
    roi: 2.8,
  },
  {
    country: 'Japan',
    users: 22000,
    sessions: 68000,
    conversions: 2800,
    revenue: 42000,
    roi: 3.6,
  },
  {
    country: 'India',
    users: 35000,
    sessions: 105000,
    conversions: 4200,
    revenue: 63000,
    roi: 3.4,
  },
];

// Real-time Events Data
export const realtimeEventsData = [
  {
    id: 'evt-001',
    timestamp: '2026-03-16T14:45:23Z',
    type: 'Conversion',
    user: 'Sarah Johnson',
    campaign: 'Q1 Product Launch',
    channel: 'Email',
    value: 150,
    status: 'Success',
  },
  {
    id: 'evt-002',
    timestamp: '2026-03-16T14:42:15Z',
    type: 'Session Start',
    user: 'Michael Chen',
    campaign: 'Summer Sale 2026',
    channel: 'Paid Ads',
    value: 0,
    status: 'Active',
  },
  {
    id: 'evt-003',
    timestamp: '2026-03-16T14:38:42Z',
    type: 'Conversion',
    user: 'David Kumar',
    campaign: 'Enterprise Upsell',
    channel: 'Direct',
    value: 250,
    status: 'Success',
  },
  {
    id: 'evt-004',
    timestamp: '2026-03-16T14:35:18Z',
    type: 'Page View',
    user: 'Emily Rodriguez',
    campaign: 'Q1 Product Launch',
    channel: 'Organic Search',
    value: 0,
    status: 'Active',
  },
  {
    id: 'evt-005',
    timestamp: '2026-03-16T14:32:05Z',
    type: 'Email Open',
    user: 'Jessica Williams',
    campaign: 'Summer Sale 2026',
    channel: 'Email',
    value: 0,
    status: 'Active',
  },
];

// Conversion Funnel Data
export const conversionFunnelData = [
  {
    stage: 'Awareness',
    users: 284700,
    conversions: 156234,
    dropoff: 128466,
    conversionRate: 54.9,
  },
  {
    stage: 'Consideration',
    users: 156234,
    conversions: 89456,
    dropoff: 66778,
    conversionRate: 57.2,
  },
  {
    stage: 'Decision',
    users: 89456,
    conversions: 45623,
    dropoff: 43833,
    conversionRate: 51.0,
  },
  {
    stage: 'Purchase',
    users: 45623,
    conversions: 35850,
    dropoff: 9773,
    conversionRate: 78.6,
  },
  {
    stage: 'Retention',
    users: 35850,
    conversions: 28680,
    dropoff: 7170,
    conversionRate: 80.0,
  },
];

// Device Performance Data
export const devicePerformanceData = [
  {
    device: 'Desktop',
    users: 145000,
    sessions: 456000,
    conversions: 18900,
    revenue: 285000,
    avgSessionDuration: 345,
    bounceRate: 32,
    roi: 4.5,
  },
  {
    device: 'Mobile',
    users: 125000,
    sessions: 412000,
    conversions: 16800,
    revenue: 168000,
    avgSessionDuration: 234,
    bounceRate: 42,
    roi: 3.2,
  },
  {
    device: 'Tablet',
    users: 14700,
    sessions: 42000,
    conversions: 1200,
    revenue: 18000,
    avgSessionDuration: 289,
    bounceRate: 38,
    roi: 3.0,
  },
];

// Browser Performance Data
export const browserPerformanceData = [
  { browser: 'Chrome', users: 156000, conversions: 14520, roi: 4.2 },
  { browser: 'Safari', users: 89000, conversions: 8010, roi: 3.8 },
  { browser: 'Firefox', users: 28000, conversions: 2240, roi: 3.2 },
  { browser: 'Edge', users: 11700, conversions: 1170, roi: 3.0 },
];

// Traffic Sources Data
export const trafficSourcesData = [
  {
    source: 'Organic Search',
    users: 95000,
    sessions: 285000,
    conversions: 12750,
    revenue: 191250,
    roi: 4.8,
  },
  {
    source: 'Paid Ads',
    users: 78000,
    sessions: 234000,
    conversions: 9360,
    revenue: 140400,
    roi: 3.6,
  },
  {
    source: 'Email',
    users: 52000,
    sessions: 156000,
    conversions: 8320,
    revenue: 124800,
    roi: 5.2,
  },
  {
    source: 'Social Media',
    users: 42000,
    sessions: 126000,
    conversions: 4200,
    revenue: 63000,
    roi: 3.0,
  },
  {
    source: 'Direct',
    users: 17700,
    sessions: 53100,
    conversions: 1770,
    revenue: 26550,
    roi: 4.5,
  },
];

// Hourly Activity Data
export const hourlyActivityData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  sessions: Math.floor(Math.random() * 5000) + 2000,
  conversions: Math.floor(Math.random() * 500) + 100,
  revenue: Math.floor(Math.random() * 50000) + 10000,
}));

// Daily Activity Data (Last 30 days)
export const dailyActivityData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    sessions: Math.floor(Math.random() * 20000) + 10000,
    conversions: Math.floor(Math.random() * 2000) + 500,
    revenue: Math.floor(Math.random() * 200000) + 50000,
    users: Math.floor(Math.random() * 8000) + 3000,
  };
});
