/*
 * Redesigned KPI cards with glassmorphic styling, luminous effects, and count-up animations
 */
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { orbitalKPIs, resolutionTrend } from "@/lib/orbitalData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OrbitalKPICardsV2() {
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

  const colorMap: Record<string, { glow: string; border: string; accent: string }> = {
    'from-blue-600 to-blue-400': {
      glow: 'glow-blue',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-300'
    },
    'from-green-600 to-green-400': {
      glow: 'glow-emerald',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-300'
    },
    'from-purple-600 to-purple-400': {
      glow: 'glow-blue',
      border: 'border-purple-500/30',
      accent: 'text-purple-300'
    },
    'from-amber-600 to-amber-400': {
      glow: 'glow-amber',
      border: 'border-amber-500/30',
      accent: 'text-amber-300'
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orbitalKPIs.map((kpi, idx) => {
          const colorConfig = colorMap[kpi.color] || colorMap['from-blue-600 to-blue-400'];
          return (
            <div
              key={idx}
              className={`glass-card p-6 group hover:scale-105 transition-transform duration-300 ${colorConfig.glow}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-xs text-cyan-300 uppercase tracking-widest font-semibold mb-2">
                    {kpi.label}
                  </div>
                  <div className={`text-4xl font-extrabold font-mono mb-1 ${colorConfig.accent}`}>
                    {kpi.unit === '%'
                      ? displayValues[idx].toFixed(1)
                      : kpi.unit === 'sessions'
                        ? displayValues[idx].toFixed(1)
                        : Math.round(displayValues[idx]).toLocaleString()}
                    <span className="text-xl ml-1 opacity-60">{kpi.unit}</span>
                  </div>
                </div>
                
                {/* Trend Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm ${
                  kpi.trend > 0
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/20 border border-red-500/40 text-red-300'
                }`}>
                  {kpi.trend > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs font-bold">{Math.abs(kpi.trend).toFixed(1)}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-2 rounded-full bg-slate-800/50 overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full bg-gradient-to-r ${kpi.color} transition-all duration-300 shadow-lg`}
                    style={{ width: `${(displayValues[idx] / kpi.target) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-300 font-mono font-semibold">
                    {((displayValues[idx] / kpi.target) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Target Info */}
              <div className="mt-4 pt-4 border-t border-slate-700/30 flex items-center justify-between">
                <span className="text-xs text-slate-400">Target</span>
                <span className="text-sm font-mono text-cyan-300/80">{kpi.target}{kpi.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Trend Chart */}
      <div className="glass-card p-6 glow-blue">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-extrabold text-cyan-100" style={{ fontFamily: 'Syne, sans-serif' }}>
              30-Day Resolution Trend
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">Identity resolution performance over time with confidence metrics</p>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={resolutionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUnresolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ color: '#06b6d4' }}
              formatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorResolved)"
              name="Resolved"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="unresolved"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorUnresolved)"
              name="Unresolved"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Confidence Metric */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Current Confidence</div>
            <div className="text-xl font-bold text-cyan-300 font-mono">
              {resolutionTrend[resolutionTrend.length - 1].confidence.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-emerald-500/20">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Resolved</div>
            <div className="text-xl font-bold text-emerald-300 font-mono">
              {(resolutionTrend[resolutionTrend.length - 1].resolved / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-red-500/20">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Unresolved</div>
            <div className="text-xl font-bold text-red-300 font-mono">
              {(resolutionTrend[resolutionTrend.length - 1].unresolved / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
