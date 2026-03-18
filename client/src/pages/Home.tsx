/*
 * OVERVIEW PAGE — LUCIA ATTRIBUTION DASHBOARD
 * Executive decision-making dashboard.
 * Sections: KPI strip · Revenue & Traffic trends · Campaign ROI · Active Links ·
 *           User Types · Conversion Paths · Funnel · Cross-Device Fingerprinting · Live Feed
 */
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ComposedChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, DollarSign, MousePointerClick,
  Link2, Activity, ChevronRight, ArrowUpRight, ArrowDownRight,
  Zap, Target, Globe, Layers, CheckCircle, AlertTriangle,
  Smartphone, Monitor, Tablet, RefreshCw, Eye, ShoppingCart,
  Orbit, ExternalLink, Copy, BarChart3,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  campaignPerformanceData, conversionFunnelData, realtimeEventsData,
  trafficSourcesData, devicePerformanceData, dailyActivityData,
  userSessionsData, attributionModelsData,
} from '@/lib/dashboardSampleData';
import { mockTrackableLinks } from '@/lib/trackableLinkData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
  : String(n);
const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n}`;

// ─── Dark Tooltip ─────────────────────────────────────────────────────────────
const DT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/98 border border-blue-500/25 rounded-lg p-2.5 text-[11px] shadow-2xl z-50 min-w-[120px]">
      {label && <p className="text-blue-300 font-mono mb-1 border-b border-blue-900/30 pb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center justify-between gap-3" style={{ color: p.color || p.fill || '#94a3b8' }}>
          <span>{p.name}</span>
          <span className="font-bold">{typeof p.value === 'number' && p.value > 1000 ? fmtMoney(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color = 'blue', action, onAction }: {
  icon: any; title: string; subtitle?: string; color?: string;
  action?: string; onAction?: () => void;
}) {
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };
  const c = iconColors[color] || iconColors.blue;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${c}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100">{title}</h2>
          {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && onAction && (
        <button onClick={onAction} className={`text-[10px] font-mono flex items-center gap-1 hover:opacity-80 transition-opacity ${c.split(' ')[0]}`}>
          {action} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, sub, color = 'blue' }: {
  label: string; value: string; delta?: number; sub?: string; color?: string;
}) {
  const borderColors: Record<string, string> = {
    blue: 'border-blue-500/20', emerald: 'border-emerald-500/20',
    purple: 'border-purple-500/20', amber: 'border-amber-500/20',
  };
  return (
    <div className={`rounded-xl border ${borderColors[color] || borderColors.blue} bg-slate-900/50 p-4`}>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      {(delta !== undefined || sub) && (
        <div className="flex items-center gap-1.5 mt-1">
          {delta !== undefined && (
            <span className={`text-[10px] font-mono flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(delta)}%
            </span>
          )}
          {sub && <span className="text-[10px] text-slate-600">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Deterministic daily data (no random) ────────────────────────────────────
const DAILY = Array.from({ length: 30 }, (_, i) => {
  const base = 50000 + i * 2000;
  const wave = Math.sin(i * 0.4) * 15000;
  const date = new Date('2026-02-17');
  date.setDate(date.getDate() + i);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.round(base + wave),
    sessions: Math.round(12000 + i * 300 + Math.sin(i * 0.5) * 3000),
    conversions: Math.round(600 + i * 15 + Math.sin(i * 0.6) * 150),
    users: Math.round(4000 + i * 100 + Math.sin(i * 0.45) * 800),
  };
});

// ─── Channel ROI data ─────────────────────────────────────────────────────────
const CHANNEL_ROI = trafficSourcesData.map(s => ({
  channel: s.source.replace(' Search', '').replace(' Media', ''),
  revenue: s.revenue,
  spend: Math.round(s.revenue / s.roi),
  conversions: s.conversions,
  roi: s.roi,
  users: s.users,
}));

