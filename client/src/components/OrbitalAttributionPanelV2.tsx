/*
 * Redesigned attribution panel with glassmorphic styling and enhanced visualizations
 */
import { attributionChannels } from "@/lib/orbitalData";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

export default function OrbitalAttributionPanelV2() {
  const totalRevenue = attributionChannels.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = attributionChannels.reduce((sum, c) => sum + c.conversions, 0);

  const chartData = attributionChannels.map(c => ({
    channel: c.channel,
    roas: c.roas,
    conversions: c.conversions,
  }));

  const channelColors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass-card p-5 glow-blue">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Total Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">${(totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[9px] text-slate-500 mt-1">From all channels</div>
        </div>
        <div className="glass-card p-5 glow-blue">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Total Conversions</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">{totalConversions.toLocaleString()}</div>
          <div className="text-[9px] text-slate-500 mt-1">Across campaigns</div>
        </div>
        <div className="glass-card p-5 glow-amber">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Avg ROAS</div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            {(attributionChannels.reduce((sum, c) => sum + c.roas, 0) / attributionChannels.length).toFixed(1)}x
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Return on ad spend</div>
        </div>
      </div>

      {/* ROAS Chart */}
      <div className="glass-card p-6 glow-blue">
        <h3 className="text-sm font-bold text-cyan-100 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          ROAS by Channel
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="channel" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ color: '#06b6d4' }}
            />
            <Bar dataKey="roas" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={channelColors[index % channelColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Breakdown */}
      <div className="glass-card rounded-xl overflow-hidden glow-blue">
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/50">
          <h3 className="text-sm font-bold text-cyan-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Channel Performance
          </h3>
        </div>

        <div className="divide-y divide-slate-700/30">
          {attributionChannels.map((channel, idx) => (
            <div key={idx} className="p-5 hover:bg-slate-800/30 transition-all border-l-4 border-l-slate-700/50 hover:border-l-cyan-500/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-slate-100">{channel.channel}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {channel.conversions.toLocaleString()} conversions • ${channel.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-cyan-300 font-mono">{channel.roas.toFixed(1)}x</div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-bold mt-1 justify-end",
                    channel.trend > 0 ? "text-emerald-400" : "text-red-400"
                  )}>
                    {channel.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(channel.trend).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Conversion Rate Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Conversion Rate</span>
                  <span className="text-cyan-300 font-mono font-semibold">{channel.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800/50 overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500 shadow-lg"
                    style={{ width: `${channel.conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performer */}
      <div className="glass-card p-5 border-emerald-500/30 glow-emerald">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200 mb-1">Top Performer</h4>
            <p className="text-xs text-slate-300">
              <span className="font-bold text-emerald-300">{attributionChannels[0].channel}</span> leads with <span className="text-amber-300 font-semibold">{attributionChannels[0].roas.toFixed(1)}x ROAS</span> and <span className="text-cyan-300 font-semibold">{attributionChannels[0].conversionRate.toFixed(1)}%</span> conversion rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
