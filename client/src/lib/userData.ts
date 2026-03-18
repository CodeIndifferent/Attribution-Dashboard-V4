/*
 * Comprehensive user data structure with devices, sessions, transactions, and locations
 */

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  countryCode: string;
  ipAddress: string;
}

export interface Device {
  deviceId: string;
  type: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
}

export interface Transaction {
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  product: string;
  productCategory: string;
  status: 'completed' | 'pending' | 'failed';
  location: Location;
  deviceId: string;
  campaignSource: string;
}

export interface SessionRecord {
  sessionId: string;
  timestamp: string;
  duration: number; // seconds
  deviceId: string;
  location: Location;
  campaignSource: string;
  events: number;
  pageViews: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface User {
  userId: string;
  email: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  totalSessions: number;
  totalTransactions: number;
  totalSpent: number;
  devices: Device[];
  sessions: SessionRecord[];
  transactions: Transaction[];
  primaryLocation: Location;
  locations: Location[];
  conversionRate: number;
  lifetimeValue: number;
  acquisitionCampaign: string;
}

export const usersData: User[] = [
  {
    userId: 'USR_001',
    email: 'sarah.k@example.com',
    name: 'Sarah K.',
    firstSeen: '2024-01-15',
    lastSeen: '2024-03-16',
    totalSessions: 47,
    totalTransactions: 3,
    totalSpent: 419.97,
    acquisitionCampaign: 'Twitter Campaign',
    conversionRate: 6.4,
    lifetimeValue: 419.97,
    primaryLocation: { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
    locations: [
      { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
      { latitude: 40.6892, longitude: -74.0445, city: 'Brooklyn', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.93' },
    ],
    devices: [
      {
        deviceId: 'dev_001_1',
        type: 'MacBook Pro 16"',
        os: 'macOS',
        osVersion: '14.2',
        browser: 'Chrome',
        browserVersion: '121.0',
        screenResolution: '1920x1200',
        firstSeen: '2024-01-15',
        lastSeen: '2024-03-16',
        sessionCount: 31,
      },
      {
        deviceId: 'dev_001_2',
        type: 'iPhone 15 Pro',
        os: 'iOS',
        osVersion: '17.3',
        browser: 'Safari',
        browserVersion: '17.3',
        screenResolution: '1179x2556',
        firstSeen: '2024-02-01',
        lastSeen: '2024-03-16',
        sessionCount: 16,
      },
    ],
    sessions: [
      {
        sessionId: 'sess_001_1',
        timestamp: '2024-03-16 14:23',
        duration: 1320,
        deviceId: 'dev_001_1',
        location: { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
        campaignSource: 'Twitter Campaign',
        events: 12,
        pageViews: 8,
        status: 'completed',
      },
      {
        sessionId: 'sess_001_2',
        timestamp: '2024-03-15 09:45',
        duration: 2145,
        deviceId: 'dev_001_2',
        location: { latitude: 40.6892, longitude: -74.0445, city: 'Brooklyn', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.93' },
        campaignSource: 'Organic Search',
        events: 15,
        pageViews: 10,
        status: 'completed',
      },
      {
        sessionId: 'sess_001_3',
        timestamp: '2024-03-14 16:30',
        duration: 890,
        deviceId: 'dev_001_1',
        location: { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
        campaignSource: 'Direct',
        events: 8,
        pageViews: 5,
        status: 'completed',
      },
    ],
    transactions: [
      {
        transactionId: 'txn_001_1',
        timestamp: '2024-03-16 14:45',
        amount: 129.99,
        currency: 'USD',
        product: 'Premium Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
        deviceId: 'dev_001_1',
        campaignSource: 'Twitter Campaign',
      },
      {
        transactionId: 'txn_001_2',
        timestamp: '2024-03-15 10:12',
        amount: 89.99,
        currency: 'USD',
        product: 'Standard Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 40.6892, longitude: -74.0445, city: 'Brooklyn', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.93' },
        deviceId: 'dev_001_2',
        campaignSource: 'Organic Search',
      },
      {
        transactionId: 'txn_001_3',
        timestamp: '2024-02-20 11:30',
        amount: 199.99,
        currency: 'USD',
        product: 'Enterprise Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 40.7128, longitude: -74.0060, city: 'New York', country: 'United States', countryCode: 'US', ipAddress: '203.45.128.92' },
        deviceId: 'dev_001_1',
        campaignSource: 'Twitter Campaign',
      },
    ],
  },
  {
    userId: 'USR_002',
    email: 'marcus.t@example.com',
    name: 'Marcus T.',
    firstSeen: '2024-02-10',
    lastSeen: '2024-03-15',
    totalSessions: 23,
    totalTransactions: 1,
    totalSpent: 79.99,
    acquisitionCampaign: 'Google Ads',
    conversionRate: 4.3,
    lifetimeValue: 79.99,
    primaryLocation: { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', country: 'United States', countryCode: 'US', ipAddress: '210.45.200.15' },
    locations: [
      { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', country: 'United States', countryCode: 'US', ipAddress: '210.45.200.15' },
    ],
    devices: [
      {
        deviceId: 'dev_002_1',
        type: 'iPhone 15',
        os: 'iOS',
        osVersion: '17.3',
        browser: 'Safari',
        browserVersion: '17.3',
        screenResolution: '1179x2556',
        firstSeen: '2024-02-10',
        lastSeen: '2024-03-15',
        sessionCount: 23,
      },
    ],
    sessions: [
      {
        sessionId: 'sess_002_1',
        timestamp: '2024-03-15 13:20',
        duration: 456,
        deviceId: 'dev_002_1',
        location: { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', country: 'United States', countryCode: 'US', ipAddress: '210.45.200.15' },
        campaignSource: 'Google Ads',
        events: 6,
        pageViews: 4,
        status: 'completed',
      },
      {
        sessionId: 'sess_002_2',
        timestamp: '2024-03-14 10:15',
        duration: 789,
        deviceId: 'dev_002_1',
        location: { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', country: 'United States', countryCode: 'US', ipAddress: '210.45.200.15' },
        campaignSource: 'Google Ads',
        events: 9,
        pageViews: 6,
        status: 'completed',
      },
    ],
    transactions: [
      {
        transactionId: 'txn_002_1',
        timestamp: '2024-03-15 13:35',
        amount: 79.99,
        currency: 'USD',
        product: 'Standard Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', country: 'United States', countryCode: 'US', ipAddress: '210.45.200.15' },
        deviceId: 'dev_002_1',
        campaignSource: 'Google Ads',
      },
    ],
  },
  {
    userId: 'USR_003',
    email: 'priya.m@example.com',
    name: 'Priya M.',
    firstSeen: '2024-01-20',
    lastSeen: '2024-03-14',
    totalSessions: 31,
    totalTransactions: 2,
    totalSpent: 289.98,
    acquisitionCampaign: 'Meta Campaign',
    conversionRate: 6.5,
    lifetimeValue: 289.98,
    primaryLocation: { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', country: 'United States', countryCode: 'US', ipAddress: '192.168.1.45' },
    locations: [
      { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', country: 'United States', countryCode: 'US', ipAddress: '192.168.1.45' },
    ],
    devices: [
      {
        deviceId: 'dev_003_1',
        type: 'Dell XPS 15',
        os: 'Windows',
        osVersion: '11',
        browser: 'Firefox',
        browserVersion: '123.0',
        screenResolution: '1920x1200',
        firstSeen: '2024-01-20',
        lastSeen: '2024-03-14',
        sessionCount: 20,
      },
      {
        deviceId: 'dev_003_2',
        type: 'Samsung Galaxy S24',
        os: 'Android',
        osVersion: '14',
        browser: 'Chrome Mobile',
        browserVersion: '121.0',
        screenResolution: '1440x3120',
        firstSeen: '2024-02-10',
        lastSeen: '2024-03-14',
        sessionCount: 11,
      },
    ],
    sessions: [
      {
        sessionId: 'sess_003_1',
        timestamp: '2024-03-14 11:20',
        duration: 1680,
        deviceId: 'dev_003_1',
        location: { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', country: 'United States', countryCode: 'US', ipAddress: '192.168.1.45' },
        campaignSource: 'Meta Campaign',
        events: 14,
        pageViews: 9,
        status: 'completed',
      },
    ],
    transactions: [
      {
        transactionId: 'txn_003_1',
        timestamp: '2024-03-14 11:45',
        amount: 89.99,
        currency: 'USD',
        product: 'Standard Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', country: 'United States', countryCode: 'US', ipAddress: '192.168.1.45' },
        deviceId: 'dev_003_1',
        campaignSource: 'Meta Campaign',
      },
      {
        transactionId: 'txn_003_2',
        timestamp: '2024-02-20 14:20',
        amount: 199.99,
        currency: 'USD',
        product: 'Premium Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 41.8781, longitude: -87.6298, city: 'Chicago', country: 'United States', countryCode: 'US', ipAddress: '192.168.1.45' },
        deviceId: 'dev_003_1',
        campaignSource: 'Meta Campaign',
      },
    ],
  },
  {
    userId: 'USR_004',
    email: 'james.r@example.com',
    name: 'James R.',
    firstSeen: '2024-02-15',
    lastSeen: '2024-03-10',
    totalSessions: 18,
    totalTransactions: 1,
    totalSpent: 129.99,
    acquisitionCampaign: 'Email Outreach',
    conversionRate: 5.6,
    lifetimeValue: 129.99,
    primaryLocation: { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', country: 'United States', countryCode: 'US', ipAddress: '215.67.45.120' },
    locations: [
      { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', country: 'United States', countryCode: 'US', ipAddress: '215.67.45.120' },
    ],
    devices: [
      {
        deviceId: 'dev_004_1',
        type: 'OnePlus 12',
        os: 'Android',
        osVersion: '14',
        browser: 'Chrome Mobile',
        browserVersion: '121.0',
        screenResolution: '1440x3168',
        firstSeen: '2024-02-15',
        lastSeen: '2024-03-10',
        sessionCount: 18,
      },
    ],
    sessions: [
      {
        sessionId: 'sess_004_1',
        timestamp: '2024-03-10 10:45',
        duration: 567,
        deviceId: 'dev_004_1',
        location: { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', country: 'United States', countryCode: 'US', ipAddress: '215.67.45.120' },
        campaignSource: 'Email Outreach',
        events: 8,
        pageViews: 5,
        status: 'completed',
      },
    ],
    transactions: [
      {
        transactionId: 'txn_004_1',
        timestamp: '2024-03-10 11:08',
        amount: 129.99,
        currency: 'USD',
        product: 'Premium Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', country: 'United States', countryCode: 'US', ipAddress: '215.67.45.120' },
        deviceId: 'dev_004_1',
        campaignSource: 'Email Outreach',
      },
    ],
  },
  {
    userId: 'USR_005',
    email: 'elena.v@example.com',
    name: 'Elena V.',
    firstSeen: '2024-01-10',
    lastSeen: '2024-03-16',
    totalSessions: 52,
    totalTransactions: 4,
    totalSpent: 599.96,
    acquisitionCampaign: 'Twitter Campaign',
    conversionRate: 7.7,
    lifetimeValue: 599.96,
    primaryLocation: { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
    locations: [
      { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
      { latitude: 42.2352, longitude: -71.0275, city: 'Cambridge', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.23' },
    ],
    devices: [
      {
        deviceId: 'dev_005_1',
        type: 'iPad Air',
        os: 'iPadOS',
        osVersion: '17.3',
        browser: 'Safari',
        browserVersion: '17.3',
        screenResolution: '2360x1640',
        firstSeen: '2024-01-10',
        lastSeen: '2024-03-16',
        sessionCount: 28,
      },
      {
        deviceId: 'dev_005_2',
        type: 'MacBook Pro 14"',
        os: 'macOS',
        osVersion: '14.2',
        browser: 'Chrome',
        browserVersion: '121.0',
        screenResolution: '1728x1117',
        firstSeen: '2024-02-05',
        lastSeen: '2024-03-16',
        sessionCount: 24,
      },
    ],
    sessions: [
      {
        sessionId: 'sess_005_1',
        timestamp: '2024-03-16 10:00',
        duration: 2340,
        deviceId: 'dev_005_1',
        location: { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
        campaignSource: 'Direct',
        events: 18,
        pageViews: 12,
        status: 'completed',
      },
    ],
    transactions: [
      {
        transactionId: 'txn_005_1',
        timestamp: '2024-03-16 10:28',
        amount: 199.99,
        currency: 'USD',
        product: 'Enterprise Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
        deviceId: 'dev_005_1',
        campaignSource: 'Direct',
      },
      {
        transactionId: 'txn_005_2',
        timestamp: '2024-03-10 15:45',
        amount: 129.99,
        currency: 'USD',
        product: 'Premium Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 42.2352, longitude: -71.0275, city: 'Cambridge', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.23' },
        deviceId: 'dev_005_2',
        campaignSource: 'Twitter Campaign',
      },
      {
        transactionId: 'txn_005_3',
        timestamp: '2024-02-28 09:20',
        amount: 89.99,
        currency: 'USD',
        product: 'Standard Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
        deviceId: 'dev_005_1',
        campaignSource: 'Organic Search',
      },
      {
        transactionId: 'txn_005_4',
        timestamp: '2024-02-15 12:30',
        amount: 179.99,
        currency: 'USD',
        product: 'Premium Plan',
        productCategory: 'Subscription',
        status: 'completed',
        location: { latitude: 42.3601, longitude: -71.0589, city: 'Boston', country: 'United States', countryCode: 'US', ipAddress: '203.45.130.22' },
        deviceId: 'dev_005_1',
        campaignSource: 'Twitter Campaign',
      },
    ],
  },
];
