/*
 * Users & Sessions panel — Orbital Command Profiles tab
 * Matches the dark card format of Users & Sessions > Overview > User Details
 * with a "View Profile" button that opens the full UserProfileTabs drilldown
 */
import { useState } from 'react';
import { Users, ArrowLeft, MapPin, Smartphone, Activity, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usersData } from '@/lib/userData';
import UserProfileTabs from '@/pages/UserProfileTabs';

// ─── Normalize usersData User → UserProfileTabs shape ────────────────────────
function normalizeUser(raw: any) {
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

// ─── Avatar initials helper ───────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Avatar color by index ────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'from-cyan-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-red-500',
];

// ─── User Card ────────────────────────────────────────────────────────────────
function UserCard({ user, idx, onViewProfile }: { user: typeof usersData[0]; idx: number; onViewProfile: (u: typeof usersData[0]) => void }) {
  const city = user.primaryLocation?.city ?? '';
  const country = user.primaryLocation?.country ?? '';
  const primaryDevice = user.devices?.[0];
  const deviceLabel = primaryDevice
    ? `${primaryDevice.type} — ${primaryDevice.browser} on ${primaryDevice.os}`
    : 'Unknown Device';
  const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

  return (
    <div className="p-5 hover:bg-cyan-500/5 transition-all group border-l-4 border-transparent hover:border-cyan-500 border-b border-cyan-500/10 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar + identity */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={cn('w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg', gradient)}>
            {initials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            {/* Name + ID */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">{user.name}</span>
              <span className="text-xs font-mono text-slate-500">{user.userId}</span>
            </div>
            {/* Email */}
            <div className="text-xs text-blue-300/60 font-mono mb-2 truncate">{user.email}</div>
            {/* Badges row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="text-[9px] px-2 py-0.5 bg-slate-800/60 text-slate-300 border-slate-700/50 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{city}, {country}
              </Badge>
              <Badge className="text-[9px] px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border-cyan-500/30 flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" />{user.totalSessions} sessions
              </Badge>
              <Badge className="text-[9px] px-2 py-0.5 bg-purple-500/15 text-purple-300 border-purple-500/30 flex items-center gap-1">
                <Smartphone className="w-2.5 h-2.5" />{user.devices.length} device{user.devices.length !== 1 ? 's' : ''}
              </Badge>
              <Badge className="text-[9px] px-2 py-0.5 bg-blue-500/15 text-blue-300 border-blue-500/30">
                {user.acquisitionCampaign}
              </Badge>
              <Badge className={cn('text-[9px] px-2 py-0.5', user.lastSeen ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600/30')}>
                {user.lastSeen ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {/* Device label */}
            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
              <Smartphone className="w-3 h-3" />{deviceLabel}
            </div>
          </div>
        </div>

        {/* Right: Stats + View Profile */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Revenue */}
          <div className="text-right">
            <div className="text-lg font-black text-emerald-400 font-mono">${user.totalSpent.toFixed(0)}</div>
            <div className="text-[10px] text-slate-500">{user.totalTransactions} purchase{user.totalTransactions !== 1 ? 's' : ''}</div>
          </div>
          {/* CVR */}
          <div className="text-right">
            <div className="text-xs font-bold text-amber-400">{user.conversionRate}% CVR</div>
            <div className="text-[10px] text-slate-500">conv. rate</div>
          </div>
          {/* View Profile button */}
          <button
            onClick={() => onViewProfile(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-400/50 hover:text-cyan-200 transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function UsersSessionsPanel() {
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);

  // ── Profile drilldown ──
  if (selectedUser) {
    const normalized = normalizeUser(selectedUser);
    return (
      <div className="space-y-5">
        <button
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Profiles
        </button>
        <UserProfileTabs user={normalized} />
      </div>
    );
  }

  // ── KPI strip ──
  const totalSessions = usersData.reduce((s, u) => s + u.totalSessions, 0);
  const totalRevenue = usersData.reduce((s, u) => s + u.totalSpent, 0);
  const totalConversions = usersData.reduce((s, u) => s + u.totalTransactions, 0);
  const avgCVR = usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length;

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: usersData.length, sub: 'Tracked profiles', color: 'cyan', Icon: Users },
          { label: 'Total Sessions', value: totalSessions.toLocaleString(), sub: 'All users', color: 'blue', Icon: Activity },
          { label: 'Conversions', value: totalConversions, sub: 'Purchase events', color: 'emerald', Icon: TrendingUp },
          { label: 'Avg CVR', value: `${avgCVR.toFixed(1)}%`, sub: 'Conversion rate', color: 'amber', Icon: Clock },
        ].map(({ label, value, sub, color, Icon }) => (
          <div key={label} className={`rounded-xl border border-${color}-500/30 p-4 bg-gradient-to-br from-slate-900/70 to-slate-900/40 backdrop-blur-md`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${color}-400 to-${color === 'cyan' ? 'blue' : color === 'blue' ? 'indigo' : color === 'emerald' ? 'teal' : 'orange'}-500 flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className={`text-[10px] font-bold text-${color}-400/70 uppercase tracking-wider`}>{label}</p>
            </div>
            <p className={`text-2xl font-black text-${color}-300 font-mono`}>{value}</p>
            <p className={`text-[10px] text-${color}-300/50 mt-1`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* User Cards List */}
      <div className="rounded-xl border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-300">User Profiles</h3>
            <p className="text-xs text-cyan-300/60">{usersData.length} users — click View Profile to see full details</p>
          </div>
        </div>

        {/* Cards */}
        <div className="divide-y divide-cyan-500/10">
          {usersData.map((user, idx) => (
            <UserCard
              key={user.userId}
              user={user}
              idx={idx}
              onViewProfile={setSelectedUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
