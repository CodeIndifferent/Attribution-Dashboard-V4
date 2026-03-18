/*
 * LUCIA ATTRIBUTION — ANALYTICS DATA
 * Global traffic distribution, user demographics, trends, and behavior
 * tied to each trackable link.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GeoCountry {
  country: string;
  code: string;
  region: string;
  users: number;
  sessions: number;
  conversions: number;
  revenue: number;
  bounceRate: number;
  avgSessionDuration: number; // seconds
  roi: number;
}

export interface DemographicSlice {
  label: string;
  users: number;
  conversions: number;
  revenue: number;
  pct: number;
}

export interface TrendPoint {
  date: string;
  sessions: number;
  users: number;
  conversions: number;
  revenue: number;
  newUsers: number;
  returningUsers: number;
}

export interface BehaviorMetric {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number;
  conversions: number;
  exitRate: number;
}

export interface DeviceSplit {
  device: string;
  users: number;
  sessions: number;
  conversions: number;
  revenue: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface ChannelSplit {
  channel: string;
  users: number;
  sessions: number;
  conversions: number;
  revenue: number;
  roi: number;
  color: string;
}

export interface LinkAnalytics {
  linkId: string;
  linkName: string;
  shortCode: string;
  geo: GeoCountry[];
  ageGroups: DemographicSlice[];
  genderSplit: DemographicSlice[];
  interests: DemographicSlice[];
  deviceSplit: DeviceSplit[];
  channelSplit: ChannelSplit[];
  topPages: BehaviorMetric[];
  trend30d: TrendPoint[];
  hourlyActivity: { hour: string; sessions: number; conversions: number }[];
  kpi: {
    totalUsers: number;
    newUsers: number;
    returningUsers: number;
    avgSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
    conversionRate: number;
    supercookieResolutionRate: number;
    crossDeviceMatchRate: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const seed = (n: number) => n;
const jitter = (base: number, variance: number, i: number) =>
  Math.round(base + Math.sin(i * 1.7 + 0.5) * variance + Math.cos(i * 0.9) * variance * 0.4);

function makeTrend(
  baseUsers: number, baseSessions: number, baseConv: number, baseRev: number
): TrendPoint[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-02-17');
    d.setDate(d.getDate() + i);
    const u = jitter(baseUsers, baseUsers * 0.18, i);
    const s = jitter(baseSessions, baseSessions * 0.2, i);
    const c = jitter(baseConv, baseConv * 0.22, i);
    const r = jitter(baseRev, baseRev * 0.15, i);
    const nu = Math.round(u * 0.62);
    return {
      date: d.toISOString().split('T')[0],
      sessions: Math.max(s, 100),
      users: Math.max(u, 50),
      conversions: Math.max(c, 5),
      revenue: Math.max(r, 500),
      newUsers: Math.max(nu, 20),
      returningUsers: Math.max(u - nu, 10),
    };
  });
}

function makeHourly(peakHour: number, baseConv: number) {
  return Array.from({ length: 24 }, (_, h) => {
    const dist = Math.abs(h - peakHour);
    const factor = Math.exp(-dist * dist / 18);
    return {
      hour: `${h.toString().padStart(2, '0')}:00`,
      sessions: Math.round(800 + factor * 3200 + Math.sin(h) * 200),
      conversions: Math.round(baseConv * factor + 5),
    };
  });
}

// ─── Shared geo base ──────────────────────────────────────────────────────────
const geoBase: GeoCountry[] = [
  { country: 'United States', code: 'US', region: 'North America', users: 58400, sessions: 182000, conversions: 7280, revenue: 109200, bounceRate: 31, avgSessionDuration: 342, roi: 4.6 },
  { country: 'United Kingdom', code: 'GB', region: 'Europe', users: 14200, sessions: 43800, conversions: 1562, revenue: 23430, bounceRate: 34, avgSessionDuration: 298, roi: 4.1 },
  { country: 'Canada', code: 'CA', region: 'North America', users: 11800, sessions: 36200, conversions: 1298, revenue: 19470, bounceRate: 33, avgSessionDuration: 318, roi: 4.0 },
  { country: 'Germany', code: 'DE', region: 'Europe', users: 9600, sessions: 28800, conversions: 960, revenue: 14400, bounceRate: 36, avgSessionDuration: 276, roi: 3.8 },
  { country: 'Australia', code: 'AU', region: 'Oceania', users: 8400, sessions: 25200, conversions: 840, revenue: 12600, bounceRate: 37, avgSessionDuration: 261, roi: 3.7 },
  { country: 'France', code: 'FR', region: 'Europe', users: 7200, sessions: 21600, conversions: 648, revenue: 9720, bounceRate: 39, avgSessionDuration: 247, roi: 3.4 },
  { country: 'Japan', code: 'JP', region: 'Asia', users: 6800, sessions: 20400, conversions: 612, revenue: 9180, bounceRate: 41, avgSessionDuration: 234, roi: 3.3 },
  { country: 'India', code: 'IN', region: 'Asia', users: 6200, sessions: 18600, conversions: 434, revenue: 6510, bounceRate: 48, avgSessionDuration: 198, roi: 2.8 },
  { country: 'Brazil', code: 'BR', region: 'South America', users: 5400, sessions: 16200, conversions: 378, revenue: 5670, bounceRate: 46, avgSessionDuration: 212, roi: 2.9 },
  { country: 'Netherlands', code: 'NL', region: 'Europe', users: 4800, sessions: 14400, conversions: 432, revenue: 6480, bounceRate: 32, avgSessionDuration: 312, roi: 4.2 },
  { country: 'Singapore', code: 'SG', region: 'Asia', users: 4200, sessions: 12600, conversions: 420, revenue: 6300, bounceRate: 30, avgSessionDuration: 334, roi: 4.5 },
  { country: 'Mexico', code: 'MX', region: 'North America', users: 3800, sessions: 11400, conversions: 266, revenue: 3990, bounceRate: 44, avgSessionDuration: 221, roi: 2.7 },
  { country: 'Sweden', code: 'SE', region: 'Europe', users: 3400, sessions: 10200, conversions: 306, revenue: 4590, bounceRate: 33, avgSessionDuration: 289, roi: 3.9 },
  { country: 'South Korea', code: 'KR', region: 'Asia', users: 3200, sessions: 9600, conversions: 288, revenue: 4320, bounceRate: 38, avgSessionDuration: 256, roi: 3.5 },
  { country: 'UAE', code: 'AE', region: 'Middle East', users: 2800, sessions: 8400, conversions: 280, revenue: 4200, bounceRate: 35, avgSessionDuration: 301, roi: 4.0 },
];

// ─── Overview (all links combined) ───────────────────────────────────────────
export const overviewAnalytics: LinkAnalytics = {
  linkId: 'overview',
  linkName: 'All Links — Overview',
  shortCode: 'ALL',
  geo: geoBase,
  ageGroups: [
    { label: '18–24', users: 28400, conversions: 1420, revenue: 21300, pct: 19 },
    { label: '25–34', users: 52600, conversions: 3682, revenue: 55230, pct: 35 },
    { label: '35–44', users: 38200, conversions: 2674, revenue: 40110, pct: 25 },
    { label: '45–54', users: 19800, conversions: 1386, revenue: 20790, pct: 13 },
    { label: '55–64', users: 8400, conversions: 504, revenue: 7560, pct: 6 },
    { label: '65+', users: 2600, conversions: 130, revenue: 1950, pct: 2 },
  ],
  genderSplit: [
    { label: 'Male', users: 82600, conversions: 5782, revenue: 86730, pct: 55 },
    { label: 'Female', users: 63400, conversions: 4438, revenue: 66570, pct: 42 },
    { label: 'Non-binary', users: 4000, conversions: 280, revenue: 4200, pct: 3 },
  ],
  interests: [
    { label: 'Technology', users: 54200, conversions: 3794, revenue: 56910, pct: 36 },
    { label: 'Finance / DeFi', users: 34800, conversions: 2436, revenue: 36540, pct: 23 },
    { label: 'E-commerce', users: 27600, conversions: 1932, revenue: 28980, pct: 18 },
    { label: 'Gaming', users: 16400, conversions: 984, revenue: 14760, pct: 11 },
    { label: 'Health & Wellness', users: 10200, conversions: 612, revenue: 9180, pct: 7 },
    { label: 'Travel', users: 6800, conversions: 340, revenue: 5100, pct: 5 },
  ],
  deviceSplit: [
    { device: 'Desktop', users: 72400, sessions: 226000, conversions: 5792, revenue: 86880, avgSessionDuration: 347, bounceRate: 29 },
    { device: 'Mobile', users: 64800, sessions: 202000, conversions: 4536, revenue: 68040, avgSessionDuration: 218, bounceRate: 44 },
    { device: 'Tablet', users: 12800, sessions: 40000, conversions: 896, revenue: 13440, avgSessionDuration: 291, bounceRate: 36 },
  ],
  channelSplit: [
    { channel: 'Social Media', users: 42200, sessions: 131000, conversions: 2954, revenue: 44310, roi: 4.8, color: '#3b82f6' },
    { channel: 'Email', users: 38600, sessions: 120000, conversions: 4246, revenue: 63690, roi: 7.2, color: '#10b981' },
    { channel: 'Paid Ads', users: 34800, sessions: 108000, conversions: 2436, revenue: 36540, roi: 2.9, color: '#f59e0b' },
    { channel: 'Organic', users: 22400, sessions: 70000, conversions: 1568, revenue: 23520, roi: 5.4, color: '#8b5cf6' },
    { channel: 'Article', users: 8600, sessions: 27000, conversions: 602, revenue: 9030, roi: 5.8, color: '#06b6d4' },
    { channel: 'Influencer', users: 3400, sessions: 10600, conversions: 238, revenue: 3570, roi: 4.1, color: '#ec4899' },
  ],
  topPages: [
    { page: '/products/new-widget', views: 48200, uniqueVisitors: 38600, avgTimeOnPage: 187, bounceRate: 28, conversions: 2892, exitRate: 22 },
    { page: '/pricing', views: 36400, uniqueVisitors: 29100, avgTimeOnPage: 142, bounceRate: 34, conversions: 1820, exitRate: 31 },
    { page: '/checkout', views: 24800, uniqueVisitors: 19840, avgTimeOnPage: 98, bounceRate: 12, conversions: 3720, exitRate: 8 },
    { page: '/features', views: 22600, uniqueVisitors: 18080, avgTimeOnPage: 213, bounceRate: 31, conversions: 904, exitRate: 28 },
    { page: '/blog/attribution-guide', views: 18400, uniqueVisitors: 14720, avgTimeOnPage: 312, bounceRate: 42, conversions: 552, exitRate: 38 },
    { page: '/enterprise/demo', views: 12800, uniqueVisitors: 10240, avgTimeOnPage: 267, bounceRate: 19, conversions: 768, exitRate: 15 },
    { page: '/landing', views: 11200, uniqueVisitors: 8960, avgTimeOnPage: 124, bounceRate: 52, conversions: 448, exitRate: 48 },
  ],
  trend30d: makeTrend(5000, 15600, 740, 111000),
  hourlyActivity: makeHourly(14, 42),
  kpi: {
    totalUsers: 150000,
    newUsers: 93000,
    returningUsers: 57000,
    avgSessionDuration: 287,
    bounceRate: 36,
    pagesPerSession: 3.8,
    conversionRate: 7.3,
    supercookieResolutionRate: 88.4,
    crossDeviceMatchRate: 64.8,
  },
};

// ─── Per-link analytics ───────────────────────────────────────────────────────
export const linkAnalyticsMap: Record<string, LinkAnalytics> = {
  'tl-001': {
    linkId: 'tl-001',
    linkName: 'Q1 Product Launch — Widget',
    shortCode: 'WIDGET-Q1',
    geo: geoBase.map(g => ({ ...g, users: Math.round(g.users * 0.48), sessions: Math.round(g.sessions * 0.48), conversions: Math.round(g.conversions * 0.46), revenue: Math.round(g.revenue * 0.46) })),
    ageGroups: [
      { label: '18–24', users: 9800, conversions: 588, revenue: 8820, pct: 23 },
      { label: '25–34', users: 17200, conversions: 1204, revenue: 18060, pct: 40 },
      { label: '35–44', users: 10800, conversions: 756, revenue: 11340, pct: 25 },
      { label: '45–54', users: 4200, conversions: 252, revenue: 3780, pct: 10 },
      { label: '55+', users: 800, conversions: 40, revenue: 600, pct: 2 },
    ],
    genderSplit: [
      { label: 'Male', users: 26400, conversions: 1848, revenue: 27720, pct: 61 },
      { label: 'Female', users: 15200, conversions: 1064, revenue: 15960, pct: 35 },
      { label: 'Non-binary', users: 1600, conversions: 112, revenue: 1680, pct: 4 },
    ],
    interests: [
      { label: 'Technology', users: 19800, conversions: 1386, revenue: 20790, pct: 46 },
      { label: 'E-commerce', users: 10200, conversions: 714, revenue: 10710, pct: 24 },
      { label: 'Finance / DeFi', users: 7600, conversions: 532, revenue: 7980, pct: 18 },
      { label: 'Gaming', users: 3400, conversions: 204, revenue: 3060, pct: 8 },
      { label: 'Other', users: 2200, conversions: 110, revenue: 1650, pct: 5 },
    ],
    deviceSplit: [
      { device: 'Desktop', users: 22800, sessions: 71000, conversions: 1824, revenue: 27360, avgSessionDuration: 312, bounceRate: 27 },
      { device: 'Mobile', users: 18600, sessions: 58000, conversions: 1302, revenue: 19530, avgSessionDuration: 198, bounceRate: 46 },
      { device: 'Tablet', users: 1800, sessions: 5600, conversions: 108, revenue: 1620, avgSessionDuration: 267, bounceRate: 34 },
    ],
    channelSplit: [
      { channel: 'Social Media', users: 18200, sessions: 56600, conversions: 1274, revenue: 19110, roi: 5.2, color: '#3b82f6' },
      { channel: 'Email', users: 12400, sessions: 38600, conversions: 1488, revenue: 22320, roi: 6.97, color: '#10b981' },
      { channel: 'Paid Ads', users: 9800, sessions: 30500, conversions: 588, revenue: 8820, roi: 2.46, color: '#f59e0b' },
      { channel: 'Article', users: 2800, sessions: 8700, conversions: 196, revenue: 2940, roi: 6.78, color: '#06b6d4' },
    ],
    topPages: [
      { page: '/products/new-widget', views: 28400, uniqueVisitors: 22700, avgTimeOnPage: 198, bounceRate: 24, conversions: 1704, exitRate: 19 },
      { page: '/pricing', views: 18200, uniqueVisitors: 14560, avgTimeOnPage: 156, bounceRate: 31, conversions: 910, exitRate: 28 },
      { page: '/checkout', views: 12400, uniqueVisitors: 9920, avgTimeOnPage: 87, bounceRate: 10, conversions: 1860, exitRate: 7 },
      { page: '/features', views: 9800, uniqueVisitors: 7840, avgTimeOnPage: 224, bounceRate: 28, conversions: 392, exitRate: 24 },
    ],
    trend30d: makeTrend(1420, 4420, 98, 14700),
    hourlyActivity: makeHourly(13, 18),
    kpi: { totalUsers: 43200, newUsers: 28100, returningUsers: 15100, avgSessionDuration: 267, bounceRate: 34, pagesPerSession: 3.6, conversionRate: 6.8, supercookieResolutionRate: 87.4, crossDeviceMatchRate: 64.2 },
  },

  'tl-002': {
    linkId: 'tl-002',
    linkName: 'Summer Sale 2026 — Homepage',
    shortCode: 'SUMMER26',
    geo: geoBase.map(g => ({ ...g, users: Math.round(g.users * 0.44), sessions: Math.round(g.sessions * 0.44), conversions: Math.round(g.conversions * 0.47), revenue: Math.round(g.revenue * 0.47) })),
    ageGroups: [
      { label: '18–24', users: 11200, conversions: 784, revenue: 11760, pct: 28 },
      { label: '25–34', users: 16800, conversions: 1344, revenue: 20160, pct: 42 },
      { label: '35–44', users: 8000, conversions: 560, revenue: 8400, pct: 20 },
      { label: '45–54', users: 3200, conversions: 192, revenue: 2880, pct: 8 },
      { label: '55+', users: 800, conversions: 40, revenue: 600, pct: 2 },
    ],
    genderSplit: [
      { label: 'Male', users: 20800, conversions: 1664, revenue: 24960, pct: 52 },
      { label: 'Female', users: 17600, conversions: 1408, revenue: 21120, pct: 44 },
      { label: 'Non-binary', users: 1600, conversions: 128, revenue: 1920, pct: 4 },
    ],
    interests: [
      { label: 'E-commerce', users: 16000, conversions: 1280, revenue: 19200, pct: 40 },
      { label: 'Technology', users: 12000, conversions: 960, revenue: 14400, pct: 30 },
      { label: 'Health & Wellness', users: 5600, conversions: 392, revenue: 5880, pct: 14 },
      { label: 'Finance / DeFi', users: 4000, conversions: 280, revenue: 4200, pct: 10 },
      { label: 'Travel', users: 2400, conversions: 144, revenue: 2160, pct: 6 },
    ],
    deviceSplit: [
      { device: 'Mobile', users: 24800, sessions: 77000, conversions: 1984, revenue: 29760, avgSessionDuration: 224, bounceRate: 41 },
      { device: 'Desktop', users: 13200, sessions: 41000, conversions: 1188, revenue: 17820, avgSessionDuration: 334, bounceRate: 28 },
      { device: 'Tablet', users: 2000, sessions: 6200, conversions: 160, revenue: 2400, avgSessionDuration: 278, bounceRate: 37 },
    ],
    channelSplit: [
      { channel: 'Social Media', users: 22400, sessions: 69600, conversions: 1792, revenue: 26880, roi: 4.9, color: '#3b82f6' },
      { channel: 'Email', users: 11200, sessions: 34800, conversions: 1232, revenue: 18480, roi: 10.0, color: '#10b981' },
      { channel: 'Influencer', users: 6400, sessions: 19900, conversions: 512, revenue: 7680, roi: 4.3, color: '#ec4899' },
    ],
    topPages: [
      { page: '/summer-sale', views: 22400, uniqueVisitors: 17920, avgTimeOnPage: 168, bounceRate: 38, conversions: 1344, exitRate: 34 },
      { page: '/products/new-widget', views: 14800, uniqueVisitors: 11840, avgTimeOnPage: 176, bounceRate: 29, conversions: 888, exitRate: 25 },
      { page: '/checkout', views: 9600, uniqueVisitors: 7680, avgTimeOnPage: 92, bounceRate: 11, conversions: 1440, exitRate: 8 },
      { page: '/features', views: 7200, uniqueVisitors: 5760, avgTimeOnPage: 198, bounceRate: 33, conversions: 288, exitRate: 29 },
    ],
    trend30d: makeTrend(1320, 4110, 104, 15600),
    hourlyActivity: makeHourly(15, 21),
    kpi: { totalUsers: 40000, newUsers: 27200, returningUsers: 12800, avgSessionDuration: 278, bounceRate: 37, pagesPerSession: 3.4, conversionRate: 7.8, supercookieResolutionRate: 91.2, crossDeviceMatchRate: 71.8 },
  },

  'tl-003': {
    linkId: 'tl-003',
    linkName: 'Enterprise Upsell — Demo CTA',
    shortCode: 'ENT-DEMO',
    geo: geoBase.map(g => ({ ...g, users: Math.round(g.users * 0.12), sessions: Math.round(g.sessions * 0.12), conversions: Math.round(g.conversions * 0.08), revenue: Math.round(g.revenue * 0.12) })),
    ageGroups: [
      { label: '25–34', users: 3200, conversions: 160, revenue: 32000, pct: 25 },
      { label: '35–44', users: 5600, conversions: 280, revenue: 56000, pct: 44 },
      { label: '45–54', users: 2800, conversions: 140, revenue: 28000, pct: 22 },
      { label: '55+', users: 1200, conversions: 60, revenue: 12000, pct: 9 },
    ],
    genderSplit: [
      { label: 'Male', users: 8400, conversions: 420, revenue: 84000, pct: 66 },
      { label: 'Female', users: 3800, conversions: 190, revenue: 38000, pct: 30 },
      { label: 'Non-binary', users: 600, conversions: 30, revenue: 6000, pct: 4 },
    ],
    interests: [
      { label: 'Finance / DeFi', users: 4800, conversions: 240, revenue: 48000, pct: 38 },
      { label: 'Technology', users: 4200, conversions: 210, revenue: 42000, pct: 33 },
      { label: 'E-commerce', users: 2000, conversions: 100, revenue: 20000, pct: 16 },
      { label: 'Other B2B', users: 1800, conversions: 90, revenue: 18000, pct: 14 },
    ],
    deviceSplit: [
      { device: 'Desktop', users: 10800, sessions: 33600, conversions: 540, revenue: 108000, avgSessionDuration: 412, bounceRate: 18 },
      { device: 'Mobile', users: 1800, sessions: 5600, conversions: 90, revenue: 18000, avgSessionDuration: 234, bounceRate: 38 },
      { device: 'Tablet', users: 200, sessions: 620, conversions: 10, revenue: 2000, avgSessionDuration: 312, bounceRate: 28 },
    ],
    channelSplit: [
      { channel: 'Email', users: 6200, sessions: 19300, conversions: 372, revenue: 74400, roi: 8.0, color: '#10b981' },
      { channel: 'Paid Ads', users: 4400, sessions: 13700, conversions: 176, revenue: 35200, roi: 4.0, color: '#f59e0b' },
      { channel: 'Article', users: 2200, sessions: 6800, conversions: 88, revenue: 17600, roi: 6.0, color: '#06b6d4' },
    ],
    topPages: [
      { page: '/enterprise/demo', views: 9800, uniqueVisitors: 7840, avgTimeOnPage: 312, bounceRate: 16, conversions: 588, exitRate: 12 },
      { page: '/enterprise/pricing', views: 6400, uniqueVisitors: 5120, avgTimeOnPage: 224, bounceRate: 22, conversions: 320, exitRate: 18 },
      { page: '/case-studies', views: 4800, uniqueVisitors: 3840, avgTimeOnPage: 387, bounceRate: 24, conversions: 192, exitRate: 20 },
      { page: '/checkout', views: 2200, uniqueVisitors: 1760, avgTimeOnPage: 112, bounceRate: 8, conversions: 330, exitRate: 6 },
    ],
    trend30d: makeTrend(420, 1310, 18, 36000),
    hourlyActivity: makeHourly(11, 6),
    kpi: { totalUsers: 12800, newUsers: 6400, returningUsers: 6400, avgSessionDuration: 389, bounceRate: 21, pagesPerSession: 4.6, conversionRate: 4.3, supercookieResolutionRate: 93.6, crossDeviceMatchRate: 58.4 },
  },
};

// ─── Region rollup for overview ───────────────────────────────────────────────
export const regionRollup = [
  { region: 'North America', users: 74000, sessions: 229600, conversions: 8844, revenue: 132660, pct: 49 },
  { region: 'Europe', users: 39200, sessions: 118800, conversions: 3908, revenue: 58620, pct: 26 },
  { region: 'Asia', users: 20400, sessions: 61200, conversions: 1734, revenue: 26010, pct: 14 },
  { region: 'South America', users: 8200, sessions: 24600, conversions: 574, revenue: 8610, pct: 5 },
  { region: 'Oceania', users: 5600, sessions: 16800, conversions: 504, revenue: 7560, pct: 4 },
  { region: 'Middle East', users: 2600, sessions: 7800, conversions: 234, revenue: 3510, pct: 2 },
];

// ─── Behavior funnel ──────────────────────────────────────────────────────────
export const behaviorFunnel = [
  { stage: 'Link Click', users: 95800, pct: 100 },
  { stage: 'Landing Page', users: 82400, pct: 86 },
  { stage: 'Product View', users: 56200, pct: 59 },
  { stage: 'Add to Cart', users: 28400, pct: 30 },
  { stage: 'Checkout', users: 18600, pct: 19 },
  { stage: 'Purchase', users: 11224, pct: 12 },
];

// ─── User intent signals ──────────────────────────────────────────────────────
export const intentSignals = [
  { signal: 'Pricing page visit', users: 36400, highIntent: true, conversionRate: 5.0 },
  { signal: 'Demo request', users: 9800, highIntent: true, conversionRate: 7.8 },
  { signal: '3+ page views', users: 48200, highIntent: true, conversionRate: 6.2 },
  { signal: 'Return visit (2+ sessions)', users: 57000, highIntent: true, conversionRate: 8.4 },
  { signal: 'Wallet connected', users: 22400, highIntent: true, conversionRate: 12.1 },
  { signal: 'Single page bounce', users: 34200, highIntent: false, conversionRate: 0.8 },
  { signal: 'Mobile, < 30s session', users: 18600, highIntent: false, conversionRate: 0.4 },
];

// ─── Weekly cohort retention ──────────────────────────────────────────────────
export const cohortRetention = [
  { week: 'Week 1', w0: 100, w1: 48, w2: 34, w3: 26, w4: 21 },
  { week: 'Week 2', w0: 100, w1: 51, w2: 37, w3: 28, w4: 23 },
  { week: 'Week 3', w0: 100, w1: 46, w2: 32, w3: 24, w4: 19 },
  { week: 'Week 4', w0: 100, w1: 53, w2: 39, w3: 30, w4: 25 },
];
