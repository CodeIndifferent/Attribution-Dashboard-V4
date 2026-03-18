// Mock data for Identity Resolution Dashboard
// Design: Dark Orbital / Identity Intelligence Command Center

export interface IdentityNode {
  id: string;
  label: string;
  type: 'user' | 'device' | 'session' | 'email' | 'cookie';
  status: 'resolved' | 'fragmented' | 'pending';
  x: number;
  y: number;
  connections: string[];
  lastSeen: string;
  confidence: number;
}

export interface IdentityEdge {
  source: string;
  target: string;
  type: 'device_link' | 'session_link' | 'email_match' | 'fingerprint';
  strength: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  resolvedAt: string;
  devices: number;
  sessions: number;
  firstSeen: string;
  lastSeen: string;
  status: 'resolved' | 'fragmented' | 'pending';
  confidence: number;
  location: string;
  channel: string;
  campaign: string;
  ltv: number;
  touchpoints: TouchPoint[];
}

export interface TouchPoint {
  timestamp: string;
  channel: string;
  device: string;
  campaign: string;
  event: string;
  sessionId: string;
}

export interface CampaignAttribution {
  campaign: string;
  channel: string;
  identities: number;
  sessions: number;
  conversions: number;
  revenue: number;
  color: string;
}

export interface JourneyStep {
  step: number;
  channel: string;
  device: string;
  event: string;
  timestamp: string;
  sessionId: string;
}

// KPI Metrics
export const kpiMetrics = {
  totalIdentities: 284_721,
  resolvedIdentities: 241_813,
  fragmentedProfiles: 42_908,
  resolutionRate: 84.9,
  avgDevicesPerUser: 2.7,
  crossDeviceSessions: 1_284_930,
  activeSessions: 3_847,
  newIdentitiesLast24h: 1_203,
};

// Identity Graph Nodes
export const graphNodes: IdentityNode[] = [
  { id: 'u1', label: 'Sarah K.', type: 'user', status: 'resolved', x: 380, y: 200, connections: ['d1', 'd2', 's1', 'e1'], lastSeen: '2 min ago', confidence: 97 },
  { id: 'u2', label: 'Marcus T.', type: 'user', status: 'resolved', x: 200, y: 320, connections: ['d3', 's2', 'e2'], lastSeen: '5 min ago', confidence: 92 },
  { id: 'u3', label: 'Anon-4821', type: 'user', status: 'fragmented', x: 560, y: 310, connections: ['d4', 's3'], lastSeen: '12 min ago', confidence: 61 },
  { id: 'u4', label: 'Priya M.', type: 'user', status: 'resolved', x: 300, y: 450, connections: ['d5', 'd6', 's4', 'e3'], lastSeen: '1 min ago', confidence: 99 },
  { id: 'u5', label: 'Anon-7734', type: 'user', status: 'pending', x: 500, y: 160, connections: ['d7', 's5'], lastSeen: '28 min ago', confidence: 44 },
  { id: 'u6', label: 'James R.', type: 'user', status: 'resolved', x: 160, y: 180, connections: ['d8', 's6', 'e4'], lastSeen: '8 min ago', confidence: 88 },
  { id: 'd1', label: 'MacBook Pro', type: 'device', status: 'resolved', x: 440, y: 130, connections: ['u1', 's1'], lastSeen: '2 min ago', confidence: 97 },
  { id: 'd2', label: 'iPhone 15', type: 'device', status: 'resolved', x: 480, y: 250, connections: ['u1', 's7'], lastSeen: '3 min ago', confidence: 95 },
  { id: 'd3', label: 'iPad Air', type: 'device', status: 'resolved', x: 120, y: 280, connections: ['u2', 's2'], lastSeen: '5 min ago', confidence: 90 },
  { id: 'd4', label: 'Chrome/Win', type: 'device', status: 'fragmented', x: 620, y: 260, connections: ['u3'], lastSeen: '12 min ago', confidence: 61 },
  { id: 'd5', label: 'Galaxy S24', type: 'device', status: 'resolved', x: 240, y: 520, connections: ['u4'], lastSeen: '1 min ago', confidence: 99 },
  { id: 'd6', label: 'Surface Pro', type: 'device', status: 'resolved', x: 360, y: 530, connections: ['u4'], lastSeen: '4 min ago', confidence: 97 },
  { id: 'd7', label: 'Safari/Mac', type: 'device', status: 'pending', x: 560, y: 100, connections: ['u5'], lastSeen: '28 min ago', confidence: 44 },
  { id: 'd8', label: 'Firefox/Win', type: 'device', status: 'resolved', x: 100, y: 140, connections: ['u6'], lastSeen: '8 min ago', confidence: 88 },
  { id: 's1', label: 'Session #8821', type: 'session', status: 'resolved', x: 420, y: 60, connections: ['u1', 'd1'], lastSeen: '2 min ago', confidence: 97 },
  { id: 's2', label: 'Session #4492', type: 'session', status: 'resolved', x: 80, y: 340, connections: ['u2', 'd3'], lastSeen: '5 min ago', confidence: 92 },
  { id: 's3', label: 'Session #9103', type: 'session', status: 'fragmented', x: 660, y: 360, connections: ['u3', 'd4'], lastSeen: '12 min ago', confidence: 61 },
  { id: 's4', label: 'Session #2271', type: 'session', status: 'resolved', x: 180, y: 570, connections: ['u4', 'd5'], lastSeen: '1 min ago', confidence: 99 },
  { id: 's5', label: 'Session #6634', type: 'session', status: 'pending', x: 600, y: 60, connections: ['u5', 'd7'], lastSeen: '28 min ago', confidence: 44 },
  { id: 's6', label: 'Session #3318', type: 'session', status: 'resolved', x: 60, y: 200, connections: ['u6', 'd8'], lastSeen: '8 min ago', confidence: 88 },
  { id: 'e1', label: 'sarah@email.com', type: 'email', status: 'resolved', x: 320, y: 140, connections: ['u1'], lastSeen: '2 min ago', confidence: 97 },
  { id: 'e2', label: 'marcus@corp.io', type: 'email', status: 'resolved', x: 160, y: 400, connections: ['u2'], lastSeen: '5 min ago', confidence: 92 },
  { id: 'e3', label: 'priya@work.co', type: 'email', status: 'resolved', x: 420, y: 490, connections: ['u4'], lastSeen: '1 min ago', confidence: 99 },
  { id: 'e4', label: 'james@net.org', type: 'email', status: 'resolved', x: 80, y: 100, connections: ['u6'], lastSeen: '8 min ago', confidence: 88 },
];