// ─── User type segments ───────────────────────────────────────────────────────
const USER_SEGMENTS = [
  { name: 'High-Value',      count: 12400, revenue: 186000, avgRev: 15.0, conv: 4.2, color: '#3b82f6',  desc: '5+ purchases, $100+ LTV' },
  { name: 'Repeat Buyer',    count: 28600, revenue: 143000, avgRev: 5.0,  conv: 8.1, color: '#10b981',  desc: '2–4 purchases' },
  { name: 'First-Time',      count: 54200, revenue: 108400, avgRev: 2.0,  conv: 3.4, color: '#8b5cf6',  desc: 'Single purchase' },
  { name: 'Active Prospect', count: 89300, revenue: 0,      avgRev: 0,    conv: 0,   color: '#f59e0b',  desc: 'Engaged, not converted' },
  { name: 'Dormant',         count: 100200,revenue: 0,      avgRev: 0,    conv: 0,   color: '#64748b',  desc: 'No activity 30+ days' },
];

// ─── Conversion paths ─────────────────────────────────────────────────────────
const CONV_PATHS = [
  { path: ['Email', 'Landing', 'Product', 'Checkout'],         rate: 18.4, revenue: 142000, users: 3820, color: '#3b82f6' },
  { path: ['Paid Ad', 'Landing', 'Product', 'Cart', 'Buy'],    rate: 12.1, revenue: 98600,  users: 2140, color: '#10b981' },
  { path: ['Organic', 'Blog', 'Product', 'Checkout'],          rate: 9.8,  revenue: 76400,  users: 1680, color: '#8b5cf6' },
  { path: ['Social', 'Landing', 'Checkout'],                   rate: 7.2,  revenue: 54200,  users: 1240, color: '#f59e0b' },
  { path: ['Direct', 'Product', 'Buy'],                        rate: 14.6, revenue: 38900,  users: 890,  color: '#06b6d4' },
];

// ─── Cross-device fingerprint data ────────────────────────────────────────────
const CROSS_DEVICE = [
  { segment: 'Desktop Only',      users: 58200, conv: 18900, roi: 4.5, color: '#3b82f6',  icon: Monitor },
  { segment: 'Mobile Only',       users: 52400, conv: 12600, roi: 3.2, color: '#10b981',  icon: Smartphone },
  { segment: 'Desktop + Mobile',  users: 34600, conv: 14800, roi: 5.8, color: '#8b5cf6',  icon: Layers },
  { segment: 'All Devices',       users: 8800,  conv: 4900,  roi: 7.2, color: '#f59e0b',  icon: Tablet },
];

const DEVICE_JOURNEY = [
  { stage: 'Awareness', desktop: 45, mobile: 55 },
  { stage: 'Discovery', desktop: 52, mobile: 48 },
  { stage: 'Research',  desktop: 68, mobile: 32 },
  { stage: 'Cart',      desktop: 71, mobile: 29 },
  { stage: 'Purchase',  desktop: 74, mobile: 26 },
  { stage: 'Retention', desktop: 69, mobile: 31 },
];

