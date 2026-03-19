/*
 * Users & Sessions panel — Orbital Command Profiles tab + Users & Sessions Overview tab
 * Dark orbital card format with search, filter, and sort controls
 * "View Profile" opens the full UserProfileTabs drilldown inline
 */
import { useState, useMemo } from 'react';
import {
  Users, ArrowLeft, MapPin, Smartphone, Activity, TrendingUp, Clock,
  ExternalLink, Search, SlidersHorizontal, X, ChevronDown,
} from 'lucide-react';
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

// ─── Avatar color by original index ──────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'from-cyan-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-red-500',
];

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'revenue_desc', label: 'Revenue: High → Low' },
  { value: 'revenue_asc',  label: 'Revenue: Low → High' },
  { value: 'sessions_desc', label: 'Sessions: High → Low' },
  { value: 'sessions_asc',  label: 'Sessions: Low → High' },
  { value: 'cvr_desc',     label: 'CVR: High → Low' },
  { value: 'cvr_asc',      label: 'CVR: Low → High' },
  { value: 'name_asc',     label: 'Name: A → Z' },
  { value: 'name_desc',    label: 'Name: Z → A' },
];

// ─── User Card ────────────────────────────────────────────────────────────────
function UserCard({
  user, originalIdx, onViewProfile,
}: {
  user: typeof usersData[0];
  originalIdx: number;
  onViewProfile: (u: typeof usersData[0]) => void;
}) {
  const city = user.primaryLocation?.city ?? '';
  const country = user.primaryLocation?.country ?? '';
  const primaryDevice = user.devices?.[0];
  const deviceLabel = primaryDevice
    ? `${primaryDevice.type} — ${primaryDevice.browser} on ${primaryDevice.os}`
    : 'Unknown Device';
  const gradient = AVATAR_GRADIENTS[originalIdx % AVATAR_GRADIENTS.length];

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
          <div className="text-right">
            <div className="text-lg font-black text-emerald-400 font-mono">${user.totalSpent.toFixed(0)}</div>
            <div className="text-[10px] text-slate-500">{user.totalTransactions} purchase{user.totalTransactions !== 1 ? 's' : ''}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-400">{user.conversionRate}% CVR</div>
            <div className="text-[10px] text-slate-500">conv. rate</div>
          </div>
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

// ─── Filter Pill ──────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all',
        active
          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
          : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-300 hover:border-slate-600/50'
      )}
    >
      {label}
    </button>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function UsersSessionsPanel() {
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);

  // Search & filter state
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatus]   = useState<'All' | 'Active' | 'Inactive'>('All');
  const [deviceFilter, setDevice]   = useState<'All' | 'Desktop' | 'Mobile' | 'Tablet'>('All');
  const [campaignFilter, setCampaign] = useState<string>('All');
  const [sortBy, setSortBy]         = useState('revenue_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort]     = useState(false);

  // Unique campaigns for filter pills
  const campaigns = useMemo(() => {
    const set = new Set(usersData.map(u => u.acquisitionCampaign));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered + sorted users
  const filtered = useMemo(() => {
    let list = usersData.map((u, i) => ({ user: u, originalIdx: i }));

    // Text search: name, email, userId, city, campaign
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(({ user: u }) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q) ||
        u.primaryLocation.city.toLowerCase().includes(q) ||
        u.acquisitionCampaign.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter(({ user: u }) => (u.lastSeen ? 'Active' : 'Inactive') === statusFilter);
    }

    // Device type filter (based on primary device type)
    if (deviceFilter !== 'All') {
      list = list.filter(({ user: u }) => {
        const type = u.devices?.[0]?.type?.toLowerCase() ?? '';
        if (deviceFilter === 'Desktop') return type.includes('macbook') || type.includes('dell') || type.includes('desktop') || type.includes('pc') || type.includes('xps') || type.includes('thinkpad');
        if (deviceFilter === 'Mobile') return type.includes('iphone') || type.includes('android') || type.includes('oneplus') || type.includes('samsung') || type.includes('pixel');
        if (deviceFilter === 'Tablet') return type.includes('ipad') || type.includes('tablet');
        return true;
      });
    }

    // Campaign filter
    if (campaignFilter !== 'All') {
      list = list.filter(({ user: u }) => u.acquisitionCampaign === campaignFilter);
    }

    // Sort
    list.sort((a, b) => {
      const ua = a.user, ub = b.user;
      switch (sortBy) {
        case 'revenue_desc':  return ub.totalSpent - ua.totalSpent;
        case 'revenue_asc':   return ua.totalSpent - ub.totalSpent;
        case 'sessions_desc': return ub.totalSessions - ua.totalSessions;
        case 'sessions_asc':  return ua.totalSessions - ub.totalSessions;
        case 'cvr_desc':      return ub.conversionRate - ua.conversionRate;
        case 'cvr_asc':       return ua.conversionRate - ub.conversionRate;
        case 'name_asc':      return ua.name.localeCompare(ub.name);
        case 'name_desc':     return ub.name.localeCompare(ua.name);
        default:              return 0;
      }
    });

    return list;
  }, [query, statusFilter, deviceFilter, campaignFilter, sortBy]);

  // Active filter count (excluding sort)
  const activeFilterCount = [
    statusFilter !== 'All',
    deviceFilter !== 'All',
    campaignFilter !== 'All',
  ].filter(Boolean).length;

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
        <UserProfileTabs user={normalized} rawUser={selectedUser} />
      </div>
    );
  }

  // ── KPI strip ──
  const totalSessions = usersData.reduce((s, u) => s + u.totalSessions, 0);
  const totalConversions = usersData.reduce((s, u) => s + u.totalTransactions, 0);
  const avgCVR = usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length;

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort';

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',    value: usersData.length,                  sub: 'Tracked profiles',  color: 'cyan',    Icon: Users },
          { label: 'Total Sessions', value: totalSessions.toLocaleString(),    sub: 'All users',         color: 'blue',    Icon: Activity },
          { label: 'Conversions',    value: totalConversions,                  sub: 'Purchase events',   color: 'emerald', Icon: TrendingUp },
          { label: 'Avg CVR',        value: `${avgCVR.toFixed(1)}%`,           sub: 'Conversion rate',   color: 'amber',   Icon: Clock },
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

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40 space-y-3">
          {/* Title row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300">User Profiles</h3>
                <p className="text-xs text-cyan-300/60">
                  {filtered.length} of {usersData.length} user{usersData.length !== 1 ? 's' : ''} — click View Profile to see full details
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Filter toggle */}
              <button
                onClick={() => { setShowFilters(v => !v); setShowSort(false); }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  showFilters || activeFilterCount > 0
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-300'
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-500 text-white leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowSort(v => !v); setShowFilters(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-300 transition-all"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  {currentSortLabel}
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-xs font-medium transition-all hover:bg-cyan-500/10',
                          sortBy === opt.value ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-400'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear all filters */}
              {(activeFilterCount > 0 || query) && (
                <button
                  onClick={() => { setQuery(''); setStatus('All'); setDevice('All'); setCampaign('All'); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Search bar ── */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, email, user ID, city, or campaign…"
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:bg-slate-800/80 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ── Filter pills (shown when expanded) ── */}
          {showFilters && (
            <div className="space-y-3 pt-1">
              {/* Status */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['All', 'Active', 'Inactive'] as const).map(s => (
                    <FilterPill key={s} label={s} active={statusFilter === s} onClick={() => setStatus(s)} />
                  ))}
                </div>
              </div>
              {/* Device */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Device Type</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['All', 'Desktop', 'Mobile', 'Tablet'] as const).map(d => (
                    <FilterPill key={d} label={d} active={deviceFilter === d} onClick={() => setDevice(d)} />
                  ))}
                </div>
              </div>
              {/* Campaign */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Acquisition Campaign</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {campaigns.map(c => (
                    <FilterPill key={c} label={c} active={campaignFilter === c} onClick={() => setCampaign(c)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Cards ── */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-cyan-500/10">
            {filtered.map(({ user, originalIdx }) => (
              <UserCard
                key={user.userId}
                user={user}
                originalIdx={originalIdx}
                onViewProfile={setSelectedUser}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-400">No users match your search</p>
            <p className="text-xs text-slate-600">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setQuery(''); setStatus('All'); setDevice('All'); setCampaign('All'); }}
              className="mt-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