export const graphEdges: IdentityEdge[] = [
  { source: 'u1', target: 'd1', type: 'device_link', strength: 0.97 },
  { source: 'u1', target: 'd2', type: 'device_link', strength: 0.95 },
  { source: 'u1', target: 's1', type: 'session_link', strength: 0.97 },
  { source: 'u1', target: 'e1', type: 'email_match', strength: 0.99 },
  { source: 'u2', target: 'd3', type: 'device_link', strength: 0.90 },
  { source: 'u2', target: 's2', type: 'session_link', strength: 0.92 },
  { source: 'u2', target: 'e2', type: 'email_match', strength: 0.99 },
  { source: 'u3', target: 'd4', type: 'fingerprint', strength: 0.61 },
  { source: 'u3', target: 's3', type: 'session_link', strength: 0.61 },
  { source: 'u4', target: 'd5', type: 'device_link', strength: 0.99 },
  { source: 'u4', target: 'd6', type: 'device_link', strength: 0.97 },
  { source: 'u4', target: 's4', type: 'session_link', strength: 0.99 },
  { source: 'u4', target: 'e3', type: 'email_match', strength: 0.99 },
  { source: 'u5', target: 'd7', type: 'fingerprint', strength: 0.44 },
  { source: 'u5', target: 's5', type: 'session_link', strength: 0.44 },
  { source: 'u6', target: 'd8', type: 'device_link', strength: 0.88 },
  { source: 'u6', target: 's6', type: 'session_link', strength: 0.88 },
  { source: 'u6', target: 'e4', type: 'email_match', strength: 0.99 },
  { source: 'd1', target: 's1', type: 'session_link', strength: 0.97 },
  { source: 'd3', target: 's2', type: 'session_link', strength: 0.92 },
  { source: 'd5', target: 's4', type: 'session_link', strength: 0.99 },
];

