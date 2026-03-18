/*
 * Redesigned event feed with glassmorphic styling and luminous effects
 */
import { useEffect, useState } from "react";
import { resolutionEvents, ResolutionEvent } from "@/lib/orbitalData";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Link2, Zap, TrendingUp, RefreshCw, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const eventIcons = {
  identity_resolved: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  session_linked: <Link2 className="w-4 h-4 text-cyan-400" />,
  device_matched: <Zap className="w-4 h-4 text-amber-400" />,
  conversion: <TrendingUp className="w-4 h-4 text-emerald-500" />,
};

const eventGlows = {
  identity_resolved: 'glow-emerald',
  session_linked: 'glow-blue',
  device_matched: 'glow-amber',
  conversion: 'glow-emerald',
};

export default function OrbitalEventFeedV2() {
  const [events, setEvents] = useState<ResolutionEvent[]>(resolutionEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        const newEvent: ResolutionEvent = {
          id: `evt_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: ['identity_resolved', 'session_linked', 'device_matched', 'conversion'][
            Math.floor(Math.random() * 4)
          ] as ResolutionEvent['type'],
          userId: `USR_${Math.floor(Math.random() * 5) + 1}`,
          description: [
            'Identity resolved: Email + Device fingerprint matched',
            'Session linked: Twitter click → Direct visit',
            'Device matched: IP + Browser fingerprint',
            'Conversion tracked: $149.99 purchase',
          ][Math.floor(Math.random() * 4)],
          confidence: 85 + Math.random() * 15,
          devices: Math.floor(Math.random() * 4) + 1,
          sessions: Math.floor(Math.random() * 12) + 1,
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        setIsRefreshing(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-xl overflow-hidden glow-blue">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/50">
        <div>
          <h3 className="text-sm font-bold text-cyan-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Live Resolution Events
          </h3>
          <p className="text-xs text-slate-400 mt-1">Real-time identity resolution stream</p>
        </div>
        <div className={cn(
          "p-2.5 rounded-lg transition-all",
          isRefreshing ? "bg-cyan-500/30" : "bg-slate-800/50"
        )}>
          <RefreshCw className={cn(
            "w-4 h-4 text-cyan-400",
            isRefreshing && "animate-spin"
          )} />
        </div>
      </div>

      <div className="divide-y divide-slate-700/30 max-h-96 overflow-y-auto">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={cn(
              "p-4 hover:bg-slate-800/30 transition-all border-l-4 group",
              idx === 0 ? "border-l-cyan-400 bg-slate-800/50" : "border-l-slate-700/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                {eventIcons[event.type]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-300">{event.userId}</span>
                  <Badge className={cn(
                    "text-[8px] px-2 py-0.5 h-5 border capitalize font-semibold",
                    event.type === 'identity_resolved' && "bg-emerald-900/50 text-emerald-200 border-emerald-500/40",
                    event.type === 'session_linked' && "bg-cyan-900/50 text-cyan-200 border-cyan-500/40",
                    event.type === 'device_matched' && "bg-amber-900/50 text-amber-200 border-amber-500/40",
                    event.type === 'conversion' && "bg-emerald-900/60 text-emerald-100 border-emerald-500/50",
                  )}>
                    {event.type.replace(/_/g, ' ')}
                  </Badge>
                  {idx === 0 && (
                    <Radio className="w-2.5 h-2.5 text-cyan-400 ml-auto animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-slate-200 mb-2 leading-relaxed">{event.description}</p>

                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="text-cyan-300 font-semibold">{event.confidence.toFixed(1)}%</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Devices:</span>
                    <span className="text-emerald-300 font-semibold">{event.devices}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Sessions:</span>
                    <span className="text-amber-300 font-semibold">{event.sessions}</span>
                  </span>
                </div>

                <div className="text-[8px] text-slate-500 mt-2">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 border-t border-slate-700/30 bg-slate-900/30 text-center">
        <span className="text-[10px] text-slate-400">
          Refreshing every 4 seconds • {events.length} recent events
        </span>
      </div>
    </div>
  );
}
