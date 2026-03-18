/*
 * ANALYTICS PAGE — LUCIA ATTRIBUTION
 * Three tabs: Overview · All Campaigns · User Behavior
 * Dark orbital theme.
 */
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  FunnelChart, Funnel, LabelList,
} from 'recharts';
import {
  Globe, Users, TrendingUp, MousePointerClick, Smartphone, Monitor,
  Clock, Target, Zap, ArrowUpRight, ArrowDownRight, ChevronRight,
  MapPin, Layers, Activity, BarChart2, Link2, RefreshCw,
  Wallet, ShoppingCart, Share2, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  overviewAnalytics, regionRollup, behaviorFunnel, intentSignals, cohortRetention,
} from '@/lib/analyticsData';
import {
  web3PlatformUsage, topAssetsHeld, defiCategories, walletActivityTrend,
  chainDistribution, shoppingPreferences, socialMediaActivity, contentConsumption,
  behaviorTrend, campaignFunnels, globalFunnel,
  type CampaignFunnelData,
} from '@/lib/behaviorData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
  : String(n);
const fmtDur = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;
const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K`
  : `$${n}`;
const fmtUsd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n}`;

// ─── Palette ──────────────────────────────────────────────────────────────────
const REGION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
const AGE_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6'];
const INTEREST_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899'];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-blue-500/20 rounded-lg p-3 text-xs shadow-xl z-50">
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
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
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
function Section({ title, subtitle, children, icon: Icon, className = '' }: {
  title: string; subtitle?: string; children: React.ReactNode; icon?: any; className?: string;
}) {
  return (
    <div className={`rounded-xl border border-blue-900/20 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md p-5 ${className}`}>
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

// ─── Tab bar ──────────────────────────────────────────────────────────────────
const MAIN_TABS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'campaigns', label: 'All Campaigns', icon: Link2 },
  { id: 'behavior', label: 'User Behavior', icon: Activity },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewTab() {
  const data = overviewAnalytics;
  const [trendMetric, setTrendMetric] = useState<'users' | 'sessions' | 'conversions' | 'revenue'>('users');

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Users} label="Total Users" value={fmt(data.kpi.totalUsers)} sub={`${fmt(data.kpi.newUsers)} new`} color="blue" delta={12} />
        <KpiCard icon={RefreshCw} label="Returning" value={fmt(data.kpi.returningUsers)} sub={`${Math.round(data.kpi.returningUsers / data.kpi.totalUsers * 100)}% of total`} color="cyan" delta={8} />
        <KpiCard icon={Clock} label="Avg Session" value={fmtDur(data.kpi.avgSessionDuration)} sub="per user" color="emerald" delta={5} />
        <KpiCard icon={Target} label="Conv. Rate" value={`${data.kpi.conversionRate}%`} sub="link → purchase" color="purple" delta={3} />
        <KpiCard icon={Zap} label="Supercookie" value={`${data.kpi.supercookieResolutionRate}%`} sub="identity resolved" color="amber" delta={2} />
        <KpiCard icon={Layers} label="Cross-Device" value={`${data.kpi.crossDeviceMatchRate}%`} sub="match rate" color="pink" delta={7} />
      </div>

      {/* Trend chart */}
      <Section title="30-Day Traffic Trend" subtitle="Sessions, users, conversions, and revenue over time" icon={TrendingUp}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(['users', 'sessions', 'conversions', 'revenue'] as const).map(m => (
            <button key={m} onClick={() => setTrendMetric(m)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-all border ${trendMetric === m ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'border-blue-900/20 text-slate-500 hover:text-slate-300'}`}>
              {m}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data.trend30d} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={d => d.slice(5)} interval={4} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={42} />
            <Tooltip content={<DarkTooltip />} />
            <Area type="monotone" dataKey={trendMetric} name={trendMetric.charAt(0).toUpperCase() + trendMetric.slice(1)} stroke="#3b82f6" fill="url(#trendGrad)" strokeWidth={2} dot={false} />
            {trendMetric === 'users' && (
              <>
                <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                <Area type="monotone" dataKey="returningUsers" name="Returning" stroke="#8b5cf6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* Geo + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Traffic by Region" subtitle="Share of total users per global region" icon={Globe}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={regionRollup} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="users" nameKey="region" paddingAngle={2}>
                  {regionRollup.map((_, i) => <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />)}
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

        <Section title="Top Countries" subtitle="Users, conversions, and ROI by country" icon={MapPin}>
          <div className="overflow-auto max-h-[220px]">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-blue-900/20">
                  {['Country', 'Users', 'Conv.', 'Revenue', 'ROI'].map(h => (
                    <th key={h} className={`pb-2 font-medium text-slate-500 ${h === 'Country' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
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
                      <span className={`font-mono font-bold ${c.roi >= 4 ? 'text-emerald-400' : c.roi >= 3 ? 'text-amber-400' : 'text-red-400'}`}>{c.roi.toFixed(1)}x</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

        <Section title="Gender Split" subtitle="User distribution by gender" icon={Users}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data.genderSplit} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="users" nameKey="label" paddingAngle={3}
                label={({ label, pct }: any) => `${label} ${pct}%`} labelLine={false}>
                {data.genderSplit.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="User Interests" subtitle="Top interest categories driving traffic" icon={Target}>
          <div className="space-y-2 mt-1">
            {data.interests.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-slate-300">{item.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{fmt(item.users)} · {item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: INTEREST_COLORS[i % INTEREST_COLORS.length] }}
                    initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Device + Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Device Breakdown" subtitle="Users, sessions, and conversion rate by device" icon={Monitor}>
          <div className="space-y-3">
            {data.deviceSplit.map((d, i) => {
              const DevIcon = d.device === 'Mobile' ? Smartphone : d.device === 'Desktop' ? Monitor : Layers;
              const convRate = ((d.conversions / d.users) * 100).toFixed(1);
              const colors = ['#3b82f6', '#10b981', '#f59e0b'];
              return (
                <div key={d.device} className="rounded-lg border border-blue-900/20 p-3 bg-slate-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DevIcon className="w-4 h-4" style={{ color: colors[i] }} />
                      <span className="text-sm font-medium text-slate-200">{d.device}</span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: colors[i] }}>{fmt(d.users)} users</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[{ label: 'Sessions', value: fmt(d.sessions) }, { label: 'Conv.', value: fmt(d.conversions) }, { label: 'Conv. Rate', value: `${convRate}%` }, { label: 'Avg Session', value: fmtDur(d.avgSessionDuration) }].map(m => (
                      <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                        <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                        <p className="text-[11px] font-mono font-bold text-slate-200">{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: colors[i] }}
                      initial={{ width: 0 }} animate={{ width: `${(d.users / data.kpi.totalUsers) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

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

      {/* Hourly + Funnel + Intent */}
      <Section title="Hourly Activity Pattern" subtitle="When your users are most active" icon={Activity}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                    <motion.div className="h-full rounded-full" style={{ background: `hsl(${210 + i * 20}, 80%, 55%)` }}
                      initial={{ width: 0 }} animate={{ width: `${stage.pct}%` }} transition={{ duration: 0.6, delay: i * 0.07 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="User Intent Signals" subtitle="Behavioral signals that predict conversion likelihood" icon={Zap}>
          <div className="space-y-2">
            {intentSignals.map(sig => (
              <div key={sig.signal} className={`flex items-center justify-between p-2 rounded-lg border ${sig.highIntent ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/10 bg-red-500/5'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${sig.highIntent ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-[11px] text-slate-300">{sig.signal}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-slate-500">{fmt(sig.users)} users</span>
                  <span className={`font-bold ${sig.highIntent ? 'text-emerald-400' : 'text-red-400'}`}>{sig.conversionRate}% conv.</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Top pages + Cohort */}
      <Section title="Top Pages" subtitle="Most visited pages — time on page, bounce rate, and conversions" icon={BarChart2}>
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
                  <td className="py-2 text-right"><span className={`font-mono ${p.bounceRate > 40 ? 'text-red-400' : p.bounceRate > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.bounceRate}%</span></td>
                  <td className="py-2 text-right text-emerald-400 font-mono">{fmt(p.conversions)}</td>
                  <td className="py-2 text-right"><span className={`font-mono ${p.exitRate > 40 ? 'text-red-400' : p.exitRate > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.exitRate}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Weekly Cohort Retention" subtitle="What % of users return each week after first visit" icon={RefreshCw}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={cohortRetention} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={v => `${v}%`} width={36} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="w0" name="Week 0" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="w1" name="Week 1" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="w2" name="Week 2" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="w3" name="Week 3" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="w4" name="Week 4" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ALL CAMPAIGNS
// ═══════════════════════════════════════════════════════════════════════════════
function CampaignsTab() {
  const [selectedLink, setSelectedLink] = useState<CampaignFunnelData | null>(null);

  return (
    <div className="space-y-5">
      {/* Global funnel */}
      <Section title="Global Funnel — All Campaigns" subtitle="Combined conversion funnel across all trackable links" icon={Target}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            {globalFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-slate-300">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    {stage.dropOffPct > 0 && <span className="text-[9px] text-red-400 font-mono">-{stage.dropOffPct}%</span>}
                    <span className="text-[11px] font-mono text-slate-200">{fmt(stage.users)}</span>
                    <span className="text-[10px] text-slate-500 w-8 text-right">{stage.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: `hsl(${200 + i * 22}, 75%, 52%)` }}
                    initial={{ width: 0 }} animate={{ width: `${stage.pct}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Funnel Summary</p>
            {[
              { label: 'Total Clicks', value: fmt(96000), color: '#3b82f6' },
              { label: 'Total Conversions', value: fmt(6608), color: '#10b981' },
              { label: 'Overall Conv. Rate', value: '6.9%', color: '#8b5cf6' },
              { label: 'Biggest Drop-off', value: 'Engagement → Checkout (58%)', color: '#ef4444' },
              { label: 'Avg Revenue / Conv.', value: '$412', color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-blue-900/20">
                <span className="text-[11px] text-slate-400">{item.label}</span>
                <span className="text-[11px] font-mono font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Campaign cards */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Click a campaign link to view its full funnel breakdown</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaignFunnels.map(cf => (
            <motion.button key={cf.linkId} onClick={() => setSelectedLink(selectedLink?.linkId === cf.linkId ? null : cf)}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`text-left rounded-xl border p-4 transition-all ${selectedLink?.linkId === cf.linkId ? 'border-opacity-60 bg-opacity-10' : 'border-blue-900/20 bg-slate-900/40 hover:border-blue-700/40'}`}
              style={selectedLink?.linkId === cf.linkId ? { borderColor: `${cf.color}55`, background: `${cf.color}10` } : {}}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cf.color }} />
                  <span className="text-xs font-mono text-slate-400">{cf.shortCode}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" style={selectedLink?.linkId === cf.linkId ? { color: cf.color, transform: 'rotate(90deg)' } : {}} />
              </div>
              <p className="text-sm font-bold text-slate-100 mb-3 leading-tight">{cf.linkName}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Clicks', value: fmt(cf.totalClicks) },
                  { label: 'Conversions', value: fmt(cf.totalConversions) },
                  { label: 'Conv. Rate', value: `${cf.overallConvRate}%` },
                  { label: 'Avg Rev.', value: `$${cf.avgRevenuePerConversion}` },
                ].map(m => (
                  <div key={m.label} className="bg-slate-800/40 rounded p-2">
                    <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                    <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                  </div>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Drilldown panel */}
      <AnimatePresence>
        {selectedLink && (
          <motion.div key={selectedLink.linkId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="rounded-xl border p-5 space-y-6" style={{ borderColor: `${selectedLink.color}30`, background: `${selectedLink.color}08` }}>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedLink.linkName}</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedLink.shortCode} · {fmt(selectedLink.totalClicks)} clicks · {selectedLink.overallConvRate}% conv. rate</p>
              </div>
              <button onClick={() => setSelectedLink(null)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion funnel */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Conversion Path Funnel
                </p>
                <div className="space-y-2">
                  {selectedLink.funnel.map((stage, i) => (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex-1">
                          <span className="text-[11px] text-slate-300">{stage.stage}</span>
                          {stage.avgTimeSpent > 0 && <span className="text-[9px] text-slate-600 ml-2">avg {fmtDur(stage.avgTimeSpent)}</span>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {stage.dropOffPct > 0 && <span className="text-[9px] text-red-400 font-mono">-{stage.dropOffPct}%</span>}
                          <span className="text-[11px] font-mono text-slate-200">{fmt(stage.users)}</span>
                          <span className="text-[10px] text-slate-500 w-7 text-right">{stage.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stage.pct}%`, background: selectedLink.color }} />
                      </div>
                      {stage.topDropOffReason && stage.dropOffPct > 0 && (
                        <p className="text-[9px] text-slate-600 mt-0.5 ml-1">Drop-off: {stage.topDropOffReason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Drop-off paths */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Top Drop-Off Paths
                </p>
                <div className="space-y-2">
                  {selectedLink.topDropOffPaths.map((d, i) => (
                    <div key={d.exitPage} className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-amber-300">{d.exitPage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 font-mono">{fmtDur(d.avgTimeBeforeExit)} on page</span>
                          <span className="text-[11px] font-mono font-bold text-red-400">{fmt(d.users)}</span>
                          <span className="text-[10px] text-slate-500">{d.pct}%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500">Reason: {d.topReason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top conversion paths */}
            <div>
              <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Top Conversion Paths
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedLink.topConversionPaths.map((path, i) => (
                  <div key={i} className="rounded-lg border border-blue-900/20 bg-slate-900/40 p-3">
                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      {path.path.map((step, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: `${path.color}20`, color: path.color }}>{step}</span>
                          {j < path.path.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-600" />}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">{fmt(path.users)} users</span>
                      <span className="text-emerald-400">{path.conversionRate}% conv.</span>
                      <span className="text-blue-300">${path.avgRevenue} avg rev.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel funnels */}
            <div>
              <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-purple-400" /> Conversion Rate by Channel
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedLink.channelFunnels.map(ch => (
                  <div key={ch.channel} className="rounded-lg border border-blue-900/20 bg-slate-900/40 p-3 text-center">
                    <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: ch.color }} />
                    <p className="text-[10px] text-slate-400 mb-1">{ch.channel}</p>
                    <p className="text-sm font-mono font-bold text-slate-100">{fmt(ch.clicks)}</p>
                    <p className="text-[9px] text-slate-500">clicks</p>
                    <p className="text-xs font-mono font-bold text-emerald-400 mt-1">{ch.convRate}%</p>
                    <p className="text-[9px] text-slate-500">conv. rate</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: USER BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════
function BehaviorTab() {
  const [behaviorSection, setBehaviorSection] = useState<'web3' | 'web2'>('web3');

  return (
    <div className="space-y-5">
      {/* Web2 vs Web3 toggle */}
      <div className="flex items-center gap-3">
        {[
          { id: 'web3', label: 'Web3 Behavior', icon: Wallet, color: '#8b5cf6' },
          { id: 'web2', label: 'Web2 Behavior', icon: ShoppingCart, color: '#3b82f6' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setBehaviorSection(tab.id as 'web3' | 'web2')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${behaviorSection === tab.id ? 'text-white' : 'border-blue-900/30 text-slate-400 hover:text-slate-200'}`}
            style={behaviorSection === tab.id ? { background: `${tab.color}20`, borderColor: `${tab.color}50`, color: tab.color } : {}}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Web2 vs Web3 trend */}
      <Section title="Web2 vs Web3 Activity Trend" subtitle="8-week comparison of session volume and wallet connections" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={behaviorTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="web2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="web3Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={42} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
            <Area type="monotone" dataKey="web2Sessions" name="Web2 Sessions" stroke="#3b82f6" fill="url(#web2Grad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="web3Sessions" name="Web3 Sessions" stroke="#8b5cf6" fill="url(#web3Grad)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="walletConnections" name="Wallet Connections" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#10b981' }} />
            <Line type="monotone" dataKey="crossPlatformUsers" name="Cross-Platform Users" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#f59e0b' }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <AnimatePresence mode="wait">
        {behaviorSection === 'web3' ? (
          <motion.div key="web3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-5">

            {/* Platform usage */}
            <Section title="Web3 Platform Usage Frequency" subtitle="Weekly active users per protocol and avg sessions per week" icon={Activity}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={web3PlatformUsage.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} />
                    <YAxis type="category" dataKey="platform" tick={{ fontSize: 10, fill: '#94a3b8' }} width={64} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="weeklyActiveUsers" name="Weekly Active Users" radius={[0, 4, 4, 0]}>
                      {web3PlatformUsage.slice(0, 8).map((p, i) => <Cell key={i} fill={p.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-2 overflow-auto max-h-[240px]">
                  {web3PlatformUsage.map((p, i) => (
                    <div key={p.platform} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-blue-900/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                        <div>
                          <p className="text-[11px] font-medium text-slate-200">{p.platform}</p>
                          <p className="text-[9px] text-slate-500">{p.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono text-slate-300">{fmt(p.weeklyActiveUsers)} WAU</p>
                        <p className="text-[9px] text-slate-500">{p.avgSessionsPerWeek}x/wk · {p.avgTxPerMonth} tx/mo</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Top assets */}
            <Section title="Top Assets Held" subtitle="Most commonly held tokens and NFTs across your user base" icon={Wallet}>
              <div className="overflow-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-blue-900/20">
                      {['Asset', 'Chain', '% of Users', 'Holders', 'Avg Holding', 'Trend'].map(h => (
                        <th key={h} className={`pb-2 font-medium text-slate-500 ${h === 'Asset' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topAssetsHeld.map((a, i) => (
                      <tr key={a.symbol} className="border-b border-blue-900/10 hover:bg-blue-900/10 transition-colors">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono w-4">{i + 1}</span>
                            <div>
                              <p className="text-slate-200 font-medium">{a.asset}</p>
                              <p className="text-[9px] text-slate-500 font-mono">{a.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-right text-slate-400">{a.chain}</td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <div className="w-12 h-1 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${a.pctOfUsers}%` }} />
                            </div>
                            <span className="font-mono text-slate-300">{a.pctOfUsers}%</span>
                          </div>
                        </td>
                        <td className="py-2 text-right text-slate-300 font-mono">{fmt(a.holdersCount)}</td>
                        <td className="py-2 text-right text-blue-300 font-mono">{fmtUsd(a.avgHoldingUsd)}</td>
                        <td className="py-2 text-right">
                          <span className={`flex items-center justify-end gap-0.5 font-mono text-[10px] ${a.trend === 'up' ? 'text-emerald-400' : a.trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                            {a.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : a.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                            {a.trendPct > 0 ? '+' : ''}{a.trendPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* DeFi categories */}
            <Section title="DeFi Usage by Category" subtitle="How users interact with decentralized finance protocols" icon={Layers}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={defiCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="users" nameKey="category" paddingAngle={2}>
                      {defiCategories.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {defiCategories.map(d => (
                    <div key={d.category} className="rounded-lg border border-blue-900/20 bg-slate-900/40 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                          <span className="text-[11px] font-medium text-slate-200">{d.category}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{fmt(d.users)} users · {d.pct}%</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mb-1.5">{d.description}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-slate-500">TVL: <span className="text-blue-300">{fmtUsd(d.tvlUsd)}</span></span>
                        <span className="text-slate-500">Avg position: <span className="text-emerald-400">{fmtUsd(d.avgPositionUsd)}</span></span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {d.protocols.map(p => (
                          <span key={p} className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{ background: `${d.color}15`, color: d.color }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Wallet activity trend + Chain distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Section title="Wallet Activity Over Time" subtitle="Monthly on-chain transaction types" icon={Activity}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={walletActivityTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f22" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} width={36} />
                    <Tooltip content={<DarkTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9, color: '#94a3b8' }} />
                    <Bar dataKey="swaps" name="Swaps" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="nftTrades" name="NFT Trades" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="stakingDeposits" name="Staking" stackId="a" fill="#10b981" />
                    <Bar dataKey="lendingActions" name="Lending" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="bridgeTx" name="Bridge" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Section>

              <Section title="Chain Distribution" subtitle="Users and transactions by blockchain network" icon={Globe}>
                <div className="space-y-2">
                  {chainDistribution.map(c => (
                    <div key={c.chain}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          <span className="text-[11px] text-slate-300">{c.chain}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono">
                          <span className="text-slate-500">{fmt(c.txCount)} tx</span>
                          <span className="text-slate-400">${c.avgGasUsd} gas</span>
                          <span className="text-slate-300">{fmt(c.users)} users</span>
                          <span className="text-slate-500 w-7 text-right">{c.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: c.color }}
                          initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </motion.div>
        ) : (
          <motion.div key="web2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-5">

            {/* Shopping preferences */}
            <Section title="Shopping Preferences" subtitle="E-commerce categories, average order value, and purchase frequency" icon={ShoppingCart}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={shoppingPreferences} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={110} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="users" name="Users" radius={[0, 4, 4, 0]}>
                      {shoppingPreferences.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-2 overflow-auto max-h-[240px]">
                  {shoppingPreferences.map(s => (
                    <div key={s.category} className="rounded-lg border border-blue-900/20 bg-slate-900/40 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-[11px] font-medium text-slate-200">{s.category}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{fmt(s.users)} users</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono mb-1.5">
                        <span className="text-slate-500">AOV: <span className="text-emerald-400">${s.avgOrderValue}</span></span>
                        <span className="text-slate-500">Freq: <span className="text-blue-300">{s.purchaseFrequency}</span></span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.topPlatforms.map(p => (
                          <span key={p} className="text-[8px] px-1.5 py-0.5 rounded font-mono bg-slate-700/60 text-slate-400">{p}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Social media activity */}
            <Section title="Social Media Activity" subtitle="Daily active users, time spent, and engagement rates by platform" icon={Share2}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={socialMediaActivity} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={fmt} />
                    <YAxis type="category" dataKey="platform" tick={{ fontSize: 9, fill: '#94a3b8' }} width={80} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="dailyActiveUsers" name="Daily Active Users" radius={[0, 4, 4, 0]}>
                      {socialMediaActivity.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-2 overflow-auto max-h-[240px]">
                  {socialMediaActivity.map(s => (
                    <div key={s.platform} className="rounded-lg border border-blue-900/20 bg-slate-900/40 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-[11px] font-medium text-slate-200">{s.platform}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{fmt(s.dailyActiveUsers)} DAU</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mb-1.5">{s.contentType}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-slate-500">{s.avgMinutesPerDay} min/day</span>
                        <span className="text-emerald-400">{s.engagementRate}% engagement</span>
                        <span className="text-slate-500">{s.pct}% of users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Content consumption */}
            <Section title="Content Consumption Habits" subtitle="How users consume content across media types" icon={BarChart2}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={contentConsumption} cx="50%" cy="50%" innerRadius={55} outerRadius={88} dataKey="users" nameKey="type" paddingAngle={2}>
                      {contentConsumption.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {contentConsumption.map(c => (
                    <div key={c.type}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          <span className="text-[11px] text-slate-300">{c.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-slate-500">{c.avgHoursPerWeek}h/wk</span>
                          <span className="text-slate-400">{fmt(c.users)}</span>
                          <span className="text-slate-600 w-7 text-right">{c.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: c.color }}
                          initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'behavior'>('overview');

  return (
    <DashboardLayout title="Analytics" subtitle="Global traffic, campaign funnels, and user behavior insights">
      <div className="space-y-5">

        {/* Main tab bar */}
        <div className="flex items-center gap-1 border-b border-blue-900/20 pb-0">
          {MAIN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'campaigns' && <CampaignsTab />}
            {activeTab === 'behavior' && <BehaviorTab />}
          </motion.div>
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