// User Profiles
export const userProfiles: UserProfile[] = [
  {
    id: 'u1', name: 'Sarah K.', email: 'sarah@email.com',
    resolvedAt: '2024-01-15', devices: 2, sessions: 47,
    firstSeen: '2023-08-12', lastSeen: '2 min ago',
    status: 'resolved', confidence: 97, location: 'San Francisco, CA',
    channel: 'Organic Search', campaign: 'Brand Awareness Q1',
    ltv: 4820,
    touchpoints: [
      { timestamp: '2024-03-16 14:32', channel: 'Organic Search', device: 'MacBook Pro', campaign: 'Brand Awareness Q1', event: 'Page View', sessionId: '#8821' },
      { timestamp: '2024-03-16 14:35', channel: 'Organic Search', device: 'MacBook Pro', campaign: 'Brand Awareness Q1', event: 'Product Click', sessionId: '#8821' },
      { timestamp: '2024-03-15 09:12', channel: 'Email', device: 'iPhone 15', campaign: 'Retargeting Spring', event: 'Email Open', sessionId: '#8799' },
      { timestamp: '2024-03-14 18:44', channel: 'Paid Social', device: 'iPhone 15', campaign: 'Spring Sale', event: 'Ad Click', sessionId: '#8750' },
    ]
  },
  {
    id: 'u2', name: 'Marcus T.', email: 'marcus@corp.io',
    resolvedAt: '2024-02-03', devices: 1, sessions: 23,
    firstSeen: '2024-01-20', lastSeen: '5 min ago',
    status: 'resolved', confidence: 92, location: 'New York, NY',
    channel: 'Paid Search', campaign: 'Performance Max Q1',
    ltv: 2140,
    touchpoints: [
      { timestamp: '2024-03-16 14:28', channel: 'Paid Search', device: 'iPad Air', campaign: 'Performance Max Q1', event: 'Ad Click', sessionId: '#4492' },
      { timestamp: '2024-03-16 14:31', channel: 'Paid Search', device: 'iPad Air', campaign: 'Performance Max Q1', event: 'Form Submit', sessionId: '#4492' },
      { timestamp: '2024-03-12 11:05', channel: 'Direct', device: 'iPad Air', campaign: '(none)', event: 'Page View', sessionId: '#4401' },
    ]
  },
  {
    id: 'u3', name: 'Anon-4821', email: '—',
    resolvedAt: '—', devices: 1, sessions: 3,
    firstSeen: '2024-03-16', lastSeen: '12 min ago',
    status: 'fragmented', confidence: 61, location: 'Unknown',
    channel: 'Referral', campaign: 'Partner Network',
    ltv: 0,
    touchpoints: [
      { timestamp: '2024-03-16 14:21', channel: 'Referral', device: 'Chrome/Win', campaign: 'Partner Network', event: 'Page View', sessionId: '#9103' },
      { timestamp: '2024-03-16 14:23', channel: 'Referral', device: 'Chrome/Win', campaign: 'Partner Network', event: 'Scroll 50%', sessionId: '#9103' },
    ]
  },
  {
    id: 'u4', name: 'Priya M.', email: 'priya@work.co',
    resolvedAt: '2023-11-08', devices: 2, sessions: 89,
    firstSeen: '2023-09-01', lastSeen: '1 min ago',
    status: 'resolved', confidence: 99, location: 'Austin, TX',
    channel: 'Email', campaign: 'Loyalty Program',
    ltv: 12_450,
    touchpoints: [
      { timestamp: '2024-03-16 14:33', channel: 'Email', device: 'Galaxy S24', campaign: 'Loyalty Program', event: 'Email Click', sessionId: '#2271' },
      { timestamp: '2024-03-16 14:36', channel: 'Email', device: 'Galaxy S24', campaign: 'Loyalty Program', event: 'Purchase', sessionId: '#2271' },
      { timestamp: '2024-03-15 16:20', channel: 'Direct', device: 'Surface Pro', campaign: '(none)', event: 'Account Login', sessionId: '#2240' },
    ]
  },
  {
    id: 'u5', name: 'Anon-7734', email: '—',
    resolvedAt: '—', devices: 1, sessions: 1,
    firstSeen: '2024-03-16', lastSeen: '28 min ago',
    status: 'pending', confidence: 44, location: 'London, UK',
    channel: 'Organic Social', campaign: 'Content Series',
    ltv: 0,
    touchpoints: [
      { timestamp: '2024-03-16 14:05', channel: 'Organic Social', device: 'Safari/Mac', campaign: 'Content Series', event: 'Page View', sessionId: '#6634' },
    ]
  },
  {
    id: 'u6', name: 'James R.', email: 'james@net.org',
    resolvedAt: '2024-01-28', devices: 1, sessions: 31,
    firstSeen: '2023-12-14', lastSeen: '8 min ago',
    status: 'resolved', confidence: 88, location: 'Chicago, IL',
    channel: 'Paid Social', campaign: 'Spring Sale',
    ltv: 3_290,
    touchpoints: [
      { timestamp: '2024-03-16 14:25', channel: 'Paid Social', device: 'Firefox/Win', campaign: 'Spring Sale', event: 'Ad Click', sessionId: '#3318' },
      { timestamp: '2024-03-16 14:28', channel: 'Paid Social', device: 'Firefox/Win', campaign: 'Spring Sale', event: 'Add to Cart', sessionId: '#3318' },
      { timestamp: '2024-03-14 20:11', channel: 'Email', device: 'Firefox/Win', campaign: 'Retargeting Spring', event: 'Email Click', sessionId: '#3280' },
    ]
  },
];

