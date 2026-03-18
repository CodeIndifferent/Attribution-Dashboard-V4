/*
 * OVERVIEW PAGE — LUCIA ATTRIBUTION DASHBOARD
 * Full dashboard summary hub. Every section card has a unique design.
 * Dark orbital theme.
 */
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Target, Users, Globe, Route, Link2, Orbit,
  ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Activity,
  MousePointerClick, CheckCircle, AlertTriangle,
  TrendingUp, Layers, Clock, Wallet,
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
const fmtDur = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

// ─── Sparkline data ────────────────────────────────────────────────────────────
const revenueSparkline = [32,38,35,42,48,44,52,58,55,64,72,78,82,88].map(v => ({ v: v * 1000 }));
const userSparkline    = [8.2,9.1,8.8,10.2,11.4,10.8,12.6,13.8,13.2,15].map(v => ({ v: v * 1000 }));
const convSparkline    = [420,510,480,590,640,610,720,800,780,890].map(v => ({ v }));
const roiSparkline     = [3.2,3.5,3.4,3.8,4.0,3.9,4.2,4.5,4.4,4.8].map(v => ({ v }));

// ─── Journey funnel ───────────────────────────────────────────────────────────
const journeySteps = [
  { step: 'Click', users: 9600, pct: 100 },
  { step: 'Land', users: 8200, pct: 85 },
  { step: 'View', users: 5600, pct: 58 },
  { step: 'Cart', users: 2800, pct: 29 },
  { step: 'Buy', users: 1100, pct: 11 },
];

// ─── Orbital resolution trend ─────────────────────────────────────────────────
const orbitalMini = [
  { t: 'W1', r: 62 }, { t: 'W2', r: 68 }, { t: 'W3', r: 71 }, { t: 'W4', r: 75 },
  { t: 'W5', r: 79 }, { t: 'W6', r: 84 }, { t: 'W7', r: 87 }, { t: 'W8', r: 88 },
];

// ─── Links data ───────────────────────────────────────────────────────────────
const linksMini = [
  { name: 'WIDGET-Q1', label: 'Q1 Product Launch', clicks: 43200, conv: 2900, roi: 5.8, color: '#3b82f6' },
  { name: 'SUMMER26',  label: 'Summer Sale 2026',  clicks: 40000, conv: 3100, roi: 4.9, color: '#10b981' },
  { name: 'ENT-DEMO',  label: 'Enterprise Demo',   clicks: 12800, conv: 550,  roi: 5.3, color: '#8b5cf6' },
];

// ─── Geo data ─────────────────────────────────────────────────────────────────
const geoMini = [
  { region: 'North America', pct: 49, color: '#3b82f6' },
  { region: 'Europe',        pct: 26, color: '#10b981' },
  { region: 'Asia',          pct: 14, color: '#f59e0b' },
  { region: 'South America', pct: 5,  color: '#8b5cf6' },
  { region: 'Oceania',       pct: 4,  color: '#06b6d4' },
  { region: 'Middle East',   pct: 2,  color: '#ec4899' },
];

