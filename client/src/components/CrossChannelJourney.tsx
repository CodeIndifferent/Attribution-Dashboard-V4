/*
 * CROSS-CHANNEL JOURNEY - Vibrant dark orbital theme
 * Visualization showing drop-offs and conversions
 */
import { Route, ArrowRight, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JourneyStep {
  channel: string;
  event: string;
  timestamp: string;
  status: 'completed' | 'abandoned' | 'converted';
  users: number;
  conversionRate: number;
}

interface JourneyPath {
  id: string;
  path: string[];
  users: number;
  conversions: number;
  conversionRate: number;
  avgTimeToConvert: string;
}

const journeyPaths: JourneyPath[] = [
  {
    id: 'path1',
    path: ['Twitter', 'Direct', 'Purchase'],
    users: 847,
    conversions: 127,
    conversionRate: 15.0,
    avgTimeToConvert: '2.3 days',
  },
  {
    id: 'path2',
    path: ['Google Ads', 'Organic', 'Purchase'],
    users: 1203,
    conversions: 156,
    conversionRate: 13.0,
    avgTimeToConvert: '3.1 days',
  },
  {
    id: 'path3',
    path: ['Meta', 'Email', 'Purchase'],
    users: 654,
    conversions: 98,
    conversionRate: 15.0,
    avgTimeToConvert: '1.8 days',
  },
  {
    id: 'path4',
    path: ['Email', 'Direct', 'Purchase'],
    users: 421,
    conversions: 89,
    conversionRate: 21.1,
    avgTimeToConvert: '0.9 days',
  },
  {
    id: 'path5',
    path: ['Twitter', 'Google Ads', 'Email', 'Purchase'],
    users: 312,
    conversions: 52,
    conversionRate: 16.7,
    avgTimeToConvert: '5.2 days',
  },
];

const channelColors: Record<string, { bg: string; text: string; border: string }> = {
  'Twitter': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Google Ads': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  'Meta': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Email': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  'Direct': { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  'Organic': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  'Purchase': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
};

// Funnel data showing drop-offs
const funnelStages = [
  { stage: 'Campaign Click', count: 12847, pct: 100, status: 'completed' as const },
  { stage: 'Site Visit', count: 8934, pct: 69.5, status: 'completed' as const },
  { stage: 'Product View', count: 5203, pct: 40.5, status: 'completed' as const },
  { stage: 'Add to Cart', count: 2847, pct: 22.1, status: 'completed' as const },
  { stage: 'Checkout', count: 1924, pct: 15.0, status: 'completed' as const },
  { stage: 'Purchase', count: 847, pct: 6.6, status: 'converted' as const },
];

export default function CrossChannelJourney() {
  return (
    <div className="space-y-6">
      {/* Conversion Funnel */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Route className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                Conversion Funnel (All Campaigns)
              </span>
              <p className="text-xs text-blue-300/60 mt-0.5">Track user progression through each stage</p>
            </div>
          </div>
          <div className="space-y-4">
            {funnelStages.map((stage, i) => {
              const dropoff = i > 0 ? funnelStages[i - 1].count - stage.count : 0;
              const dropoffPct = i > 0 ? ((dropoff / funnelStages[i - 1].count) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 text-xs text-right shrink-0">
                    <div className="font-bold text-cyan-300">{stage.stage}</div>
                    {i > 0 && <div className="text-orange-400 text-[10px] mt-1 font-semibold">↓ {dropoffPct}%</div>}
                  </div>
                  <div className="flex-1 h-12 rounded-lg bg-slate-800/50 border border-cyan-500/20 overflow-hidden relative flex items-center group hover:border-cyan-500/40 transition-all">
                    <div
                      className={cn("h-full rounded-lg transition-all duration-500",
                        stage.status === 'converted' 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                          : "bg-gradient-to-r from-cyan-500 to-blue-500"
                      )}
                      style={{ width: `${stage.pct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-xs font-mono text-white font-bold">{stage.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-12 text-xs font-mono text-cyan-400 shrink-0 text-right font-bold">{stage.pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Conversion Paths */}
      <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-green-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                Top Conversion Paths
              </span>
              <p className="text-xs text-green-300/60 mt-0.5">Most successful user journeys to conversion</p>
            </div>
          </div>
          <div className="space-y-3">
            {journeyPaths.map((path, i) => (
              <div 
                key={path.id} 
                className="flex items-center gap-4 p-4 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-green-400 to-emerald-500 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    {path.path.map((channel, j) => (
                      <div key={j} className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${channelColors[channel]?.bg || 'bg-slate-500/20'} ${channelColors[channel]?.text || 'text-slate-300'} ${channelColors[channel]?.border || 'border-slate-500/30'}`}
                        >
                          {channel}
                        </span>
                        {j < path.path.length - 1 && <ArrowRight className="w-3 h-3 text-green-500/60" />}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-green-300/70 font-medium">
                    <span>{path.users.toLocaleString()} users</span>
                    <span className="text-green-400 font-bold">{path.conversions} conversions</span>
                    <span>Avg: {path.avgTimeToConvert}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-green-400">{path.conversionRate.toFixed(1)}%</div>
                  <div className="text-[10px] text-green-300/60 font-semibold">Conv. Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="rounded-lg border border-orange-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-orange-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                Drop-off Hotspots
              </span>
              <p className="text-xs text-orange-300/60 mt-0.5">Critical areas where users abandon their journey</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/15 transition-all">
              <div>
                <div className="text-sm font-bold text-orange-300">High drop-off: Site Visit → Product View</div>
                <div className="text-xs text-orange-300/70 mt-1 font-medium">3,731 users abandoned (41.8% drop)</div>
              </div>
              <Badge className="text-[10px] px-3 py-1 h-6 bg-orange-500/30 text-orange-300 border-orange-500/50 font-bold">
                Investigate
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/15 transition-all">
              <div>
                <div className="text-sm font-bold text-red-300">Critical: Checkout → Purchase</div>
                <div className="text-xs text-red-300/70 mt-1 font-medium">1,077 users abandoned (55.9% drop)</div>
              </div>
              <Badge className="text-[10px] px-3 py-1 h-6 bg-red-500/30 text-red-300 border-red-500/50 font-bold">
                Critical
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
