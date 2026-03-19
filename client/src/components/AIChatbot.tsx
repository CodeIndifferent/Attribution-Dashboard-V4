/*
 * AI CHATBOT WIDGET — LUCIA AI
 * Floating icon on bottom-right that opens a chat panel.
 * Context-aware: detects current page and surfaces relevant suggestions.
 * Full user-specific query support for Users & Sessions page.
 */
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown, RotateCcw, Copy, Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTrackableLinks } from '@/lib/trackableLinkData';
import { mockCampaignLinks } from '@/lib/campaignLinkData';
import { usersData } from '@/lib/userData';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  typing?: boolean;
}

// ─── Page-aware suggested prompts ─────────────────────────────────────────────
const GLOBAL_PROMPTS = [
  'Which campaign has the highest ROI?',
  'Show me top performing trackable links',
  'What is the overall conversion rate?',
  'Which channel drives the most revenue?',
  'How many active users do we have?',
  'What are the top user segments?',
];

const USERS_PAGE_PROMPTS = [
  'Show me all users',
  'Who is the highest value user?',
  'Tell me about Sarah K.',
  'Which users have the most sessions?',
  'Compare user CVR across campaigns',
  'Show device breakdown for all users',
  'Which users were acquired via Email?',
  'Show session history for Marcus T.',
  'What devices does Elena V. use?',
  'List users with 2 or more devices',
];

// ─── Data helpers — Platform ──────────────────────────────────────────────────
function getOverallStats() {
  const totalClicks   = mockTrackableLinks.reduce((s, l) => s + l.totalClicks, 0);
  const totalConv     = mockTrackableLinks.reduce((s, l) => s + l.totalConversions, 0);
  const totalRevenue  = mockTrackableLinks.reduce((s, l) => s + l.totalRevenue, 0);
  const totalSpend    = mockTrackableLinks.reduce((s, l) => s + l.campaigns.reduce((cs, c) => cs + c.spend, 0), 0);
  const avgROI        = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';
  const cvr           = totalClicks > 0 ? ((totalConv / totalClicks) * 100).toFixed(1) : '0';
  return { totalClicks, totalConv, totalRevenue, totalSpend, avgROI, cvr };
}

function getTopLinks() {
  return [...mockTrackableLinks].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 3);
}

