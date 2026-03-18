/*
 * LUCIA ATTRIBUTION — TRACKABLE LINKS & CAMPAIGN MANAGER
 * Links are the canonical source of every visitor.
 * Each link connects a browser cookie to the supercookie,
 * enabling full cross-device, cross-platform journey tracking.
 */
import { useState } from 'react';
import {
  Link2, Plus, Copy, Trash2, Eye, EyeOff, ChevronDown, ChevronRight,
  Zap, Shield, Globe, Smartphone, Monitor, Activity, Target, TrendingUp,
  CheckCircle2, XCircle, Clock, ExternalLink, Code2, Wifi, AlertCircle,
  BarChart3, Users, DollarSign, MousePointerClick
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import {
  mockTrackableLinks, TrackableLink, LinkedCampaign, channelColors, ChannelType
} from '@/lib/trackableLinkData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TrackableLink['status'] }) {
  const map = {
    Active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Expired: 'bg-red-500/20 text-red-300 border-red-500/30',
    Draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status]}`}>
      {status}
    </span>
  );
}

// ─── SDK badge ────────────────────────────────────────────────────────────────
function SdkBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${enabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-slate-700/30 text-slate-400 border-slate-600/30'}`}>
      <Code2 className="w-2.5 h-2.5" />
      {enabled ? 'SDK Active' : 'SDK Pending'}
    </span>
  );
}

// ─── Supercookie badge ────────────────────────────────────────────────────────
function SupercookieBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${enabled ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-700/30 text-slate-400 border-slate-600/30'}`}>
      <Shield className="w-2.5 h-2.5" />
      {enabled ? 'Supercookie On' : 'Supercookie Off'}
    </span>
  );
}

