/*
 * CAMPAIGN LINK REDIRECTOR DATA MODEL
 * Manages campaign links that can be used across multiple marketing channels
 */

export type CampaignCategory = 'Social Media' | 'Email Outreach' | 'Mobile' | 'Article' | 'Ads';

export interface UserDemographic {
  ageGroup: string;
  gender: string;
  location: string;
  deviceType: string;
  users: number;
  conversions: number;
  revenue: number;
  avgSessionDuration: number;
}

export interface CampaignChannelMetrics {
  channel: CampaignCategory;
  clicks: number;
  impressions: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  avgTimeOnSite: number;
  demographics: UserDemographic[];
  topPages: Array<{ page: string; views: number; conversions: number }>;
  deviceBreakdown: Array<{ device: string; users: number; conversions: number; revenue: number }>;
}

export interface CampaignLink {
  id: string;
  name: string;
  shortCode: string;
  destinationUrl: string;
  description: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  channels: CampaignChannelMetrics[];
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  overallRoi: number;
  bestPerformingChannel: CampaignCategory;
}

// Mock demographic data generators
const generateDemographics = (): UserDemographic[] => [
  {
    ageGroup: '18-24',
    gender: 'Male',
    location: 'United States',
    deviceType: 'Mobile',
    users: 2145,
    conversions: 128,
    revenue: 6400,
    avgSessionDuration: 245,
  },
  {
    ageGroup: '25-34',
    gender: 'Female',
    location: 'United States',
    deviceType: 'Desktop',
    users: 3421,
    conversions: 205,
    revenue: 10250,
    avgSessionDuration: 312,
  },
  {
    ageGroup: '35-44',
    gender: 'Male',
    location: 'Canada',
    deviceType: 'Desktop',
    users: 1876,
    conversions: 150,
    revenue: 7500,
    avgSessionDuration: 289,
  },
  {
    ageGroup: '25-34',
    gender: 'Male',
    location: 'United Kingdom',
    deviceType: 'Mobile',
    users: 2654,
    conversions: 140,
    revenue: 7000,
    avgSessionDuration: 198,
  },
];

const generateTopPages = (): Array<{ page: string; views: number; conversions: number }> => [
  { page: '/products/new-widget', views: 4521, conversions: 271 },
  { page: '/pricing', views: 3214, conversions: 192 },
  { page: '/features', views: 2876, conversions: 86 },
  { page: '/checkout', views: 2145, conversions: 174 },
];

const generateDeviceBreakdown = (): Array<{ device: string; users: number; conversions: number; revenue: number }> => [
  { device: 'Desktop', users: 5432, conversions: 380, revenue: 19000 },
  { device: 'Mobile', users: 4876, conversions: 243, revenue: 12150 },
  { device: 'Tablet', users: 1142, conversions: 57, revenue: 2850 },
];

