/*
 * DESIGN: Dark Orbital — User profiles table with expandable rows and journey timeline
 */
import { useState } from "react";
import { userProfiles, UserProfile } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  Users, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Circle,
  Monitor, Smartphone, Mail, Globe, Tag, DollarSign, Clock, MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  resolved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Resolved' },
  fragmented: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Fragmented' },
  pending: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Pending' },
};

const channelColors: Record<string, string> = {
  'Organic Search': '#3b82f6',
  'Paid Search': '#8b5cf6',
  'Paid Social': '#f59e0b',
  'Email': '#10b981',
  'Organic Social': '#06b6d4',
  'Referral': '#f43f5e',
  'Direct': '#64748b',
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all",
            value > 80 ? "bg-emerald-400" : value > 60 ? "bg-amber-400" : "bg-slate-400"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[11px] font-mono text-white/60">{value}%</span>
    </div>
  );
}

function TouchpointTimeline({ profile }: { profile: UserProfile }) {
  return (
    <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.05]">
      <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">User Journey</div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-3 bottom-3 w-px bg-white/[0.08]" />

        <div className="space-y-3">
          {profile.touchpoints.map((tp, i) => (
            <div key={i} className="flex items-start gap-4 pl-8 relative">
              {/* Dot */}
              <div className="absolute left-2 top-1.5 w-2 h-2 rounded-full border-2 border-background"
                style={{ backgroundColor: channelColors[tp.channel] || '#64748b' }} />

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-white/30 mb-0.5">Channel</div>
                  <div className="text-xs text-white/70"
                    style={{ color: channelColors[tp.channel] || '#94a3b8' }}>
                    {tp.channel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 mb-0.5">Device</div>
                  <div className="text-xs text-white/70">{tp.device}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 mb-0.5">Event</div>
                  <div className="text-xs text-white/70">{tp.event}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/30 mb-0.5">Time</div>
                  <div className="text-[11px] text-white/50 font-mono">{tp.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ profile }: { profile: UserProfile }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[profile.status];
  const StatusIcon = status.icon;

  return (
    <>
      <tr
        className={cn(
          "border-b border-white/[0.04] cursor-pointer transition-colors",
          expanded ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5 text-white/40" />
              : <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
            <div>
              <div className="text-sm font-semibold text-white">{profile.name}</div>
              <div className="text-[11px] text-white/40 font-mono">{profile.email}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px]", status.bg, status.border, status.color)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
        </td>
        <td className="px-4 py-3.5">
          <ConfidenceBar value={profile.confidence} />
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/60">{profile.devices}</span>
            <span className="text-white/20 mx-1">·</span>
            <Clock className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/60">{profile.sessions} sessions</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channelColors[profile.channel] || '#64748b' }} />
            <span className="text-xs text-white/60">{profile.channel}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="text-xs text-white/50 truncate max-w-[140px]">{profile.campaign}</div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400/60" />
            <span className="text-xs font-mono text-white/70">{profile.ltv.toLocaleString()}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-white/20" />
            <span className="text-xs text-white/40 truncate max-w-[100px]">{profile.location}</span>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-white/[0.04]">
          <td colSpan={8} className="p-0">
            <TouchpointTimeline profile={profile} />
          </td>
        </tr>
      )}
    </>
  );
}

export default function UserProfiles() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = userProfiles.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            User Profiles
          </span>
          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/15 text-blue-300 border-blue-500/20">
            {filtered.length} shown
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'resolved', 'fragmented', 'pending'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all capitalize",
                statusFilter === s
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Identity', 'Status', 'Confidence', 'Devices / Sessions', 'First Channel', 'Campaign', 'LTV', 'Location'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(profile => (
              <ProfileRow key={profile.id} profile={profile} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