// ─── KPI mini card ────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className={`rounded-lg border p-4 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md border-${color}-500/20`}>
      <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 text-${color}-400`} />
      </div>
      <p className={`text-xl font-black text-${color}-300`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ─── Channel bar chart ────────────────────────────────────────────────────────
function ChannelChart({ link }: { link: TrackableLink }) {
  if (!link.channelMetrics.length) return (
    <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No channel data yet</div>
  );
  const data = link.channelMetrics.map(m => ({
    channel: m.channel.replace(' ', '\n'),
    Clicks: m.clicks,
    Conversions: m.conversions,
    Revenue: Math.round(m.revenue / 1000),
  }));
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="channel" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 9 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: '#7dd3fc' }}
        />
        <Bar dataKey="Clicks" radius={[4, 4, 0, 0]} fill="#3b82f6" />
        <Bar dataKey="Conversions" radius={[4, 4, 0, 0]} fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Link detail drawer ───────────────────────────────────────────────────────
function LinkDetail({ link, onClose }: { link: TrackableLink; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'campaigns' | 'events'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'campaigns', label: `Campaigns (${link.campaigns.length})` },
    { id: 'events', label: 'Live Events' },
  ] as const;

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-cyan-100">{link.name}</h2>
            <StatusBadge status={link.status} />
            <SdkBadge enabled={link.sdkEnabled} />
            <SupercookieBadge enabled={link.supercookieEnabled} />
          </div>
          <p className="text-xs text-slate-400 ml-10">{link.description}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-200 transition-colors text-lg leading-none">✕</button>
      </div>

      {/* Tracking URL */}
      <div className="px-6 py-4 border-b border-slate-700/40 bg-slate-900/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider w-24 shrink-0">Tracking URL</span>
          <code className="flex-1 text-xs text-cyan-300 font-mono bg-slate-800/60 px-3 py-1.5 rounded-lg border border-cyan-500/20 truncate">{link.trackingUrl}</code>
          <button onClick={() => { navigator.clipboard.writeText(link.trackingUrl); toast.success('Tracking URL copied!'); }} className="shrink-0 p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <a href={link.destinationUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-slate-700/60 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        {link.utmCampaign && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider w-24 shrink-0">UTM Params</span>
            <div className="flex gap-2 flex-wrap">
              {link.utmSource && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-slate-300">source={link.utmSource}</span>}
              {link.utmMedium && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-slate-300">medium={link.utmMedium}</span>}
              {link.utmCampaign && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-slate-300">campaign={link.utmCampaign}</span>}
            </div>
          </div>
        )}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4 border-b border-slate-700/40">
        <div className="text-center">
          <p className="text-lg font-black text-blue-300">{link.totalClicks.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Clicks</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-emerald-300">{link.totalConversions.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Conversions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-cyan-300">${(link.totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-purple-300">{link.supercookieResolutionRate}%</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Supercookie Resolved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/40">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-3 text-xs font-semibold transition-all ${tab === t.id ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-slate-400 hover:text-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 py-5">
        {tab === 'overview' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">Channel Performance</h4>
              <ChannelChart link={link} />
            </div>
            {link.channelMetrics.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">Channel Breakdown</h4>
                <div className="space-y-2">
                  {link.channelMetrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/40 hover:border-slate-600/60 transition-all">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: channelColors[m.channel as ChannelType] || '#64748b' }} />
                      <span className="text-xs font-semibold text-slate-200 w-24 shrink-0">{m.channel}</span>
                      <div className="flex-1 grid grid-cols-4 gap-2 text-right">
                        <div><p className="text-xs font-bold text-blue-300">{m.clicks.toLocaleString()}</p><p className="text-[9px] text-slate-500">Clicks</p></div>
                        <div><p className="text-xs font-bold text-emerald-300">{m.conversions.toLocaleString()}</p><p className="text-[9px] text-slate-500">Conv.</p></div>
                        <div><p className="text-xs font-bold text-cyan-300">${(m.revenue / 1000).toFixed(1)}K</p><p className="text-[9px] text-slate-500">Revenue</p></div>
                        <div><p className="text-xs font-bold text-purple-300">{m.roi.toFixed(1)}x</p><p className="text-[9px] text-slate-500">ROI</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'campaigns' && (
          <div className="space-y-3">
            {link.campaigns.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No campaigns linked yet. Create a campaign and attach this link.</div>
            ) : link.campaigns.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/40 hover:border-slate-600/60 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-100">{c.campaignName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${c.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : c.status === 'Paused' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: channelColors[c.channel as ChannelType] || '#64748b' }} />
                      <span className="text-[11px] text-slate-400">{c.channel}</span>
                      <span className="text-[11px] text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">Started {c.startDate}</span>
                      {c.endDate && <><span className="text-[11px] text-slate-600">·</span><span className="text-[11px] text-slate-400">Ended {c.endDate}</span></>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded bg-slate-900/40"><p className="text-sm font-bold text-blue-300">${(c.spend / 1000).toFixed(1)}K</p><p className="text-[9px] text-slate-500">Spend</p></div>
                  <div className="text-center p-2 rounded bg-slate-900/40"><p className="text-sm font-bold text-emerald-300">${(c.revenue / 1000).toFixed(1)}K</p><p className="text-[9px] text-slate-500">Revenue</p></div>
                  <div className="text-center p-2 rounded bg-slate-900/40"><p className="text-sm font-bold text-cyan-300">{c.conversions.toLocaleString()}</p><p className="text-[9px] text-slate-500">Conversions</p></div>
                  <div className="text-center p-2 rounded bg-slate-900/40"><p className="text-sm font-bold text-purple-300">{c.roi.toFixed(1)}x</p><p className="text-[9px] text-slate-500">ROI</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'events' && (
          <div className="space-y-2">
            {link.recentEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No events yet. Events will appear when visitors click this link.</div>
            ) : link.recentEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ev.resolved ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300">{ev.userId}</span>
                    <span className="text-[10px] text-slate-500">{ev.deviceType}</span>
                    <span className={`text-[10px] font-bold ${ev.resolved ? 'text-emerald-400' : 'text-yellow-400'}`}>{ev.resolved ? '✓ Resolved' : '⟳ Pending'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-500">cookie: {ev.cookieId}</span>
                    <span className="text-[10px] text-slate-600">→</span>
                    <span className="text-[10px] font-mono text-purple-400">supercookie: {ev.supercookieId}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-cyan-300">{ev.confidence}%</p>
                  <p className="text-[9px] text-slate-500">confidence</p>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-slate-500 text-center pt-2">Showing {link.recentEvents.length} most recent supercookie resolution events</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Create Link Form ─────────────────────────────────────────────────────────
function CreateLinkForm({ onClose, onCreate }: { onClose: () => void; onCreate: (link: TrackableLink) => void }) {
  const [form, setForm] = useState({ name: '', destinationUrl: '', description: '', utmSource: 'lucia', utmMedium: '', utmCampaign: '', sdkEnabled: true, supercookieEnabled: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.destinationUrl) { toast.error('Name and Destination URL are required'); return; }
    const shortCode = form.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    const newLink: TrackableLink = {
      id: `tl-${Date.now()}`,
      name: form.name,
      shortCode,
      trackingUrl: `https://track.lucia.io/l/${shortCode}`,
      destinationUrl: form.destinationUrl,
      description: form.description,
      utmSource: form.utmSource || undefined,
      utmMedium: form.utmMedium || undefined,
      utmCampaign: form.utmCampaign || undefined,
      sdkEnabled: form.sdkEnabled,
      supercookieEnabled: form.supercookieEnabled,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      campaigns: [],
      channelMetrics: [],
      totalClicks: 0,
      totalUniqueVisitors: 0,
      totalConversions: 0,
      totalRevenue: 0,
      overallRoi: 0,
      supercookieResolutionRate: 0,
      crossDeviceMatchRate: 0,
      recentEvents: [],
    };
    onCreate(newLink);
    toast.success('Trackable link created!', { description: `Short code: ${shortCode}` });
    onClose();
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 transition-all";
  const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 backdrop-blur-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-cyan-100">Create Trackable Link</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Link Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Q2 Product Launch" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Destination URL *</label>
            <input type="url" value={form.destinationUrl} onChange={e => setForm({ ...form, destinationUrl: e.target.value })} placeholder="https://example.com/page" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the purpose of this link..." rows={2} className={inputCls} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>UTM Source</label>
            <input type="text" value={form.utmSource} onChange={e => setForm({ ...form, utmSource: e.target.value })} placeholder="lucia" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>UTM Medium</label>
            <input type="text" value={form.utmMedium} onChange={e => setForm({ ...form, utmMedium: e.target.value })} placeholder="email / social / cpc" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>UTM Campaign</label>
            <input type="text" value={form.utmCampaign} onChange={e => setForm({ ...form, utmCampaign: e.target.value })} placeholder="q2-launch" className={inputCls} />
          </div>
        </div>
        <div className="flex items-center gap-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/40">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.sdkEnabled} onChange={e => setForm({ ...form, sdkEnabled: e.target.checked })} className="w-4 h-4 rounded accent-cyan-500" />
            <span className="text-xs text-slate-300 font-medium">Lucia SDK Enabled</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.supercookieEnabled} onChange={e => setForm({ ...form, supercookieEnabled: e.target.checked })} className="w-4 h-4 rounded accent-purple-500" />
            <span className="text-xs text-slate-300 font-medium">Supercookie Resolution</span>
          </label>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold transition-all">
            Create Link
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-700/40 border border-slate-600/40 text-slate-300 text-sm font-medium hover:bg-slate-700/60 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardLinks() {
  const [links, setLinks] = useState<TrackableLink[]>(mockTrackableLinks);
  const [selectedLink, setSelectedLink] = useState<TrackableLink | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Draft' | 'Paused' | 'Expired'>('All');

  const filtered = filter === 'All' ? links : links.filter(l => l.status === filter);

  const totalClicks = links.reduce((s, l) => s + l.totalClicks, 0);
  const totalConversions = links.reduce((s, l) => s + l.totalConversions, 0);
  const totalRevenue = links.reduce((s, l) => s + l.totalRevenue, 0);
  const activeLinks = links.filter(l => l.status === 'Active').length;

  const handleCreate = (link: TrackableLink) => setLinks([link, ...links]);
  const handleDelete = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    if (selectedLink?.id === id) setSelectedLink(null);
    toast.success('Link deleted');
  };

  return (
    <DashboardLayout title="Trackable Links" subtitle="Canonical source identifiers — the lifeblood of Lucia Attribution">
      <div className="space-y-6">

        {/* Theory Banner */}
        <div className="rounded-xl border border-cyan-500/20 p-5 bg-gradient-to-r from-slate-900/80 via-cyan-950/20 to-slate-900/80 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-200 mb-1">How Lucia Attribution Works</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                Every trackable link is a <span className="text-cyan-300 font-semibold">canonical source identifier</span> for a visitor. When a user clicks a link, the Lucia SDK — integrated into your destination page — connects their current browser cookie to the <span className="text-purple-300 font-semibold">supercookie</span>. This supercookie persists across devices and sessions, enabling you to measure the <span className="text-emerald-300 font-semibold">full customer journey</span> from first click to last conversion — across every device, platform, and marketing channel.
              </p>
              <div className="flex items-center gap-6 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><Code2 className="w-3.5 h-3.5 text-cyan-400" /><span>SDK integration on destination</span></div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><Shield className="w-3.5 h-3.5 text-purple-400" /><span>Cookie → Supercookie resolution</span></div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><Globe className="w-3.5 h-3.5 text-blue-400" /><span>Cross-device identity graph</span></div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><Activity className="w-3.5 h-3.5 text-emerald-400" /><span>Full journey KPI measurement</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-blue-500/20 p-4 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3"><Link2 className="w-4 h-4 text-blue-400" /></div>
            <p className="text-xl font-black text-blue-300">{activeLinks}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Active Links</p>
          </div>
          <div className="rounded-lg border border-cyan-500/20 p-4 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3"><MousePointerClick className="w-4 h-4 text-cyan-400" /></div>
            <p className="text-xl font-black text-cyan-300">{(totalClicks / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Total Clicks</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 p-4 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3"><Target className="w-4 h-4 text-emerald-400" /></div>
            <p className="text-xl font-black text-emerald-300">{totalConversions.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Conversions</p>
          </div>
          <div className="rounded-lg border border-purple-500/20 p-4 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3"><DollarSign className="w-4 h-4 text-purple-400" /></div>
            <p className="text-xl font-black text-purple-300">${(totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Total Revenue</p>
          </div>
        </div>

        {/* Create form */}
        {showCreate && <CreateLinkForm onClose={() => setShowCreate(false)} onCreate={handleCreate} />}

        {/* Link detail */}
        {selectedLink && <LinkDetail link={selectedLink} onClose={() => setSelectedLink(null)} />}

        {/* Links table */}
        <div className="rounded-xl border border-slate-700/40 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Link2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-100">All Trackable Links</h3>
                <p className="text-[10px] text-slate-400">{filtered.length} links — each one a canonical attribution source</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter pills */}
              <div className="flex gap-1">
                {(['All', 'Active', 'Draft', 'Paused', 'Expired'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-blue-500/30 text-blue-200 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}>{f}</button>
                ))}
              </div>
              <button onClick={() => { setShowCreate(true); setSelectedLink(null); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all">
                <Plus className="w-3.5 h-3.5" />
                New Link
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-slate-900/30">
                  <th className="text-left py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link / Short Code</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaigns</th>
                  <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clicks</th>
                  <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conv.</th>
                  <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</th>
                  <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SC Resolved</th>
                  <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROI</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((link) => (
                  <tr key={link.id} className={`border-b border-slate-700/20 hover:bg-slate-800/30 transition-all cursor-pointer group ${selectedLink?.id === link.id ? 'bg-cyan-900/10 border-l-2 border-l-cyan-500' : ''}`} onClick={() => setSelectedLink(selectedLink?.id === link.id ? null : link)}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${link.status === 'Active' ? 'bg-emerald-400 animate-pulse' : link.status === 'Draft' ? 'bg-slate-400' : 'bg-yellow-400'}`} />
                        <div>
                          <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">{link.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <code className="text-[10px] font-mono text-cyan-400 bg-cyan-900/20 px-1.5 py-0.5 rounded">{link.shortCode}</code>
                            {link.sdkEnabled && <SdkBadge enabled={true} />}
                            {link.supercookieEnabled && <SupercookieBadge enabled={true} />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><StatusBadge status={link.status} /></td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-slate-300">{link.campaigns.length}</span>
                      <span className="text-[10px] text-slate-500 ml-1">campaign{link.campaigns.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-xs text-blue-300">{link.totalClicks.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-xs text-emerald-300">{link.totalConversions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-xs text-cyan-300">{link.totalRevenue > 0 ? `$${(link.totalRevenue / 1000).toFixed(1)}K` : '—'}</td>
                    <td className="py-4 px-4 text-right">
                      {link.supercookieResolutionRate > 0 ? (
                        <span className="text-xs font-bold text-purple-300">{link.supercookieResolutionRate}%</span>
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {link.overallRoi > 0 ? (
                        <span className="text-xs font-bold text-yellow-300">{link.overallRoi.toFixed(1)}x</span>
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { navigator.clipboard.writeText(link.trackingUrl); toast.success('URL copied!'); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-blue-900/20 transition-all" title="Copy tracking URL">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
