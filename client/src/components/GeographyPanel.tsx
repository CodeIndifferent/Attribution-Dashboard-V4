/*
 * DESIGN: Dark Orbital — Geographic distribution with world map background and country table
 */
import { geoDistribution } from "@/lib/mockData";
import { Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 p-3 text-xs"
      style={{ background: 'oklch(0.14 0.018 255)', backdropFilter: 'blur(12px)' }}>
      <div className="font-semibold text-white mb-1">{label}</div>
      <div className="text-white/60">Users: <span className="font-mono text-white">{payload[0]?.value?.toLocaleString()}</span></div>
    </div>
  );
};

const flagEmojis: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'Canada': '🇨🇦',
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Japan': '🇯🇵',
  'Netherlands': '🇳🇱',
  'Brazil': '🇧🇷',
  'Other': '🌍',
};

export default function GeographyPanel() {
  const top9 = geoDistribution.slice(0, 9);

  return (
    <div className="space-y-4">
      {/* World Map Visual */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden relative" style={{ background: 'oklch(0.1 0.018 258 / 0.5)', minHeight: '280px' }}>
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663444090836/bcu7fJXB4mRs4q8aJj5dGs/world-map-bg-aafr3tT9sCJvYm8w3TcCar.webp"
            alt="World Map"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, oklch(0.085 0.015 260))' }} />
        </div>

        <div className="relative z-10 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Geographic Distribution
            </span>
          </div>

          {/* Floating stat cards */}
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: 'Countries', value: '47' },
              { label: 'Top Region', value: 'North America' },
              { label: 'EMEA Share', value: '26.5%' },
              { label: 'APAC Share', value: '11.5%' },
            ].map(stat => (
              <div key={stat.label} className="px-3 py-2 rounded-lg border border-white/[0.08] bg-black/40 backdrop-blur-sm">
                <div className="text-[10px] text-white/40">{stat.label}</div>
                <div className="text-sm font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Country breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table */}
        <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Top Countries</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {geoDistribution.map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-base">{flagEmojis[row.country] || '🌐'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/80 truncate">{row.country}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{ width: `${(row.pct / 35) * 100}%`, opacity: 0.7 + (row.pct / 100) }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-white/70">{row.users.toLocaleString()}</div>
                  <div className="text-[10px] text-white/30">{row.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-xl border border-white/[0.08] p-5" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
          <div className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Users by Country
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={top9}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'Geist Mono' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <YAxis
                type="category"
                dataKey="country"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'Geist' }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" radius={[0, 3, 3, 0]}>
                {top9.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`oklch(${0.65 - i * 0.03} 0.2 ${250 + i * 8})`}
                    opacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
