/*
 * USER OVERVIEW PAGE - Vibrant dark orbital theme
 * High-level summary of user activity across Web2 and Web3
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Activity, Wallet, DollarSign, Globe, Zap, Calendar, MapPin, Smartphone } from 'lucide-react';

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

export default function UserOverview({ user }: UserOverviewProps) {
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
    </div>
  );
}
