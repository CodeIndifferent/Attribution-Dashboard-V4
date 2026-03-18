/*
 * USERS & SESSIONS DASHBOARD PAGE — Restructured with 3 tabs
 * Tab 1: Overview — existing KPIs, charts, and user table
 * Tab 2: User Details — All Users / Active Campaigns / Expired Campaigns sub-sections
 * Tab 3: User Journey — JourneyCommandCenter + UserJourneysDetail combined
 */
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Cell,
} from 'recharts';
import { userSessionsData, dailyActivityData } from '@/lib/dashboardSampleData';
import { usersData } from '@/lib/userData';
import { mockTrackableLinks } from '@/lib/trackableLinkData';
import {
  Users, Activity, TrendingUp, Clock, Zap, ArrowLeft,
  ChevronRight, ChevronDown, Link2, CheckCircle2, XCircle,
  AlertTriangle, Network, User as UserIcon,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import UserProfileTabs from './UserProfileTabs';
import JourneyCommandCenter from '@/components/JourneyCommandCenter';
import UserJourneysDetail from './UserJourneysDetail';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─── Normalize raw usersData User → UserProfileTabs shape ────────────────────
function normalizeUser(raw: any): { name: string; email: string; location: string; device: string; sessions: number; conversions: number; revenue: number; status: string } {
  // If already in the flat shape (from userSessionsData), return as-is
  if (typeof raw.location === 'string' && typeof raw.device === 'string') {
    return {
      name: raw.name,
      email: raw.email,
      location: raw.location,
      device: raw.device,
      sessions: raw.sessions ?? 0,
      conversions: raw.conversions ?? 0,
      revenue: raw.revenue ?? 0,
      status: raw.status ?? 'Active',
    };
  }
  // Otherwise it's a usersData User with nested fields
  const city = raw.primaryLocation?.city ?? '';
  const country = raw.primaryLocation?.country ?? '';
  const primaryDevice = raw.devices?.[0];
  const deviceLabel = primaryDevice
    ? `${primaryDevice.type} — ${primaryDevice.browser} on ${primaryDevice.os}`
    : 'Unknown Device';
  return {
    name: raw.name ?? raw.userId ?? 'Unknown',
    email: raw.email ?? '',
    location: [city, country].filter(Boolean).join(', ') || 'Unknown',
    device: deviceLabel,
    sessions: raw.totalSessions ?? 0,
    conversions: raw.totalTransactions ?? 0,
    revenue: raw.totalSpent ?? raw.lifetimeValue ?? 0,
    status: raw.lastSeen ? 'Active' : 'Inactive',
  };
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">
        {payload[0]?.payload?.date || payload[0]?.payload?.name}
      </div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-5 py-2.5 rounded-lg text-sm font-bold transition-all border',
        active
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/50 shadow-lg'
          : 'text-blue-300/60 border-transparent hover:text-blue-300 hover:border-slate-700/50'
      )}
    >
      {children}
    </button>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ onUserClick }: { onUserClick: (user: any) => void }) {
  const totalSessions = userSessionsData.reduce((sum, u) => sum + u.sessions, 0);
  const totalConversions = userSessionsData.reduce((sum, u) => sum + u.conversions, 0);
  const totalRevenue = userSessionsData.reduce((sum, u) => sum + u.revenue, 0);
  const avgSessionValue = totalRevenue / totalSessions;

  const sessionData = dailyActivityData.map(d => ({ date: d.date, sessions: d.sessions, users: d.users }));
  const topUsersData = [...userSessionsData].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: userSessionsData.length, sub: 'Sample users', color: 'cyan', Icon: Users },
          { label: 'Total Sessions', value: totalSessions, sub: 'All users', color: 'green', Icon: Activity },
          { label: 'Conversions', value: totalConversions, sub: 'From sessions', color: 'purple', Icon: TrendingUp },
          { label: 'Avg Session Value', value: `$${avgSessionValue.toFixed(2)}`, sub: 'Per session', color: 'orange', Icon: Clock },
        ].map(({ label, value, sub, color, Icon }) => (
          <div key={label} className={`rounded-lg border border-${color}-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-${color}-500/50 transition-all`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${color}-400 to-${color === 'cyan' ? 'blue' : color === 'purple' ? 'pink' : color === 'orange' ? 'red' : 'emerald'}-500 flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-xs font-bold text-${color}-400/70 uppercase tracking-wider`}>{label}</p>
            </div>
            <p className={`text-3xl font-black text-${color}-${color === 'cyan' ? '300' : '400'}`}>{value}</p>
            <p className={`text-xs text-${color}-300/60 mt-2`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-white" /></div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300">Sessions & Users Trend</h3>
                <p className="text-xs text-blue-300/60">Last 30 days activity</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={sessionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(14,165,233,0.15)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(148,163,184,0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(148,163,184,0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="sessions" stroke="#00d9ff" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10"><div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <div>
                <h3 className="text-sm font-bold text-green-300">Top Users by Revenue</h3>
                <p className="text-xs text-green-300/60">Highest revenue generators</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topUsersData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(16,185,129,0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'rgba(148,163,184,0.8)', fontSize: 11 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'rgba(148,163,184,0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.1)' }} />
                <Bar dataKey="revenue" radius={[12, 12, 0, 0]}>
                  {topUsersData.map((_, i) => (
                    <Cell key={i} fill={['#10b981', '#06b6d4', '#0ea5e9', '#8b5cf6', '#f59e0b'][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Users className="w-4 h-4 text-white" /></div>
          <div>
            <h3 className="text-sm font-bold text-cyan-300">User Details</h3>
            <p className="text-xs text-cyan-300/60 mt-0.5">Click on any user row to view their profile</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                {['Name', 'Email', 'Sessions', 'Conversions', 'Revenue', 'Device', 'Status'].map(h => (
                  <th key={h} className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {userSessionsData.map((user, i) => (
                <tr
                  key={i}
                  onClick={() => onUserClick(user)}
                  className="hover:bg-cyan-500/10 transition-all cursor-pointer group border-l-4 border-transparent hover:border-cyan-500"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-cyan-300 group-hover:text-cyan-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-blue-300/70 font-mono text-xs">{user.email}</td>
                  <td className="py-4 px-6 text-slate-300 font-mono font-bold">{user.sessions}</td>
                  <td className="py-4 px-6 text-emerald-400 font-mono font-bold">{user.conversions}</td>
                  <td className="py-4 px-6 text-amber-400 font-mono font-bold">${user.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <Badge className="text-[9px] px-2 py-0.5 bg-slate-800/50 text-blue-300 border-slate-700/50">{user.device || 'Desktop'}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={cn('text-[9px] px-2 py-0.5', user.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600/30')}>
                      {user.status || 'Active'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── User Details Tab ─────────────────────────────────────────────────────────
function UserDetailsTab({ onUserClick }: { onUserClick: (user: any) => void }) {
  const [subTab, setSubTab] = useState<'all' | 'active' | 'expired'>('all');
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  const activeLinks = mockTrackableLinks.filter(l => l.status === 'Active');
  const expiredLinks = mockTrackableLinks.filter(l => l.status === 'Expired');

  // Map usersData to the display format
  const allUsers = usersData.map(u => ({
    id: u.userId,
    name: u.name,
    email: u.email,
    city: u.primaryLocation.city,
    country: u.primaryLocation.country,
    sessions: u.totalSessions,
    transactions: u.totalTransactions,
    spent: u.totalSpent,
    campaign: u.acquisitionCampaign,
    convRate: u.conversionRate,
    firstSeen: u.firstSeen,
    lastSeen: u.lastSeen,
    devices: u.devices.length,
    raw: u,
  }));

  // Build per-campaign user lists from acquisitionCampaign field
  const campaignUserMap: Record<string, typeof allUsers> = {};
  allUsers.forEach(u => {
    if (!campaignUserMap[u.campaign]) campaignUserMap[u.campaign] = [];
    campaignUserMap[u.campaign].push(u);
  });

  const subBtnClass = (active: boolean) => cn(
    'px-4 py-1.5 rounded-lg text-xs font-bold transition-all border',
    active
      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      : 'text-slate-400 border-slate-700/30 hover:text-slate-200 hover:border-slate-600/50'
  );

  return (
    <div className="space-y-5">
      {/* Sub-tab selector */}
      <div className="flex gap-2 flex-wrap">
        <button className={subBtnClass(subTab === 'all')} onClick={() => setSubTab('all')}>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />All Users</span>
        </button>
        <button className={subBtnClass(subTab === 'active')} onClick={() => setSubTab('active')}>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" />Active Campaigns</span>
        </button>
        <button className={subBtnClass(subTab === 'expired')} onClick={() => setSubTab('expired')}>
          <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-red-400" />Expired Campaigns</span>
        </button>
      </div>

      {/* All Users */}
      {subTab === 'all' && (
        <div className="rounded-xl border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Users className="w-4 h-4 text-white" /></div>
            <div>
              <h3 className="text-sm font-bold text-cyan-300">All Users</h3>
              <p className="text-xs text-cyan-300/60">{allUsers.length} users across all campaigns</p>
            </div>
          </div>
          <div className="divide-y divide-cyan-500/10">
            {allUsers.map(u => (
              <div
                key={u.id}
                onClick={() => onUserClick(u.raw)}
                className="p-5 hover:bg-cyan-500/10 transition-all cursor-pointer group border-l-4 border-transparent hover:border-cyan-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-cyan-300 group-hover:text-cyan-200">{u.name}</span>
                        <span className="text-xs font-mono text-slate-500">{u.id}</span>
                      </div>
                      <div className="text-xs text-blue-300/60 font-mono mb-2">{u.email}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="text-[9px] px-2 py-0.5 bg-slate-800/50 text-blue-300 border-slate-700/50">{u.city}, {u.country}</Badge>
                        <Badge className="text-[9px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{u.sessions} sessions</Badge>
                        <Badge className="text-[9px] px-2 py-0.5 bg-purple-500/20 text-purple-300 border-purple-500/30">{u.devices} device{u.devices !== 1 ? 's' : ''}</Badge>
                        <Badge className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-300 border-blue-500/30">{u.campaign}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-lg font-black text-emerald-400 font-mono">${u.spent.toFixed(0)}</div>
                    <div className="text-xs text-slate-500 mt-1">{u.transactions} purchase{u.transactions !== 1 ? 's' : ''}</div>
                    <div className="text-xs text-amber-400 mt-1">{u.convRate}% CVR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      {subTab === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-slate-200">Active Campaign Links</h3>
            <span className="text-[10px] text-slate-500 ml-auto">Click a link to see its users</span>
          </div>
          {activeLinks.map(link => {
            const expanded = expandedLink === link.id;
            // Assign users to this link based on campaign names matching
            const linkCampaignNames = link.campaigns.map(c => c.campaignName.toLowerCase());
            const linkUsers = allUsers.filter(u =>
              linkCampaignNames.some(cn => u.campaign.toLowerCase().includes(cn.split(' ')[0].toLowerCase()))
            );
            // Fallback: show all users if no match
            const displayUsers = linkUsers.length > 0 ? linkUsers : allUsers.slice(0, 3);

            return (
              <div key={link.id} className={cn('rounded-xl border transition-all overflow-hidden', expanded ? 'border-green-500/40 bg-slate-800/60' : 'border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50')}>
                <button
                  onClick={() => setExpandedLink(expanded ? null : link.id)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-100">{link.name}</span>
                      <Badge className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                      <span className="text-[10px] font-mono text-slate-500">{link.shortCode}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400">
                      <span>{link.campaigns.length} campaigns</span>
                      <span className="text-cyan-400 font-mono font-bold">{link.totalClicks.toLocaleString()} clicks</span>
                      <span className="text-emerald-400 font-mono font-bold">{link.totalConversions.toLocaleString()} conv.</span>
                      <span className="text-amber-400 font-mono font-bold">${(link.totalRevenue / 1000).toFixed(0)}K revenue</span>
                    </div>
                  </div>
                  {expanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {expanded && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Campaigns under this link */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Campaigns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {link.campaigns.map(c => (
                          <div key={c.campaignId} className="p-3 rounded-lg border border-slate-700/30 bg-slate-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-200">{c.campaignName}</span>
                              <Badge className={cn('text-[8px] px-1.5 py-0', c.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600/30')}>{c.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div><span className="text-slate-500">Channel</span><div className="text-blue-300 font-semibold">{c.channel}</div></div>
                              <div><span className="text-slate-500">ROI</span><div className="text-amber-400 font-mono font-bold">{c.roi}x</div></div>
                              <div><span className="text-slate-500">Revenue</span><div className="text-emerald-400 font-mono font-bold">${(c.revenue / 1000).toFixed(0)}K</div></div>
                              <div><span className="text-slate-500">Conv.</span><div className="text-cyan-400 font-mono font-bold">{c.conversions.toLocaleString()}</div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Users for this link */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Users from this link ({displayUsers.length})
                      </h4>
                      <div className="rounded-lg border border-slate-700/30 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-700/30 bg-slate-800/50">
                              {['User', 'Location', 'Sessions', 'Spent', 'CVR', 'Campaign'].map(h => (
                                <th key={h} className="text-left py-3 px-4 font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {displayUsers.map(u => (
                              <tr
                                key={u.id}
                                onClick={() => onUserClick(u.raw)}
                                className="hover:bg-cyan-500/10 transition-all cursor-pointer group"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <span className="text-cyan-300 font-semibold group-hover:text-cyan-200">{u.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-400">{u.city}</td>
                                <td className="py-3 px-4 text-slate-300 font-mono font-bold">{u.sessions}</td>
                                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">${u.spent.toFixed(0)}</td>
                                <td className="py-3 px-4 text-amber-400 font-mono font-bold">{u.convRate}%</td>
                                <td className="py-3 px-4 text-blue-300">{u.campaign}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Expired Campaigns */}
      {subTab === 'expired' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">Expired Campaign Links</h3>
            <span className="text-[10px] text-slate-500 ml-auto">Historical data — click a link to see its users</span>
          </div>
          {expiredLinks.length === 0 && (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-8 text-center text-slate-500 text-sm">
              No expired campaigns found.
            </div>
          )}
          {expiredLinks.map(link => {
            const expanded = expandedLink === link.id;
            const displayUsers = allUsers.slice(0, 4); // Historical users

            return (
              <div key={link.id} className={cn('rounded-xl border transition-all overflow-hidden', expanded ? 'border-amber-500/40 bg-slate-800/60' : 'border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50')}>
                <button
                  onClick={() => setExpandedLink(expanded ? null : link.id)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-300">{link.name}</span>
                      <Badge className="text-[9px] px-2 py-0.5 bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>
                      <span className="text-[10px] font-mono text-slate-500">{link.shortCode}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      <span>{link.campaigns.length} campaigns</span>
                      <span className="font-mono font-bold">{link.totalClicks.toLocaleString()} clicks</span>
                      <span className="text-emerald-500/70 font-mono font-bold">{link.totalConversions.toLocaleString()} conv.</span>
                      <span className="text-amber-500/70 font-mono font-bold">${(link.totalRevenue / 1000).toFixed(0)}K revenue</span>
                      <span className="text-red-400/70">Expired {link.expiresAt}</span>
                    </div>
                  </div>
                  {expanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {expanded && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Campaigns */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Completed Campaigns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {link.campaigns.map(c => (
                          <div key={c.campaignId} className="p-3 rounded-lg border border-slate-700/30 bg-slate-800/50 opacity-80">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-300">{c.campaignName}</span>
                              <Badge className="text-[8px] px-1.5 py-0 bg-slate-700/50 text-slate-400 border-slate-600/30">Completed</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div><span className="text-slate-500">Channel</span><div className="text-slate-400 font-semibold">{c.channel}</div></div>
                              <div><span className="text-slate-500">ROI</span><div className="text-amber-500/80 font-mono font-bold">{c.roi}x</div></div>
                              <div><span className="text-slate-500">Revenue</span><div className="text-emerald-500/80 font-mono font-bold">${(c.revenue / 1000).toFixed(0)}K</div></div>
                              <div><span className="text-slate-500">Conv.</span><div className="text-cyan-500/80 font-mono font-bold">{c.conversions.toLocaleString()}</div></div>
                            </div>
                            {c.endDate && <div className="text-[9px] text-slate-600 mt-2">Ended {c.endDate}</div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Historical Users */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Historical Users ({link.totalConversions.toLocaleString()} conversions total)
                      </h4>
                      <div className="rounded-lg border border-slate-700/30 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-700/30 bg-slate-800/50">
                              {['User', 'Location', 'Sessions', 'Spent', 'CVR', 'Campaign'].map(h => (
                                <th key={h} className="text-left py-3 px-4 font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {displayUsers.map(u => (
                              <tr
                                key={u.id}
                                onClick={() => onUserClick(u.raw)}
                                className="hover:bg-slate-700/20 transition-all cursor-pointer group opacity-75"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <span className="text-slate-400 font-semibold">{u.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-500">{u.city}</td>
                                <td className="py-3 px-4 text-slate-400 font-mono font-bold">{u.sessions}</td>
                                <td className="py-3 px-4 text-emerald-500/70 font-mono font-bold">${u.spent.toFixed(0)}</td>
                                <td className="py-3 px-4 text-amber-500/70 font-mono font-bold">{u.convRate}%</td>
                                <td className="py-3 px-4 text-slate-500">{u.campaign}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-slate-700/20 bg-slate-800/30 text-[10px] text-slate-500 text-center">
                          Showing sample users — {link.totalConversions.toLocaleString()} total conversions recorded for this link
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── User Journey Tab ─────────────────────────────────────────────────────────
function UserJourneyTab() {
  const [view, setView] = useState<'intelligence' | 'profiles'>('intelligence');
  const [showUserJourneys, setShowUserJourneys] = useState(false);

  if (showUserJourneys) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowUserJourneys(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Journey Intelligence
        </button>
        <UserJourneysDetail onBack={() => setShowUserJourneys(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* View switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('intelligence')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border',
            view === 'intelligence'
              ? 'bg-blue-900/40 text-blue-200 border-blue-500/40 shadow-md'
              : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:text-slate-200 hover:border-slate-600/50'
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          Journey Intelligence
        </button>
        <button
          onClick={() => setView('profiles')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border',
            view === 'profiles'
              ? 'bg-cyan-900/40 text-cyan-200 border-cyan-500/40 shadow-md'
              : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:text-slate-200 hover:border-slate-600/50'
          )}
        >
          <Network className="w-3.5 h-3.5" />
          User Journey Profiles
        </button>
      </div>

      {view === 'intelligence' && (
        <div className="space-y-5">
          {/* Journey Intelligence Command Center from Orbital */}
          <JourneyCommandCenter />

          {/* CTA to User Journey Profiles */}
          <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-900/10 to-slate-900 p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-cyan-200">Explore Individual User Journeys</h4>
              </div>
              <p className="text-xs text-slate-400">
                Drill into specific user profiles — view their Web2 activity, Web3 wallet, cross-device paths, and conversion history.
              </p>
            </div>
            <button
              onClick={() => setShowUserJourneys(true)}
              className="ml-4 shrink-0 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
            >
              <UserIcon className="w-3.5 h-3.5" />
              View Profiles
            </button>
          </div>
        </div>
      )}

      {view === 'profiles' && (
        <div className="space-y-5">
          {/* CTA back to intelligence */}
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-900/10 to-slate-900 p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-blue-200">Journey Intelligence Command Center</h4>
              </div>
              <p className="text-xs text-slate-400">
                View campaign-level conversion paths, drop-off analysis, and the global funnel across all acquisition channels.
              </p>
            </div>
            <button
              onClick={() => setView('intelligence')}
              className="ml-4 shrink-0 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5" />
              View Intelligence
            </button>
          </div>

          {/* User Journey Profiles from the old User Journeys page */}
          <UserJourneysDetail onBack={() => setView('intelligence')} />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardUsers() {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'journey'>('overview');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleUserClick = (user: any) => setSelectedUser(user);
  const handleBack = () => setSelectedUser(null);

  // User profile drilldown (from any tab)
  if (selectedUser) {
    const normalizedUser = normalizeUser(selectedUser);
    // Pass the raw usersData User if available (has devices[] array = from usersData)
    // or look it up by email/name from usersData for flat userSessionsData users
    const rawUserForProfile = Array.isArray(selectedUser.devices)
      ? selectedUser
      : usersData.find(u => u.email === selectedUser.email || u.name === selectedUser.name);
    return (
      <DashboardLayout title={`${normalizedUser.name} — User Profile`} subtitle="View user overview, Web2 activity, and Web3 portfolio">
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users
          </button>
          <UserProfileTabs user={normalizedUser} rawUser={rawUserForProfile} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Users & Sessions" subtitle="Track user engagement, session performance, and journey paths across all channels">
      <div className="space-y-6">

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-700/40 pb-1">
          <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" />Overview</span>
          </TabBtn>
          <TabBtn active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
            <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />User Details</span>
          </TabBtn>
          <TabBtn active={activeTab === 'journey'} onClick={() => setActiveTab('journey')}>
            <span className="flex items-center gap-2"><Network className="w-3.5 h-3.5" />User Journey</span>
          </TabBtn>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab onUserClick={handleUserClick} />}
        {activeTab === 'details' && <UserDetailsTab onUserClick={handleUserClick} />}
        {activeTab === 'journey' && <UserJourneyTab />}

      </div>
    </DashboardLayout>
  );
}