function getChannelBreakdown() {
  const map: Record<string, { revenue: number; conversions: number; spend: number }> = {};
  mockTrackableLinks.forEach(link => {
    link.channelMetrics.forEach(ch => {
      if (!map[ch.channel]) map[ch.channel] = { revenue: 0, conversions: 0, spend: 0 };
      map[ch.channel].revenue     += ch.revenue;
      map[ch.channel].conversions += ch.conversions;
      const chSpend = link.campaigns.filter(c => c.channel === ch.channel).reduce((s, c) => s + c.spend, 0);
      map[ch.channel].spend += chSpend;
    });
  });
  return Object.entries(map)
    .map(([channel, d]) => ({ channel, ...d, roi: d.spend > 0 ? (d.revenue / d.spend).toFixed(2) : '0' }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getSupercookieStats() {
  const avg  = mockTrackableLinks.reduce((s, l) => s + l.supercookieResolutionRate, 0) / mockTrackableLinks.length;
  const best = [...mockTrackableLinks].sort((a, b) => b.supercookieResolutionRate - a.supercookieResolutionRate)[0];
  return { avg: avg.toFixed(1), best };
}

// ─── Data helpers — Users ─────────────────────────────────────────────────────

/** Find a user by partial name or user ID (case-insensitive) */
function findUser(query: string) {
  const q = query.toLowerCase();
  return usersData.find(u =>
    u.name.toLowerCase().includes(q) ||
    u.userId.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
}

/** Extract a name-like token from the query, e.g. "tell me about sarah k" → "sarah k" */
function extractUserName(input: string): string | null {
  const patterns = [
    /(?:about|for|show me|profile of|details for|info on|data for|sessions for|devices for|transactions for|journey for|history for|cvr for|revenue for)\s+([a-z][a-z\s.'-]{1,30})/i,
    /([a-z][a-z\s.'-]{1,30})(?:'s|s')\s+(?:profile|sessions|devices|transactions|journey|history|cvr|revenue|data|info)/i,
    /^(?:who is|lookup|find)\s+([a-z][a-z\s.'-]{1,30})/i,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1].trim();
  }
  // Also try matching any known user name directly in the query
  for (const u of usersData) {
    if (input.toLowerCase().includes(u.name.toLowerCase())) return u.name;
    if (input.toLowerCase().includes(u.userId.toLowerCase())) return u.userId;
  }
  return null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── User-specific response builders ─────────────────────────────────────────

function buildUserProfileResponse(u: typeof usersData[0]): string {
  const deviceSummary = u.devices.map(d => `${d.type} — ${d.browser} on ${d.os} (${d.sessionCount} sessions)`).join('\n   ');
  const recentTx = u.transactions.slice(0, 3).map(t =>
    `• ${t.product} — $${t.amount.toFixed(2)} via ${t.campaignSource} on ${formatDate(t.timestamp)}`
  ).join('\n');
  const recentSessions = u.sessions.slice(0, 3).map(s =>
    `• ${formatDate(s.timestamp)} — ${formatDuration(s.duration)} · ${s.pageViews} page views · ${s.campaignSource}`
  ).join('\n');
  return `**User Profile: ${u.name}** (\`${u.userId}\`)\n\n` +
    `📧 ${u.email}\n` +
    `📍 ${u.primaryLocation.city}, ${u.primaryLocation.country}\n` +
    `🗓 First seen: ${formatDate(u.firstSeen)} · Last seen: ${formatDate(u.lastSeen)}\n\n` +
    `**Engagement**\n` +
    `• Sessions: ${u.totalSessions} · Transactions: ${u.totalTransactions}\n` +
    `• Total Spent: $${u.totalSpent.toFixed(2)} · CVR: ${u.conversionRate}%\n` +
    `• Acquired via: ${u.acquisitionCampaign}\n\n` +
    `**Devices (${u.devices.length})**\n   ${deviceSummary}\n\n` +
    `**Recent Transactions**\n${recentTx}\n\n` +
    `**Recent Sessions**\n${recentSessions}`;
}

function buildUserSessionsResponse(u: typeof usersData[0]): string {
  const sessions = u.sessions.slice(0, 5);
  const avgDuration = Math.round(u.sessions.reduce((s, sess) => s + sess.duration, 0) / u.sessions.length);
  const completed = u.sessions.filter(s => s.status === 'completed').length;
  return `**Session History: ${u.name}** (\`${u.userId}\`)\n\n` +
    `• Total Sessions: **${u.totalSessions}** · Completed: ${completed} · Abandoned: ${u.sessions.length - completed}\n` +
    `• Avg Duration: **${formatDuration(avgDuration)}**\n` +
    `• First Session: ${formatDate(u.firstSeen)} · Last Session: ${formatDate(u.lastSeen)}\n\n` +
    `**Last ${sessions.length} Sessions:**\n` +
    sessions.map((s, i) =>
      `${i + 1}. ${formatDate(s.timestamp)}\n   Duration: ${formatDuration(s.duration)} · ${s.pageViews} page views · ${s.events} events\n   Source: ${s.campaignSource} · Location: ${s.location.city} · Status: ${s.status}`
    ).join('\n\n');
}

function buildUserDevicesResponse(u: typeof usersData[0]): string {
  return `**Device Fingerprints: ${u.name}** (\`${u.userId}\`)\n\n` +
    `• ${u.devices.length} device${u.devices.length > 1 ? 's' : ''} tracked · Supercookie linked across all devices\n\n` +
    u.devices.map((d, i) =>
      `**Device ${i + 1}: ${d.type}** (\`${d.deviceId}\`)\n` +
      `   OS: ${d.os} ${d.osVersion} · Browser: ${d.browser} ${d.browserVersion}\n` +
      `   Resolution: ${d.screenResolution} · Sessions: ${d.sessionCount}\n` +
      `   First seen: ${formatDate(d.firstSeen)} · Last seen: ${formatDate(d.lastSeen)}`
    ).join('\n\n') +
    `\n\n**Known Locations:**\n` +
    u.locations.map(l => `• ${l.city}, ${l.country} (${l.ipAddress})`).join('\n');
}

function buildUserTransactionsResponse(u: typeof usersData[0]): string {
  const total = u.transactions.reduce((s, t) => s + t.amount, 0);
  return `**Transaction History: ${u.name}** (\`${u.userId}\`)\n\n` +
    `• ${u.transactions.length} transactions · Lifetime Value: **$${total.toFixed(2)}**\n` +
    `• Avg Order Value: $${(total / u.transactions.length).toFixed(2)}\n\n` +
    u.transactions.map((t, i) =>
      `${i + 1}. **${t.product}** — $${t.amount.toFixed(2)}\n` +
      `   Date: ${formatDate(t.timestamp)} · Status: ${t.status}\n` +
      `   Category: ${t.productCategory} · Source: ${t.campaignSource}\n` +
      `   Device: \`${t.deviceId}\` · Location: ${t.location.city}`
    ).join('\n\n');
}

function buildUserJourneyResponse(u: typeof usersData[0]): string {
  const firstSession = u.sessions[u.sessions.length - 1];
  const lastTx = u.transactions[0];
  const devices = Array.from(new Set(u.sessions.map(s => s.deviceId)));
  const sources = Array.from(new Set(u.sessions.map(s => s.campaignSource)));
  return `**User Journey: ${u.name}** (\`${u.userId}\`)\n\n` +
    `**1. Acquisition (First Touch)**\n` +
    `   Campaign: ${u.acquisitionCampaign}\n` +
    `   Date: ${formatDate(u.firstSeen)}\n` +
    `   Entry device: ${u.devices[0]?.type || 'Unknown'} · Location: ${u.primaryLocation.city}\n\n` +
    `**2. Engagement (Multi-Session)**\n` +
    `   ${u.totalSessions} sessions across ${devices.length} device${devices.length > 1 ? 's' : ''}\n` +
    `   Channels touched: ${sources.join(', ')}\n` +
    `   Supercookie: ✓ Resolved — cross-device identity confirmed\n\n` +
    `**3. Conversion (Last Touch)**\n` +
    (lastTx
      ? `   Product: ${lastTx.product} — $${lastTx.amount.toFixed(2)}\n` +
        `   Date: ${formatDate(lastTx.timestamp)}\n` +
        `   Source: ${lastTx.campaignSource} · Device: ${lastTx.deviceId}\n`
      : `   No conversions recorded yet\n`) +
    `\n**CVR: ${u.conversionRate}%** · Total Spent: $${u.totalSpent.toFixed(2)}`;
}

// ─── All-users response builders ──────────────────────────────────────────────

function buildAllUsersResponse(): string {
  const sorted = [...usersData].sort((a, b) => b.totalSpent - a.totalSpent);
  const totalSpent = usersData.reduce((s, u) => s + u.totalSpent, 0);
  const avgCVR = (usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length).toFixed(1);
  return `**All Users — Platform Overview**\n\n` +
    `• Total Users: **${usersData.length}** · Total Revenue: **$${totalSpent.toFixed(0)}**\n` +
    `• Avg CVR: **${avgCVR}%** · Avg Sessions: ${Math.round(usersData.reduce((s, u) => s + u.totalSessions, 0) / usersData.length)}\n\n` +
    sorted.map((u, i) =>
      `${i + 1}. **${u.name}** (\`${u.userId}\`) — ${u.primaryLocation.city}\n` +
      `   Revenue: $${u.totalSpent.toFixed(0)} · Sessions: ${u.totalSessions} · CVR: ${u.conversionRate}% · Devices: ${u.devices.length}\n` +
      `   Acquired via: ${u.acquisitionCampaign}`
    ).join('\n\n');
}

function buildHighestValueUserResponse(): string {
  const top = [...usersData].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  return buildUserProfileResponse(top) +
    `\n\n**Why they're the highest-value user:**\n` +
    `• Highest lifetime spend at $${top.totalSpent.toFixed(2)}\n` +
    `• ${top.totalSessions} sessions — ${Math.round(top.totalSessions / usersData.reduce((s, u) => s + u.totalSessions, 0) * 100)}% of all platform sessions\n` +
    `• ${top.devices.length} device${top.devices.length > 1 ? 's' : ''} tracked via supercookie — cross-device attribution confirmed`;
}

function buildMostSessionsResponse(): string {
  const sorted = [...usersData].sort((a, b) => b.totalSessions - a.totalSessions).slice(0, 5);
  return `**Users by Session Count**\n\n` +
    sorted.map((u, i) =>
      `${i + 1}. **${u.name}** — ${u.totalSessions} sessions · $${u.totalSpent.toFixed(0)} revenue · ${u.conversionRate}% CVR`
    ).join('\n');
}

function buildCVRComparisonResponse(): string {
  const sorted = [...usersData].sort((a, b) => b.conversionRate - a.conversionRate);
  const byCampaign: Record<string, { users: number; totalCVR: number }> = {};
  usersData.forEach(u => {
    if (!byCampaign[u.acquisitionCampaign]) byCampaign[u.acquisitionCampaign] = { users: 0, totalCVR: 0 };
    byCampaign[u.acquisitionCampaign].users++;
    byCampaign[u.acquisitionCampaign].totalCVR += u.conversionRate;
  });
  const campaignCVR = Object.entries(byCampaign)
    .map(([campaign, d]) => ({ campaign, avgCVR: (d.totalCVR / d.users).toFixed(1), users: d.users }))
    .sort((a, b) => parseFloat(b.avgCVR) - parseFloat(a.avgCVR));
  return `**CVR Comparison Across Users**\n\n` +
    `**Individual User CVR (ranked):**\n` +
    sorted.map((u, i) => `${i + 1}. **${u.name}** — ${u.conversionRate}% CVR · $${u.totalSpent.toFixed(0)} revenue`).join('\n') +
    `\n\n**Avg CVR by Acquisition Campaign:**\n` +
    campaignCVR.map(c => `• ${c.campaign}: **${c.avgCVR}%** avg CVR (${c.users} user${c.users > 1 ? 's' : ''})`).join('\n');
}

function buildDeviceBreakdownAllUsersResponse(): string {
  const deviceTypes: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  usersData.forEach(u => {
    u.devices.forEach(d => {
      deviceTypes[d.type] = (deviceTypes[d.type] || 0) + 1;
      browsers[d.browser] = (browsers[d.browser] || 0) + 1;
    });
  });
  const totalDevices = Object.values(deviceTypes).reduce((s, n) => s + n, 0);
  const multiDevice = usersData.filter(u => u.devices.length > 1);
  return `**Device Fingerprint Breakdown — All Users**\n\n` +
    `• Total Devices Tracked: **${totalDevices}** across ${usersData.length} users\n` +
    `• Multi-Device Users: **${multiDevice.length}** (${Math.round(multiDevice.length / usersData.length * 100)}%) — all resolved via supercookie\n\n` +
    `**Device Types:**\n` +
    Object.entries(deviceTypes).sort((a, b) => b[1] - a[1]).map(([type, n]) =>
      `• ${type}: ${n} device${n > 1 ? 's' : ''} (${Math.round(n / totalDevices * 100)}%)`
    ).join('\n') +
    `\n\n**Browsers:**\n` +
    Object.entries(browsers).sort((a, b) => b[1] - a[1]).map(([browser, n]) =>
      `• ${browser}: ${n} device${n > 1 ? 's' : ''}`
    ).join('\n') +
    `\n\n**Per-User Device Count:**\n` +
    usersData.map(u => `• **${u.name}**: ${u.devices.length} device${u.devices.length > 1 ? 's' : ''} — ${u.devices.map(d => d.type).join(', ')}`).join('\n');
}

function buildUsersByCampaignResponse(campaignName: string): string {
  const matched = usersData.filter(u =>
    u.acquisitionCampaign.toLowerCase().includes(campaignName.toLowerCase())
  );
  if (matched.length === 0) {
    const campaigns = Array.from(new Set(usersData.map(u => u.acquisitionCampaign)));
    return `No users found acquired via "${campaignName}".\n\nAvailable campaigns: ${campaigns.join(', ')}`;
  }
  return `**Users Acquired via "${matched[0].acquisitionCampaign}"**\n\n` +
    `• ${matched.length} user${matched.length > 1 ? 's' : ''} acquired\n` +
    `• Total Revenue: $${matched.reduce((s, u) => s + u.totalSpent, 0).toFixed(0)}\n` +
    `• Avg CVR: ${(matched.reduce((s, u) => s + u.conversionRate, 0) / matched.length).toFixed(1)}%\n\n` +
    matched.map((u, i) =>
      `${i + 1}. **${u.name}** — $${u.totalSpent.toFixed(0)} · ${u.totalSessions} sessions · ${u.conversionRate}% CVR`
    ).join('\n');
}

function buildMultiDeviceUsersResponse(): string {
  const multi = usersData.filter(u => u.devices.length >= 2);
  const single = usersData.filter(u => u.devices.length === 1);
  const avgCVRMulti = (multi.reduce((s, u) => s + u.conversionRate, 0) / multi.length).toFixed(1);
  const avgCVRSingle = (single.reduce((s, u) => s + u.conversionRate, 0) / single.length).toFixed(1);
  return `**Multi-Device Users (2+ Devices)**\n\n` +
    `• Multi-device users: **${multi.length}** · Single-device: ${single.length}\n` +
    `• Avg CVR multi-device: **${avgCVRMulti}%** vs single-device: ${avgCVRSingle}%\n` +
    `• All multi-device users resolved via supercookie cross-device identity\n\n` +
    multi.map((u, i) =>
      `${i + 1}. **${u.name}** — ${u.devices.length} devices (${u.devices.map(d => d.type).join(' + ')})\n` +
      `   CVR: ${u.conversionRate}% · Revenue: $${u.totalSpent.toFixed(0)} · Sessions: ${u.totalSessions}`
    ).join('\n\n');
}

// ─── Main response engine ─────────────────────────────────────────────────────
function generateResponse(input: string, isUsersPage: boolean): string {
  const q = input.toLowerCase().trim();

  // ── User-specific lookup ──
  const nameToken = extractUserName(input);
  if (nameToken) {
    const user = findUser(nameToken);
    if (user) {
      // Determine what aspect they're asking about
      if (q.includes('session') || q.includes('visit')) return buildUserSessionsResponse(user);
      if (q.includes('device') || q.includes('fingerprint') || q.includes('browser') || q.includes('os')) return buildUserDevicesResponse(user);
      if (q.includes('transaction') || q.includes('purchase') || q.includes('order') || q.includes('bought')) return buildUserTransactionsResponse(user);
      if (q.includes('journey') || q.includes('path') || q.includes('funnel')) return buildUserJourneyResponse(user);
      if (q.includes('cvr') || q.includes('conversion rate')) return `**CVR for ${user.name}:** ${user.conversionRate}%\n\n• ${user.totalTransactions} conversions from ${user.totalSessions} sessions\n• Revenue: $${user.totalSpent.toFixed(2)}\n• Acquired via: ${user.acquisitionCampaign}\n\nPlatform avg CVR: ${(usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length).toFixed(1)}% — ${user.name} is ${user.conversionRate > 6 ? 'above' : 'below'} average.`;
      if (q.includes('revenue') || q.includes('spent') || q.includes('value')) return `**Revenue for ${user.name}:** $${user.totalSpent.toFixed(2)}\n\n• ${user.totalTransactions} transactions · Avg order: $${(user.totalSpent / user.totalTransactions).toFixed(2)}\n• Lifetime value: $${user.lifetimeValue.toFixed(2)}\n• Acquired via: ${user.acquisitionCampaign}`;
      // Default: full profile
      return buildUserProfileResponse(user);
    }
    // Name mentioned but not found
    return `I couldn't find a user matching "${nameToken}".\n\nKnown users: ${usersData.map(u => `**${u.name}** (${u.userId})`).join(', ')}\n\nTry asking: "Tell me about Sarah K." or "Show sessions for Marcus T."`;
  }

  // ── All users overview ──
  if (q.includes('all user') || q.includes('list user') || q.includes('show user') || q.includes('every user')) {
    return buildAllUsersResponse();
  }

  // ── Highest value user ──
  if (q.includes('highest value') || q.includes('most valuable') || q.includes('top user') || q.includes('best user') || q.includes('biggest spender')) {
    return buildHighestValueUserResponse();
  }

  // ── Most sessions ──
  if (q.includes('most session') || q.includes('highest session') || q.includes('most active user')) {
    return buildMostSessionsResponse();
  }

  // ── CVR comparison ──
  if ((q.includes('compare') || q.includes('comparison') || q.includes('breakdown')) && (q.includes('cvr') || q.includes('conversion'))) {
    return buildCVRComparisonResponse();
  }

  // ── Device breakdown all users ──
  if ((q.includes('device') || q.includes('fingerprint')) && (q.includes('all') || q.includes('breakdown') || q.includes('overview'))) {
    return buildDeviceBreakdownAllUsersResponse();
  }

  // ── Multi-device users ──
  if (q.includes('multi') || q.includes('multiple device') || q.includes('2 or more device') || q.includes('two device')) {
    return buildMultiDeviceUsersResponse();
  }

  // ── Users by campaign ──
  const campaignKeywords = ['email', 'twitter', 'google', 'meta', 'social', 'paid', 'organic'];
  for (const kw of campaignKeywords) {
    if (q.includes(kw) && (q.includes('user') || q.includes('who') || q.includes('acquired'))) {
      return buildUsersByCampaignResponse(kw);
    }
  }

  // ── Users page context: show user-specific help ──
  if (isUsersPage && (q.includes('help') || q.includes('what can') || q.includes('capabilities'))) {
    return `**Lucia AI — Users & Sessions Queries**\n\nI'm fully integrated with the Users & Sessions page. Here's what I can tell you:\n\n👤 **Individual User Lookups**\n• "Tell me about Sarah K."\n• "Show profile for USR_003"\n• "What devices does Elena V. use?"\n\n📊 **Session Data**\n• "Show session history for Marcus T."\n• "Which users have the most sessions?"\n\n💳 **Transaction History**\n• "Show transactions for Priya M."\n• "What did James R. buy?"\n\n🔗 **Device Fingerprints**\n• "Show device breakdown for all users"\n• "List users with 2 or more devices"\n\n🗺 **User Journeys**\n• "Show journey for Sarah K."\n• "What was Elena's conversion path?"\n\n📈 **Comparisons**\n• "Compare CVR across campaigns"\n• "Which users were acquired via Email?"\n• "Who is the highest value user?"`;
  }

  // ── ROI queries ──
  if (q.includes('roi') || q.includes('return on investment')) {
    const stats = getOverallStats();
    const topLinks = getTopLinks();
    const channels = getChannelBreakdown();
    const topCh = channels[0];
    return `**Platform ROI Summary**\n\nOverall platform ROI is **${stats.avgROI}x** across all active campaigns.\n\n**Top Links by ROI:**\n${topLinks.map((l, i) => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      const roi = spend > 0 ? (l.totalRevenue / spend).toFixed(2) : 'N/A';
      return `${i + 1}. **${l.name}** (${l.shortCode}) — ${roi}x ROI · $${l.totalRevenue.toLocaleString()} revenue`;
    }).join('\n')}\n\n**Best Channel:** ${topCh.channel} at **${topCh.roi}x ROI** generating $${topCh.revenue.toLocaleString()} revenue from $${topCh.spend.toLocaleString()} spend.`;
  }

  // ── Trackable links ──
  if (q.includes('trackable link') || q.includes('link performance') || q.includes('top link') || q.includes('best link')) {
    const links = getTopLinks();
    return `**Top Trackable Links by Revenue**\n\n${links.map((l, i) => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      const roi = spend > 0 ? (l.totalRevenue / spend).toFixed(2) : 'N/A';
      return `**${i + 1}. ${l.name}** (\`${l.shortCode}\`)\n   • Clicks: ${l.totalClicks.toLocaleString()} · Conversions: ${l.totalConversions.toLocaleString()}\n   • Revenue: $${l.totalRevenue.toLocaleString()} · ROI: ${roi}x\n   • Supercookie Resolution: ${l.supercookieResolutionRate}%`;
    }).join('\n\n')}\n\nAll ${mockTrackableLinks.length} links are tracked with SDK integration and supercookie resolution enabled.`;
  }

  // ── Conversion rate ──
  if (q.includes('conversion rate') || q.includes('cvr') || q.includes('convert')) {
    const stats = getOverallStats();
    const channels = getChannelBreakdown();
    return `**Conversion Rate Analysis**\n\nOverall platform CVR: **${stats.cvr}%**\n\n• Total Clicks: ${stats.totalClicks.toLocaleString()}\n• Total Conversions: ${stats.totalConv.toLocaleString()}\n• Revenue per Conversion: $${(stats.totalRevenue / stats.totalConv).toFixed(2)}\n\n**CVR by Channel:**\n${channels.map(ch => `• ${ch.channel}: ${ch.conversions.toLocaleString()} conversions · $${ch.revenue.toLocaleString()} revenue`).join('\n')}`;
  }

  // ── Channel / revenue ──
  if (q.includes('channel') || q.includes('revenue') || q.includes('best channel')) {
    const channels = getChannelBreakdown();
    const stats = getOverallStats();
    return `**Channel Performance Breakdown**\n\nTotal Revenue: **$${stats.totalRevenue.toLocaleString()}** · Total Spend: **$${stats.totalSpend.toLocaleString()}**\n\n${channels.map((ch, i) => `${i + 1}. **${ch.channel}**\n   Revenue: $${ch.revenue.toLocaleString()} · Spend: $${ch.spend.toLocaleString()} · ROI: ${ch.roi}x · Conversions: ${ch.conversions.toLocaleString()}`).join('\n\n')}\n\n**Top Channel:** ${channels[0].channel} drives the most revenue at $${channels[0].revenue.toLocaleString()} with a ${channels[0].roi}x ROI.`;
  }

  // ── Active users / user count ──
  if (q.includes('active user') || q.includes('how many user') || q.includes('user count') || q.includes('total user')) {
    const topUsers = [...usersData].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);
    return `**User Overview**\n\n• Total Tracked Users: **${usersData.length}**\n• Total Sessions: ${usersData.reduce((s, u) => s + u.totalSessions, 0).toLocaleString()}\n• Avg CVR: ${(usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length).toFixed(1)}%\n\n**Top Users by Revenue:**\n${topUsers.map((u, i) => `${i + 1}. **${u.name}** — $${u.totalSpent.toFixed(0)} · ${u.totalSessions} sessions · ${u.conversionRate}% CVR`).join('\n')}`;
  }

  // ── Segments ──
  if (q.includes('segment') || q.includes('high value') || q.includes('high-value')) {
    const topUsers = [...usersData].sort((a, b) => b.totalSpent - a.totalSpent);
    const avgSpend = usersData.reduce((s, u) => s + u.totalSpent, 0) / usersData.length;
    return `**User Segments**\n\nAvg Revenue per User: **$${avgSpend.toFixed(0)}**\n\n**High-Value Users (Top 3):**\n${topUsers.slice(0, 3).map((u, i) => {
      return `${i + 1}. **${u.name}** (${u.primaryLocation.city})\n   Revenue: $${u.totalSpent.toFixed(0)} · Sessions: ${u.totalSessions} · Devices: ${u.devices.length} · CVR: ${u.conversionRate}%\n   Acquired via: ${u.acquisitionCampaign}`;
    }).join('\n\n')}\n\nUsers with 2+ devices show **60% higher ROI** due to cross-device supercookie resolution.`;
  }

  // ── Spend / budget ──
  if (q.includes('spend') || q.includes('budget') || q.includes('cost')) {
    const stats = getOverallStats();
    return `**Campaign Spend Summary**\n\nTotal Platform Spend: **$${stats.totalSpend.toLocaleString()}**\nTotal Revenue Generated: **$${stats.totalRevenue.toLocaleString()}**\nOverall ROAS: **${stats.avgROI}x**\n\n**Spend by Link:**\n${mockTrackableLinks.map(l => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      return `• **${l.name}**: $${spend.toLocaleString()} spend → $${l.totalRevenue.toLocaleString()} revenue`;
    }).join('\n')}\n\nFor every $1 spent, the platform generates **$${stats.avgROI}** in revenue.`;
  }

  // ── Supercookie / fingerprint ──
  if (q.includes('supercookie') || q.includes('fingerprint') || q.includes('resolution') || q.includes('identity')) {
    const sc = getSupercookieStats();
    return `**Supercookie & Identity Resolution**\n\nAvg Resolution Rate: **${sc.avg}%** across all links\n\n**Best Performing Link:**\n• ${sc.best.name} (\`${sc.best.shortCode}\`) — **${sc.best.supercookieResolutionRate}%** resolution rate\n\n**How it works:**\nWhen a user clicks a trackable link, the Lucia SDK fires and connects their browser cookie to the persistent supercookie. This enables:\n• Cross-device identity matching\n• Full journey attribution from first click to last conversion\n• True ROI measurement even when users switch devices\n\nUsers resolved via supercookie show **2.4x higher** conversion rates than unresolved sessions.`;
  }

  // ── Campaign summary ──
  if (q.includes('campaign') || q.includes('all campaign') || q.includes('campaign list')) {
    const allCampaigns = mockTrackableLinks.flatMap(l => l.campaigns.map(c => ({ ...c, linkName: l.name })));
    const active = allCampaigns.filter(c => c.status === 'Active');
    const totalSpend = allCampaigns.reduce((s, c) => s + c.spend, 0);
    const totalRev = allCampaigns.reduce((s, c) => s + c.revenue, 0);
    const top3 = [...allCampaigns].sort((a, b) => b.roi - a.roi).slice(0, 3);
    return `**Campaign Overview**\n\n• Total Campaigns: **${allCampaigns.length}** (${active.length} active)\n• Total Spend: **$${totalSpend.toLocaleString()}**\n• Total Revenue: **$${totalRev.toLocaleString()}**\n• Platform ROAS: **${(totalRev / totalSpend).toFixed(2)}x**\n\n**Top 3 Campaigns by ROI:**\n${top3.map((c, i) => `${i + 1}. **${c.campaignName}** (${c.linkName})\n   ROI: ${c.roi}x · Revenue: $${c.revenue.toLocaleString()} · Spend: $${c.spend.toLocaleString()}`).join('\n\n')}`;
  }

  // ── Attribution ──
  if (q.includes('attribution') || q.includes('first touch') || q.includes('last touch') || q.includes('linear')) {
    return `**Attribution Model Insights**\n\nThe Lucia Attribution system supports 4 models:\n\n1. **First Touch** — 100% credit to the first interaction. Best for awareness campaigns.\n\n2. **Last Touch** — 100% credit to the final conversion event. Best for bottom-funnel.\n\n3. **Linear** — Equal credit across all touchpoints. Best for full journey analysis.\n\n4. **Time Decay** — More credit to recent touchpoints. Best for short sales cycles.\n\n**Recommendation:** Linear attribution provides the most accurate ROI picture since users average 3.2 touchpoints before converting.`;
  }

  // ── Journey / funnel ──
  if (q.includes('journey') || q.includes('path') || q.includes('funnel') || q.includes('drop')) {
    return `**User Journey & Funnel Analysis**\n\n**Platform Conversion Funnel:**\n• Link Click → Landing: **82%** retention\n• Landing → Product View: **64%** retention (18% drop-off)\n• Product View → Cart: **41%** retention (23% drop-off)\n• Cart → Checkout: **28%** retention (13% drop-off)\n• Checkout → Purchase: **11.2%** final CVR\n\n**Biggest Drop-off:** Product View → Cart (23%).\n\n**Top Conversion Path:**\nEmail → Landing → Product → Checkout → Purchase\n• 847 users · $312 avg revenue · 18.4% CVR`;
  }

  // ── Help ──
  if (q.includes('help') || q.includes('what can you') || q.includes('capabilities')) {
    return `**Lucia AI — What I Can Help With**\n\n📊 **Campaigns** — performance, spend, revenue, ROI, status\n🔗 **Trackable Links** — clicks, conversions, supercookie resolution\n👥 **Users** — individual profiles, sessions, devices, transactions, journeys\n📍 **Attribution** — model comparisons, first/last touch, linear\n🌍 **Channels** — Email, Social, Paid Ads, Organic, Influencer\n🔮 **Identity** — supercookie resolution, cross-device matching\n📈 **Funnels** — conversion paths, drop-off points\n\n**User queries (try these):**\n• "Tell me about Sarah K."\n• "Show sessions for Marcus T."\n• "Which users have the most sessions?"\n• "Compare CVR across campaigns"`;
  }

  // ── Greeting ──
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'yo') {
    const stats = getOverallStats();
    return `**Hello! I'm Lucia AI** 👋\n\nYour attribution intelligence assistant. Here's a quick snapshot:\n\n• Total Revenue: **$${stats.totalRevenue.toLocaleString()}**\n• Conversions: **${stats.totalConv.toLocaleString()}** (${stats.cvr}% CVR)\n• Platform ROI: **${stats.avgROI}x**\n• Users: **${usersData.length}** tracked\n\n${isUsersPage ? 'You\'re on the Users & Sessions page — try asking about a specific user like "Tell me about Sarah K." or "Show devices for Elena V."' : 'Ask me about campaigns, users, attribution models, or conversion funnels.'}`;
  }

  // ── Default fallback ──
  const stats = getOverallStats();
  if (isUsersPage) {
    return `I can help you analyze user data. Try:\n\n• "Tell me about Sarah K." — full user profile\n• "Show sessions for Marcus T."\n• "What devices does Elena V. use?"\n• "Show all users"\n• "Who is the highest value user?"\n• "Compare CVR across campaigns"\n\nPlatform snapshot: ${usersData.length} users · $${stats.totalRevenue.toLocaleString()} revenue · ${stats.cvr}% CVR`;
  }
  return `I can help you analyze your attribution data.\n\n• **Revenue:** $${stats.totalRevenue.toLocaleString()} · **ROI:** ${stats.avgROI}x\n• **Conversions:** ${stats.totalConv.toLocaleString()} · **CVR:** ${stats.cvr}%\n• **Users:** ${usersData.length} tracked\n\nType **"help"** to see everything I can do.`;
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-cyan-200 font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={j} className="px-1 py-0.5 rounded text-[10px] bg-slate-700/60 text-amber-300 font-mono">{part.slice(1, -1)}</code>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  return (
    <div className={cn('flex gap-2.5 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
      )}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className={cn(
        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed relative',
        isUser
          ? 'bg-gradient-to-br from-blue-600/80 to-indigo-700/80 text-white rounded-tr-sm border border-blue-500/30'
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-200 rounded-tl-sm border border-cyan-500/20'
      )}>
        {msg.typing ? (
          <div className="flex items-center gap-1 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap">{renderText(msg.text)}</div>
            {!isUser && (
              <button
                onClick={() => { navigator.clipboard.writeText(msg.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700/50"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
              </button>
            )}
          </>
        )}
        <div className={cn('text-[9px] mt-1 opacity-50', isUser ? 'text-right text-blue-200' : 'text-slate-500')}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Chatbot Component ───────────────────────────────────────────────────
export default function AIChatbot() {
  const [location]            = useLocation();
  const isUsersPage           = location === '/users';
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Hi! I'm **Lucia AI**, your attribution intelligence assistant.\n\nI have full access to your campaign data, trackable links, user analytics, and attribution models. Ask me anything about your marketing performance.\n\nTry: *\"Which campaign has the highest ROI?\"* or *\"Tell me about Sarah K.\"*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]     = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unread, setUnread]   = useState(0);
  const messagesEndRef         = useRef<HTMLDivElement>(null);
  const inputRef               = useRef<HTMLInputElement>(null);

  // When navigating to /users, inject a context-aware greeting
  const prevPage = useRef(location);
  useEffect(() => {
    if (location !== prevPage.current) {
      prevPage.current = location;
      if (location === '/users') {
        const contextMsg: Message = {
          id: 'ctx-users',
          role: 'assistant',
          text: `**Users & Sessions detected** 👥\n\nI'm now connected to your user data. You can ask me about specific users, sessions, devices, transactions, and journeys.\n\n**Quick queries:**\n• "Show me all users"\n• "Tell me about Sarah K."\n• "Who has the highest CVR?"\n• "Show devices for Elena V."\n• "Compare CVR across campaigns"`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, contextMsg]);
        setShowSuggestions(false);
        if (!open) setUnread(n => n + 1);
      }
    }
  }, [location, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setShowSuggestions(false);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), timestamp: new Date() };
    const typingMsg: Message = { id: 'typing', role: 'assistant', text: '', timestamp: new Date(), typing: true };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setInput('');

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const response = generateResponse(text, isUsersPage);
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        { id: Date.now().toString(), role: 'assistant', text: response, timestamp: new Date() },
      ]);
      setIsTyping(false);
      if (!open) setUnread(n => n + 1);
    }, delay);

    setIsTyping(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleReset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      text: isUsersPage
        ? "Conversation cleared. I'm connected to your user data — ask me about specific users, sessions, devices, or journeys."
        : "Conversation cleared. How can I help you analyze your attribution data?",
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
    setUnread(0);
  };

  const currentPrompts = isUsersPage ? USERS_PAGE_PROMPTS : GLOBAL_PROMPTS;

  return (
    <>
      {/* ── Chat Panel ── */}
      <div className={cn(
        'fixed bottom-20 right-5 z-50 w-[390px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 transition-all duration-300 origin-bottom-right',
        open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
        'bg-gradient-to-b from-slate-900/98 to-slate-950/98 backdrop-blur-xl'
      )} style={{ height: '540px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                Lucia AI
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                {isUsersPage ? (
                  <><Users className="w-2.5 h-2.5 text-cyan-600" /> Users & Sessions mode</>
                ) : 'Attribution Intelligence'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleReset} title="Clear conversation" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Context badge */}
        {isUsersPage && (
          <div className="px-4 py-1.5 bg-cyan-500/10 border-b border-cyan-500/15 shrink-0">
            <p className="text-[10px] text-cyan-400 flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              Connected to Users & Sessions — user-specific queries enabled
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50">
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

          {/* Suggested prompts */}
          {showSuggestions && messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                {isUsersPage ? 'User queries' : 'Suggested questions'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentPrompts.slice(0, 6).map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isUsersPage ? 'Ask about a user, session, or device…' : 'Ask about campaigns, users, ROI…'}
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:bg-slate-800/90 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0',
                input.trim() && !isTyping
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-600 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-slate-700 mt-1.5 text-center">Lucia AI · Powered by Lucia Attribution Platform</p>
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'fixed bottom-5 right-5 z-50 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300',
          open
            ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 hover:scale-110 hover:shadow-cyan-500/30'
        )}
        style={{ width: '52px', height: '52px' }}
        title="Lucia AI Assistant"
      >
        {open ? <X className="w-5 h-5 text-slate-300" /> : <MessageCircle className="w-5 h-5 text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
            {unread}
          </span>
        )}
        {!open && <span className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />}
      </button>
    </>
  );
}
