/*
 * Live KPI cards with count-up animations and resolution trend chart
 */
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { orbitalKPIs, resolutionTrend } from "@/lib/orbitalData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OrbitalKPICards() {
  const [displayValues, setDisplayValues] = useState<number[]>(orbitalKPIs.map(() => 0));

  useEffect(() => {
    const intervals = orbitalKPIs.map((kpi, idx) => {
      const target = kpi.value;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[idx] = current;
          return newValues;
        });
      }, duration / steps);

      return interval;
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {orbitalKPIs.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 hover:border-blue-500/50 transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-1">
                  {kpi.label}
                </div>
                <div className={`text-3xl font-bold font-mono bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                  {kpi.unit === '%'
                    ? displayValues[idx].toFixed(1)
                    : kpi.unit === 'sessions'
                      ? displayValues[idx].toFixed(1)
                      : Math.round(displayValues[idx]).toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                kpi.trend > 0
                  ? 'bg-green-900/30 text-green-300'
                  : 'bg-red-900/30 text-red-300'
              }`}>
                {kpi.trend > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-semibold">{Math.abs(kpi.trend).toFixed(1)}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${kpi.color} transition-all duration-300`}
                style={{ width: `${(displayValues[idx] / kpi.target) * 100}%` }}
              />
            </div>

            <div className="text-[10px] text-blue-300/60 mt-2 font-mono">
              Target: {kpi.target}{kpi.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Trend Chart */}
      <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            30-Day Resolution Trend
          </h3>
          <p className="text-xs text-blue-300/60 mt-1">Identities resolved vs. unresolved over time</p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={resolutionTrend}>
            <defs>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUnresolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(147, 197, 253, 0.5)"
              style={{ fontSize: '11px' }}
            />
            <YAxis
              stroke="rgba(147, 197, 253, 0.5)"
              style={{ fontSize: '11px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#93c5fd' }}
              formatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorResolved)"
              name="Resolved"
            />
            <Area
              type="monotone"
              dataKey="unresolved"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorUnresolved)"
              name="Unresolved"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Confidence metric */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-300 uppercase tracking-wider font-medium">Avg Confidence</span>
            <span className="text-lg font-bold text-blue-200 font-mono">
              {resolutionTrend[resolutionTrend.length - 1].confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
