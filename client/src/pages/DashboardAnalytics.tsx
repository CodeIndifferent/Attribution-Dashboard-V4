/*
 * ANALYTICS PAGE — LUCIA ATTRIBUTION
 * Global traffic distribution, user demographics, trends, and behavior
 * tied to each trackable link. Dark orbital theme.
 */
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Globe, Users, TrendingUp, MousePointerClick, Smartphone, Monitor,
  Clock, Target, Zap, ChevronDown, ArrowUpRight, ArrowDownRight,
  MapPin, Layers, Activity, BarChart2, Link2, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  overviewAnalytics, linkAnalyticsMap, regionRollup,
  behaviorFunnel, intentSignals, cohortRetention,
  type LinkAnalytics,
} from '@/lib/analyticsData';

// ─── Palette ──────────────────────────────────────────────────────────────────
const REGION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
const AGE_COLORS   = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6'];
const INTEREST_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899'];

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
  : String(n);

const fmtDur = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;
const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
  : `$${n}`;

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-blue-500/20 rounded-lg p-3 text-xs shadow-xl">
      {label && <p className="text-blue-300 font-mono mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill || '#94a3b8' }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 999 ? fmt(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'blue', delta }: {
  icon: any; label: string; value: string; sub?: string; color?: string; delta?: number;
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400',
    pink: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md ${cls}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-current/10`} style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Icon className="w-4 h-4" />
        </div>
        {delta !== undefined && (
          <span className={`text-[10px] font-mono flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children, icon: Icon }: {
  title: string; subtitle?: string; children: React.ReactNode; icon?: any;
}) {
  return (
    <div className="rounded-xl border border-blue-900/20 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md p-5">
      <div className="flex items-center gap-2 mb-4">
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-blue-400" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Link selector tabs ───────────────────────────────────────────────────────
const LINK_TABS = [
  { id: 'overview', label: 'All Links', shortCode: 'OVERVIEW', color: '#3b82f6' },
  { id: 'tl-001', label: 'Widget Q1', shortCode: 'WIDGET-Q1', color: '#10b981' },
  { id: 'tl-002', label: 'Summer Sale', shortCode: 'SUMMER26', color: '#f59e0b' },
  { id: 'tl-003', label: 'Enterprise', shortCode: 'ENT-DEMO', color: '#8b5cf6' },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardAnalytics() {
  const [activeLink, setActiveLink] = useState('overview');
  const [trendMetric, setTrendMetric] = useState<'users' | 'sessions' | 'conversions' | 'revenue'>('users');

  const data: LinkAnalytics = useMemo(() => {
    if (activeLink === 'overview') return overviewAnalytics;
    return linkAnalyticsMap[activeLink] ?? overviewAnalytics;
  }, [activeLink]);

  const activeTab = LINK_TABS.find(t => t.id === activeLink)!;

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Global traffic distribution, user demographics, and behavior insights per trackable link"
    >
      <div className="space-y-5">

        {/* ── Link selector ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider mr-1">View by link:</span>
          {LINK_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveLink(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeLink === tab.id
                  ? 'border-opacity-60 text-white'
                  : 'border-blue-900/30 text-slate-400 hover:text-slate-200 hover:border-blue-700/40 bg-transparent'
              }`}
              style={activeLink === tab.id ? { background: `${tab.color}22`, borderColor: `${tab.color}55`, color: tab.color } : {}}
            >
              <Link2 className="w-3 h-3" />
              {tab.label}
              <span className="font-mono text-[9px] opacity-60">{tab.shortCode}</span>
            </button>
          ))}
        </div>

        {/* ── KPI Row ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLink + '-kpi'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <KpiCard icon={Users} label="Total Users" value={fmt(data.kpi.totalUsers)} sub={`${fmt(data.kpi.newUsers)} new`} color="blue" delta={12} />
            <KpiCard icon={RefreshCw} label="Returning" value={fmt(data.kpi.returningUsers)} sub={`${Math.round(data.kpi.returningUsers / data.kpi.totalUsers * 100)}% of total`} color="cyan" delta={8} />
            <KpiCard icon={Clock} label="Avg Session" value={fmtDur(data.kpi.avgSessionDuration)} sub="per user" color="emerald" delta={5} />
            <KpiCard icon={Target} label="Conv. Rate" value={`${data.kpi.conversionRate}%`} sub="link → purchase" color="purple" delta={3} />
            <KpiCard icon={Zap} label="Supercookie" value={`${data.kpi.supercookieResolutionRate}%`} sub="identity resolved" color="amber" delta={2} />
            <KpiCard icon={Layers} label="Cross-Device" value={`${data.kpi.crossDeviceMatchRate}%`} sub="match rate" color="pink" delta={7} />
          </motion.div>
        </AnimatePresence>

        {/* ── Trend chart ── */}
        <Section title="30-Day Traffic Trend" subtitle="Sessions, users, conversions, and revenue over time" icon={TrendingUp}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(['users', 'sessions', 'conversions', 'revenue'] as const).map(m => (
              <button
                key={m}
                onClick={() => setTrendMetric(m)}
                className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-all border ${
                  trendMetric === m
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : 'border-blue-900/20 text-slate-500 hover:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.trend30d} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeTab.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={activeTab.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={d => d.slice(5)} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={42} />
              <Tooltip content={<DarkTooltip />} />
              <Area
                type="monotone"
                dataKey={trendMetric}
                name={trendMetric.charAt(0).toUpperCase() + trendMetric.slice(1)}
                stroke={activeTab.color}
                fill="url(#trendGrad)"
                strokeWidth={2}
                dot={false}
              />
              {trendMetric === 'users' && (
                <>
                  <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                  <Area type="monotone" dataKey="returningUsers" name="Returning" stroke="#8b5cf6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Section>

        {/* ── Geo + Region ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Region pie */}
          <Section title="Traffic by Region" subtitle="Share of total users per global region" icon={Globe}>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={regionRollup}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    dataKey="users"
                    nameKey="region"
                    paddingAngle={2}
                  >
                    {regionRollup.map((_, i) => (
                      <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {regionRollup.map((r, i) => (
                  <div key={r.region} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: REGION_COLORS[i] }} />
                    <span className="text-[11px] text-slate-300 flex-1 truncate">{r.region}</span>
                    <span className="text-[11px] font-mono text-slate-400">{fmt(r.users)}</span>
                    <span className="text-[10px] text-slate-600 w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Top countries table */}
          <Section title="Top Countries" subtitle="Users, conversions, and ROI by country" icon={MapPin}>
            <div className="overflow-auto max-h-[220px]">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-blue-900/20">
                    <th className="text-left text-slate-500 pb-2 font-medium">Country</th>
                    <th className="text-right text-slate-500 pb-2 font-medium">Users</th>
                    <th className="text-right text-slate-500 pb-2 font-medium">Conv.</th>
                    <th className="text-right text-slate-500 pb-2 font-medium">Revenue</th>
                    <th className="text-right text-slate-500 pb-2 font-medium">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.geo.slice(0, 10).map((c, i) => (
                    <tr key={c.code} className="border-b border-blue-900/10 hover:bg-blue-900/10 transition-colors">
                      <td className="py-1.5 flex items-center gap-1.5">
                        <span className="text-slate-500 font-mono w-4">{i + 1}</span>
                        <span className="text-slate-200">{c.country}</span>
                        <span className="text-[9px] text-slate-600 font-mono">{c.code}</span>
                      </td>
                      <td className="py-1.5 text-right text-slate-300 font-mono">{fmt(c.users)}</td>
                      <td className="py-1.5 text-right text-emerald-400 font-mono">{fmt(c.conversions)}</td>
                      <td className="py-1.5 text-right text-blue-300 font-mono">{fmtMoney(c.revenue)}</td>
                      <td className="py-1.5 text-right">
                        <span className={`font-mono font-bold ${c.roi >= 4 ? 'text-emerald-400' : c.roi >= 3 ? 'text-amber-400' : 'text-red-400'}`}>
                          {c.roi.toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* ── Demographics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Age */}
          <Section title="Age Groups" subtitle="Users and conversions by age" icon={Users}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.ageGroups} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} width={36} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="users" name="Users" radius={[0, 4, 4, 0]}>
                  {data.ageGroups.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Gender */}
          <Section title="Gender Split" subtitle="User distribution by gender" icon={Users}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data.genderSplit}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={72}
                  dataKey="users"
                  nameKey="label"
                  paddingAngle={3}
                  label={({ label, pct }) => `${label} ${pct}%`}
                  labelLine={false}
                >
                  {data.genderSplit.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Section>

          {/* Interests */}
          <Section title="User Interests" subtitle="Top interest categories driving traffic" icon={Target}>
            <div className="space-y-2 mt-1">
              {data.interests.map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] text-slate-300">{item.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{fmt(item.users)} · {item.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: INTEREST_COLORS[i % INTEREST_COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Device + Channel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Device split */}
          <Section title="Device Breakdown" subtitle="Users, sessions, and conversion rate by device" icon={Monitor}>
            <div className="space-y-3">
              {data.deviceSplit.map((d, i) => {
                const Icon = d.device === 'Mobile' ? Smartphone : d.device === 'Desktop' ? Monitor : Layers;
                const convRate = ((d.conversions / d.users) * 100).toFixed(1);
                const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                return (
                  <div key={d.device} className="rounded-lg border border-blue-900/20 p-3 bg-slate-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: colors[i] }} />
                        <span className="text-sm font-medium text-slate-200">{d.device}</span>
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: colors[i] }}>
                        {fmt(d.users)} users
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Sessions', value: fmt(d.sessions) },
                        { label: 'Conv.', value: fmt(d.conversions) },
                        { label: 'Conv. Rate', value: `${convRate}%` },
                        { label: 'Avg Session', value: fmtDur(d.avgSessionDuration) },
                      ].map(m => (
                        <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                          <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                          <p className="text-[11px] font-mono font-bold text-slate-200">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: colors[i] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.users / data.kpi.totalUsers) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Channel split */}
          <Section title="Channel Performance" subtitle="Revenue and ROI by acquisition channel" icon={BarChart2}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.channelSplit} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
                <XAxis dataKey="channel" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={42} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={v => `${v}x`} width={28} />
                <Tooltip content={<DarkTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                  {data.channelSplit.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {data.channelSplit.map(c => (
                <div key={c.channel} className="flex items-center justify-between text-[10px] px-2 py-1 rounded bg-slate-800/40">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-slate-300">{c.channel}</span>
                  </div>
                  <span className="font-mono text-slate-400">{fmt(c.users)} · <span className="text-amber-400">{c.roi}x</span></span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Hourly activity heatmap ── */}
        <Section title="Hourly Activity Pattern" subtitle="When your users are most active (sessions and conversions by hour)" icon={Activity}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.hourlyActivity} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
              <XAxis dataKey="hour" tick={{ fontSize: 8, fill: '#64748b' }} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={36} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="sessions" name="Sessions" fill="#3b82f6" opacity={0.7} radius={[2, 2, 0, 0]} />
              <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* ── Behavior funnel + Intent signals ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Funnel */}
          <Section title="Conversion Funnel" subtitle="From link click to purchase — drop-off at each stage" icon={MousePointerClick}>
            <div className="space-y-2">
              {behaviorFunnel.map((stage, i) => {
                const drop = i > 0 ? behaviorFunnel[i - 1].pct - stage.pct : 0;
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-slate-300">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        {drop > 0 && <span className="text-[9px] text-red-400 font-mono">-{drop}%</span>}
                        <span className="text-[11px] font-mono text-slate-200">{fmt(stage.users)}</span>
                        <span className="text-[10px] text-slate-500 w-8 text-right">{stage.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `hsl(${210 + i * 20}, 80%, 55%)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.07 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Intent signals */}
          <Section title="User Intent Signals" subtitle="Behavioral signals that predict conversion likelihood" icon={Zap}>
            <div className="space-y-2">
              {intentSignals.map(sig => (
                <div key={sig.signal} className={`flex items-center justify-between p-2 rounded-lg border ${
                  sig.highIntent
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-red-500/10 bg-red-500/5'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${sig.highIntent ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-[11px] text-slate-300">{sig.signal}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-slate-500">{fmt(sig.users)} users</span>
                    <span className={`font-bold ${sig.highIntent ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sig.conversionRate}% conv.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Top pages ── */}
        <Section title="Top Pages" subtitle="Most visited pages from this link — time on page, bounce rate, and conversions" icon={BarChart2}>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-blue-900/20">
                  {['Page', 'Views', 'Unique Visitors', 'Avg Time', 'Bounce Rate', 'Conversions', 'Exit Rate'].map(h => (
                    <th key={h} className={`pb-2 font-medium text-slate-500 ${h === 'Page' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topPages.map(p => (
                  <tr key={p.page} className="border-b border-blue-900/10 hover:bg-blue-900/10 transition-colors">
                    <td className="py-2 font-mono text-blue-300">{p.page}</td>
                    <td className="py-2 text-right text-slate-300 font-mono">{fmt(p.views)}</td>
                    <td className="py-2 text-right text-slate-400 font-mono">{fmt(p.uniqueVisitors)}</td>
                    <td className="py-2 text-right text-slate-300 font-mono">{fmtDur(p.avgTimeOnPage)}</td>
                    <td className="py-2 text-right">
                      <span className={`font-mono ${p.bounceRate > 40 ? 'text-red-400' : p.bounceRate > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.bounceRate}%
                      </span>
                    </td>
                    <td className="py-2 text-right text-emerald-400 font-mono">{fmt(p.conversions)}</td>
                    <td className="py-2 text-right">
                      <span className={`font-mono ${p.exitRate > 40 ? 'text-red-400' : p.exitRate > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.exitRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Cohort retention ── */}
        <Section title="Weekly Cohort Retention" subtitle="What % of users return each week after first visit" icon={RefreshCw}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={cohortRetention} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={v => `${v}%`} width={36} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="w0" name="Week 0 (baseline)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="w1" name="Week 1" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="w2" name="Week 2" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="w3" name="Week 3" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="w4" name="Week 4" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Section>

      </div>
    </DashboardLayout>
  );
}