// Mock campaign links data
export const mockCampaignLinks: CampaignLink[] = [
  {
    id: 'link-001',
    name: 'Q1 Product Launch - New Widget',
    shortCode: 'WIDGET-Q1',
    destinationUrl: 'https://example.com/products/new-widget',
    description: 'Multi-channel campaign for new widget product launch',
    createdAt: new Date('2026-01-15'),
    expiresAt: new Date('2026-03-31'),
    isActive: true,
    channels: [
      {
        channel: 'Social Media',
        clicks: 12450,
        impressions: 156200,
        conversions: 623,
        revenue: 31150,
        ctr: 7.97,
        conversionRate: 5.0,
        roi: 4.2,
        avgTimeOnSite: 245,
        demographics: [
          {
            ageGroup: '18-24',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Mobile',
            users: 4200,
            conversions: 210,
            revenue: 10500,
            avgSessionDuration: 198,
          },
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Mobile',
            users: 5100,
            conversions: 280,
            revenue: 14000,
            avgSessionDuration: 234,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'Canada',
            deviceType: 'Desktop',
            users: 3150,
            conversions: 133,
            revenue: 6650,
            avgSessionDuration: 267,
          },
        ],
        topPages: [
          { page: '/products/new-widget', views: 8234, conversions: 412 },
          { page: '/pricing', views: 2145, conversions: 107 },
          { page: '/features', views: 1876, conversions: 94 },
          { page: '/checkout', views: 1195, conversions: 110 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', users: 9300, conversions: 490, revenue: 24500 },
          { device: 'Desktop', users: 2876, conversions: 115, revenue: 5750 },
          { device: 'Tablet', users: 274, conversions: 18, revenue: 900 },
        ],
      },
      {
        channel: 'Email Outreach',
        clicks: 8932,
        impressions: 45600,
        conversions: 1072,
        revenue: 53600,
        ctr: 19.59,
        conversionRate: 12.0,
        roi: 5.8,
        avgTimeOnSite: 312,
        demographics: [
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Desktop',
            users: 3456,
            conversions: 414,
            revenue: 20700,
            avgSessionDuration: 345,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Desktop',
            users: 2876,
            conversions: 345,
            revenue: 17250,
            avgSessionDuration: 312,
          },
          {
            ageGroup: '45-54',
            gender: 'Female',
            location: 'Canada',
            deviceType: 'Desktop',
            users: 1600,
            conversions: 313,
            revenue: 15650,
            avgSessionDuration: 289,
          },
        ],
        topPages: [
          { page: '/products/new-widget', views: 5432, conversions: 651 },
          { page: '/checkout', views: 2145, conversions: 257 },
          { page: '/pricing', views: 876, conversions: 105 },
          { page: '/features', views: 479, conversions: 59 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 7932, conversions: 1072, revenue: 53600 },
          { device: 'Mobile', users: 1000, conversions: 0, revenue: 0 },
        ],
      },
      {
        channel: 'Article',
        clicks: 5643,
        impressions: 28200,
        conversions: 339,
        revenue: 16950,
        ctr: 20.01,
        conversionRate: 6.0,
        roi: 3.5,
        avgTimeOnSite: 189,
        demographics: [
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'United Kingdom',
            deviceType: 'Desktop',
            users: 2145,
            conversions: 128,
            revenue: 6400,
            avgSessionDuration: 276,
          },
          {
            ageGroup: '45-54',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Desktop',
            users: 1876,
            conversions: 113,
            revenue: 5650,
            avgSessionDuration: 234,
          },
          {
            ageGroup: '25-34',
            gender: 'Male',
            location: 'Australia',
            deviceType: 'Mobile',
            users: 1622,
            conversions: 98,
            revenue: 4900,
            avgSessionDuration: 145,
          },
        ],
        topPages: [
          { page: '/features', views: 3214, conversions: 192 },
          { page: '/products/new-widget', views: 1876, conversions: 94 },
          { page: '/pricing', views: 987, conversions: 53 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 4021, conversions: 241, revenue: 12050 },
          { device: 'Mobile', users: 1622, conversions: 98, revenue: 4900 },
        ],
      },
      {
        channel: 'Ads',
        clicks: 15200,
        impressions: 380500,
        conversions: 912,
        revenue: 45600,
        ctr: 4.0,
        conversionRate: 6.0,
        roi: 2.8,
        avgTimeOnSite: 156,
        demographics: [
          {
            ageGroup: '18-24',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Mobile',
            users: 5432,
            conversions: 326,
            revenue: 16300,
            avgSessionDuration: 167,
          },
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Desktop',
            users: 4876,
            conversions: 293,
            revenue: 14650,
            avgSessionDuration: 189,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'Canada',
            deviceType: 'Desktop',
            users: 2987,
            conversions: 179,
            revenue: 8950,
            avgSessionDuration: 145,
          },
          {
            ageGroup: '45-54',
            gender: 'Female',
            location: 'United Kingdom',
            deviceType: 'Mobile',
            users: 1905,
            conversions: 114,
            revenue: 5700,
            avgSessionDuration: 123,
          },
        ],
        topPages: [
          { page: '/products/new-widget', views: 9876, conversions: 592 },
          { page: '/checkout', views: 3214, conversions: 192 },
          { page: '/pricing', views: 1876, conversions: 94 },
          { page: '/features', views: 1234, conversions: 34 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', users: 7337, conversions: 440, revenue: 22000 },
          { device: 'Desktop', users: 7863, conversions: 472, revenue: 23600 },
        ],
      },
    ],
    totalClicks: 42225,
    totalConversions: 2946,
    totalRevenue: 147300,
    overallRoi: 4.1,
    bestPerformingChannel: 'Email Outreach',
  },
  {
    id: 'link-002',
    name: 'Summer Sale Campaign 2026',
    shortCode: 'SUMMER-26',
    destinationUrl: 'https://example.com/sales/summer-2026',
    description: 'Cross-channel summer sale promotion',
    createdAt: new Date('2026-02-01'),
    expiresAt: new Date('2026-08-31'),
    isActive: true,
    channels: [
      {
        channel: 'Social Media',
        clicks: 18900,
        impressions: 234500,
        conversions: 945,
        revenue: 47250,
        ctr: 8.06,
        conversionRate: 5.0,
        roi: 3.9,
        avgTimeOnSite: 267,
        demographics: [
          {
            ageGroup: '18-24',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Mobile',
            users: 6543,
            conversions: 327,
            revenue: 16350,
            avgSessionDuration: 234,
          },
          {
            ageGroup: '25-34',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Mobile',
            users: 7234,
            conversions: 362,
            revenue: 18100,
            avgSessionDuration: 267,
          },
          {
            ageGroup: '35-44',
            gender: 'Female',
            location: 'Canada',
            deviceType: 'Desktop',
            users: 5123,
            conversions: 256,
            revenue: 12800,
            avgSessionDuration: 301,
          },
        ],
        topPages: [
          { page: '/sales/summer-2026', views: 12345, conversions: 617 },
          { page: '/products', views: 4321, conversions: 216 },
          { page: '/checkout', views: 3456, conversions: 112 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', users: 13777, conversions: 689, revenue: 34450 },
          { device: 'Desktop', users: 5123, conversions: 256, revenue: 12800 },
        ],
      },
      {
        channel: 'Mobile',
        clicks: 22340,
        impressions: 112000,
        conversions: 1340,
        revenue: 67000,
        ctr: 19.95,
        conversionRate: 6.0,
        roi: 4.5,
        avgTimeOnSite: 198,
        demographics: [
          {
            ageGroup: '18-24',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Mobile',
            users: 8765,
            conversions: 526,
            revenue: 26300,
            avgSessionDuration: 187,
          },
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Mobile',
            users: 7654,
            conversions: 459,
            revenue: 22950,
            avgSessionDuration: 212,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'Canada',
            deviceType: 'Mobile',
            users: 5921,
            conversions: 355,
            revenue: 17750,
            avgSessionDuration: 198,
          },
        ],
        topPages: [
          { page: '/sales/summer-2026', views: 18765, conversions: 1127 },
          { page: '/products', views: 6543, conversions: 131 },
          { page: '/checkout', views: 5032, conversions: 82 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', users: 22340, conversions: 1340, revenue: 67000 },
        ],
      },
      {
        channel: 'Email Outreach',
        clicks: 9876,
        impressions: 52000,
        conversions: 1185,
        revenue: 59250,
        ctr: 18.99,
        conversionRate: 12.0,
        roi: 5.2,
        avgTimeOnSite: 334,
        demographics: [
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Desktop',
            users: 4234,
            conversions: 508,
            revenue: 25400,
            avgSessionDuration: 356,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Desktop',
            users: 3456,
            conversions: 414,
            revenue: 20700,
            avgSessionDuration: 334,
          },
          {
            ageGroup: '45-54',
            gender: 'Female',
            location: 'Canada',
            deviceType: 'Desktop',
            users: 2186,
            conversions: 263,
            revenue: 13150,
            avgSessionDuration: 312,
          },
        ],
        topPages: [
          { page: '/sales/summer-2026', views: 7234, conversions: 866 },
          { page: '/checkout', views: 2345, conversions: 281 },
          { page: '/products', views: 1297, conversions: 38 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 9876, conversions: 1185, revenue: 59250 },
        ],
      },
      {
        channel: 'Ads',
        clicks: 16500,
        impressions: 412500,
        conversions: 990,
        revenue: 49500,
        ctr: 4.0,
        conversionRate: 6.0,
        roi: 2.9,
        avgTimeOnSite: 142,
        demographics: [
          {
            ageGroup: '18-24',
            gender: 'Male',
            location: 'United States',
            deviceType: 'Mobile',
            users: 6234,
            conversions: 374,
            revenue: 18700,
            avgSessionDuration: 134,
          },
          {
            ageGroup: '25-34',
            gender: 'Female',
            location: 'United States',
            deviceType: 'Desktop',
            users: 5432,
            conversions: 326,
            revenue: 16300,
            avgSessionDuration: 156,
          },
          {
            ageGroup: '35-44',
            gender: 'Male',
            location: 'Canada',
            deviceType: 'Mobile',
            users: 3234,
            conversions: 194,
            revenue: 9700,
            avgSessionDuration: 128,
          },
          {
            ageGroup: '45-54',
            gender: 'Female',
            location: 'United Kingdom',
            deviceType: 'Desktop',
            users: 1600,
            conversions: 96,
            revenue: 4800,
            avgSessionDuration: 156,
          },
        ],
        topPages: [
          { page: '/sales/summer-2026', views: 11234, conversions: 674 },
          { page: '/products', views: 3456, conversions: 207 },
          { page: '/checkout', views: 2345, conversions: 109 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', users: 9468, conversions: 568, revenue: 28400 },
          { device: 'Desktop', users: 7032, conversions: 422, revenue: 21100 },
        ],
      },
    ],
    totalClicks: 67616,
    totalConversions: 4460,
    totalRevenue: 223000,
    overallRoi: 4.2,
    bestPerformingChannel: 'Mobile',
  },
];

export function calculateAggregateMetrics(channels: CampaignChannelMetrics[]) {
  const totalClicks = channels.reduce((sum, c) => sum + c.clicks, 0);
  const totalImpressions = channels.reduce((sum, c) => sum + c.impressions, 0);
  const totalConversions = channels.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = channels.reduce((sum, c) => sum + c.revenue, 0);

  return {
    totalClicks,
    totalImpressions,
    totalConversions,
    totalRevenue,
    overallCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    overallConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    overallRoi: totalRevenue > 0 ? totalRevenue / (totalRevenue * 0.2) : 0,
  };
}

export function findBestChannel(channels: CampaignChannelMetrics[]): CampaignCategory {
  if (channels.length === 0) return 'Social Media';
  return channels.reduce((best, current) =>
    current.roi > best.roi ? current : best
  ).channel;
}