// ─── Dark tooltip ─────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-blue-500/20 rounded-lg p-2 text-[10px] shadow-xl z-50">
      {label && <p className="text-blue-300 font-mono mb-0.5">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#94a3b8' }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Hero KPI Card ────────────────────────────────────────────────────────────
function HeroKpi({ label, value, delta, color, sparkData }: {
  label: string; value: string; delta: number; color: string; sparkData: { v: number }[];
}) {
  const hex: Record<string, string> = {
    blue: '#3b82f6', emerald: '#10b981', purple: '#8b5cf6', amber: '#f59e0b',
  };
  const c = hex[color] || '#3b82f6';
  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-md p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
        <span className={`text-[10px] font-mono flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="text-2xl font-extrabold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      <ResponsiveContainer width="100%" height={32}>
        <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.3} />
              <stop offset="95%" stopColor={c} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={c} fill={`url(#sg-${color})`} strokeWidth={1.5} dot={false} />
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
        <div className="relative rounded-xl overflow-hidden border border-blue-500/20 bg-gradient-to-r from-slate-900/60 via-blue-900/20 to-slate-900/60 p-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Orbit className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Lucia Attribution · Orbital Identity Platform</span>
              </div>
              <h2 className="text-2xl font-extrabold text-blue-100 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                Platform Performance Summary
              </h2>
              <p className="text-sm text-blue-300/60 mt-1 max-w-xl">
                Every campaign, user journey, and trackable link in one view. Click any section to drill in.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Platform Status</p>
                <p className="text-lg font-bold text-emerald-400">Operational</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Strip ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <HeroKpi label="Total Revenue"  value={fmtMoney(487250)} delta={18} color="blue"    sparkData={revenueSparkline} />
          <HeroKpi label="Total Users"    value={fmt(analytics.kpi.totalUsers)} delta={12} color="emerald" sparkData={userSparkline} />
          <HeroKpi label="Conversions"    value={fmt(11216)}       delta={9}  color="purple"  sparkData={convSparkline} />
          <HeroKpi label="Avg ROI"        value="3.88x"            delta={7}  color="amber"   sparkData={roiSparkline} />
        </div>

        {/* ── Live ticker ──────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/40 px-4 py-2.5 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto text-[11px] font-mono whitespace-nowrap">
            {realtimeEventsData.map(evt => (
              <span key={evt.id} className={`flex items-center gap-1.5 ${evt.type === 'Conversion' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Activity className="w-3 h-3 shrink-0" />
                <span className="text-slate-500">{evt.user}</span>
                <span className="text-slate-700">·</span>
                <span>{evt.type}</span>
                {evt.value > 0 && <span className="text-emerald-400">${evt.value}</span>}
                <span className="text-slate-600">via {evt.channel}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION CARDS — each with a unique design
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* ── 1. CAMPAIGNS — Horizontal metric bars ─────────────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/campaigns')}
            className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/60 p-5 cursor-pointer group col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Campaigns</p>
                  <p className="text-[10px] text-slate-500">18 active · ROI tracking</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Campaign bars */}
            <div className="space-y-3">
              {campaignPerformanceData.filter(c => c.status === 'Active').map((c, i) => {
                const colors = ['#3b82f6', '#06b6d4', '#8b5cf6'];
                const maxRev = 160000;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="text-slate-300 truncate flex-1">{c.name}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="font-mono text-slate-400">{fmtMoney(c.revenue)}</span>
                        <span className="font-mono font-bold" style={{ color: colors[i] }}>{c.roi}x</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: colors[i] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.revenue / maxRev) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom stat row */}
            <div className="mt-4 pt-3 border-t border-blue-900/20 flex items-center justify-between text-[11px]">
              <div className="text-center">
                <p className="text-slate-500">Total Spend</p>
                <p className="font-mono font-bold text-slate-200">$125K</p>
              </div>
              <div className="w-px h-6 bg-blue-900/30" />
              <div className="text-center">
                <p className="text-slate-500">Total Revenue</p>
                <p className="font-mono font-bold text-blue-300">$487K</p>
              </div>
              <div className="w-px h-6 bg-blue-900/30" />
              <div className="text-center">
                <p className="text-slate-500">Avg ROAS</p>
                <p className="font-mono font-bold text-emerald-400">3.9x</p>
              </div>
            </div>
          </motion.div>

          {/* ── 2. USERS — Avatar list with stat pills ────────────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/users')}
            className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 p-5 cursor-pointer group col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Users & Sessions</p>
                  <p className="text-[10px] text-slate-500">{fmt(analytics.kpi.totalUsers)} total · {fmt(analytics.kpi.returningUsers)} returning</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* User list */}
            <div className="space-y-2.5">
              {userSessionsData.slice(0, 4).map((u, i) => {
                const initials = u.name.split(' ').map(n => n[0]).join('');
                const avatarColors = ['bg-blue-500/20 text-blue-300 border-blue-500/30', 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', 'bg-purple-500/20 text-purple-300 border-purple-500/30', 'bg-amber-500/20 text-amber-300 border-amber-500/30'];
                return (
                  <div key={u.userId} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[i]}`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-slate-200 truncate">{u.name}</p>
                      <p className="text-[9px] text-slate-600">{u.device} · {u.location.split(',')[1]?.trim()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">{u.sessions}s</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">${u.revenue}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stat pills */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {[
                { label: 'Avg Session', value: '4m 47s', icon: Clock },
                { label: 'Conv. Rate', value: `${analytics.kpi.conversionRate}%`, icon: TrendingUp },
                { label: 'Cross-Device', value: `${analytics.kpi.crossDeviceMatchRate}%`, icon: Layers },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/15 text-[10px]">
                  <m.icon className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-slate-400">{m.label}:</span>
                  <span className="font-mono font-bold text-emerald-300">{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── 3. ANALYTICS — Donut + country list ──────────────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/analytics')}
            className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 p-5 cursor-pointer group col-span-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Analytics</p>
                  <p className="text-[10px] text-slate-500">142 countries · geo & demographics</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="flex items-center gap-3">
              {/* Donut */}
              <div className="shrink-0">
                <ResponsiveContainer width={90} height={90}>
                  <PieChart>
                    <Pie data={geoMini} cx="50%" cy="50%" innerRadius={26} outerRadius={42} dataKey="pct" paddingAngle={2}>
                      {geoMini.map((g, i) => <Cell key={i} fill={g.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Region list */}
              <div className="flex-1 space-y-1.5">
                {geoMini.map(g => (
                  <div key={g.region} className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: g.color }} />
                    <span className="text-slate-400 flex-1 truncate">{g.region}</span>
                    <span className="font-mono text-slate-500">{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stats */}
            <div className="mt-3 pt-3 border-t border-cyan-900/20 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Countries', value: '142' },
                { label: 'Conv. Rate', value: `${analytics.kpi.conversionRate}%` },
                { label: 'Bounce Rate', value: '28%' },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-[9px] text-slate-500 uppercase">{m.label}</p>
                  <p className="text-xs font-mono font-bold text-slate-200">{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── 4. USER JOURNEYS — Funnel steps (full width on md, 2/3 on xl) */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/journeys')}
            className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/25 to-slate-900/60 p-5 cursor-pointer group md:col-span-2 xl:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Route className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">User Journeys</p>
                  <p className="text-[10px] text-slate-500">Cross-channel paths from first click to conversion</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-amber-400 font-bold">11.5% end-to-end</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Funnel steps */}
            <div className="grid grid-cols-5 gap-2">
              {journeySteps.map((step, i) => {
                const opacity = 0.25 + (i / journeySteps.length) * 0.55;
                return (
                  <div key={step.step} className="relative">
                    {/* Step block */}
                    <div className="rounded-lg p-3 text-center border"
                      style={{ background: `rgba(245,158,11,${opacity * 0.15})`, borderColor: `rgba(245,158,11,${opacity * 0.4})` }}>
                      <p className="text-base font-extrabold text-slate-100 font-mono">{fmt(step.users)}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{step.step}</p>
                      <p className="text-[10px] font-mono mt-1" style={{ color: `rgba(245,158,11,${0.5 + opacity * 0.5})` }}>{step.pct}%</p>
                    </div>
                    {/* Connector arrow */}
                    {i < journeySteps.length - 1 && (
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                        <ChevronRight className="w-3 h-3 text-amber-700" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drop-off indicators */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {journeySteps.slice(1).map((step, i) => {
                const drop = journeySteps[i].pct - step.pct;
                return (
                  <span key={step.step} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-900/20 border border-red-500/15 text-red-400">
                    {journeySteps[i].step}→{step.step}: -{drop}%
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* ── 5. TRACKABLE LINKS — Card with link rows ──────────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/links')}
            className="rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-950/25 to-slate-900/60 p-5 cursor-pointer group col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/25 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Trackable Links</p>
                  <p className="text-[10px] text-slate-500">SDK · supercookie · 12 active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/20">NEW</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Link cards */}
            <div className="space-y-2.5">
              {linksMini.map(l => (
                <div key={l.name} className="rounded-lg border p-3 flex items-center justify-between"
                  style={{ borderColor: `${l.color}25`, background: `${l.color}08` }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: l.color }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono font-bold" style={{ color: l.color }}>{l.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{l.label}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-mono font-bold text-slate-200">{fmt(l.clicks)}</p>
                    <p className="text-[9px] text-slate-500">clicks</p>
                    <p className="text-[10px] font-mono font-bold" style={{ color: l.color }}>{l.roi}x ROI</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-3 pt-3 border-t border-pink-900/20 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Total clicks</span>
              <span className="font-mono font-bold text-slate-200">96K</span>
              <div className="w-px h-4 bg-pink-900/30" />
              <span className="text-slate-500">Avg conv.</span>
              <span className="font-mono font-bold text-pink-300">6.9%</span>
            </div>
          </motion.div>

          {/* ── 6. ORBITAL COMMAND — Resolution trend (wide) ─────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/orbital')}
            className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 p-5 cursor-pointer group md:col-span-2 xl:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Orbit className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Orbital Command</p>
                  <p className="text-[10px] text-slate-500">Real-time identity resolution · 8-week trend</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Chart */}
              <div className="md:col-span-2">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={orbitalMini} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="orbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[50, 100]} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="monotone" dataKey="r" name="Resolved %" stroke="#6366f1" fill="url(#orbGrad)" strokeWidth={2} dot={{ r: 2, fill: '#6366f1' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stat column */}
              <div className="space-y-2">
                {[
                  { label: 'Resolution Rate', value: '88.4%', color: '#6366f1' },
                  { label: 'Identity Graph', value: '1.2M nodes', color: '#8b5cf6' },
                  { label: 'Avg Confidence', value: '91.2%', color: '#10b981' },
                  { label: 'Events / sec', value: '340', color: '#f59e0b' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between text-[11px] py-1 border-b border-indigo-900/20 last:border-0">
                    <span className="text-slate-500">{m.label}</span>
                    <span className="font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── 7. PLATFORM HEALTH — Status list (1 col) ─────────────────── */}
          <motion.div
            whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/orbital')}
            className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-5 cursor-pointer group col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Platform Health</p>
                  <p className="text-[10px] text-slate-500">All systems operational</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'SDK Integration',       status: 'Operational', pct: 100, color: '#10b981' },
                { label: 'Supercookie Engine',     status: '88.4%',       pct: 88,  color: '#3b82f6' },
                { label: 'Cross-Device Match',     status: '64.8%',       pct: 65,  color: '#8b5cf6' },
                { label: 'Attribution Engine',     status: 'Operational', pct: 100, color: '#10b981' },
                { label: 'Event Pipeline',         status: '340 evt/s',   pct: 100, color: '#10b981' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5 text-[10px]">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-mono" style={{ color: item.color }}>{item.status}</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── Conversion Funnel (full width) ───────────────────────────────── */}
        <motion.div
          whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }}
          onClick={() => navigate('/analytics')}
          className="rounded-xl border border-emerald-500/15 bg-gradient-to-br from-slate-900/60 to-emerald-950/20 p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">Conversion Funnel</p>
                <p className="text-[10px] text-slate-500">Platform-wide · Awareness → Retention</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Funnel bars */}
            <div className="space-y-2.5">
              {conversionFunnelData.map((stage, i) => {
                const pct = Math.round((stage.users / conversionFunnelData[0].users) * 100);
                const drop = i > 0 ? Math.round(((conversionFunnelData[i - 1].users - stage.users) / conversionFunnelData[i - 1].users) * 100) : 0;
                const stageColors = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'];
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
                        style={{ background: stageColors[i] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Top of Funnel',   value: fmt(284700) + ' users', color: '#3b82f6',  icon: Users },
                { label: 'Purchase Rate',   value: '78.6%',                color: '#10b981',  icon: TrendingUp },
                { label: 'Retention Rate',  value: '80%',                  color: '#8b5cf6',  icon: CheckCircle },
                { label: 'Biggest Drop',    value: 'Awareness → Consid.',  color: '#f59e0b',  icon: AlertTriangle },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-white/5 bg-slate-800/30 p-3">
                  <item.icon className="w-3.5 h-3.5 mb-1.5" style={{ color: item.color }} />
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-mono font-bold mt-0.5" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Recent Events (bottom) ────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-900/20 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-slate-200">Recent Events</p>
            </div>
            <button onClick={() => navigate('/orbital')} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {realtimeEventsData.map(evt => (
              <div key={evt.id} className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] ${evt.type === 'Conversion' ? 'border-emerald-500/15 bg-emerald-900/10' : 'border-blue-900/15 bg-slate-800/30'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${evt.type === 'Conversion' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                  <span className="text-slate-300 font-medium">{evt.user}</span>
                  <span className={evt.type === 'Conversion' ? 'text-emerald-400' : 'text-slate-500'}>{evt.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {evt.value > 0 && <span className="font-mono font-bold text-emerald-400">${evt.value}</span>}
                  <span className="text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800">{evt.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
