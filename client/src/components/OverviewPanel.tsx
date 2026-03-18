/*
 * DESIGN: Dark Orbital — Overview dashboard combining KPIs, resolution chart, live feed, and graph preview
 */
import LiveFeed from "./LiveFeed";
import AnimatedGraph from "./AnimatedGraph";
import { Fingerprint } from "lucide-react";

export default function OverviewPanel() {
  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, oklch(0.12 0.025 255) 0%, oklch(0.1 0.02 270) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("https://d2xsxph8kpxj0f.cloudfront.net/310519663444090836/bcu7fJXB4mRs4q8aJj5dGs/identity-graph-hero-RN78Pww552UPsonTcuT2Ag.webp")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, oklch(0.1 0.02 260 / 0.95) 0%, oklch(0.1 0.02 260 / 0.6) 100%)' }} />
        <div className="relative z-10 px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-mono text-blue-400/80 uppercase tracking-widest">Identity Resolution Protocol</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Unified Identity Graph
            </h2>
            <p className="text-sm text-white/50 mt-1 max-w-lg">
              Mapping fragmented digital activity into persistent user identities across sessions, devices, and channels.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Resolution Rate', value: '84.9%', color: 'text-emerald-400' },
              { label: 'Avg Confidence', value: '91.2%', color: 'text-blue-400' },
              { label: 'Graph Nodes', value: '1.2M', color: 'text-violet-400' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'Syne, sans-serif' }}>{stat.value}</div>
                <div className="text-[11px] text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Chart placeholder */}
        </div>
        <div>
          <LiveFeed />
        </div>
      </div>

      {/* Identity Graph preview */}
      <AnimatedGraph />
    </div>
  );
}
