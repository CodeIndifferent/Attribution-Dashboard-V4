/*
 * USERS & SESSIONS DASHBOARD PAGE - Vibrant dark orbital theme
 * Displays user sessions and engagement metrics with clickable user rows
 */
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { userSessionsData, dailyActivityData } from '@/lib/dashboardSampleData';
import { Users, Activity, TrendingUp, Clock, Zap, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import UserProfileTabs from './UserProfileTabs';

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

export default function DashboardUsers() {
  const [selectedUser, setSelectedUser] = useState<typeof userSessionsData[0] | null>(null);

  const totalSessions = userSessionsData.reduce((sum, u) => sum + u.sessions, 0);
  const totalConversions = userSessionsData.reduce((sum, u) => sum + u.conversions, 0);
  const totalRevenue = userSessionsData.reduce((sum, u) => sum + u.revenue, 0);
  const avgSessionValue = totalRevenue / totalSessions;

  const sessionData = dailyActivityData.map(d => ({
    date: d.date,
    sessions: d.sessions,
    users: d.users,
  }));

  const topUsersData = userSessionsData.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const handleUserClick = (user: typeof userSessionsData[0]) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  // User Profile View with Tabs
  if (selectedUser) {
    return (
      <DashboardLayout title={`${selectedUser.name} - User Profile`} subtitle="View user overview, Web2 activity, and Web3 portfolio">
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users
          </button>
          <UserProfileTabs user={selectedUser} />
        </div>
      </DashboardLayout>
    );
  }

  // Main Users List View
  return (
    <DashboardLayout title="Users & Sessions" subtitle="Track user engagement and session performance across all channels">
      <div className="space-y-6">

      {/* KPI Cards - Vibrant */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">Total Users</p>
          </div>
          <p className="text-3xl font-black text-cyan-300">{userSessionsData.length}</p>
          <p className="text-xs text-blue-300/60 mt-2">Sample users</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase tracking-wider">Total Sessions</p>
          </div>
          <p className="text-3xl font-black text-green-400">{totalSessions}</p>
          <p className="text-xs text-green-300/60 mt-2">All users</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">Conversions</p>
          </div>
          <p className="text-3xl font-black text-purple-400">{totalConversions}</p>
          <p className="text-xs text-purple-300/60 mt-2">From sessions</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase tracking-wider">Avg Session Value</p>
          </div>
          <p className="text-3xl font-black text-orange-400">${avgSessionValue.toFixed(2)}</p>
          <p className="text-xs text-orange-300/60 mt-2">Per session</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Trend */}
        <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300">Sessions & Users Trend</h3>
                <p className="text-xs text-blue-300/60">Last 30 days activity</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sessionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#00d9ff" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="sessions" stroke="#00d9ff" strokeWidth={3} dot={false} animationDuration={800} />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Users by Revenue */}
        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-300">Top Users by Revenue</h3>
                <p className="text-xs text-green-300/60">Highest revenue generators</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topUsersData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRevenue1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorRevenue3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(16, 185, 129, 0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                <Bar dataKey="revenue" radius={[12, 12, 0, 0]} animationDuration={800}>
                  {topUsersData.map((_, i) => (
                    <Cell key={i} fill={[`url(#colorRevenue1)`, `url(#colorRevenue2)`, `url(#colorRevenue3)`][i % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Users Table - Vibrant with Clickable Rows */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-300">User Details</h3>
            <p className="text-xs text-cyan-300/60 mt-0.5">Click on any user row to view their profile</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Location</th>
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Device</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Sessions</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Conversions</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Revenue</th>
                <th className="text-center py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {userSessionsData.map((user, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => handleUserClick(user)}
                  className="border-b border-cyan-500/10 hover:bg-cyan-500/15 transition-all duration-200 group cursor-pointer"
                >
                  <td className="py-4 px-6 font-semibold text-cyan-100 group-hover:text-cyan-200">{user.name}</td>
                  <td className="py-4 px-6 text-blue-300/80 text-xs">{user.email}</td>
                  <td className="py-4 px-6 text-blue-300/80">{user.location}</td>
                  <td className="py-4 px-6 text-blue-300/80">{user.device}</td>
                  <td className="text-right py-4 px-6 text-cyan-300">{user.sessions}</td>
                  <td className="text-right py-4 px-6 text-green-400 font-semibold">{user.conversions}</td>
                  <td className="text-right py-4 px-6 font-bold text-cyan-400">${user.revenue}</td>
                  <td className="text-center py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
