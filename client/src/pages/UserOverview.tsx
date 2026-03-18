/*
 * USER OVERVIEW PAGE - Vibrant dark orbital theme
 * High-level summary of user activity across Web2 and Web3
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Activity, Wallet, DollarSign, Globe, Zap, Calendar, MapPin, Smartphone, Monitor, Clock, ShoppingCart, ChevronDown, ChevronRight, Network, Shield, Fingerprint } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Device, SessionRecord, Transaction } from '@/lib/userData';

interface UserOverviewProps {
  user: {
    name: string;
    email: string;
    location: string;
    device: string;
    sessions: number;
    conversions: number;
    revenue: number;
    status: string;
  };
  rawUser?: User;
}

// ─── Device Card ─────────────────────────────────────────────────────────────
function DeviceCard({ device, index }: { device: Device; index: number }) {
  const gradients = ['from-cyan-400 to-blue-500', 'from-purple-400 to-pink-500', 'from-emerald-400 to-teal-500'];
  const isDesktop = ['macbook', 'dell', 'windows', 'desktop', 'laptop'].some(k => device.type.toLowerCase().includes(k));
  const isMobile = ['iphone', 'samsung', 'android', 'pixel', 'galaxy'].some(k => device.type.toLowerCase().includes(k));
  const DeviceIcon = isMobile ? Smartphone : Monitor;
  return (
    <div className={cn('rounded-xl border p-4 bg-gradient-to-br from-slate-900/70 to-slate-900/40 backdrop-blur-md', index === 0 ? 'border-cyan-500/40' : 'border-slate-700/40')}>
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', gradients[index % gradients.length])}>
          <DeviceIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-cyan-300">{device.type}</span>
            {index === 0 && <Badge className="text-[9px] px-1.5 py-0 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Primary</Badge>}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mb-2">{device.deviceId}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <div><span className="text-slate-500">OS:</span> <span className="text-slate-300">{device.os} {device.osVersion}</span></div>
            <div><span className="text-slate-500">Browser:</span> <span className="text-slate-300">{device.browser} {device.browserVersion}</span></div>
            <div><span className="text-slate-500">Resolution:</span> <span className="text-slate-300">{device.screenResolution}</span></div>
            <div><span className="text-slate-500">Sessions:</span> <span className="text-cyan-400 font-bold">{device.sessionCount}</span></div>
            <div><span className="text-slate-500">First seen:</span> <span className="text-slate-300">{device.firstSeen}</span></div>
            <div><span className="text-slate-500">Last seen:</span> <span className="text-slate-300">{device.lastSeen}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Session Row ─────────────────────────────────────────────────────────────
function SessionRow({ session }: { session: SessionRecord }) {
  const [open, setOpen] = useState(false);
  const mins = Math.floor(session.duration / 60);
  const secs = session.duration % 60;
  const statusColor = session.status === 'completed' ? 'text-green-400 border-green-500/30 bg-green-500/10'
    : session.status === 'abandoned' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  return (
    <div className="border border-slate-700/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-200">{session.timestamp}</div>
            <div className="text-[10px] text-slate-500">{session.campaignSource} · {session.location.city}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn('text-[9px] px-2 py-0.5 border', statusColor)}>{session.status}</Badge>
          <span className="text-[10px] text-slate-400 font-mono">{mins}m {secs}s</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-slate-900/40 border-t border-slate-700/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
            <div><span className="text-slate-500">Session ID:</span><div className="font-mono text-slate-300 mt-0.5">{session.sessionId}</div></div>
            <div><span className="text-slate-500">Device:</span><div className="font-mono text-slate-300 mt-0.5">{session.deviceId}</div></div>
            <div><span className="text-slate-500">Events:</span><div className="font-bold text-cyan-400 mt-0.5">{session.events}</div></div>
            <div><span className="text-slate-500">Page Views:</span><div className="font-bold text-cyan-400 mt-0.5">{session.pageViews}</div></div>
            <div><span className="text-slate-500">IP Address:</span><div className="font-mono text-slate-300 mt-0.5">{session.location.ipAddress}</div></div>
            <div><span className="text-slate-500">Location:</span><div className="text-slate-300 mt-0.5">{session.location.city}, {session.location.country}</div></div>
            <div><span className="text-slate-500">Duration:</span><div className="font-bold text-amber-400 mt-0.5">{mins}m {secs}s</div></div>
            <div><span className="text-slate-500">Campaign:</span><div className="text-blue-300 mt-0.5">{session.campaignSource}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TransactionRow({ txn }: { txn: Transaction }) {
  const [open, setOpen] = useState(false);
  const statusColor = txn.status === 'completed' ? 'text-green-400 border-green-500/30 bg-green-500/10'
    : txn.status === 'pending' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
    : 'text-red-400 border-red-500/30 bg-red-500/10';
  return (
    <div className="border border-slate-700/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-200">{txn.product}</div>
            <div className="text-[10px] text-slate-500">{txn.timestamp} · {txn.campaignSource}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn('text-[9px] px-2 py-0.5 border', statusColor)}>{txn.status}</Badge>
          <span className="text-sm font-black text-emerald-400 font-mono">${txn.amount.toFixed(2)}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-slate-900/40 border-t border-slate-700/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
            <div><span className="text-slate-500">Transaction ID:</span><div className="font-mono text-slate-300 mt-0.5">{txn.transactionId}</div></div>
            <div><span className="text-slate-500">Product:</span><div className="text-slate-300 mt-0.5">{txn.product}</div></div>
            <div><span className="text-slate-500">Category:</span><div className="text-slate-300 mt-0.5">{txn.productCategory}</div></div>
            <div><span className="text-slate-500">Currency:</span><div className="text-slate-300 mt-0.5">{txn.currency}</div></div>
            <div><span className="text-slate-500">Device:</span><div className="font-mono text-slate-300 mt-0.5">{txn.deviceId}</div></div>
            <div><span className="text-slate-500">IP Address:</span><div className="font-mono text-slate-300 mt-0.5">{txn.location.ipAddress}</div></div>
            <div><span className="text-slate-500">Location:</span><div className="text-slate-300 mt-0.5">{txn.location.city}, {txn.location.country}</div></div>
            <div><span className="text-slate-500">Campaign:</span><div className="text-blue-300 mt-0.5">{txn.campaignSource}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.date || payload[0]?.payload?.name}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function UserOverview({ user, rawUser }: UserOverviewProps) {
  // Generate sample overview data
  const activityTrend = [
    { date: '2026-03-10', web2: 2, web3: 1, conversions: 1 },
    { date: '2026-03-11', web2: 1, web3: 2, conversions: 0 },
    { date: '2026-03-12', web2: 3, web3: 1, conversions: 1 },
    { date: '2026-03-13', web2: 1, web3: 2, conversions: 0 },
    { date: '2026-03-14', web2: 4, web3: 2, conversions: 2 },
    { date: '2026-03-15', web2: 2, web3: 1, conversions: 1 },
    { date: '2026-03-16', web2: 3, web3: 3, conversions: 1 },
  ];

  const channelDistribution = [
    { name: 'Web2 Sessions', value: 60, color: '#00d9ff' },
    { name: 'Web3 Transactions', value: 25, color: '#a855f7' },
    { name: 'Direct Conversions', value: 15, color: '#10b981' },
  ];

  const revenueBySource = [
    { source: 'Web2 E-commerce', revenue: 525, percentage: 60 },
    { source: 'Web3 DeFi Yield', revenue: 262, percentage: 30 },
    { source: 'Affiliate/Referral', revenue: 88, percentage: 10 },
  ];

  const engagementMetrics = [
    { metric: 'Page Views', value: 175, trend: '+12%' },
    { metric: 'Session Duration', value: '4m 12s', trend: '+8%' },
    { metric: 'Bounce Rate', value: '12%', trend: '-5%' },
    { metric: 'Conversion Rate', value: '25.6%', trend: '+3%' },
  ];

  const totalPortfolioValue = 20271.5;
  const web2Revenue = 875;
  const web3Yield = 487.5;

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <div className="rounded-lg border border-cyan-500/30 p-8 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info */}
            <div>
              <h2 className="text-3xl font-black text-cyan-300 mb-2">{user.name}</h2>
              <p className="text-sm text-cyan-300/70 mb-6">{user.email}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400/60" />
                  <span className="text-sm text-cyan-300/80">{user.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-cyan-400/60" />
                  <span className="text-sm text-cyan-300/80">{user.device}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-cyan-400/60" />
                  <span className="text-sm text-cyan-300/80">Member since Nov 2025</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-[10px] text-cyan-300/60 uppercase mb-2 font-bold">Status</div>
                <div className={`text-sm font-bold ${user.status === 'Active' ? 'text-green-400' : 'text-blue-400'}`}>
                  {user.status}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-[10px] text-cyan-300/60 uppercase mb-2 font-bold">Web2 Revenue</div>
                <div className="text-sm font-mono text-cyan-300">${web2Revenue}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-[10px] text-cyan-300/60 uppercase mb-2 font-bold">Web3 Yield</div>
                <div className="text-sm font-mono text-purple-400">${web3Yield.toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-[10px] text-cyan-300/60 uppercase mb-2 font-bold">Total Value</div>
                <div className="text-sm font-mono text-green-400">${(web2Revenue + totalPortfolioValue).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-cyan-400/70 uppercase">Sessions</p>
          </div>
          <p className="text-2xl font-black text-cyan-300">{user.sessions}</p>
          <p className="text-xs text-blue-300/60 mt-2">Web2 + Web3</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase">Conversions</p>
          </div>
          <p className="text-2xl font-black text-green-400">{user.conversions}</p>
          <p className="text-xs text-green-300/60 mt-2">Purchase events</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase">Portfolio</p>
          </div>
          <p className="text-2xl font-black text-purple-300">${totalPortfolioValue.toLocaleString()}</p>
          <p className="text-xs text-purple-300/60 mt-2">Web3 value</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase">Total Revenue</p>
          </div>
          <p className="text-2xl font-black text-orange-400">${(web2Revenue + web3Yield).toFixed(2)}</p>
          <p className="text-xs text-orange-300/60 mt-2">All sources</p>
        </div>
      </div>

      {/* Activity Trend */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-cyan-300">Activity Trend (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTrend} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorWeb2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00d9ff" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorWeb3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="web2" stroke="#00d9ff" strokeWidth={3} dot={false} animationDuration={800} name="Web2 Sessions" />
              <Line type="monotone" dataKey="web3" stroke="#a855f7" strokeWidth={3} dot={false} animationDuration={800} name="Web3 Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Distribution & Channel Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-green-300 mb-6">Revenue by Source</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueBySource} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(16, 185, 129, 0.15)" vertical={false} />
                <XAxis dataKey="source" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 10 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                <Bar dataKey="revenue" fill="url(#gradRevenue)" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="rounded-lg border border-purple-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-purple-300 mb-6">Activity Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={channelDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-cyan-300">Engagement Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {engagementMetrics.map((metric, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-all">
              <div className="text-[10px] text-cyan-300/60 uppercase mb-2 font-bold">{metric.metric}</div>
              <div className="flex items-end justify-between">
                <div className="text-lg font-black text-cyan-300">{metric.value}</div>
                <div className="text-xs text-green-400 font-bold">{metric.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FINGERPRINT DATA (only when rawUser is available) ─── */}
      {rawUser && (
        <>
          {/* Devices */}
          <div className="rounded-xl border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300">Device Fingerprints</h3>
                <p className="text-[10px] text-cyan-300/60">{rawUser.devices.length} device{rawUser.devices.length !== 1 ? 's' : ''} linked to this identity</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-bold">Supercookie Linked</span>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {rawUser.devices.map((device, idx) => (
                <DeviceCard key={device.deviceId} device={device} index={idx} />
              ))}
            </div>
            {/* Location fingerprints */}
            {rawUser.locations.length > 0 && (
              <div className="px-5 pb-5">
                <div className="rounded-lg border border-slate-700/40 p-4 bg-slate-900/40">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">Known Locations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rawUser.locations.map((loc, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-[10px]">
                        <span className="text-slate-300 font-bold">{loc.city}, {loc.country}</span>
                        <span className="text-slate-500 font-mono">{loc.ipAddress}</span>
                        {i === 0 && <Badge className="text-[8px] px-1 py-0 bg-amber-500/20 text-amber-300 border-amber-500/30">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session History */}
          <div className="rounded-xl border border-blue-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-300">Session History</h3>
                <p className="text-[10px] text-blue-300/60">{rawUser.sessions.length} recorded sessions · {rawUser.totalSessions} total</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs font-bold text-blue-300">First seen: {rawUser.firstSeen}</div>
                <div className="text-[10px] text-blue-300/60">Last seen: {rawUser.lastSeen}</div>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {rawUser.sessions.map((session) => (
                <SessionRow key={session.sessionId} session={session} />
              ))}
              {rawUser.totalSessions > rawUser.sessions.length && (
                <div className="text-center py-3 text-[10px] text-slate-500">
                  + {rawUser.totalSessions - rawUser.sessions.length} more sessions not shown
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-xl border border-emerald-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300">Transaction History</h3>
                <p className="text-[10px] text-emerald-300/60">{rawUser.transactions.length} transactions · ${rawUser.totalSpent.toFixed(2)} total spent</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-black text-emerald-400 font-mono">${rawUser.totalSpent.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-300/60">Lifetime value</div>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {rawUser.transactions.map((txn) => (
                <TransactionRow key={txn.transactionId} txn={txn} />
              ))}
            </div>
          </div>

          {/* User Journey Summary */}
          <div className="rounded-xl border border-purple-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-300">User Journey Summary</h3>
                <p className="text-[10px] text-purple-300/60">Cross-device attribution path from first touch to conversion</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] text-purple-400 font-bold">{rawUser.conversionRate}% CVR</span>
              </div>
            </div>
            <div className="p-5">
              {/* Acquisition + journey steps */}
              <div className="flex items-start gap-0 flex-col">
                {/* Step 1: Acquisition */}
                <div className="flex items-start gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 mt-1" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="text-xs font-bold text-blue-300 mb-1">First Touch — Acquisition</div>
                    <div className="rounded-lg border border-blue-500/30 p-3 bg-blue-500/5 text-[10px] space-y-1">
                      <div><span className="text-slate-500">Campaign:</span> <span className="text-blue-300 font-bold">{rawUser.acquisitionCampaign}</span></div>
                      <div><span className="text-slate-500">First seen:</span> <span className="text-slate-300">{rawUser.firstSeen}</span></div>
                      <div><span className="text-slate-500">Entry device:</span> <span className="text-slate-300">{rawUser.devices[0]?.type ?? 'Unknown'}</span></div>
                      <div><span className="text-slate-500">Entry location:</span> <span className="text-slate-300">{rawUser.primaryLocation.city}, {rawUser.primaryLocation.country}</span></div>
                    </div>
                  </div>
                </div>
                {/* Step 2: Engagement */}
                <div className="flex items-start gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">2</div>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-emerald-500 mt-1" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="text-xs font-bold text-cyan-300 mb-1">Engagement — Multi-Session Activity</div>
                    <div className="rounded-lg border border-cyan-500/30 p-3 bg-cyan-500/5 text-[10px] space-y-1">
                      <div><span className="text-slate-500">Total sessions:</span> <span className="text-cyan-400 font-bold">{rawUser.totalSessions}</span></div>
                      <div><span className="text-slate-500">Devices used:</span> <span className="text-cyan-300">{rawUser.devices.map(d => d.type).join(', ')}</span></div>
                      <div><span className="text-slate-500">Locations:</span> <span className="text-slate-300">{rawUser.locations.map(l => l.city).join(', ')}</span></div>
                      <div><span className="text-slate-500">Supercookie:</span> <span className="text-green-400 font-bold">Resolved — {rawUser.devices.length} device{rawUser.devices.length !== 1 ? 's' : ''} unified</span></div>
                    </div>
                  </div>
                </div>
                {/* Step 3: Conversion */}
                <div className="flex items-start gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">3</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-emerald-300 mb-1">Last Touch — Conversion</div>
                    <div className="rounded-lg border border-emerald-500/30 p-3 bg-emerald-500/5 text-[10px] space-y-1">
                      <div><span className="text-slate-500">Transactions:</span> <span className="text-emerald-400 font-bold">{rawUser.totalTransactions}</span></div>
                      <div><span className="text-slate-500">Total spent:</span> <span className="text-emerald-400 font-bold">${rawUser.totalSpent.toFixed(2)}</span></div>
                      {rawUser.transactions[0] && (
                        <>
                          <div><span className="text-slate-500">Last product:</span> <span className="text-slate-300">{rawUser.transactions[0].product}</span></div>
                          <div><span className="text-slate-500">Last conversion device:</span> <span className="text-slate-300">{rawUser.transactions[0].deviceId}</span></div>
                          <div><span className="text-slate-500">Attribution source:</span> <span className="text-blue-300">{rawUser.transactions[0].campaignSource}</span></div>
                        </>
                      )}
                      <div><span className="text-slate-500">Conversion rate:</span> <span className="text-amber-400 font-bold">{rawUser.conversionRate}%</span></div>
                      <div><span className="text-slate-500">Last seen:</span> <span className="text-slate-300">{rawUser.lastSeen}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
