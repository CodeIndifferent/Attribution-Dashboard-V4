/*
 * LUCIA ATTRIBUTION SYSTEM — TRACKABLE LINK DATA MODEL
 * Links are the canonical source identifiers for every visitor.
 * Each link connects the user's browser cookie to the supercookie,
 * enabling full cross-device, cross-platform journey tracking.
 */

export type ChannelType = 'Social Media' | 'Email' | 'Paid Ads' | 'Organic' | 'Article' | 'Influencer' | 'SMS' | 'Direct';
export type LinkStatus = 'Active' | 'Paused' | 'Expired' | 'Draft';
export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet';

// ─── Supercookie Resolution Event ────────────────────────────────────────────
export interface SupercookieEvent {
  timestamp: string;
  userId: string;
  cookieId: string;
  supercookieId: string;
  deviceType: DeviceType;
  resolved: boolean;
  confidence: number;
}

// ─── Per-Channel Metrics for a Link ──────────────────────────────────────────
export interface LinkChannelMetrics {
  channel: ChannelType;
  clicks: number;
  uniqueVisitors: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  avgTimeOnSite: number; // seconds
  bounceRate: number;    // percent
  deviceBreakdown: { device: DeviceType; users: number; conversions: number; revenue: number }[];
}

// ─── Campaign associated with a link ─────────────────────────────────────────
export interface LinkedCampaign {
  campaignId: string;
  campaignName: string;
  channel: ChannelType;
  status: 'Active' | 'Paused' | 'Completed';
  spend: number;
  revenue: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate?: string;
}

