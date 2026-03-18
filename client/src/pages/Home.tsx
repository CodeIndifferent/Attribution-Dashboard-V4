/*
 * OVERVIEW PAGE — LUCIA ATTRIBUTION DASHBOARD
 * Full dashboard summary hub. Every section is clickable and navigates to the relevant page.
 * Dark orbital theme.
 */
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Target, Users, TrendingUp, Globe, Route, Link2, Orbit,
  ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Activity,
  MousePointerClick, Layers, Clock, CheckCircle, AlertTriangle,
  BarChart3, Wallet,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { campaignPerformanceData, userSessionsData, realtimeEventsData, conversionFunnelData } from '@/lib/dashboardSampleData';
import { overviewAnalytics } from '@/lib/analyticsData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
  : String(n);

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n}`;

// ─── Sparkline data ────────────────────────────────────────────────────────────
const revenueSparkline = [
  { v: 32000 }, { v: 38000 }, { v: 35000 }, { v: 42000 }, { v: 48000 },
  { v: 44000 }, { v: 52000 }, { v: 58000 }, { v: 55000 }, { v: 64000 },
  { v: 72000 }, { v: 78000 }, { v: 82000 }, { v: 88000 },
];
const userSparkline = [
  { v: 8200 }, { v: 9100 }, { v: 8800 }, { v: 10200 }, { v: 11400 },
  { v: 10800 }, { v: 12600 }, { v: 13800 }, { v: 13200 }, { v: 15000 },
];
const convSparkline = [
  { v: 420 }, { v: 510 }, { v: 480 }, { v: 590 }, { v: 640 },
  { v: 610 }, { v: 720 }, { v: 800 }, { v: 780 }, { v: 890 },
];
const roiSparkline = [
  { v: 3.2 }, { v: 3.5 }, { v: 3.4 }, { v: 3.8 }, { v: 4.0 },
  { v: 3.9 }, { v: 4.2 }, { v: 4.5 }, { v: 4.4 }, { v: 4.8 },
];

// ─── Attribution mini-data ────────────────────────────────────────────────────
const attrMini = [
  { channel: 'Email', firstTouch: 32, lastTouch: 48, linear: 42 },
  { channel: 'Paid', firstTouch: 78, lastTouch: 65, linear: 71 },
  { channel: 'Social', firstTouch: 28, lastTouch: 42, linear: 36 },
  { channel: 'Organic', firstTouch: 45, lastTouch: 62, linear: 54 },
];

// ─── Journey mini-data ────────────────────────────────────────────────────────
const journeyMini = [
  { step: 'Click', users: 9600 },
  { step: 'Land', users: 8200 },
  { step: 'View', users: 5600 },
  { step: 'Cart', users: 2800 },
  { step: 'Buy', users: 1100 },
];

// ─── Orbital mini-data ───────────────────────────────────────────────────────
const orbitalMini = [
  { t: 'W1', resolved: 62, unresolved: 38 },
  { t: 'W2', resolved: 68, unresolved: 32 },
  { t: 'W3', resolved: 71, unresolved: 29 },
  { t: 'W4', resolved: 75, unresolved: 25 },
  { t: 'W5', resolved: 79, unresolved: 21 },
  { t: 'W6', resolved: 84, unresolved: 16 },
  { t: 'W7', resolved: 87, unresolved: 13 },
  { t: 'W8', resolved: 88, unresolved: 12 },
];

// ─── Links mini-data ─────────────────────────────────────────────────────────
const linksMini = [
  { name: 'WIDGET-Q1', clicks: 43200, conv: 2900, roi: 5.8, color: '#3b82f6' },
  { name: 'SUMMER26', clicks: 40000, conv: 3100, roi: 4.9, color: '#10b981' },
  { name: 'ENT-DEMO', clicks: 12800, conv: 550, roi: 5.3, color: '#8b5cf6' },
];

// ─── Analytics geo mini ───────────────────────────────────────────────────────
const geoMini = [
  { region: 'North America', pct: 49, color: '#3b82f6' },
  { region: 'Europe', pct: 26, color: '#10b981' },
  { region: 'Asia', pct: 14, color: '#f59e0b' },
  { region: 'South America', pct: 5, color: '#8b5cf6' },
  { region: 'Oceania', pct: 4, color: '#06b6d4' },
  { region: 'Middle East', pct: 2, color: '#ec4899' },
];

// ─── Dark tooltip ─────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-blue-500/20 rounded-lg p-2 text-[10px] shadow-xl z-50">
      {label && <p className="text-blue-300 font-mono mb-0.5">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill || '#94a3b8' }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Clickable Section Card ───────────────────────────────────────────────────
function SectionCard({
  title, subtitle, icon: Icon, color, path, children, badge, span = 1,
}: {
  title: string; subtitle: string; icon: any; color: string;
  path: string; children: React.ReactNode; badge?: string; span?: number;
}) {
  const [, navigate] = useLocation();
  const colorMap: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
    blue:    { border: 'border-blue-500/25',    bg: 'from-blue-900/20 to-slate-900/40',    icon: 'text-blue-400',    badge: 'bg-blue-500/20 text-blue-300' },
    emerald: { border: 'border-emerald-500/25', bg: 'from-emerald-900/20 to-slate-900/40', icon: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
    purple:  { border: 'border-purple-500/25',  bg: 'from-purple-900/20 to-slate-900/40',  icon: 'text-purple-400',  badge: 'bg-purple-500/20 text-purple-300' },
    amber:   { border: 'border-amber-500/25',   bg: 'from-amber-900/20 to-slate-900/40',   icon: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300' },
    cyan:    { border: 'border-cyan-500/25',     bg: 'from-cyan-900/20 to-slate-900/40',    icon: 'text-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-300' },
    pink:    { border: 'border-pink-500/25',     bg: 'from-pink-900/20 to-slate-900/40',    icon: 'text-pink-400',    badge: 'bg-pink-500/20 text-pink-300' },
    indigo:  { border: 'border-indigo-500/25',  bg: 'from-indigo-900/20 to-slate-900/40',  icon: 'text-indigo-400',  badge: 'bg-indigo-500/20 text-indigo-300' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.012, y: -2 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => navigate(path)}
      className={`relative rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} backdrop-blur-md p-4 cursor-pointer group transition-shadow hover:shadow-lg hover:shadow-black/30`}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10`}>
            <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 leading-tight">{title}</h3>
            <p className="text-[10px] text-slate-500 leading-tight">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {badge && <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${c.badge}`}>{badge}</span>}
          <ChevronRight className={`w-3.5 h-3.5 text-slate-600 group-hover:${c.icon} group-hover:translate-x-0.5 transition-all`} />
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Hero KPI strip ───────────────────────────────────────────────────────────
function HeroKpi({ label, value, delta, color, sparkData }: {
  label: string; value: string; delta: number; color: string; sparkData: { v: number }[];
}) {
  const colorMap: Record<string, string> = {
    blue: '#3b82f6', emerald: '#10b981', purple: '#8b5cf6', amber: '#f59e0b',
  };
  const hex = colorMap[color] || '#3b82f6';
  return (
    <div className={`rounded-xl border border-white/5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
        <span className={`text-[10px] font-mono flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="text-2xl font-extrabold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      <ResponsiveContainer width="100%" height={36}>
        <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={hex} stopOpacity={0.3} />
              <stop offset="95%" stopColor={hex} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={hex} fill={`url(#sg-${color})`} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [, navigate] = useLocation();
  const analytics = overviewAnalytics;

  return (
    <DashboardLayout title="Overview" subtitle="Full platform summary — click any section to explore">
      <div className="space-y-5">

        {/* ── Hero Banner ──────────────────────────────────────────────────── */}
        <div className="relative rounded-xl overflow-hidden border border-blue-500/20 bg-gradient-to-r from-slate-900/60 via-blue-900/20 to-slate-900/60 backdrop-blur-md p-6">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Orbit className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Lucia Attribution — Orbital Identity Platform</span>
              </div>
              <h2 className="text-2xl font-extrabold text-blue-100 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                Platform Performance Summary
              </h2>
              <p className="text-sm text-blue-300/70 mt-1 max-w-xl">
                Every trackable link, campaign, user journey, and attribution model in one view. Click any card to drill into that section.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Platform Health</p>
                <p className="text-xl font-bold text-emerald-400">Operational</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Top KPI Strip ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <HeroKpi label="Total Revenue" value={fmtMoney(487250)} delta={18} color="blue" sparkData={revenueSparkline} />
          <HeroKpi label="Total Users" value={fmt(analytics.kpi.totalUsers)} delta={12} color="emerald" sparkData={userSparkline} />
          <HeroKpi label="Conversions" value={fmt(11216)} delta={9} color="purple" sparkData={convSparkline} />
          <HeroKpi label="Avg ROI" value="3.88x" delta={7} color="amber" sparkData={roiSparkline} />
        </div>

        {/* ── Live activity ticker ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/40 backdrop-blur-md px-4 py-3 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide text-[11px] font-mono whitespace-nowrap">
            {realtimeEventsData.map((evt, i) => (
              <span key={evt.id} className={`flex items-center gap-1.5 ${evt.type === 'Conversion' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Activity className="w-3 h-3 shrink-0" />
                <span className="text-slate-500">{evt.user}</span>
                <span>·</span>
                <span>{evt.type}</span>
                {evt.value > 0 && <span className="text-emerald-400">${evt.value}</span>}
                <span className="text-slate-600">via {evt.channel}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* ── CAMPAIGNS ─────────────────────────────────────────────────── */}
          <SectionCard title="Campaigns" subtitle="8 active campaigns · ROI & spend tracking" icon={Target} color="blue" path="/campaigns" badge="8">
            <div className="space-y-2">
              {campaignPerformanceData.filter(c => c.status === 'Active').map((c, i) => {
                const colors = ['#3b82f6', '#10b981', '#8b5cf6'];
                return (
                  <div key={c.id} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colors[i] }} />
                      <span className="text-slate-300 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-400">{fmtMoney(c.revenue)}</span>
                      <span className="font-mono font-bold text-emerald-400">{c.roi}x</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-900/20 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Active', value: '18' },
                { label: 'Total Spend', value: '$125K' },
                { label: 'Avg ROAS', value: '3.9x' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── USERS & SESSIONS ──────────────────────────────────────────── */}
          <SectionCard title="Users & Sessions" subtitle="Active users, sessions, and top performers" icon={Users} color="emerald" path="/users">
            <div className="space-y-1.5 mb-3">
              {userSessionsData.slice(0, 4).map((u, i) => (
                <div key={u.userId} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-emerald-400">{u.name.charAt(0)}</span>
                    </div>
                    <span className="text-slate-300 truncate">{u.name}</span>
                    {u.tags[0] && <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/15 text-blue-400 shrink-0">{u.tags[0]}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-500 font-mono">{u.sessions}s</span>
                    <span className="font-mono font-bold text-emerald-400">${u.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Total Users', value: fmt(analytics.kpi.totalUsers) },
                { label: 'Returning', value: `${Math.round(analytics.kpi.returningUsers / analytics.kpi.totalUsers * 100)}%` },
                { label: 'Avg Session', value: '4m 47s' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── ATTRIBUTION ───────────────────────────────────────────────── */}
          <SectionCard title="Attribution" subtitle="Multi-touch models · SDK & supercookie tracking" icon={TrendingUp} color="purple" path="/attribution">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={attrMini} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="channel" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="firstTouch" name="First Touch" fill="#8b5cf6" opacity={0.7} radius={[2, 2, 0, 0]} />
                <Bar dataKey="lastTouch" name="Last Touch" fill="#3b82f6" opacity={0.7} radius={[2, 2, 0, 0]} />
                <Bar dataKey="linear" name="Linear" fill="#10b981" opacity={0.7} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
              {[
                { label: 'Supercookie Rate', value: `${analytics.kpi.supercookieResolutionRate}%`, color: 'text-amber-400' },
                { label: 'Cross-Device Match', value: `${analytics.kpi.crossDeviceMatchRate}%`, color: 'text-purple-400' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500">{m.label}</p>
                  <p className={`font-mono font-bold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── ANALYTICS ─────────────────────────────────────────────────── */}
          <SectionCard title="Analytics" subtitle="Global traffic, geo, demographics, user behavior" icon={Globe} color="cyan" path="/analytics">
            <div className="flex items-center gap-3 mb-3">
              <ResponsiveContainer width="40%" height={90}>
                <PieChart>
                  <Pie data={geoMini} cx="50%" cy="50%" innerRadius={24} outerRadius={40} dataKey="pct" paddingAngle={2}>
                    {geoMini.map((g, i) => <Cell key={i} fill={g.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1">
                {geoMini.map((g, i) => (
                  <div key={g.region} className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: g.color }} />
                    <span className="text-slate-400 flex-1 truncate">{g.region}</span>
                    <span className="font-mono text-slate-500">{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: 'Countries', value: '142' },
                { label: 'Conv. Rate', value: `${analytics.kpi.conversionRate}%` },
                { label: 'Bounce Rate', value: '28%' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── USER JOURNEYS ─────────────────────────────────────────────── */}
          <SectionCard title="User Journeys" subtitle="Cross-channel paths from first click to conversion" icon={Route} color="amber" path="/journeys">
            <div className="flex items-center gap-1 mb-3">
              {journeyMini.map((step, i) => (
                <div key={step.step} className="flex items-center gap-1 flex-1">
                  <div className="flex-1 text-center">
                    <div className="h-6 rounded flex items-center justify-center text-[9px] font-mono font-bold text-slate-200"
                      style={{ background: `rgba(245,158,11,${0.1 + (i / journeyMini.length) * 0.3})`, border: '1px solid rgba(245,158,11,0.2)' }}>
                      {fmt(step.users)}
                    </div>
                    <p className="text-[8px] text-slate-600 mt-0.5">{step.step}</p>
                  </div>
                  {i < journeyMini.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-700 shrink-0" />}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={journeyMini} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="journeyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="#f59e0b" fill="url(#journeyGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">9,600 entries</span>
              <span className="text-amber-400 font-bold">11.5% end-to-end conv.</span>
            </div>
          </SectionCard>

          {/* ── TRACKABLE LINKS ───────────────────────────────────────────── */}
          <SectionCard title="Trackable Links" subtitle="Canonical source links · SDK & supercookie enabled" icon={Link2} color="pink" path="/links" badge="NEW">
            <div className="space-y-2 mb-3">
              {linksMini.map(l => (
                <div key={l.name}>
                  <div className="flex items-center justify-between mb-0.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                      <span className="font-mono text-slate-400">{l.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{fmt(l.clicks)} clicks</span>
                      <span className="font-bold" style={{ color: l.color }}>{l.roi}x ROI</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(l.clicks / 50000) * 100}%`, background: l.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: 'Active Links', value: '12' },
                { label: 'Total Clicks', value: '96K' },
                { label: 'Avg Conv.', value: '6.9%' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── ORBITAL COMMAND ───────────────────────────────────────────── */}
          <SectionCard title="Orbital Command" subtitle="Real-time identity resolution · live event feed" icon={Orbit} color="indigo" path="/orbital">
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={orbitalMini} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="orbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="resolved" name="Resolved %" stroke="#6366f1" fill="url(#orbGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="unresolved" name="Unresolved %" stroke="#ef4444" fill="none" strokeWidth={1} strokeDasharray="3 2" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: 'Resolved', value: '88.4%', color: 'text-indigo-400' },
                { label: 'Graph Nodes', value: '1.2M', color: 'text-slate-200' },
                { label: 'Confidence', value: '91.2%', color: 'text-emerald-400' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/40 rounded p-1.5">
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className={`text-xs font-mono font-bold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── CONVERSION FUNNEL (wide) ───────────────────────────────────── */}
          <SectionCard title="Conversion Funnel" subtitle="Platform-wide funnel from awareness to retention" icon={MousePointerClick} color="emerald" path="/analytics" span={2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                {conversionFunnelData.map((stage, i) => {
                  const pct = Math.round((stage.users / conversionFunnelData[0].users) * 100);
                  const drop = i > 0 ? Math.round(((conversionFunnelData[i - 1].users - stage.users) / conversionFunnelData[i - 1].users) * 100) : 0;
                  return (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-0.5 text-[11px]">
                        <span className="text-slate-300">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          {drop > 0 && <span className="text-red-400 font-mono text-[9px]">-{drop}%</span>}
                          <span className="font-mono text-slate-200">{fmt(stage.users)}</span>
                          <span className="text-slate-500 w-7 text-right">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: `hsl(${160 + i * 20}, 70%, 50%)` }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.07 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Funnel Highlights</p>
                {[
                  { label: 'Top of Funnel', value: fmt(284700) + ' users', icon: Users, color: 'text-blue-400' },
                  { label: 'Purchase Rate', value: `${conversionFunnelData[3].conversionRate}%`, icon: MousePointerClick, color: 'text-emerald-400' },
                  { label: 'Retention Rate', value: `${conversionFunnelData[4].conversionRate}%`, icon: RefreshCw, color: 'text-purple-400' },
                  { label: 'Biggest Drop-off', value: 'Consideration → Decision', icon: AlertTriangle, color: 'text-amber-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-blue-900/10 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <item.icon className={`w-3 h-3 ${item.color}`} />
                      <span className="text-slate-400">{item.label}</span>
                    </div>
                    <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

        </div>

        {/* ── Bottom row: Recent activity + Platform health ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Events */}
          <div className="rounded-xl border border-blue-900/20 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">Recent Events</h3>
                  <p className="text-[10px] text-slate-500">Live platform activity</p>
                </div>
              </div>
              <button onClick={() => navigate('/orbital')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {realtimeEventsData.map(evt => (
                <div key={evt.id} className="flex items-center justify-between text-[11px] py-1.5 border-b border-blue-900/10 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${evt.type === 'Conversion' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                    <span className="text-slate-300">{evt.user}</span>
                    <span className="text-slate-500">·</span>
                    <span className={evt.type === 'Conversion' ? 'text-emerald-400' : 'text-slate-400'}>{evt.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {evt.value > 0 && <span className="font-mono font-bold text-emerald-400">${evt.value}</span>}
                    <span className="text-slate-600 font-mono text-[9px]">{evt.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div className="rounded-xl border border-blue-900/20 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">Platform Health</h3>
                <p className="text-[10px] text-slate-500">SDK, supercookie, and identity resolution status</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'SDK Integration', status: 'Operational', pct: 100, color: '#10b981' },
                { label: 'Supercookie Resolution', status: '88.4% rate', pct: 88, color: '#3b82f6' },
                { label: 'Cross-Device Matching', status: '64.8% rate', pct: 65, color: '#8b5cf6' },
                { label: 'Attribution Engine', status: 'Operational', pct: 100, color: '#10b981' },
                { label: 'Identity Graph', status: '1.2M nodes', pct: 92, color: '#f59e0b' },
                { label: 'Event Pipeline', status: 'Live · 340 evt/s', pct: 100, color: '#10b981' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5 text-[11px]">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono" style={{ color: item.color }}>{item.status}</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: item.color }}
                      initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

// tiny helper used inline above
function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
