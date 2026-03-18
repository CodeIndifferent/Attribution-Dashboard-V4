/*
 * DESIGN: Dark Orbital — User journey flows with cross-device timeline visualization
 */
import { userProfiles } from "@/lib/mockData";
import { Route, Monitor, Smartphone, Mail, Globe, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const channelColors: Record<string, string> = {
  'Organic Search': '#3b82f6',
  'Paid Search': '#8b5cf6',
  'Paid Social': '#f59e0b',
  'Email': '#10b981',
  'Organic Social': '#06b6d4',
  'Referral': '#f43f5e',
  'Direct': '#64748b',
};

const channelIcons: Record<string, React.ElementType> = {
  'Organic Search': Globe,
  'Paid Search': Zap,
  'Paid Social': Monitor,
  'Email': Mail,
  'Organic Social': Globe,
  'Referral': ArrowRight,
  'Direct': Monitor,
};

// Funnel data
const funnelStages = [
  { stage: 'First Touch', count: 284_721, pct: 100, color: '#3b82f6' },
  { stage: 'Engaged', count: 198_304, pct: 69.6, color: '#8b5cf6' },
  { stage: 'Multi-Session', count: 142_360, pct: 50.0, color: '#06b6d4' },
  { stage: 'Cross-Device', count: 76_874, pct: 27.0, color: '#10b981' },
  { stage: 'Converted', count: 19_630, pct: 6.9, color: '#f59e0b' },
];

// Path flows
const topPaths = [
  { path: ['Organic Search', 'Direct', 'Email', 'Purchase'], count: 12_840, pct: 4.5 },
  { path: ['Paid Social', 'Direct', 'Purchase'], count: 9_820, pct: 3.5 },
  { path: ['Paid Search', 'Email', 'Purchase'], count: 8_460, pct: 3.0 },
  { path: ['Referral', 'Organic Search', 'Direct', 'Purchase'], count: 6_210, pct: 2.2 },
  { path: ['Email', 'Direct', 'Purchase'], count: 5_760, pct: 2.0 },
  { path: ['Organic Social', 'Paid Social', 'Email', 'Purchase'], count: 4_120, pct: 1.4 },
];

function JourneyCard({ profile }: { profile: typeof userProfiles[0] }) {
  return (
    <div className="rounded-xl border border-white/[0.08] p-4 hover:border-blue-500/20 transition-all"
      style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-white">{profile.name}</div>
          <div className="text-[11px] text-white/40 font-mono">{profile.devices} devices · {profile.sessions} sessions</div>
        </div>
        <div className={cn(
          "text-[10px] px-2 py-1 rounded-full font-medium",
          profile.status === 'resolved' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            profile.status === 'fragmented' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-slate-500/10 text-slate-400 border border-slate-500/20"
        )}>
          {profile.confidence}% confidence
        </div>
      </div>

      {/* Journey timeline */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {profile.touchpoints.map((tp, i) => {
          const Icon = channelIcons[tp.channel] || Globe;
          const color = channelColors[tp.channel] || '#64748b';
          return (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div className="text-[9px] text-white/30 text-center max-w-[50px] truncate">{tp.event}</div>
              </div>
              {i < profile.touchpoints.length - 1 && (
                <ArrowRight className="w-3 h-3 text-white/15 shrink-0 mb-3" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.05]">
        <div className="text-[10px] text-white/30">First: <span className="text-white/50">{profile.channel}</span></div>
        <div className="text-[10px] text-white/30">LTV: <span className="text-emerald-400 font-mono">${profile.ltv.toLocaleString()}</span></div>
        <div className="text-[10px] text-white/30 ml-auto">{profile.location}</div>
      </div>
    </div>
  );
}

export default function JourneysPanel() {
  return (
    <div className="space-y-4">
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.08]" style={{ minHeight: '120px' }}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663444090836/bcu7fJXB4mRs4q8aJj5dGs/user-journey-bg-f5U6Z67PxPcKv9xnfJFcvd.webp"
          alt="Journey"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, oklch(0.085 0.015 260 / 0.9) 0%, transparent 60%)' }} />
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>User Journey Mapping</span>
            </div>
            <p className="text-xs text-white/50 max-w-md">
              Track how users move across sessions, devices, and channels — from first touch to conversion.
            </p>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Avg Touchpoints', value: '4.2' },
              { label: 'Cross-Device Rate', value: '27%' },
              { label: 'Avg Days to Convert', value: '8.4' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.value}</div>
                <div className="text-[10px] text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="rounded-xl border border-white/[0.08] p-5" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
        <div className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Identity Resolution Funnel</div>
        <div className="space-y-2">
          {funnelStages.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-28 text-xs text-white/60 text-right shrink-0">{stage.stage}</div>
              <div className="flex-1 h-8 rounded bg-white/[0.04] overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700"
                  style={{ width: `${stage.pct}%`, backgroundColor: stage.color, opacity: 0.7 }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-mono text-white font-medium">{stage.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-12 text-xs font-mono text-white/40 shrink-0">{stage.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top conversion paths */}
      <div className="rounded-xl border border-white/[0.08] p-5" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
        <div className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Top Conversion Paths</div>
        <div className="space-y-3">
          {topPaths.map((path, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40 bg-white/[0.05] shrink-0">
                {i + 1}
              </div>
              <div className="flex items-center gap-1 flex-1 flex-wrap">
                {path.path.map((step, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor: step === 'Purchase' ? '#10b98120' : `${channelColors[step] || '#64748b'}20`,
                        color: step === 'Purchase' ? '#10b981' : channelColors[step] || '#94a3b8',
                        border: `1px solid ${step === 'Purchase' ? '#10b98130' : `${channelColors[step] || '#64748b'}30`}`
                      }}
                    >
                      {step}
                    </span>
                    {j < path.path.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-white/20" />}
                  </div>
                ))}
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono text-white/60">{path.count.toLocaleString()}</div>
                <div className="text-[10px] text-white/30">{path.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual journey cards */}
      <div>
        <div className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Individual Journeys</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userProfiles.filter(p => p.touchpoints.length > 1).map(profile => (
            <JourneyCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
}
