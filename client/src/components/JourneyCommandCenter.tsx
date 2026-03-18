/*
 * Intelligence Command Center for User Journeys
 * Campaign performance overview, interactive conversion/drop-off path explorer, and global funnel
 */
import { useState } from "react";
import {
  campaignJourneys, conversionPaths, dropOffPaths, globalFunnel,
  CampaignJourney, JourneyPath
} from "@/lib/journeyIntelData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList
} from "recharts";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  ChevronDown, ChevronRight, Zap, Users, DollarSign,
  ArrowRight, XCircle, Target, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Campaign Performance Cards ───────────────────────────────
function CampaignCards({
  campaigns,
  selected,
  onSelect,
}: {
  campaigns: CampaignJourney[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {campaigns.map((c) => {
        const active = selected === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(active ? null : c.id)}
            className={cn(
              "text-left p-5 rounded-xl border transition-all duration-200",
              active
                ? "border-blue-400/60 bg-blue-900/30 shadow-lg shadow-blue-500/10 scale-[1.02]"
                : "border-slate-700/40 bg-slate-800/40 hover:border-blue-500/30 hover:bg-slate-800/60"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <Badge
                className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: c.color + '20',
                  color: c.color,
                  borderColor: c.color + '40',
                }}
              >
                {c.channel}
              </Badge>
              <span className={cn(
                "text-xs font-bold",
                c.conversionRate >= 25 ? "text-emerald-400" : c.conversionRate >= 18 ? "text-blue-400" : "text-amber-400"
              )}>
                {c.conversionRate}% CVR
              </span>
            </div>

            {/* Campaign Name */}
            <h4 className="text-sm font-bold text-slate-100 mb-3 leading-snug">{c.campaign}</h4>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500 block mb-0.5">Users</span>
                <span className="text-slate-200 font-mono font-bold">{c.totalUsers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Conversions</span>
                <span className="text-emerald-400 font-mono font-bold">{c.conversions.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Revenue</span>
                <span className="text-blue-300 font-mono font-bold">${(c.revenue / 1000).toFixed(0)}K</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Avg Touchpoints</span>
                <span className="text-amber-300 font-mono font-bold">{c.avgTouchpoints}</span>
              </div>
            </div>

            {/* Conversion vs Drop-off bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>Converted</span>
                <span>Dropped off</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${c.conversionRate}%` }}
                />
                <div
                  className="h-full bg-red-500/60 transition-all"
                  style={{ width: `${100 - c.conversionRate}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Path Explorer ────────────────────────────────────────────
function PathExplorer({
  paths,
  type,
}: {
  paths: JourneyPath[];
  type: 'conversion' | 'dropoff';
}) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const isConversion = type === 'conversion';
  const accentColor = isConversion ? 'emerald' : 'red';

  return (
    <div className="space-y-3">
      {paths.map((path) => {
        const expanded = expandedPath === path.id;
        return (
          <div
            key={path.id}
            className={cn(
              "rounded-xl border transition-all overflow-hidden",
              expanded
                ? `border-${accentColor}-500/40 bg-slate-800/60`
                : "border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50"
            )}
          >
            {/* Path Header */}
            <button
              onClick={() => setExpandedPath(expanded ? null : path.id)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                isConversion ? "bg-emerald-900/50" : "bg-red-900/50"
              )}>
                {isConversion ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-slate-100 truncate">{path.label}</h5>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {path.users.toLocaleString()} users
                  </span>
                  <span className={cn(
                    "font-bold",
                    isConversion ? "text-emerald-400" : "text-red-400"
                  )}>
                    {path.percentage}% of total
                  </span>
                </div>
              </div>

              {expanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {/* Expanded Steps */}
            {expanded && (
              <div className="px-4 pb-4">
                <div className="relative pl-6 space-y-0">
                  {path.steps.map((step, idx) => {
                    const isLast = idx === path.steps.length - 1;
                    const isExit = step.channel === 'Exit' || step.channel === 'Drop-off';
                    const dropPercent = idx > 0
                      ? ((step.dropOffCount / path.steps[idx - 1].usersRemaining) * 100).toFixed(1)
                      : '0';

                    return (
                      <div key={idx} className="relative">
                        {/* Vertical line */}
                        {!isLast && (
                          <div className="absolute left-[-16px] top-6 bottom-0 w-px bg-slate-700/50" />
                        )}

                        {/* Dot */}
                        <div className={cn(
                          "absolute left-[-20px] top-2 w-2.5 h-2.5 rounded-full border-2",
                          isExit
                            ? "bg-red-500 border-red-400"
                            : isLast && isConversion
                              ? "bg-emerald-500 border-emerald-400"
                              : "bg-blue-500 border-blue-400"
                        )} />

                        <div className={cn(
                          "py-3 px-4 rounded-lg mb-2 border",
                          isExit
                            ? "bg-red-900/20 border-red-500/20"
                            : isLast && isConversion
                              ? "bg-emerald-900/20 border-emerald-500/20"
                              : "bg-slate-800/50 border-slate-700/20"
                        )}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge className="text-[8px] px-1.5 py-0 h-4 bg-slate-700/50 text-slate-300 border-slate-600/50">
                                {step.channel}
                              </Badge>
                              <span className="text-xs font-bold text-slate-100">{step.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{step.timestamp}</span>
                          </div>

                          <p className="text-[10px] text-slate-400 mb-2">{step.action}</p>

                          <div className="flex items-center gap-4 text-[9px]">
                            <span className="text-slate-400">
                              Users: <span className="text-blue-300 font-mono font-bold">{step.usersRemaining.toLocaleString()}</span>
                            </span>
                            {step.dropOffCount > 0 && (
                              <span className="text-red-400 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                -{step.dropOffCount.toLocaleString()} ({dropPercent}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Global Funnel ────────────────────────────────────────────
function GlobalFunnel() {
  const maxUsers = globalFunnel[0].users;

  return (
    <div className="space-y-2">
      {globalFunnel.map((stage, idx) => {
        const widthPercent = (stage.users / maxUsers) * 100;
        const isLast = idx === globalFunnel.length - 1;

        return (
          <div key={idx} className="group">
            <div className="flex items-center gap-3">
              {/* Stage label */}
              <div className="w-40 shrink-0 text-right">
                <span className="text-xs text-slate-300 font-medium">{stage.stage}</span>
              </div>

              {/* Bar */}
              <div className="flex-1 relative">
                <div
                  className={cn(
                    "h-9 rounded-lg transition-all duration-500 flex items-center px-3 relative overflow-hidden",
                    isLast
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
                      : "bg-gradient-to-r from-blue-600/80 to-blue-500/60"
                  )}
                  style={{ width: `${Math.max(widthPercent, 8)}%` }}
                >
                  <span className="text-[10px] font-bold text-white font-mono relative z-10">
                    {stage.users.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Drop-off indicator */}
              <div className="w-24 shrink-0">
                {stage.dropOff > 0 ? (
                  <div className="flex items-center gap-1 text-[10px] text-red-400">
                    <TrendingDown className="w-3 h-3" />
                    <span className="font-mono font-bold">-{stage.dropOff.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500">Entry</span>
                )}
              </div>

              {/* Rate */}
              <div className="w-12 shrink-0 text-right">
                <span className={cn(
                  "text-xs font-bold font-mono",
                  stage.conversionRate > 20 ? "text-emerald-400" : stage.conversionRate > 10 ? "text-blue-400" : "text-amber-400"
                )}>
                  {stage.conversionRate}%
                </span>
              </div>
            </div>

            {/* Drop-off connector */}
            {!isLast && stage.dropOff > 0 && (
              <div className="flex items-center gap-3 ml-[172px] my-0.5">
                <div className="flex items-center gap-1 text-[8px] text-red-400/60">
                  <ArrowRight className="w-2.5 h-2.5 rotate-90" />
                  <span>{((stage.dropOff / stage.users) * 100).toFixed(1)}% drop-off</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Command Center ──────────────────────────────────────
export default function JourneyCommandCenter() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'conversions' | 'dropoffs' | 'funnel'>('overview');

  const totalUsers = campaignJourneys.reduce((s, c) => s + c.totalUsers, 0);
  const totalConversions = campaignJourneys.reduce((s, c) => s + c.conversions, 0);
  const totalRevenue = campaignJourneys.reduce((s, c) => s + c.revenue, 0);
  const avgCVR = (totalConversions / totalUsers * 100).toFixed(1);

  const chartData = campaignJourneys.map(c => ({
    name: c.campaign.split(' ').slice(0, 2).join(' '),
    conversions: c.conversions,
    dropOffs: c.dropOffs,
    color: c.color,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-900/10 to-slate-900 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-extrabold text-blue-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Intelligence Command Center
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Track campaign performance, analyze conversion paths, and identify drop-off points across all acquisition channels.
        </p>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Total Users</span>
            </div>
            <div className="text-xl font-extrabold text-blue-300 font-mono">{(totalUsers / 1000).toFixed(1)}K</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Conversions</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-300 font-mono">{totalConversions.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Revenue</span>
            </div>
            <div className="text-xl font-extrabold text-amber-300 font-mono">${(totalRevenue / 1000).toFixed(0)}K</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Avg CVR</span>
            </div>
            <div className="text-xl font-extrabold text-purple-300 font-mono">{avgCVR}%</div>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview' as const, label: 'Campaign Overview', icon: BarChart },
          { id: 'conversions' as const, label: 'Conversion Paths', icon: CheckCircle2 },
          { id: 'dropoffs' as const, label: 'Drop-off Paths', icon: AlertTriangle },
          { id: 'funnel' as const, label: 'Global Funnel', icon: TrendingDown },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all border",
                activeView === tab.id
                  ? "bg-blue-900/40 text-blue-200 border-blue-500/40 shadow-md"
                  : "bg-slate-800/30 text-slate-400 border-slate-700/30 hover:text-slate-200 hover:border-slate-600/50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Campaign Overview */}
      {activeView === 'overview' && (
        <div className="space-y-5">
          <CampaignCards
            campaigns={campaignJourneys}
            selected={selectedCampaign}
            onSelect={setSelectedCampaign}
          />

          {/* Conversions vs Drop-offs Chart */}
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Conversions vs Drop-offs by Campaign
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '10px' }} />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#93c5fd' }}
                />
                <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dropOffs" name="Drop-offs" fill="#ef4444" opacity={0.5} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Conversion Paths */}
      {activeView === 'conversions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: 'Syne, sans-serif' }}>
              Top Conversion Paths
            </h3>
            <span className="text-[10px] text-slate-500 ml-auto">Click to expand journey steps</span>
          </div>
          <PathExplorer paths={conversionPaths} type="conversion" />
        </div>
      )}

      {/* Drop-off Paths */}
      {activeView === 'dropoffs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: 'Syne, sans-serif' }}>
              Critical Drop-off Paths
            </h3>
            <span className="text-[10px] text-slate-500 ml-auto">Click to expand journey steps</span>
          </div>
          <PathExplorer paths={dropOffPaths} type="dropoff" />

          {/* Drop-off Insights */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-900/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-200 mb-2">Key Drop-off Insights</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">44.9%</span>
                    <span>of Twitter users bounce from the landing page within 10 seconds — consider improving page load speed and above-fold content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">28.8%</span>
                    <span>of Google users exit after viewing pricing — test different pricing tiers or add a free trial CTA.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">14.4%</span>
                    <span>of Meta users abandon checkout — simplify the checkout flow and add trust signals.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Funnel */}
      {activeView === 'funnel' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <TrendingDown className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: 'Syne, sans-serif' }}>
              Global Conversion Funnel
            </h3>
            <span className="text-[10px] text-slate-500 ml-auto">All campaigns combined</span>
          </div>

          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-6">
            <GlobalFunnel />
          </div>

          {/* Funnel Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-900/10">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Overall Conversion</div>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono">6.4%</div>
              <div className="text-[10px] text-slate-400 mt-1">Impression → Purchase</div>
            </div>
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-900/10">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Biggest Drop-off</div>
              <div className="text-2xl font-extrabold text-red-300 font-mono">7,418</div>
              <div className="text-[10px] text-slate-400 mt-1">Engagement stage (−43%)</div>
            </div>
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/10">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Best Stage Retention</div>
              <div className="text-2xl font-extrabold text-blue-300 font-mono">78.8%</div>
              <div className="text-[10px] text-slate-400 mt-1">Checkout → Purchase</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
