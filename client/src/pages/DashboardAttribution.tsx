/*
 * LUCIA ATTRIBUTION SYSTEM — ATTRIBUTION MODELS PAGE
 * Represents the full theory: trackable links → SDK → supercookie → full journey KPIs
 * Desktop & Mobile tracking transparency panels included.
 */
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { attributionModelsData } from '@/lib/dashboardSampleData';
import {
  TrendingUp, Zap, Shield, Code2, Globe, Monitor, Smartphone,
  Link2, Activity, ChevronRight, CheckCircle2, Info, Fingerprint,
  Wallet, MousePointerClick, Eye, Navigation, MapPin, Clock, Wifi,
  BarChart3, ArrowRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.channel}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">${(entry.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
};

const modelColors = [
  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', gradient: 'from-blue-500 to-blue-600', hex: '#3b82f6' },
  { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', gradient: 'from-green-500 to-green-600', hex: '#10b981' },
  { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', gradient: 'from-yellow-500 to-yellow-600', hex: '#f59e0b' },
  { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', gradient: 'from-purple-500 to-purple-600', hex: '#8b5cf6' },
];

// ─── Journey flow step ────────────────────────────────────────────────────────
function FlowStep({ icon: Icon, label, sub, color, last }: { icon: any; label: string; sub: string; color: string; last?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 border border-${color}-500/30 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        {!last && <div className="w-px h-4 bg-slate-700/60 mt-1" />}
      </div>
      <div className="pb-4">
        <p className={`text-xs font-bold text-${color}-300`}>{label}</p>
        <p className="text-[10px] text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

// ─── Tracking field row ───────────────────────────────────────────────────────
function TrackField({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 border border-${color}-500/10 hover:border-${color}-500/25 transition-all`}>
      <div className={`w-6 h-6 rounded-md bg-${color}-500/15 flex items-center justify-center shrink-0`}>
        <Icon className={`w-3 h-3 text-${color}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs text-slate-200 truncate">{value}</p>
      </div>
      <CheckCircle2 className={`w-3.5 h-3.5 text-${color}-400 shrink-0`} />
    </div>
  );
}

// ─── Journey path data ────────────────────────────────────────────────────────
const journeyData = [
  { day: 'Day 1', firstTouch: 100, lastTouch: 0, linear: 25, timeDecay: 5 },
  { day: 'Day 3', firstTouch: 0, lastTouch: 0, linear: 25, timeDecay: 10 },
  { day: 'Day 7', firstTouch: 0, lastTouch: 0, linear: 25, timeDecay: 20 },
  { day: 'Day 14', firstTouch: 0, lastTouch: 0, linear: 25, timeDecay: 30 },
  { day: 'Day 21', firstTouch: 0, lastTouch: 100, linear: 0, timeDecay: 35 },
];

const sdkFlowSteps = [
  { step: '1', label: 'User Clicks Link', desc: 'Trackable link captured with UTM params', color: 'blue', icon: MousePointerClick },
  { step: '2', label: 'SDK Fires', desc: 'Lucia SDK on destination page activates', color: 'cyan', icon: Code2 },
  { step: '3', label: 'Cookie Read', desc: 'Current browser cookie is identified', color: 'yellow', icon: Fingerprint },
  { step: '4', label: 'Supercookie Resolved', desc: 'Cookie linked to persistent supercookie identity', color: 'purple', icon: Shield },
  { step: '5', label: 'Journey Recorded', desc: 'Full path stored: device, channel, time, action', color: 'emerald', icon: Activity },
  { step: '6', label: 'KPI Attribution', desc: 'Conversion credited to canonical source link', color: 'orange', icon: TrendingUp },
];

// ─── Desktop tracking fields ──────────────────────────────────────────────────
const desktopFields = [
  { icon: Fingerprint, label: 'Device ID', value: 'fp_a1b2c3d4e5f6 (Canvas + WebGL fingerprint)', color: 'blue' },
  { icon: Wallet, label: 'Wallet Address', value: '0x742d35Cc6634C0532925a3b8D4C9E2 (MetaMask / WalletConnect)', color: 'purple' },
  { icon: MousePointerClick, label: 'Clicks', value: 'Element-level click tracking with XPath capture', color: 'cyan' },
  { icon: Eye, label: 'Page Views', value: 'URL, title, referrer, scroll depth, time-on-page', color: 'blue' },
  { icon: TrendingUp, label: 'Conversions', value: 'Goal events: purchase, signup, form submit', color: 'emerald' },
  { icon: Globe, label: 'IP Address', value: 'IPv4 / IPv6 with geolocation (city, region, country)', color: 'yellow' },
  { icon: Monitor, label: 'Browser', value: 'Chrome 122 / Safari 17 / Firefox 124 — UA + feature detection', color: 'slate' },
  { icon: Code2, label: 'OS', value: 'macOS 14.3 / Windows 11 / Ubuntu 22.04', color: 'slate' },
  { icon: Clock, label: 'Timezone', value: 'America/New_York (UTC−5) — auto-detected', color: 'yellow' },
  { icon: Navigation, label: 'Navigation Paths', value: '/home → /products → /checkout → /confirm', color: 'cyan' },
  { icon: Link2, label: 'Referral Sources', value: 'Canonical link short code + UTM params + HTTP Referer', color: 'blue' },
];

// ─── Mobile tracking fields ───────────────────────────────────────────────────
const mobileFields = [
  { icon: Fingerprint, label: 'Device ID', value: 'IDFA (iOS) / GAID (Android) + hardware fingerprint', color: 'blue' },
  { icon: Wallet, label: 'Wallet Address', value: '0x8f3e1a... (Rainbow / Trust / MetaMask Mobile)', color: 'purple' },
  { icon: MousePointerClick, label: 'Clicks', value: 'Touch events, tap coordinates, gesture recognition', color: 'cyan' },
  { icon: Eye, label: 'Views', value: 'Screen views, scroll events, viewport visibility', color: 'blue' },
  { icon: Activity, label: 'App Events', value: 'Session start/end, deep links, push notification opens', color: 'emerald' },
  { icon: Smartphone, label: 'Device Model', value: 'iPhone 15 Pro / Samsung Galaxy S24 / Pixel 8', color: 'slate' },
  { icon: Code2, label: 'OS', value: 'iOS 17.3 / Android 14 — version + build number', color: 'slate' },
  { icon: Wifi, label: 'Carrier', value: 'AT&T / Verizon / T-Mobile — MCC + MNC codes', color: 'yellow' },
  { icon: Clock, label: 'Timezone', value: 'Device timezone + DST offset auto-detected', color: 'yellow' },
  { icon: Wallet, label: 'Mobile Wallet Details', value: 'Wallet type, connected chain, ENS name, balance tier', color: 'purple' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardAttribution() {
  const [activeTab, setActiveTab] = useState<'models' | 'journey' | 'desktop' | 'mobile'>('models');
  const modelNames = ['First Touch', 'Last Touch', 'Linear', 'Time Decay'];
  const channels = ['organic', 'email', 'paidAds', 'social', 'direct', 'other'];

  const channelComparison = channels.map(channel => {
    const data: any = { channel: channel === 'paidAds' ? 'Paid Ads' : channel.charAt(0).toUpperCase() + channel.slice(1) };
    attributionModelsData.forEach((model, idx) => {
      data[modelNames[idx]] = model[channel as keyof typeof model];
    });
    return data;
  });

  return (
    <DashboardLayout title="Attribution Models" subtitle="Lucia Attribution — canonical link tracking, supercookie resolution, full journey KPIs">
      <div className="space-y-6">

        {/* Theory Banner */}
        <div className="rounded-xl border border-cyan-500/20 p-5 bg-gradient-to-r from-slate-900/80 via-cyan-950/20 to-slate-900/80 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyan-200 mb-1">The Lucia Attribution Theory</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To measure the true ROI of any campaign, you must know the <span className="text-cyan-300 font-semibold">canonical source</span> of every visitor. Trackable links are the mechanism — each one is a unique identifier embedded in every marketing channel. When a user clicks, the Lucia <span className="text-yellow-300 font-semibold">SDK</span> on the destination page reads their browser cookie and resolves it to a <span className="text-purple-300 font-semibold">supercookie</span> — a persistent cross-device identity. This enables measurement of the <span className="text-emerald-300 font-semibold">complete customer journey</span>: from first-touch channel to last-touch conversion, across every device and platform.
                </p>
              </div>
            </div>
            {/* Flow diagram */}
            <div className="mt-5 flex items-center gap-0 overflow-x-auto pb-1">
              {[
                { icon: Link2, label: 'Trackable Link', sub: 'Canonical source ID', color: 'blue' },
                { icon: MousePointerClick, label: 'User Clicks', sub: 'Any channel', color: 'cyan' },
                { icon: Code2, label: 'SDK Fires', sub: 'On destination', color: 'yellow' },
                { icon: Fingerprint, label: 'Cookie Read', sub: 'Browser identity', color: 'orange' },
                { icon: Shield, label: 'Supercookie', sub: 'Cross-device link', color: 'purple' },
                { icon: Activity, label: 'Journey Tracked', sub: 'Full path', color: 'emerald' },
                { icon: TrendingUp, label: 'KPI Attributed', sub: 'True ROI', color: 'green' },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center gap-1 px-3">
                    <div className={`w-9 h-9 rounded-lg bg-${step.color}-500/20 border border-${step.color}-500/30 flex items-center justify-center`}>
                      <step.icon className={`w-4 h-4 text-${step.color}-400`} />
                    </div>
                    <p className={`text-[9px] font-bold text-${step.color}-300 text-center leading-tight`}>{step.label}</p>
                    <p className="text-[8px] text-slate-500 text-center leading-tight">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-700/40 w-fit">
          {[
            { id: 'models', label: 'Attribution Models', icon: BarChart3 },
            { id: 'journey', label: 'Journey Flow', icon: Activity },
            { id: 'desktop', label: 'Desktop Tracking', icon: Monitor },
            { id: 'mobile', label: 'Mobile Tracking', icon: Smartphone },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-blue-600/80 text-blue-100 border border-blue-500/40 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Attribution Models Tab ── */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {modelNames.map((model, idx) => {
                const modelData = attributionModelsData[idx];
                const total = modelData.organic + modelData.email + modelData.paidAds + modelData.social + modelData.direct + modelData.other;
                const colors = modelColors[idx];
                const descriptions = [
                  'Credits the first trackable link click — identifies which channel initiated the journey.',
                  'Credits the final link before conversion — shows which channel closed the deal.',
                  'Distributes credit equally across all touchpoints in the journey.',
                  'Weights credit toward recent touchpoints — more credit as conversion approaches.',
                ];
                return (
                  <div key={idx} className={`rounded-lg border ${colors.border} p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-opacity-60 transition-all`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <p className={`text-xs font-bold ${colors.text}/70 uppercase tracking-wider`}>{model}</p>
                    </div>
                    <p className={`text-3xl font-black ${colors.text}`}>${(total / 1000).toFixed(0)}K</p>
                    <p className={`text-[10px] ${colors.text}/50 mt-1`}>Total attributed</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{descriptions[idx]}</p>
                  </div>
                );
              })}
            </div>

            {/* Channel comparison chart */}
            <div className="rounded-xl border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300">Attribution by Channel & Model</h3>
                    <p className="text-xs text-blue-300/60 mt-0.5">Revenue attributed per channel across all four models — powered by supercookie journey data</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={channelComparison} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                      {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color, i) => (
                        <linearGradient key={i} id={`gradBar${i + 1}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
                    <XAxis dataKey="channel" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {modelNames.map((model, idx) => (
                      <Bar key={idx} dataKey={model} fill={`url(#gradBar${idx + 1})`} radius={[8, 8, 0, 0]} animationDuration={800} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model details + table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {attributionModelsData.map((model, idx) => {
                const colors = modelColors[idx];
                return (
                  <div key={idx} className={`rounded-lg border ${colors.border} p-6 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md overflow-hidden relative`}>
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl`} />
                    </div>
                    <div className="relative z-10">
                      <h3 className={`text-sm font-bold ${colors.text} mb-5`}>{modelNames[idx]} Model</h3>
                      <div className="space-y-3">
                        {Object.entries(model).filter(([k]) => k !== 'model').map(([channel, value]) => {
                          const total = model.organic + model.email + model.paidAds + model.social + model.direct + model.other;
                          const pct = Math.round(((value as number) / total) * 100);
                          return (
                            <div key={channel}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-semibold capitalize ${colors.text}`}>{channel === 'paidAds' ? 'Paid Ads' : channel}</span>
                                <span className={`text-xs font-bold ${colors.text}`}>${((value as number) / 1000).toFixed(0)}K <span className="text-[10px] opacity-60">({pct}%)</span></span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-800/60">
                                <div className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Attribution Table */}
            <div className="rounded-xl border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cyan-300">Detailed Attribution Breakdown</h3>
                  <p className="text-xs text-cyan-300/60 mt-0.5">Complete attribution data across all models and channels — sourced from supercookie journey records</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                      <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Attribution Model</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Organic</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Email</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Paid Ads</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Social</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Direct</th>
                      <th className="text-right py-4 px-4 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Other</th>
                      <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributionModelsData.map((model, idx) => {
                      const total = model.organic + model.email + model.paidAds + model.social + model.direct + model.other;
                      return (
                        <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-all duration-200 group">
                          <td className="py-4 px-6 font-semibold text-cyan-100 group-hover:text-cyan-200">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: modelColors[idx].hex }} />
                              {modelNames[idx]}
                            </div>
                          </td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.organic / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.email / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.paidAds / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.social / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.direct / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-4 text-blue-300/80 font-mono text-xs">${(model.other / 1000).toFixed(0)}K</td>
                          <td className="text-right py-4 px-6 font-bold text-cyan-400 font-mono text-xs">${(total / 1000).toFixed(0)}K</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Journey Flow Tab ── */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {/* SDK Integration flow */}
            <div className="rounded-xl border border-cyan-500/20 p-6 bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cyan-300">SDK → Supercookie Resolution Flow</h3>
                  <p className="text-xs text-slate-400">How Lucia connects a click to a persistent cross-device identity</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {sdkFlowSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 relative">
                    <div className={`w-12 h-12 rounded-xl bg-${step.color}-500/20 border border-${step.color}-500/30 flex items-center justify-center`}>
                      <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                    </div>
                    <div className={`w-5 h-5 rounded-full bg-${step.color}-500/30 border border-${step.color}-500/40 flex items-center justify-center`}>
                      <span className={`text-[9px] font-black text-${step.color}-300`}>{step.step}</span>
                    </div>
                    <p className={`text-[10px] font-bold text-${step.color}-300 leading-tight`}>{step.label}</p>
                    <p className="text-[9px] text-slate-500 leading-tight">{step.desc}</p>
                    {i < sdkFlowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-6 -right-2 w-4 h-px bg-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Credit distribution over journey */}
            <div className="rounded-xl border border-blue-500/20 p-6 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-300">Credit Distribution Over Journey Timeline</h3>
                  <p className="text-xs text-slate-400">How each model allocates conversion credit across the 21-day journey</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={journeyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    {[['first', '#3b82f6'], ['last', '#10b981'], ['linear', '#f59e0b'], ['decay', '#8b5cf6']].map(([id, color]) => (
                      <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, fontSize: 11 }} />
                  <Legend />
                  <Area type="monotone" dataKey="firstTouch" name="First Touch" stroke="#3b82f6" fill="url(#grad-first)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                  <Area type="monotone" dataKey="lastTouch" name="Last Touch" stroke="#10b981" fill="url(#grad-last)" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                  <Area type="monotone" dataKey="linear" name="Linear" stroke="#f59e0b" fill="url(#grad-linear)" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                  <Area type="monotone" dataKey="timeDecay" name="Time Decay" stroke="#8b5cf6" fill="url(#grad-decay)" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key insight cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Link2, title: 'Links Are the Source of Truth', body: "Every visitor's canonical source is determined by the trackable link they clicked. Without a link, attribution is a guess. With one, it's a fact.", color: 'cyan' },
                { icon: Shield, title: 'Supercookie Bridges Devices', body: 'When a user switches from mobile to desktop, the supercookie maintains their identity. No journey is lost, no conversion is mis-attributed.', color: 'purple' },
                { icon: TrendingUp, title: 'Full Journey = True ROI', body: 'By tracking every touchpoint from first click to final conversion, you measure the actual return on every dollar spent across every channel.', color: 'emerald' },
              ].map((card, i) => (
                <div key={i} className={`rounded-xl border border-${card.color}-500/20 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md`}>
                  <div className={`w-9 h-9 rounded-lg bg-${card.color}-500/20 border border-${card.color}-500/30 flex items-center justify-center mb-3`}>
                    <card.icon className={`w-4 h-4 text-${card.color}-400`} />
                  </div>
                  <h4 className={`text-xs font-bold text-${card.color}-300 mb-2`}>{card.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Desktop Tracking Tab ── */}
        {activeTab === 'desktop' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-blue-500/20 p-6 bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-200">Desktop Tracking</h3>
                    <p className="text-xs text-slate-400">What Lucia captures on every desktop session — building trust through transparency</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 ml-13">
                  Clients see exactly what is tracked on desktop, enabling informed consent and building trust — especially important for Web3 users who are privacy-conscious. Marketers use this data to optimize campaigns with precision.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {desktopFields.map((field, i) => (
                    <TrackField key={i} icon={field.icon} label={field.label} value={field.value} color={field.color} />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop device breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Avg Session Duration', value: '5m 47s', sub: 'Desktop sessions', icon: Clock, color: 'blue' },
                { label: 'Cross-Device Match Rate', value: '64.2%', sub: 'Desktop → Mobile', icon: Globe, color: 'cyan' },
                { label: 'Supercookie Resolution', value: '91.4%', sub: 'Desktop visitors', icon: Shield, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border border-${stat.color}-500/20 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md`}>
                  <div className={`w-9 h-9 rounded-lg bg-${stat.color}-500/20 border border-${stat.color}-500/30 flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                  </div>
                  <p className={`text-2xl font-black text-${stat.color}-300`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{stat.label}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Navigation path example */}
            <div className="rounded-xl border border-cyan-500/20 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-4">Example Desktop Navigation Path — Tracked by Lucia SDK</h4>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { page: 'Twitter Ad Click', type: 'Source', color: 'blue' },
                  { page: '/landing', type: 'Page View', color: 'cyan' },
                  { page: '/products/widget', type: 'Product View', color: 'yellow' },
                  { page: '/pricing', type: 'Page View', color: 'cyan' },
                  { page: 'Email (Day 3)', type: 'Re-engage', color: 'emerald' },
                  { page: '/checkout', type: 'High Intent', color: 'orange' },
                  { page: '/confirm', type: 'Conversion', color: 'green' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg bg-${step.color}-500/15 border border-${step.color}-500/25`}>
                      <p className={`text-[10px] font-bold text-${step.color}-300`}>{step.page}</p>
                      <p className="text-[9px] text-slate-500">{step.type}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-3">All steps linked to the same supercookie identity — even after the 3-day gap between sessions.</p>
            </div>
          </div>
        )}

        {/* ── Mobile Tracking Tab ── */}
        {activeTab === 'mobile' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/20 p-6 bg-gradient-to-br from-slate-900/70 to-slate-900/50 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-200">Mobile Tracking</h3>
                    <p className="text-xs text-slate-400">What Lucia captures on every mobile session — transparency reassures Web3 clients</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Mobile tracking transparency is critical for Web3 clients who are privacy-aware. By showing exactly what data is collected — including wallet details and device identifiers — Lucia builds trust while giving marketers the data they need to optimize mobile campaigns and cross-device journeys.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {mobileFields.map((field, i) => (
                    <TrackField key={i} icon={field.icon} label={field.label} value={field.value} color={field.color} />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Avg Session Duration', value: '3m 12s', sub: 'Mobile sessions', icon: Clock, color: 'emerald' },
                { label: 'Mobile Wallet Connect Rate', value: '38.7%', sub: 'Web3 users', icon: Wallet, color: 'purple' },
                { label: 'Supercookie Resolution', value: '84.9%', sub: 'Mobile visitors', icon: Shield, color: 'cyan' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border border-${stat.color}-500/20 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md`}>
                  <div className={`w-9 h-9 rounded-lg bg-${stat.color}-500/20 border border-${stat.color}-500/30 flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                  </div>
                  <p className={`text-2xl font-black text-${stat.color}-300`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{stat.label}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Mobile journey example */}
            <div className="rounded-xl border border-purple-500/20 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-4">Example Mobile Journey — Web3 User</h4>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { page: 'Twitter Mobile', type: 'Source', color: 'blue' },
                  { page: '/landing', type: 'App View', color: 'cyan' },
                  { page: 'Wallet Connect', type: 'Web3 Event', color: 'purple' },
                  { page: '/nft-drop', type: 'Product View', color: 'yellow' },
                  { page: 'Push Notification', type: 'Re-engage', color: 'emerald' },
                  { page: '/mint', type: 'High Intent', color: 'orange' },
                  { page: 'Tx Confirmed', type: 'Conversion', color: 'green' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg bg-${step.color}-500/15 border border-${step.color}-500/25`}>
                      <p className={`text-[10px] font-bold text-${step.color}-300`}>{step.page}</p>
                      <p className="text-[9px] text-slate-500">{step.type}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-3">Wallet address linked to supercookie — cross-device match confirmed when same wallet connected on desktop 2 days later.</p>
            </div>

            {/* Comparison table */}
            <div className="rounded-xl border border-slate-700/40 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
              <div className="px-6 py-4 border-b border-slate-700/40 bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Desktop vs Mobile — Tracking Comparison</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700/40 bg-slate-900/20">
                      <th className="text-left py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Point</th>
                      <th className="text-center py-3 px-4 text-[10px] font-bold text-blue-400 uppercase tracking-wider"><Monitor className="w-3 h-3 inline mr-1" />Desktop</th>
                      <th className="text-center py-3 px-4 text-[10px] font-bold text-emerald-400 uppercase tracking-wider"><Smartphone className="w-3 h-3 inline mr-1" />Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Device ID', 'Canvas + WebGL fingerprint', 'IDFA / GAID + hardware'],
                      ['Wallet Address', 'MetaMask / WalletConnect', 'Rainbow / Trust / MetaMask Mobile'],
                      ['Clicks', 'Element-level, XPath', 'Touch events, tap coords'],
                      ['Views', 'URL, scroll depth, time-on-page', 'Screen views, viewport visibility'],
                      ['Conversions', 'Purchase, signup, form submit', 'In-app events, tx confirmed'],
                      ['IP Address', '✓ IPv4 / IPv6', '✓ IPv4 / IPv6'],
                      ['Browser / App', 'Chrome, Safari, Firefox', 'Native app + mobile browser'],
                      ['OS', 'macOS, Windows, Linux', 'iOS, Android'],
                      ['Timezone', '✓ Auto-detected', '✓ Auto-detected'],
                      ['Navigation Paths', 'Full URL path history', 'Screen flow + deep links'],
                      ['Referral Source', 'HTTP Referer + UTM params', 'UTM params + app store source'],
                      ['Carrier', '—', 'MCC + MNC codes'],
                      ['Mobile Wallet Details', '—', 'Chain, ENS, balance tier'],
                    ].map(([field, desktop, mobile], i) => (
                      <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/20 transition-all">
                        <td className="py-3 px-6 font-semibold text-slate-300">{field}</td>
                        <td className="py-3 px-4 text-center text-slate-400">{desktop}</td>
                        <td className="py-3 px-4 text-center text-slate-400">{mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
