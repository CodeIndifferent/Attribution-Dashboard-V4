/*
 * DESIGN: Dark Orbital — Campaign attribution with bar charts and channel breakdown
 */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { campaignData, channelDistribution, deviceBreakdown } from "@/lib/mockData";
import { BarChart3, Target, Layers, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 p-3 text-xs"
      style={{ background: 'oklch(0.14 0.018 255)', backdropFilter: 'blur(12px)' }}>
      <div className="font-semibold text-white mb-2">{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill || entry.color }} />
          <span className="text-white/60">{entry.name}:</span>
          <span className="font-mono text-white">
            {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

function CampaignTable() {
  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.07]">
        <Target className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Campaign Attribution
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Campaign', 'Channel', 'Identities', 'Sessions', 'Conversions', 'Revenue', 'Conv. Rate'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaignData.map((row, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
                    <span className="text-sm text-white font-medium">{row.campaign}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-white/60">{row.channel}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono text-white/70">{row.identities.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono text-white/60">{row.sessions.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono text-white/70">{row.conversions.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono text-emerald-400">${row.revenue.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${(row.conversions / row.sessions * 100).toFixed(1)}%`,
                        backgroundColor: row.color
                      }} />
                    </div>
                    <span className="text-[11px] font-mono text-white/50">
                      {(row.conversions / row.sessions * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChannelBarChart() {
  return (
    <div className="rounded-xl border border-white/[0.08] p-5" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <Layers className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Sessions by Channel
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={channelDistribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="channel"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'Geist Mono' }}
            tickLine={false}
            axisLine={false}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'Geist Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sessions" name="Sessions" radius={[3, 3, 0, 0]}>
            {channelDistribution.map((_, i) => (
              <Cell key={i} fill={`oklch(0.6 0.22 ${250 + i * 15})`} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DeviceDonut() {
  return (
    <div className="rounded-xl border border-white/[0.08] p-5" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Device Breakdown
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={deviceBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
            >
              {deviceBreakdown.map((entry, i) => (
                <Cell key={i} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {deviceBreakdown.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-white/60">{item.name}</span>
              </div>
              <span className="text-xs font-mono text-white/70">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AttributionPanel() {
  return (
    <div className="space-y-4">
      <CampaignTable />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChannelBarChart />
        <DeviceDonut />
      </div>
    </div>
  );
}