// Campaign Attribution
export const campaignData: CampaignAttribution[] = [
  { campaign: 'Brand Awareness Q1', channel: 'Organic Search', identities: 48_210, sessions: 182_400, conversions: 3_840, revenue: 284_000, color: '#3b82f6' },
  { campaign: 'Performance Max Q1', channel: 'Paid Search', identities: 31_450, sessions: 94_200, conversions: 2_810, revenue: 198_500, color: '#10b981' },
  { campaign: 'Spring Sale', channel: 'Paid Social', identities: 27_830, sessions: 83_400, conversions: 4_120, revenue: 312_000, color: '#f59e0b' },
  { campaign: 'Loyalty Program', channel: 'Email', identities: 19_200, sessions: 57_600, conversions: 5_760, revenue: 441_000, color: '#8b5cf6' },
  { campaign: 'Content Series', channel: 'Organic Social', identities: 22_100, sessions: 66_300, conversions: 1_320, revenue: 89_400, color: '#06b6d4' },
  { campaign: 'Partner Network', channel: 'Referral', identities: 14_820, sessions: 44_400, conversions: 1_780, revenue: 127_000, color: '#f43f5e' },
];

// Resolution over time (30 days)
export const resolutionTimeline = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2024-02-15');
  date.setDate(date.getDate() + i);
  const base = 220_000 + i * 2_200;
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    resolved: Math.round(base + Math.sin(i * 0.4) * 3000),
    fragmented: Math.round(45_000 - i * 400 + Math.cos(i * 0.3) * 1000),
    pending: Math.round(12_000 - i * 200 + Math.sin(i * 0.5) * 500),
    newIdentities: Math.round(1000 + Math.sin(i * 0.6) * 400),
  };
});

// Device breakdown
export const deviceBreakdown = [
  { name: 'Desktop', value: 38, color: '#3b82f6' },
  { name: 'Mobile', value: 44, color: '#10b981' },
  { name: 'Tablet', value: 12, color: '#f59e0b' },
  { name: 'Smart TV', value: 4, color: '#8b5cf6' },
  { name: 'Other', value: 2, color: '#64748b' },
];

// Channel distribution
export const channelDistribution = [
  { channel: 'Organic Search', sessions: 182_400, pct: 28 },
  { channel: 'Paid Search', sessions: 94_200, pct: 14 },
  { channel: 'Paid Social', sessions: 83_400, pct: 13 },
  { channel: 'Email', sessions: 57_600, pct: 9 },
  { channel: 'Organic Social', sessions: 66_300, pct: 10 },
  { channel: 'Referral', sessions: 44_400, pct: 7 },
  { channel: 'Direct', sessions: 117_600, pct: 18 },
  { channel: 'Other', sessions: 6_500, pct: 1 },
];

// Geographic distribution
export const geoDistribution = [
  { country: 'United States', users: 98_420, pct: 34.6 },
  { country: 'United Kingdom', users: 28_470, pct: 10.0 },
  { country: 'Germany', users: 21_350, pct: 7.5 },
  { country: 'Canada', users: 18_920, pct: 6.6 },
  { country: 'France', users: 14_280, pct: 5.0 },
  { country: 'Australia', users: 12_840, pct: 4.5 },
  { country: 'Japan', users: 11_390, pct: 4.0 },
  { country: 'Netherlands', users: 9_820, pct: 3.5 },
  { country: 'Brazil', users: 8_460, pct: 3.0 },
  { country: 'Other', users: 60_771, pct: 21.3 },
];

// Recent resolution events (live feed)
export const recentEvents = [
  { id: 1, type: 'resolved', user: 'Priya M.', action: 'Cross-device identity merged', devices: 2, time: '1 min ago', confidence: 99 },
  { id: 2, type: 'new', user: 'Anon-7734', action: 'New anonymous session started', devices: 1, time: '2 min ago', confidence: 44 },
  { id: 3, type: 'resolved', user: 'Sarah K.', action: 'Email match confirmed identity', devices: 2, time: '2 min ago', confidence: 97 },
  { id: 4, type: 'fragmented', user: 'Anon-4821', action: 'Conflicting fingerprints detected', devices: 1, time: '12 min ago', confidence: 61 },
  { id: 5, type: 'resolved', user: 'Marcus T.', action: 'Session linked to known profile', devices: 1, time: '5 min ago', confidence: 92 },
  { id: 6, type: 'resolved', user: 'James R.', action: 'Deterministic match via email', devices: 1, time: '8 min ago', confidence: 88 },
  { id: 7, type: 'new', user: 'Anon-2291', action: 'New anonymous session started', devices: 1, time: '15 min ago', confidence: 38 },
  { id: 8, type: 'resolved', user: 'Elena V.', action: 'Cross-device identity merged', devices: 3, time: '18 min ago', confidence: 94 },
];
