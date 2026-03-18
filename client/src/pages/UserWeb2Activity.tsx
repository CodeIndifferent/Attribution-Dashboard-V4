/*
 * USER WEB2 ACTIVITY PAGE - Vibrant dark orbital theme
 * Displays Web2 user engagement, session history, and conversion data
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Globe, Activity, TrendingUp, Clock, MapPin, Smartphone, Eye, MousePointer, ShoppingCart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserWeb2ActivityProps {
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

export default function UserWeb2Activity({ user }: UserWeb2ActivityProps) {
  // Generate sample session history
  const sessionHistory = [
    { date: '2026-03-10', sessions: 3, pageViews: 24, avgDuration: '4m 32s', bounceRate: 12 },
    { date: '2026-03-11', sessions: 2, pageViews: 18, avgDuration: '3m 15s', bounceRate: 15 },
    { date: '2026-03-12', sessions: 4, pageViews: 32, avgDuration: '5m 48s', bounceRate: 8 },
    { date: '2026-03-13', sessions: 2, pageViews: 16, avgDuration: '2m 45s', bounceRate: 20 },
    { date: '2026-03-14', sessions: 5, pageViews: 42, avgDuration: '6m 22s', bounceRate: 5 },
    { date: '2026-03-15', sessions: 3, pageViews: 28, avgDuration: '4m 10s', bounceRate: 10 },
    { date: '2026-03-16', sessions: 4, pageViews: 35, avgDuration: '5m 5s', bounceRate: 9 },
  ];

  const conversionFunnel = [
    { stage: 'Site Visit', users: 847, percentage: 100 },
    { stage: 'Product View', users: 612, percentage: 72.2 },
    { stage: 'Add to Cart', users: 389, percentage: 45.9 },
    { stage: 'Checkout', users: 234, percentage: 27.6 },
    { stage: 'Purchase', users: 156, percentage: 18.4 },
  ];

  const channelBreakdown = [
    { name: 'Organic', value: 35, color: '#10b981' },
    { name: 'Paid Ads', value: 28, color: '#06b6d4' },
    { name: 'Direct', value: 20, color: '#0ea5e9' },
    { name: 'Referral', value: 12, color: '#f59e0b' },
    { name: 'Email', value: 5, color: '#8b5cf6' },
  ];

  const deviceBreakdown = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 40, color: '#06b6d4' },
    { name: 'Tablet', value: 15, color: '#10b981' },
  ];

  const topPages = [
    { page: 'Home', views: 124, avgTime: '2m 34s', bounceRate: 8 },
    { page: 'Product Listing', views: 98, avgTime: '3m 12s', bounceRate: 12 },
    { page: 'Product Detail', views: 87, avgTime: '4m 45s', bounceRate: 5 },
    { page: 'Shopping Cart', views: 56, avgTime: '1m 23s', bounceRate: 35 },
    { page: 'Checkout', views: 42, avgTime: '2m 8s', bounceRate: 18 },
  ];

  const campaignPerformance = [
    { campaign: 'Q1 Launch', clicks: 245, conversions: 32, ctr: 13.1, convRate: 13.1 },
    { campaign: 'Summer Sale', clicks: 189, conversions: 28, ctr: 12.7, convRate: 14.8 },
    { campaign: 'Email Nurture', clicks: 156, conversions: 24, ctr: 15.4, convRate: 15.4 },
    { campaign: 'Retargeting', clicks: 98, conversions: 18, ctr: 18.4, convRate: 18.4 },
  ];

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-cyan-300">{user.name}</h2>
                  <p className="text-sm text-blue-300/70">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-400">${user.revenue}</div>
              <div className="text-xs text-green-300/60 font-semibold mt-1">Total Web2 Revenue</div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase mb-1 font-bold">Location</div>
              <div className="text-sm font-mono text-cyan-300">{user.location}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase mb-1 font-bold">Device</div>
              <div className="text-sm font-mono text-cyan-300">{user.device}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase mb-1 font-bold">Sessions</div>
              <div className="text-sm font-mono text-cyan-300">{user.sessions}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase mb-1 font-bold">Conversions</div>
              <div className="text-sm font-mono text-green-400">{user.conversions}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase mb-1 font-bold">Status</div>
              <div className={`text-xs font-bold ${user.status === 'Active' ? 'text-green-400' : 'text-blue-400'}`}>
                {user.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-cyan-400/70 uppercase">Total Sessions</p>
          </div>
          <p className="text-2xl font-black text-cyan-300">{user.sessions}</p>
          <p className="text-xs text-blue-300/60 mt-2">Last 7 days</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase">Page Views</p>
          </div>
          <p className="text-2xl font-black text-green-400">175</p>
          <p className="text-xs text-green-300/60 mt-2">Total interactions</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase">Conversions</p>
          </div>
          <p className="text-2xl font-black text-purple-400">{user.conversions}</p>
          <p className="text-xs text-purple-300/60 mt-2">Purchase events</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase">Avg Session</p>
          </div>
          <p className="text-2xl font-black text-orange-400">4m 12s</p>
          <p className="text-xs text-orange-300/60 mt-2">Duration</p>
        </div>
      </div>

      {/* Session History Chart */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-cyan-300">Session History</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionHistory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorSessions2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00d9ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="sessions" stroke="#00d9ff" strokeWidth={3} dot={false} animationDuration={800} name="Sessions" />
              <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={800} name="Page Views" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-green-300 mb-6">Traffic by Channel</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={channelBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {channelBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-lg border border-purple-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-purple-300 mb-6">Device Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={deviceBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-cyan-300">Top Pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Page</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Views</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Avg Time</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, idx) => (
                <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all">
                  <td className="py-4 px-6 font-semibold text-cyan-100">{page.page}</td>
                  <td className="text-right py-4 px-6 text-cyan-300">{page.views}</td>
                  <td className="text-right py-4 px-6 text-blue-300/80">{page.avgTime}</td>
                  <td className="text-right py-4 px-6 font-semibold text-orange-400">{page.bounceRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="rounded-lg border border-orange-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-orange-300">Campaign Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradCampaign" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(245, 158, 11, 0.15)" vertical={false} />
              <XAxis dataKey="campaign" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="conversions" fill="url(#gradCampaign)" radius={[8, 8, 0, 0]} animationDuration={800} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
