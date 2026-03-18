/*
 * CAMPAIGN PERFORMANCE - Modern vibrant charts with gradients and animations
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { campaignPerformanceData } from "@/lib/dashboardSampleData";
import { vibrantColors, chartStyles } from "@/lib/chartConfig";

const campaignData = campaignPerformanceData.slice(0, 3).map(c => ({
  name: c.name,
  channel: c.channels,
  spend: c.spend,
  revenue: c.revenue,
  conversions: c.conversions,
  cpa: c.cpa,
  roas: c.roas,
  trend: c.trend,
}));

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.name}</div>
      <div className="text-blue-300">ROAS: <span className="font-mono text-cyan-400 font-bold">{payload[0]?.payload?.roas}x</span></div>
    </div>
  );
};

export default function CampaignPerformance() {
  return (
    <div className="space-y-6">
      {/* ROAS Chart - Vibrant Bar Chart */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        {/* Background gradient glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                ROAS by Campaign
              </span>
              <p className="text-xs text-blue-300/60 mt-0.5">Return on Ad Spend Performance</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={campaignData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRoas1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorRoas2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorRoas3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
              <Bar dataKey="roas" name="ROAS" radius={[12, 12, 0, 0]} animationDuration={800}>
                <Cell fill="url(#colorRoas1)" />
                <Cell fill="url(#colorRoas2)" />
                <Cell fill="url(#colorRoas3)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Table - Enhanced with vibrant styling */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-orange-300" style={{ fontFamily: 'Syne, sans-serif' }}>
              Campaign Performance
            </span>
            <p className="text-xs text-orange-300/60 mt-0.5">Detailed metrics across all active campaigns</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                {['Campaign', 'Channel', 'Spend', 'Revenue', 'Conversions', 'CPA', 'ROAS', 'Trend'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaignData.map((row, i) => (
                <tr key={i} className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-cyan-100 group-hover:text-cyan-200">{row.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="text-[10px] px-2.5 py-1 h-5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-cyan-300 border-cyan-500/50 font-semibold">
                      {row.channel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-blue-300/80">${row.spend.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-green-400 font-bold">${row.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-cyan-300">{row.conversions.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-blue-300/80">${row.cpa.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-900/50 to-cyan-900/50 overflow-hidden border border-cyan-500/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${Math.min((row.roas / 8) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold w-10">{row.roas.toFixed(2)}x</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-mono font-bold ${row.trend.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {row.trend}
                    </span>
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
