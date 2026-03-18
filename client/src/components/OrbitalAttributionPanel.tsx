/*
 * Attribution panel with campaign breakdown and conversion rate bars
 */
import { attributionChannels } from "@/lib/orbitalData";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

export default function OrbitalAttributionPanel() {
  const totalRevenue = attributionChannels.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = attributionChannels.reduce((sum, c) => sum + c.conversions, 0);

  const chartData = attributionChannels.map(c => ({
    channel: c.channel,
    roas: c.roas,
    conversions: c.conversions,
  }));

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
          <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-2">Total Revenue</div>
          <div className="text-2xl font-bold text-green-300 font-mono">${(totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-blue-300/60 mt-1">From all channels</div>
        </div>
        <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
          <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-2">Total Conversions</div>
          <div className="text-2xl font-bold text-blue-300 font-mono">{totalConversions.toLocaleString()}</div>
          <div className="text-[10px] text-blue-300/60 mt-1">Across campaigns</div>
        </div>
        <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
          <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-2">Avg ROAS</div>
          <div className="text-2xl font-bold text-purple-300 font-mono">
            {(attributionChannels.reduce((sum, c) => sum + c.roas, 0) / attributionChannels.length).toFixed(1)}x
          </div>
          <div className="text-[10px] text-blue-300/60 mt-1">Return on ad spend</div>
        </div>
      </div>

      {/* ROAS Chart */}
      <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <h3 className="text-sm font-semibold text-blue-200 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          ROI by Channel
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
            <XAxis dataKey="channel" stroke="rgba(147, 197, 253, 0.5)" style={{ fontSize: '11px' }} />
            <YAxis stroke="rgba(147, 197, 253, 0.5)" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#93c5fd' }}
            />
            <Bar dataKey="roas" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Breakdown Table */}
      <div className="rounded-lg border border-blue-900/30 overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="px-4 py-3 border-b border-blue-900/20 bg-slate-900/50">
          <h3 className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            Channel Performance
          </h3>
        </div>

        <div className="divide-y divide-blue-900/20">
          {attributionChannels.map((channel, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-blue-200">{channel.channel}</div>
                  <div className="text-xs text-blue-300/60 mt-0.5">
                    {channel.conversions.toLocaleString()} conversions • ${channel.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-300 font-mono">{channel.roas.toFixed(1)}x</div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold mt-1",
                    channel.trend > 0 ? "text-green-400" : "text-red-400"
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
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-300/70">Conversion Rate</span>
                  <span className="text-blue-200 font-mono font-semibold">{channel.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${channel.conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performer */}
      <div className="p-4 rounded-lg border border-green-500/30 bg-gradient-to-br from-green-900/20 to-green-900/10">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-200 mb-1">Top Performer</h4>
            <p className="text-xs text-green-300/80">
              <span className="font-bold">{attributionChannels[0].channel}</span> leads with {attributionChannels[0].roas.toFixed(1)}x ROAS and {attributionChannels[0].conversionRate.toFixed(1)}% conversion rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
