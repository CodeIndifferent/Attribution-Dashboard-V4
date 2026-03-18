/*
 * Campaign drill-down data: session-level data, user journeys, and fingerprints
 */

export interface TouchPoint {
  timestamp: string;
  event: string;
  channel: string;
  duration: number; // seconds
  pageUrl?: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  userName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  firstSeen: string;
  lastSeen: string;
  touchpoints: TouchPoint[];
  status: 'converted' | 'abandoned' | 'active';
  conversionValue?: number;
  fingerprint: {
    confidence: number;
    linkedDevices: number;
    linkedEmails: number;
  };
}

export interface CampaignDrilldown {
  campaignId: string;
  campaignName: string;
  channel: string;
  dateRange: { start: string; end: string };
  totalSessions: number;
  convertedSessions: number;
  abandonedSessions: number;
  activeSessions: number;
  conversionRate: number;
  avgSessionDuration: number;
  avgTouchpoints: number;
  sessions: UserSession[];
}

export const campaignDrilldownData: Record<string, CampaignDrilldown> = {
  twitter_campaign: {
    campaignId: 'twitter_campaign',
    campaignName: 'Twitter Campaign',
    channel: 'Twitter',
    dateRange: { start: '2024-03-01', end: '2024-03-16' },
    totalSessions: 1247,
    convertedSessions: 187,
    abandonedSessions: 892,
    activeSessions: 168,
    conversionRate: 15.0,
    avgSessionDuration: 342,
    avgTouchpoints: 3.2,
    sessions: [
      {
        sessionId: 'sess_001',
        userId: 'user_2847',
        userName: 'Sarah K.',
        deviceType: 'MacBook Pro 16"',
        os: 'macOS 14.2',
        browser: 'Chrome 121.0',
        ipAddress: '203.45.128.92',
        firstSeen: '2024-03-15 14:23',
        lastSeen: '2024-03-15 14:45',
        status: 'converted',
        conversionValue: 129.99,
        fingerprint: { confidence: 98, linkedDevices: 2, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-15 14:23', event: 'Click Tweet', channel: 'Twitter', duration: 0, pageUrl: 'twitter.com/campaign' },
          { timestamp: '2024-03-15 14:24', event: 'Landing Page', channel: 'Twitter', duration: 45, pageUrl: 'example.com/promo' },
          { timestamp: '2024-03-15 14:26', event: 'Product View', channel: 'Direct', duration: 120, pageUrl: 'example.com/product/xyz' },
          { timestamp: '2024-03-15 14:29', event: 'Add to Cart', channel: 'Direct', duration: 30, pageUrl: 'example.com/cart' },
          { timestamp: '2024-03-15 14:35', event: 'Checkout', channel: 'Direct', duration: 180, pageUrl: 'example.com/checkout' },
          { timestamp: '2024-03-15 14:45', event: 'Purchase', channel: 'Direct', duration: 0, pageUrl: 'example.com/confirmation' },
        ],
      },
      {
        sessionId: 'sess_002',
        userId: 'user_3124',
        userName: 'Marcus T.',
        deviceType: 'iPhone 15 Pro',
        os: 'iOS 17.3',
        browser: 'Safari',
        ipAddress: '203.45.129.15',
        firstSeen: '2024-03-15 09:12',
        lastSeen: '2024-03-15 09:18',
        status: 'abandoned',
        fingerprint: { confidence: 94, linkedDevices: 1, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-15 09:12', event: 'Click Tweet', channel: 'Twitter', duration: 0, pageUrl: 'twitter.com/campaign' },
          { timestamp: '2024-03-15 09:13', event: 'Landing Page', channel: 'Twitter', duration: 30, pageUrl: 'example.com/promo' },
          { timestamp: '2024-03-15 09:15', event: 'Product View', channel: 'Direct', duration: 180, pageUrl: 'example.com/product/abc' },
          { timestamp: '2024-03-15 09:18', event: 'Exit', channel: 'Direct', duration: 0, pageUrl: 'example.com/product/abc' },
        ],
      },
      {
        sessionId: 'sess_003',
        userId: 'user_4521',
        userName: 'Priya M.',
        deviceType: 'Dell XPS 15',
        os: 'Windows 11',
        browser: 'Firefox 123.0',
        ipAddress: '192.168.1.45',
        firstSeen: '2024-03-14 16:45',
        lastSeen: '2024-03-14 17:02',
        status: 'converted',
        conversionValue: 89.99,
        fingerprint: { confidence: 87, linkedDevices: 2, linkedEmails: 2 },
        touchpoints: [
          { timestamp: '2024-03-14 16:45', event: 'Click Tweet', channel: 'Twitter', duration: 0, pageUrl: 'twitter.com/campaign' },
          { timestamp: '2024-03-14 16:46', event: 'Landing Page', channel: 'Twitter', duration: 60, pageUrl: 'example.com/promo' },
          { timestamp: '2024-03-14 16:50', event: 'Product View', channel: 'Direct', duration: 240, pageUrl: 'example.com/product/xyz' },
          { timestamp: '2024-03-14 16:55', event: 'Add to Cart', channel: 'Direct', duration: 45, pageUrl: 'example.com/cart' },
          { timestamp: '2024-03-14 17:02', event: 'Purchase', channel: 'Direct', duration: 0, pageUrl: 'example.com/confirmation' },
        ],
      },
      {
        sessionId: 'sess_004',
        userId: 'user_5632',
        userName: 'James R.',
        deviceType: 'Samsung Galaxy S24',
        os: 'Android 14',
        browser: 'Chrome Mobile',
        ipAddress: '192.168.1.46',
        firstSeen: '2024-03-14 11:20',
        lastSeen: '2024-03-14 11:35',
        status: 'abandoned',
        fingerprint: { confidence: 91, linkedDevices: 1, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-14 11:20', event: 'Click Tweet', channel: 'Twitter', duration: 0, pageUrl: 'twitter.com/campaign' },
          { timestamp: '2024-03-14 11:21', event: 'Landing Page', channel: 'Twitter', duration: 45, pageUrl: 'example.com/promo' },
          { timestamp: '2024-03-14 11:25', event: 'Product View', channel: 'Direct', duration: 300, pageUrl: 'example.com/product/def' },
          { timestamp: '2024-03-14 11:35', event: 'Exit', channel: 'Direct', duration: 0, pageUrl: 'example.com/product/def' },
        ],
      },
      {
        sessionId: 'sess_005',
        userId: 'user_6743',
        userName: 'Elena V.',
        deviceType: 'iPad Air',
        os: 'iPadOS 17.3',
        browser: 'Safari',
        ipAddress: '203.45.130.22',
        firstSeen: '2024-03-13 19:00',
        lastSeen: '2024-03-13 19:28',
        status: 'converted',
        conversionValue: 199.99,
        fingerprint: { confidence: 96, linkedDevices: 3, linkedEmails: 2 },
        touchpoints: [
          { timestamp: '2024-03-13 19:00', event: 'Click Tweet', channel: 'Twitter', duration: 0, pageUrl: 'twitter.com/campaign' },
          { timestamp: '2024-03-13 19:01', event: 'Landing Page', channel: 'Twitter', duration: 90, pageUrl: 'example.com/promo' },
          { timestamp: '2024-03-13 19:05', event: 'Product View', channel: 'Direct', duration: 360, pageUrl: 'example.com/product/xyz' },
          { timestamp: '2024-03-13 19:12', event: 'Add to Cart', channel: 'Direct', duration: 120, pageUrl: 'example.com/cart' },
          { timestamp: '2024-03-13 19:18', event: 'Checkout', channel: 'Direct', duration: 300, pageUrl: 'example.com/checkout' },
          { timestamp: '2024-03-13 19:28', event: 'Purchase', channel: 'Direct', duration: 0, pageUrl: 'example.com/confirmation' },
        ],
      },
    ],
  },
  google_ads: {
    campaignId: 'google_ads',
    campaignName: 'Google Ads',
    channel: 'Google',
    dateRange: { start: '2024-03-01', end: '2024-03-16' },
    totalSessions: 1842,
    convertedSessions: 239,
    abandonedSessions: 1421,
    activeSessions: 182,
    conversionRate: 13.0,
    avgSessionDuration: 385,
    avgTouchpoints: 2.8,
    sessions: [
      {
        sessionId: 'sess_101',
        userId: 'user_7854',
        userName: 'David L.',
        deviceType: 'MacBook Air',
        os: 'macOS 14.1',
        browser: 'Safari',
        ipAddress: '210.45.200.15',
        firstSeen: '2024-03-16 08:30',
        lastSeen: '2024-03-16 08:52',
        status: 'converted',
        conversionValue: 149.99,
        fingerprint: { confidence: 95, linkedDevices: 2, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-16 08:30', event: 'Click Ad', channel: 'Google', duration: 0, pageUrl: 'google.com/ads' },
          { timestamp: '2024-03-16 08:31', event: 'Landing Page', channel: 'Google', duration: 60, pageUrl: 'example.com/google-promo' },
          { timestamp: '2024-03-16 08:35', event: 'Product View', channel: 'Direct', duration: 480, pageUrl: 'example.com/product/premium' },
          { timestamp: '2024-03-16 08:43', event: 'Add to Cart', channel: 'Direct', duration: 120, pageUrl: 'example.com/cart' },
          { timestamp: '2024-03-16 08:52', event: 'Purchase', channel: 'Direct', duration: 0, pageUrl: 'example.com/confirmation' },
        ],
      },
      {
        sessionId: 'sess_102',
        userId: 'user_8965',
        userName: 'Lisa W.',
        deviceType: 'iPhone 14',
        os: 'iOS 17.2',
        browser: 'Chrome Mobile',
        ipAddress: '210.45.201.88',
        firstSeen: '2024-03-15 13:15',
        lastSeen: '2024-03-15 13:22',
        status: 'abandoned',
        fingerprint: { confidence: 88, linkedDevices: 1, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-15 13:15', event: 'Click Ad', channel: 'Google', duration: 0, pageUrl: 'google.com/ads' },
          { timestamp: '2024-03-15 13:16', event: 'Landing Page', channel: 'Google', duration: 45, pageUrl: 'example.com/google-promo' },
          { timestamp: '2024-03-15 13:22', event: 'Exit', channel: 'Direct', duration: 0, pageUrl: 'example.com/google-promo' },
        ],
      },
    ],
  },
  meta_campaign: {
    campaignId: 'meta_campaign',
    campaignName: 'Meta Campaign',
    channel: 'Meta',
    dateRange: { start: '2024-03-01', end: '2024-03-16' },
    totalSessions: 1521,
    convertedSessions: 228,
    abandonedSessions: 1087,
    activeSessions: 206,
    conversionRate: 15.0,
    avgSessionDuration: 298,
    avgTouchpoints: 2.9,
    sessions: [
      {
        sessionId: 'sess_201',
        userId: 'user_9876',
        userName: 'Alex K.',
        deviceType: 'OnePlus 12',
        os: 'Android 14',
        browser: 'Chrome Mobile',
        ipAddress: '215.67.45.120',
        firstSeen: '2024-03-16 10:45',
        lastSeen: '2024-03-16 11:08',
        status: 'converted',
        conversionValue: 79.99,
        fingerprint: { confidence: 92, linkedDevices: 1, linkedEmails: 1 },
        touchpoints: [
          { timestamp: '2024-03-16 10:45', event: 'Click Ad', channel: 'Meta', duration: 0, pageUrl: 'facebook.com/ads' },
          { timestamp: '2024-03-16 10:46', event: 'Landing Page', channel: 'Meta', duration: 75, pageUrl: 'example.com/meta-promo' },
          { timestamp: '2024-03-16 10:52', event: 'Product View', channel: 'Direct', duration: 240, pageUrl: 'example.com/product/standard' },
          { timestamp: '2024-03-16 11:00', event: 'Add to Cart', channel: 'Direct', duration: 60, pageUrl: 'example.com/cart' },
          { timestamp: '2024-03-16 11:08', event: 'Purchase', channel: 'Direct', duration: 0, pageUrl: 'example.com/confirmation' },
        ],
      },
    ],
  },
};

export function getCampaignDrilldown(campaignId: string): CampaignDrilldown | null {
  return campaignDrilldownData[campaignId] || null;
}
