/*
 * Orbital Command Center mock data
 */

export interface ResolutionEvent {
  id: string;
  timestamp: string;
  type: 'identity_resolved' | 'session_linked' | 'device_matched' | 'conversion';
  userId: string;
  description: string;
  confidence: number;
  devices: number;
  sessions: number;
}

export interface OrbitalKPI {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  color: string;
}

export const orbitalKPIs: OrbitalKPI[] = [
  {
    label: 'Total Identities Resolved',
    value: 284000,
    target: 300000,
    unit: 'identities',
    trend: 12.5,
    color: 'from-blue-600 to-blue-400',
  },
  {
    label: 'Resolution Rate',
    value: 84.9,
    target: 90,
    unit: '%',
    trend: 3.2,
    color: 'from-green-600 to-green-400',
  },
  {
    label: 'Avg Sessions per Identity',
    value: 3.7,
    target: 4.0,
    unit: 'sessions',
    trend: 1.8,
    color: 'from-purple-600 to-purple-400',
  },
  {
    label: 'Cross-Device Match Rate',
    value: 67.2,
    target: 75,
    unit: '%',
    trend: 5.1,
    color: 'from-amber-600 to-amber-400',
  },
];

export const resolutionEvents: ResolutionEvent[] = [
  {
    id: 'evt_001',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    type: 'identity_resolved',
    userId: 'USR_001',
    description: 'Identity resolved: Email + Device fingerprint matched',
    confidence: 98.5,
    devices: 2,
    sessions: 5,
  },
  {
    id: 'evt_002',
    timestamp: new Date(Date.now() - 8000).toISOString(),
    type: 'session_linked',
    userId: 'USR_002',
    description: 'Session linked: Twitter click → Direct visit',
    confidence: 94.2,
    devices: 1,
    sessions: 2,
  },
  {
    id: 'evt_003',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    type: 'device_matched',
    userId: 'USR_003',
    description: 'Device matched: IP + Browser fingerprint',
    confidence: 91.7,
    devices: 3,
    sessions: 8,
  },
  {
    id: 'evt_004',
    timestamp: new Date(Date.now() - 22000).toISOString(),
    type: 'conversion',
    userId: 'USR_004',
    description: 'Conversion tracked: $149.99 purchase',
    confidence: 99.1,
    devices: 2,
    sessions: 4,
  },
  {
    id: 'evt_005',
    timestamp: new Date(Date.now() - 28000).toISOString(),
    type: 'identity_resolved',
    userId: 'USR_005',
    description: 'Identity resolved: CRM + Web activity matched',
    confidence: 96.3,
    devices: 4,
    sessions: 12,
  },
];

export interface ResolutionTrendPoint {
  date: string;
  resolved: number;
  unresolved: number;
  confidence: number;
}

export const resolutionTrend: ResolutionTrendPoint[] = [
  { date: 'Mar 1', resolved: 245000, unresolved: 45000, confidence: 78.2 },
  { date: 'Mar 3', resolved: 252000, unresolved: 42000, confidence: 79.8 },
  { date: 'Mar 5', resolved: 258000, unresolved: 40000, confidence: 81.1 },
  { date: 'Mar 7', resolved: 265000, unresolved: 38000, confidence: 82.5 },
  { date: 'Mar 9', resolved: 271000, unresolved: 36000, confidence: 83.2 },
  { date: 'Mar 11', resolved: 276000, unresolved: 34000, confidence: 84.1 },
  { date: 'Mar 13', resolved: 280000, unresolved: 32000, confidence: 84.6 },
  { date: 'Mar 15', resolved: 284000, unresolved: 30000, confidence: 84.9 },
];

export interface AttributionChannel {
  channel: string;
  conversions: number;
  revenue: number;
  conversionRate: number;
  roas: number;
  trend: number;
}

export const attributionChannels: AttributionChannel[] = [
  {
    channel: 'Email',
    conversions: 1247,
    revenue: 187050,
    conversionRate: 21.3,
    roas: 4.2,
    trend: 8.5,
  },
  {
    channel: 'Google Ads',
    conversions: 892,
    revenue: 133800,
    conversionRate: 13.1,
    roas: 3.1,
    trend: 2.1,
  },
  {
    channel: 'Meta',
    conversions: 756,
    revenue: 113400,
    conversionRate: 14.9,
    roas: 2.8,
    trend: -1.2,
  },
  {
    channel: 'Twitter',
    conversions: 543,
    revenue: 81450,
    conversionRate: 12.8,
    roas: 2.1,
    trend: 5.3,
  },
  {
    channel: 'Direct',
    conversions: 412,
    revenue: 61800,
    conversionRate: 18.7,
    roas: 3.5,
    trend: 3.8,
  },
];

export interface GeographicData {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  users: number;
  revenue: number;
  conversions: number;
}

export const geographicData: GeographicData[] = [
  {
    country: 'United States',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    users: 12450,
    revenue: 186750,
    conversions: 1247,
  },
  {
    country: 'United States',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    users: 10320,
    revenue: 154800,
    conversions: 1032,
  },
  {
    country: 'United Kingdom',
    city: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    users: 8540,
    revenue: 128100,
    conversions: 854,
  },
  {
    country: 'Germany',
    city: 'Berlin',
    latitude: 52.52,
    longitude: 13.405,
    users: 6780,
    revenue: 101700,
    conversions: 678,
  },
  {
    country: 'France',
    city: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    users: 5920,
    revenue: 88800,
    conversions: 592,
  },
  {
    country: 'Canada',
    city: 'Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    users: 4560,
    revenue: 68400,
    conversions: 456,
  },
  {
    country: 'Australia',
    city: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    users: 3890,
    revenue: 58350,
    conversions: 389,
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    users: 3450,
    revenue: 51750,
    conversions: 345,
  },
];