// ─── Core Trackable Link ──────────────────────────────────────────────────────
export interface TrackableLink {
  id: string;
  name: string;
  shortCode: string;
  trackingUrl: string;       // e.g. https://track.lucia.io/l/WIDGET-Q1
  destinationUrl: string;
  description: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  sdkEnabled: boolean;       // Whether Lucia SDK is integrated on destination
  supercookieEnabled: boolean;
  status: LinkStatus;
  createdAt: string;
  expiresAt?: string;
  campaigns: LinkedCampaign[];
  channelMetrics: LinkChannelMetrics[];
  totalClicks: number;
  totalUniqueVisitors: number;
  totalConversions: number;
  totalRevenue: number;
  overallRoi: number;
  supercookieResolutionRate: number; // % of visitors where supercookie was resolved
  crossDeviceMatchRate: number;       // % matched across 2+ devices
  recentEvents: SupercookieEvent[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const mockTrackableLinks: TrackableLink[] = [
  {
    id: 'tl-001',
    name: 'Q1 Product Launch — Widget',
    shortCode: 'WIDGET-Q1',
    trackingUrl: 'https://track.lucia.io/l/WIDGET-Q1',
    destinationUrl: 'https://example.com/products/new-widget',
    description: 'Multi-channel launch link for the new Widget product. SDK integrated on destination page — supercookie resolution active.',
    utmSource: 'lucia',
    utmMedium: 'multi',
    utmCampaign: 'q1-widget-launch',
    sdkEnabled: true,
    supercookieEnabled: true,
    status: 'Active',
    createdAt: '2026-01-15',
    expiresAt: '2026-03-31',
    campaigns: [
      { campaignId: 'camp-001', campaignName: 'Q1 Social Blitz', channel: 'Social Media', status: 'Active', spend: 12000, revenue: 62400, conversions: 623, roi: 5.2, startDate: '2026-01-15' },
      { campaignId: 'camp-002', campaignName: 'Q1 Email Drip', channel: 'Email', status: 'Active', spend: 3200, revenue: 53600, conversions: 1072, roi: 16.75, startDate: '2026-01-18' },
      { campaignId: 'camp-003', campaignName: 'Q1 Google Ads', channel: 'Paid Ads', status: 'Active', spend: 18500, revenue: 45600, conversions: 912, roi: 2.46, startDate: '2026-01-20' },
      { campaignId: 'camp-004', campaignName: 'Q1 Tech Article', channel: 'Article', status: 'Completed', spend: 2500, revenue: 16950, conversions: 339, roi: 6.78, startDate: '2026-01-22', endDate: '2026-02-28' },
    ],
    channelMetrics: [
      { channel: 'Social Media', clicks: 12450, uniqueVisitors: 10200, conversions: 623, revenue: 62400, ctr: 7.97, conversionRate: 5.0, roi: 5.2, avgTimeOnSite: 245, bounceRate: 38, deviceBreakdown: [{ device: 'Mobile', users: 9300, conversions: 490, revenue: 49000 }, { device: 'Desktop', users: 2876, conversions: 115, revenue: 11500 }, { device: 'Tablet', users: 274, conversions: 18, revenue: 1900 }] },
      { channel: 'Email', clicks: 8932, uniqueVisitors: 8100, conversions: 1072, revenue: 53600, ctr: 19.59, conversionRate: 12.0, roi: 16.75, avgTimeOnSite: 312, bounceRate: 18, deviceBreakdown: [{ device: 'Desktop', users: 7100, conversions: 980, revenue: 49000 }, { device: 'Mobile', users: 1000, conversions: 92, revenue: 4600 }] },
      { channel: 'Paid Ads', clicks: 15200, uniqueVisitors: 13800, conversions: 912, revenue: 45600, ctr: 4.0, conversionRate: 6.0, roi: 2.46, avgTimeOnSite: 156, bounceRate: 52, deviceBreakdown: [{ device: 'Mobile', users: 7337, conversions: 440, revenue: 22000 }, { device: 'Desktop', users: 6463, conversions: 472, revenue: 23600 }] },
      { channel: 'Article', clicks: 5643, uniqueVisitors: 5100, conversions: 339, revenue: 16950, ctr: 20.01, conversionRate: 6.0, roi: 6.78, avgTimeOnSite: 189, bounceRate: 29, deviceBreakdown: [{ device: 'Desktop', users: 4021, conversions: 241, revenue: 12050 }, { device: 'Mobile', users: 1622, conversions: 98, revenue: 4900 }] },
    ],
    totalClicks: 42225,
    totalUniqueVisitors: 37200,
    totalConversions: 2946,
    totalRevenue: 178550,
    overallRoi: 4.8,
    supercookieResolutionRate: 87.4,
    crossDeviceMatchRate: 64.2,
    recentEvents: [
      { timestamp: '2026-03-18T12:01:00Z', userId: 'USR_001', cookieId: 'ck_a1b2c3', supercookieId: 'sc_x9y8z7', deviceType: 'Mobile', resolved: true, confidence: 97.2 },
      { timestamp: '2026-03-18T11:58:00Z', userId: 'USR_002', cookieId: 'ck_d4e5f6', supercookieId: 'sc_w6v5u4', deviceType: 'Desktop', resolved: true, confidence: 94.1 },
      { timestamp: '2026-03-18T11:55:00Z', userId: 'USR_003', cookieId: 'ck_g7h8i9', supercookieId: 'sc_t3s2r1', deviceType: 'Mobile', resolved: false, confidence: 61.3 },
    ],
  },
  {
    id: 'tl-002',
    name: 'Summer Sale 2026 — Homepage',
    shortCode: 'SUMMER26',
    trackingUrl: 'https://track.lucia.io/l/SUMMER26',
    destinationUrl: 'https://example.com/summer-sale',
    description: 'Main entry link for the summer sale campaign. Tracks cross-device journeys from first click to final purchase.',
    utmSource: 'lucia',
    utmMedium: 'multi',
    utmCampaign: 'summer-sale-2026',
    sdkEnabled: true,
    supercookieEnabled: true,
    status: 'Active',
    createdAt: '2026-02-01',
    expiresAt: '2026-08-31',
    campaigns: [
      { campaignId: 'camp-005', campaignName: 'Summer Social Push', channel: 'Social Media', status: 'Active', spend: 15000, revenue: 73500, conversions: 1470, roi: 4.9, startDate: '2026-02-01' },
      { campaignId: 'camp-006', campaignName: 'Summer Email Series', channel: 'Email', status: 'Active', spend: 4800, revenue: 48000, conversions: 960, roi: 10.0, startDate: '2026-02-05' },
      { campaignId: 'camp-007', campaignName: 'Summer Influencer', channel: 'Influencer', status: 'Active', spend: 8200, revenue: 35260, conversions: 705, roi: 4.3, startDate: '2026-02-10' },
    ],
    channelMetrics: [
      { channel: 'Social Media', clicks: 18900, uniqueVisitors: 16200, conversions: 1470, revenue: 73500, ctr: 8.4, conversionRate: 7.8, roi: 4.9, avgTimeOnSite: 198, bounceRate: 41, deviceBreakdown: [{ device: 'Mobile', users: 13000, conversions: 1100, revenue: 55000 }, { device: 'Desktop', users: 3200, conversions: 370, revenue: 18500 }] },
      { channel: 'Email', clicks: 11200, uniqueVisitors: 9800, conversions: 960, revenue: 48000, ctr: 22.4, conversionRate: 8.6, roi: 10.0, avgTimeOnSite: 289, bounceRate: 21, deviceBreakdown: [{ device: 'Desktop', users: 8400, conversions: 820, revenue: 41000 }, { device: 'Mobile', users: 1400, conversions: 140, revenue: 7000 }] },
      { channel: 'Influencer', clicks: 9400, uniqueVisitors: 8700, conversions: 705, revenue: 35260, ctr: 6.2, conversionRate: 7.5, roi: 4.3, avgTimeOnSite: 267, bounceRate: 33, deviceBreakdown: [{ device: 'Mobile', users: 7200, conversions: 580, revenue: 29000 }, { device: 'Desktop', users: 1500, conversions: 125, revenue: 6260 }] },
    ],
    totalClicks: 39500,
    totalUniqueVisitors: 34700,
    totalConversions: 3135,
    totalRevenue: 156760,
    overallRoi: 5.6,
    supercookieResolutionRate: 91.2,
    crossDeviceMatchRate: 71.8,
    recentEvents: [
      { timestamp: '2026-03-18T12:03:00Z', userId: 'USR_011', cookieId: 'ck_j1k2l3', supercookieId: 'sc_q9p8o7', deviceType: 'Mobile', resolved: true, confidence: 98.4 },
      { timestamp: '2026-03-18T12:00:00Z', userId: 'USR_012', cookieId: 'ck_m4n5o6', supercookieId: 'sc_n6m5l4', deviceType: 'Desktop', resolved: true, confidence: 92.7 },
    ],
  },
  {
    id: 'tl-003',
    name: 'Enterprise Upsell — Demo CTA',
    shortCode: 'ENT-DEMO',
    trackingUrl: 'https://track.lucia.io/l/ENT-DEMO',
    destinationUrl: 'https://example.com/enterprise/demo',
    description: 'High-intent link for enterprise prospects. Tracks wallet address + device fingerprint for Web3 clients.',
    utmSource: 'lucia',
    utmMedium: 'b2b',
    utmCampaign: 'enterprise-upsell',
    sdkEnabled: true,
    supercookieEnabled: true,
    status: 'Active',
    createdAt: '2026-02-15',
    campaigns: [
      { campaignId: 'camp-008', campaignName: 'Enterprise Email Sequence', channel: 'Email', status: 'Active', spend: 6500, revenue: 52000, conversions: 260, roi: 8.0, startDate: '2026-02-15' },
      { campaignId: 'camp-009', campaignName: 'LinkedIn Ads — Enterprise', channel: 'Paid Ads', status: 'Active', spend: 9800, revenue: 39200, conversions: 196, roi: 4.0, startDate: '2026-02-20' },
      { campaignId: 'camp-010', campaignName: 'Industry Article Placement', channel: 'Article', status: 'Active', spend: 3200, revenue: 19200, conversions: 96, roi: 6.0, startDate: '2026-03-01' },
    ],
    channelMetrics: [
      { channel: 'Email', clicks: 4200, uniqueVisitors: 3900, conversions: 260, revenue: 52000, ctr: 24.1, conversionRate: 6.2, roi: 8.0, avgTimeOnSite: 412, bounceRate: 14, deviceBreakdown: [{ device: 'Desktop', users: 3700, conversions: 245, revenue: 49000 }, { device: 'Mobile', users: 500, conversions: 15, revenue: 3000 }] },
      { channel: 'Paid Ads', clicks: 6800, uniqueVisitors: 6100, conversions: 196, revenue: 39200, ctr: 3.8, conversionRate: 2.9, roi: 4.0, avgTimeOnSite: 234, bounceRate: 44, deviceBreakdown: [{ device: 'Desktop', users: 5200, conversions: 168, revenue: 33600 }, { device: 'Mobile', users: 900, conversions: 28, revenue: 5600 }] },
      { channel: 'Article', clicks: 3100, uniqueVisitors: 2800, conversions: 96, revenue: 19200, ctr: 18.7, conversionRate: 3.1, roi: 6.0, avgTimeOnSite: 356, bounceRate: 22, deviceBreakdown: [{ device: 'Desktop', users: 2500, conversions: 85, revenue: 17000 }, { device: 'Mobile', users: 300, conversions: 11, revenue: 2200 }] },
    ],
    totalClicks: 14100,
    totalUniqueVisitors: 12800,
    totalConversions: 552,
    totalRevenue: 110400,
    overallRoi: 5.8,
    supercookieResolutionRate: 93.6,
    crossDeviceMatchRate: 58.4,
    recentEvents: [
      { timestamp: '2026-03-18T11:50:00Z', userId: 'USR_021', cookieId: 'ck_p7q8r9', supercookieId: 'sc_k3j2i1', deviceType: 'Desktop', resolved: true, confidence: 99.1 },
    ],
  },
  {
    id: 'tl-exp-001',
    name: 'Black Friday 2025 — Main',
    shortCode: 'BF2025',
    trackingUrl: 'https://track.lucia.io/l/BF2025',
    destinationUrl: 'https://example.com/black-friday-2025',
    description: 'Black Friday 2025 multi-channel campaign. Expired Nov 30 2025.',
    utmSource: 'lucia',
    utmMedium: 'multi',
    utmCampaign: 'black-friday-2025',
    sdkEnabled: true,
    supercookieEnabled: true,
    status: 'Expired',
    createdAt: '2025-10-15',
    expiresAt: '2025-11-30',
    campaigns: [
      { campaignId: 'camp-exp-001', campaignName: 'BF Social Blitz', channel: 'Social Media', status: 'Completed', spend: 22000, revenue: 110000, conversions: 2200, roi: 5.0, startDate: '2025-11-01', endDate: '2025-11-30' },
      { campaignId: 'camp-exp-002', campaignName: 'BF Email Countdown', channel: 'Email', status: 'Completed', spend: 5400, revenue: 54000, conversions: 1080, roi: 10.0, startDate: '2025-11-10', endDate: '2025-11-30' },
      { campaignId: 'camp-exp-003', campaignName: 'BF Google Shopping', channel: 'Paid Ads', status: 'Completed', spend: 31000, revenue: 93000, conversions: 1860, roi: 3.0, startDate: '2025-11-15', endDate: '2025-11-30' },
    ],
    channelMetrics: [
      { channel: 'Social Media', clicks: 28400, uniqueVisitors: 24200, conversions: 2200, revenue: 110000, ctr: 9.2, conversionRate: 7.7, roi: 5.0, avgTimeOnSite: 212, bounceRate: 36, deviceBreakdown: [{ device: 'Mobile', users: 18000, conversions: 1650, revenue: 82500 }, { device: 'Desktop', users: 6200, conversions: 550, revenue: 27500 }] },
      { channel: 'Email', clicks: 14600, uniqueVisitors: 12800, conversions: 1080, revenue: 54000, ctr: 21.3, conversionRate: 7.4, roi: 10.0, avgTimeOnSite: 298, bounceRate: 19, deviceBreakdown: [{ device: 'Desktop', users: 10400, conversions: 900, revenue: 45000 }, { device: 'Mobile', users: 2400, conversions: 180, revenue: 9000 }] },
      { channel: 'Paid Ads', clicks: 34200, uniqueVisitors: 29800, conversions: 1860, revenue: 93000, ctr: 5.1, conversionRate: 5.4, roi: 3.0, avgTimeOnSite: 143, bounceRate: 58, deviceBreakdown: [{ device: 'Mobile', users: 16000, conversions: 900, revenue: 45000 }, { device: 'Desktop', users: 13800, conversions: 960, revenue: 48000 }] },
    ],
    totalClicks: 77200,
    totalUniqueVisitors: 66800,
    totalConversions: 5140,
    totalRevenue: 257000,
    overallRoi: 4.4,
    supercookieResolutionRate: 89.1,
    crossDeviceMatchRate: 67.3,
    recentEvents: [],
  },
  {
    id: 'tl-exp-002',
    name: 'Spring Launch 2025 — Product',
    shortCode: 'SPRING25',
    trackingUrl: 'https://track.lucia.io/l/SPRING25',
    destinationUrl: 'https://example.com/spring-2025',
    description: 'Spring 2025 product launch. Expired June 30 2025.',
    utmSource: 'lucia',
    utmMedium: 'multi',
    utmCampaign: 'spring-launch-2025',
    sdkEnabled: true,
    supercookieEnabled: true,
    status: 'Expired',
    createdAt: '2025-03-01',
    expiresAt: '2025-06-30',
    campaigns: [
      { campaignId: 'camp-exp-004', campaignName: 'Spring Email Series', channel: 'Email', status: 'Completed', spend: 3800, revenue: 34200, conversions: 684, roi: 9.0, startDate: '2025-03-01', endDate: '2025-06-30' },
      { campaignId: 'camp-exp-005', campaignName: 'Spring Influencer Push', channel: 'Influencer', status: 'Completed', spend: 9200, revenue: 36800, conversions: 736, roi: 4.0, startDate: '2025-03-15', endDate: '2025-05-31' },
    ],
    channelMetrics: [
      { channel: 'Email', clicks: 9800, uniqueVisitors: 8600, conversions: 684, revenue: 34200, ctr: 18.9, conversionRate: 7.0, roi: 9.0, avgTimeOnSite: 276, bounceRate: 23, deviceBreakdown: [{ device: 'Desktop', users: 7200, conversions: 576, revenue: 28800 }, { device: 'Mobile', users: 1400, conversions: 108, revenue: 5400 }] },
      { channel: 'Influencer', clicks: 12400, uniqueVisitors: 10900, conversions: 736, revenue: 36800, ctr: 7.1, conversionRate: 5.9, roi: 4.0, avgTimeOnSite: 234, bounceRate: 38, deviceBreakdown: [{ device: 'Mobile', users: 8700, conversions: 580, revenue: 29000 }, { device: 'Desktop', users: 2200, conversions: 156, revenue: 7800 }] },
    ],
    totalClicks: 22200,
    totalUniqueVisitors: 19500,
    totalConversions: 1420,
    totalRevenue: 71000,
    overallRoi: 5.5,
    supercookieResolutionRate: 82.6,
    crossDeviceMatchRate: 54.9,
    recentEvents: [],
  },
  {
    id: 'tl-004',
    name: 'Holiday Campaign 2026 — Preview',
    shortCode: 'HOLIDAY26',
    trackingUrl: 'https://track.lucia.io/l/HOLIDAY26',
    destinationUrl: 'https://example.com/holiday-2026',
    description: 'Pre-launch link for Holiday 2026. SDK integration pending — supercookie will activate on launch.',
    sdkEnabled: false,
    supercookieEnabled: false,
    status: 'Draft',
    createdAt: '2026-03-10',
    expiresAt: '2026-12-31',
    campaigns: [],
    channelMetrics: [],
    totalClicks: 0,
    totalUniqueVisitors: 0,
    totalConversions: 0,
    totalRevenue: 0,
    overallRoi: 0,
    supercookieResolutionRate: 0,
    crossDeviceMatchRate: 0,
    recentEvents: [],
  },
];

// ─── UTM Parameter Builder ────────────────────────────────────────────────────
export function buildTrackingUrl(base: string, params: { source?: string; medium?: string; campaign?: string; content?: string; shortCode: string }): string {
  const url = new URL(`https://track.lucia.io/l/${params.shortCode}`);
  if (params.source) url.searchParams.set('utm_source', params.source);
  if (params.medium) url.searchParams.set('utm_medium', params.medium);
  if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
  if (params.content) url.searchParams.set('utm_content', params.content);
  return url.toString();
}

// ─── Channel color map ────────────────────────────────────────────────────────
export const channelColors: Record<ChannelType, string> = {
  'Social Media': '#3b82f6',
  'Email': '#10b981',
  'Paid Ads': '#f59e0b',
  'Organic': '#8b5cf6',
  'Article': '#06b6d4',
  'Influencer': '#ec4899',
  'SMS': '#f97316',
  'Direct': '#64748b',
};