// ─── Campaign channel breakdown ───────────────────────────────────────────────
const CAMP_CHANNELS = [
  { campaign: 'Q1 Launch',   email: 53600, social: 62400, paid: 45600, organic: 28000, direct: 15950 },
  { campaign: 'Summer Sale', email: 48200, social: 55800, paid: 38400, organic: 22600, direct: 12800 },
  { campaign: 'Enterprise',  email: 42100, social: 18600, paid: 22400, organic: 8200,  direct: 7400  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [, navigate] = useLocation();
  const [trendMetric, setTrendMetric] = useState<'revenue' | 'sessions' | 'conversions' | 'users'>('revenue');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [funnelView, setFunnelView] = useState<'absolute' | 'rate'>('absolute');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const activeLinks = mockTrackableLinks.filter(l => l.status === 'Active');

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  const trendColor: Record<string, string> = {
    revenue: '#3b82f6', sessions: '#10b981', conversions: '#8b5cf6', users: '#f59e0b',
  };

  const segmentTotal = USER_SEGMENTS.reduce((a, s) => a + s.count, 0);
  const pieData = USER_SEGMENTS.map(s => ({ name: s.name, value: s.count, color: s.color }));

  return (
    <DashboardLayout title="Overview" subtitle="Executive performance dashboard — real-time attribution insights">
      <div className="space-y-6">

        {/* ══════════════════════════════════════════════════════════════════
            1. KPI STRIP
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Revenue"   value="$487K"  delta={18} sub="vs last 30d" color="blue" />
          <StatCard label="Conversions"     value="11.2K"  delta={9}  sub="all channels" color="purple" />
          <StatCard label="Avg ROI"         value="3.88x"  delta={7}  sub="across campaigns" color="emerald" />
          <StatCard label="Active Users"    value="150K"   delta={12} sub="unique identities" color="amber" />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            2. REVENUE & TRAFFIC TREND (interactive metric switcher)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <SectionHeader icon={TrendingUp} title="30-Day Performance Trend" subtitle="Click a metric to switch the chart view" color="blue" />
            <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
              {(['revenue', 'sessions', 'conversions', 'users'] as const).map(m => (
                <button key={m} onClick={() => setTrendMetric(m)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${trendMetric === m ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DAILY} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={trendColor[trendMetric]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={trendColor[trendMetric]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => trendMetric === 'revenue' ? `$${(v/1000).toFixed(0)}K` : fmt(v)} />
              <Tooltip content={<DT />} />
              <Area type="monotone" dataKey={trendMetric} name={trendMetric.charAt(0).toUpperCase() + trendMetric.slice(1)}
                stroke={trendColor[trendMetric]} fill="url(#trendGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            3. CAMPAIGN ROI — which campaigns drive real conversions
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/50 p-5">
          <SectionHeader icon={Target} title="Campaign Performance — True ROI by Channel"
            subtitle="Revenue, spend, and conversions across all active campaigns"
            color="blue" action="View Campaigns" onAction={() => navigate('/campaigns')} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Stacked channel revenue bar */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Revenue by Channel per Campaign</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CAMP_CHANNELS} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="campaign" tick={{ fontSize: 9, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<DT />} />
                  <Legend wrapperStyle={{ fontSize: 9, color: '#64748b' }} />
                  <Bar dataKey="email"   name="Email"   stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
                  <Bar dataKey="social"  name="Social"  stackId="a" fill="#10b981" />
                  <Bar dataKey="paid"    name="Paid"    stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="organic" name="Organic" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="direct"  name="Direct"  stackId="a" fill="#06b6d4" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ROI vs Spend scatter + table */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Channel ROI vs Spend</p>
              <ResponsiveContainer width="100%" height={120}>
                <ComposedChart data={CHANNEL_ROI} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="channel" tick={{ fontSize: 9, fill: '#475569' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `${v}x`} />
                  <Tooltip content={<DT />} />
                  <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#1e293b" radius={[3,3,0,0]} />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3b82f6" opacity={0.7} radius={[3,3,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Campaign table */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-blue-900/20">
                      {['Campaign', 'Spend', 'Revenue', 'Conv.', 'ROI', 'CPA', 'Status'].map(h => (
                        <th key={h} className="text-left text-slate-500 pb-1.5 pr-3 font-medium uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformanceData.filter(c => c.status === 'Active').map((c, i) => {
                      const colors = ['#3b82f6', '#10b981', '#8b5cf6'];
                      return (
                        <tr key={c.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                          <td className="py-1.5 pr-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i] }} />
                              <span className="text-slate-300 font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className="py-1.5 pr-3 font-mono text-slate-400">{fmtMoney(c.spend)}</td>
                          <td className="py-1.5 pr-3 font-mono text-slate-200">{fmtMoney(c.revenue)}</td>
                          <td className="py-1.5 pr-3 font-mono text-slate-400">{fmt(c.conversions)}</td>
                          <td className="py-1.5 pr-3 font-mono font-bold" style={{ color: colors[i] }}>{c.roi}x</td>
                          <td className="py-1.5 pr-3 font-mono text-slate-400">${c.cpa}</td>
                          <td className="py-1.5">
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            4. ACTIVE TRACKABLE LINKS — clickable, each opens detail
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-pink-500/15 bg-slate-900/50 p-5">
          <SectionHeader icon={Link2} title="Active Trackable Links"
            subtitle="Each link is the canonical source identifier — SDK + supercookie enabled"
            color="pink" action="Manage Links" onAction={() => navigate('/links')} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {activeLinks.map((link, idx) => {
              const linkColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
              const c = linkColors[idx % linkColors.length];
              return (
                <motion.div key={link.id}
                  whileHover={{ y: -2, boxShadow: `0 8px 24px ${c}15` }}
                  className="rounded-lg border p-4 cursor-pointer group transition-all"
                  style={{ borderColor: `${c}30`, background: `${c}06` }}
                  onClick={() => navigate('/links')}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${c}20`, color: c }}>
                          {link.shortCode}
                        </span>
                        {link.sdkEnabled && (
                          <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">SDK</span>
                        )}
                        {link.supercookieEnabled && (
                          <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">SC</span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-200 truncate">{link.name}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); copyLink(link.trackingUrl, link.id); }}
                        className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                        title="Copy tracking URL"
                      >
                        {copiedLink === link.id
                          ? <CheckCircle className="w-3 h-3 text-emerald-400" />
                          : <Copy className="w-3 h-3 text-slate-500 hover:text-slate-300" />}
                      </button>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {[
                      { label: 'Clicks', value: fmt(link.totalClicks) },
                      { label: 'Conv.', value: fmt(link.totalConversions) },
                      { label: 'Revenue', value: fmtMoney(link.totalRevenue) },
                      { label: 'ROI', value: `${link.overallRoi}x` },
                    ].map(m => (
                      <div key={m.label} className="text-center">
                        <p className="text-[9px] text-slate-600 uppercase">{m.label}</p>
                        <p className="text-[11px] font-mono font-bold text-slate-200">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Supercookie resolution bar */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5 text-[9px]">
                      <span className="text-slate-600">Supercookie resolution</span>
                      <span className="font-mono" style={{ color: c }}>{link.supercookieResolutionRate}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: c }}
                        initial={{ width: 0 }}
                        animate={{ width: `${link.supercookieResolutionRate}%` }}
                        transition={{ duration: 0.7, delay: idx * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Channel mini-bars */}
                  <div className="mt-2.5 flex items-end gap-1 h-8">
                    {link.channelMetrics.map((ch, ci) => {
                      const maxRev = Math.max(...link.channelMetrics.map(x => x.revenue));
                      const h = Math.round((ch.revenue / maxRev) * 100);
                      const chColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
                      return (
                        <div key={ch.channel} className="flex-1 flex flex-col items-center gap-0.5" title={`${ch.channel}: ${fmtMoney(ch.revenue)}`}>
                          <div className="w-full rounded-sm" style={{ height: `${h}%`, background: chColors[ci % chColors.length], opacity: 0.7 }} />
                          <span className="text-[7px] text-slate-600 truncate w-full text-center">{ch.channel.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            5. USER TYPES — interactive segment explorer
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/50 p-5">
          <SectionHeader icon={Users} title="User Segments"
            subtitle="Click a segment to explore its revenue contribution and conversion rate"
            color="emerald" action="View Users" onAction={() => navigate('/users')} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
            {/* Pie chart */}
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80}
                    dataKey="value" paddingAngle={2}
                    onClick={(d) => setSelectedSegment(selectedSegment === d.name ? null : d.name)}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color}
                        opacity={selectedSegment && selectedSegment !== entry.name ? 0.3 : 1}
                        stroke={selectedSegment === entry.name ? '#fff' : 'transparent'}
                        strokeWidth={selectedSegment === entry.name ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<DT />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Segment list */}
              <div className="flex-1 space-y-2">
                {USER_SEGMENTS.map(s => (
                  <div key={s.name}
                    onClick={() => setSelectedSegment(selectedSegment === s.name ? null : s.name)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                      selectedSegment === s.name
                        ? 'border-white/20 bg-white/5'
                        : 'border-transparent hover:border-white/10 hover:bg-white/3'
                    }`}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-200">{s.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{fmt(s.count)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(s.count / segmentTotal) * 100}%`, background: s.color }} />
                        </div>
                        <span className="text-[9px] text-slate-600 shrink-0">{Math.round((s.count / segmentTotal) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected segment detail or default revenue bars */}
            <AnimatePresence mode="wait">
              {selectedSegment ? (
                <motion.div key="detail" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  {(() => {
                    const seg = USER_SEGMENTS.find(s => s.name === selectedSegment)!;
                    return (
                      <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: `${seg.color}30`, background: `${seg.color}08` }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-100">{seg.name}</p>
                            <p className="text-[10px] text-slate-500">{seg.desc}</p>
                          </div>
                          <button onClick={() => setSelectedSegment(null)} className="text-[9px] text-slate-500 hover:text-slate-300">✕ close</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Users', value: fmt(seg.count), color: seg.color },
                            { label: 'Revenue', value: seg.revenue > 0 ? fmtMoney(seg.revenue) : '—', color: seg.color },
                            { label: 'Avg Rev / User', value: seg.avgRev > 0 ? `$${seg.avgRev}` : '—', color: seg.color },
                            { label: 'Conv. Rate', value: seg.conv > 0 ? `${seg.conv}%` : '—', color: seg.color },
                          ].map(m => (
                            <div key={m.label} className="rounded-lg bg-slate-800/40 p-2.5 text-center">
                              <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                              <p className="text-sm font-mono font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
                            </div>
                          ))}
                        </div>
                        {seg.revenue > 0 && (
                          <div>
                            <p className="text-[9px] text-slate-500 mb-1">Revenue share of total</p>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(seg.revenue / 487250) * 100}%`, background: seg.color }} />
                            </div>
                            <p className="text-[9px] text-right mt-0.5 font-mono" style={{ color: seg.color }}>
                              {Math.round((seg.revenue / 487250) * 100)}% of total revenue
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Revenue by Segment</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={USER_SEGMENTS.filter(s => s.revenue > 0)} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                      <Tooltip content={<DT />} />
                      <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                        {USER_SEGMENTS.filter(s => s.revenue > 0).map((s, i) => (
                          <Cell key={i} fill={s.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[9px] text-slate-600 mt-2 text-center">← Click a segment on the left to see its details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            6. CONVERSION PATHS — top paths from first touch to purchase
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/50 p-5">
          <SectionHeader icon={MousePointerClick} title="Top Conversion Paths"
            subtitle="Most common journeys from first touch to purchase — click a path to highlight"
            color="purple" action="View Analytics" onAction={() => navigate('/analytics')} />

          <div className="space-y-3">
            {CONV_PATHS.map((path, idx) => (
              <motion.div key={idx}
                onClick={() => setSelectedPath(selectedPath === idx ? null : idx)}
                whileHover={{ x: 3 }}
                className={`rounded-lg border p-3 cursor-pointer transition-all ${
                  selectedPath === idx ? 'border-white/20 bg-white/5' : 'border-slate-800/60 hover:border-slate-700/60'
                }`}>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Path steps */}
                  <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
                    {path.path.map((step, si) => (
                      <div key={si} className="flex items-center gap-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                          style={{ color: path.color, borderColor: `${path.color}40`, background: `${path.color}10` }}>
                          {step}
                        </span>
                        {si < path.path.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 shrink-0 text-[11px]">
                    <div className="text-center">
                      <p className="text-[9px] text-slate-600">Users</p>
                      <p className="font-mono font-bold text-slate-300">{fmt(path.users)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-slate-600">Revenue</p>
                      <p className="font-mono font-bold text-slate-300">{fmtMoney(path.revenue)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-slate-600">Conv. Rate</p>
                      <p className="font-mono font-bold" style={{ color: path.color }}>{path.rate}%</p>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="w-full mt-1.5">
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: path.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(path.revenue / 142000) * 100}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            7. CONVERSION FUNNEL — absolute vs rate toggle
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <SectionHeader icon={BarChart3} title="Conversion Funnel"
              subtitle="Platform-wide funnel — Awareness to Retention"
              color="cyan" />
            <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
              {(['absolute', 'rate'] as const).map(v => (
                <button key={v} onClick={() => setFunnelView(v)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${funnelView === v ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                  {v === 'absolute' ? 'Users' : 'Conv. Rate'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Funnel visual */}
            <div className="space-y-2">
              {conversionFunnelData.map((stage, i) => {
                const pct = Math.round((stage.users / conversionFunnelData[0].users) * 100);
                const drop = i > 0 ? Math.round(((conversionFunnelData[i-1].users - stage.users) / conversionFunnelData[i-1].users) * 100) : 0;
                const stageColors = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'];
                const displayVal = funnelView === 'absolute' ? fmt(stage.users) : `${stage.conversionRate}%`;
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="text-slate-300 font-medium w-28">{stage.stage}</span>
                      <div className="flex items-center gap-2 flex-1 mx-3">
                        <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden relative">
                          <motion.div className="h-full rounded"
                            style={{ background: stageColors[i] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${funnelView === 'absolute' ? pct : stage.conversionRate}%` }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white mix-blend-plus-lighter">
                            {displayVal}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-20 justify-end">
                        {drop > 0 && <span className="text-red-400 font-mono text-[9px]">-{drop}%</span>}
                        <span className="text-slate-500 font-mono text-[9px]">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Funnel chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={conversionFunnelData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#475569' }}
                  tickFormatter={v => funnelView === 'absolute' ? fmt(v) : `${v}%`} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 9, fill: '#64748b' }} width={60} />
                <Tooltip content={<DT />} />
                <Bar dataKey={funnelView === 'absolute' ? 'users' : 'conversionRate'}
                  name={funnelView === 'absolute' ? 'Users' : 'Conv. Rate'}
                  radius={[0, 4, 4, 0]}>
                  {conversionFunnelData.map((_, i) => {
                    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'];
                    return <Cell key={i} fill={colors[i]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            8. CROSS-DEVICE FINGERPRINTING — ROI by device journey
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-indigo-500/15 bg-slate-900/50 p-5">
          <SectionHeader icon={Layers} title="Cross-Device Fingerprinting & True ROI"
            subtitle="Identity resolution across devices — users tracked via supercookie, not just cookies"
            color="indigo" action="Orbital Command" onAction={() => navigate('/orbital')} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Device segment cards */}
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">ROI by Device Journey</p>
              {CROSS_DEVICE.map(seg => {
                const DevIcon = seg.icon;
                const convRate = Math.round((seg.conv / seg.users) * 100 * 10) / 10;
                return (
                  <div key={seg.segment} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/60 bg-slate-800/20">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${seg.color}15`, border: `1px solid ${seg.color}30` }}>
                      <DevIcon className="w-4 h-4" style={{ color: seg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-slate-200">{seg.segment}</span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: seg.color }}>{seg.roi}x ROI</span>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] text-slate-500">
                        <span>{fmt(seg.users)} users</span>
                        <span>·</span>
                        <span>{fmt(seg.conv)} conv.</span>
                        <span>·</span>
                        <span>{convRate}% rate</span>
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: seg.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(seg.roi / 8) * 100}%` }}
                          transition={{ duration: 0.7 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-2 p-3 rounded-lg border border-amber-500/15 bg-amber-900/10 text-[10px]">
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-300/80">
                    <span className="font-bold text-amber-300">Key insight:</span> Users tracked across all devices convert at <span className="font-bold">7.2x ROI</span> — 60% higher than desktop-only. Cross-device identity resolution is the single biggest lever for campaign ROI.
                  </p>
                </div>
              </div>
            </div>

            {/* Device journey stacked bar */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Desktop vs Mobile at Each Funnel Stage</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DEVICE_JOURNEY} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<DT />} />
                  <Legend wrapperStyle={{ fontSize: 9, color: '#64748b' }} />
                  <Bar dataKey="desktop" name="Desktop %" stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
                  <Bar dataKey="mobile"  name="Mobile %"  stackId="a" fill="#10b981" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[9px] text-slate-600 mt-2">
                Mobile dominates awareness (55%) but desktop closes the sale (74% at purchase). Cross-device tracking bridges this gap.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            9. LIVE EVENT FEED
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-slate-200">Live Event Feed</p>
              <span className="text-[9px] font-mono text-slate-500">340 events/sec</span>
            </div>
            <button onClick={() => navigate('/orbital')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors">
              Orbital Command <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {realtimeEventsData.map(evt => (
              <div key={evt.id} className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] ${
                evt.type === 'Conversion'
                  ? 'border-emerald-500/15 bg-emerald-900/10'
                  : 'border-slate-800/40 bg-slate-800/20'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${evt.type === 'Conversion' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                  <span className="text-slate-300 font-medium truncate">{evt.user}</span>
                  <span className={`shrink-0 ${evt.type === 'Conversion' ? 'text-emerald-400' : 'text-slate-500'}`}>{evt.type}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {evt.value > 0 && <span className="font-mono font-bold text-emerald-400">${evt.value}</span>}
                  <span className="text-[9px] font-mono text-slate-600 px-1.5 py-0.5 rounded bg-slate-800">{evt.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
