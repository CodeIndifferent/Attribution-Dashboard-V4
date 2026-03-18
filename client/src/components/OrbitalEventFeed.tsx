/*
 * Live resolution event feed with auto-refresh every 4 seconds
 */
import { useEffect, useState } from "react";
import { resolutionEvents, ResolutionEvent } from "@/lib/orbitalData";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Link2, Zap, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const eventIcons = {
  identity_resolved: <CheckCircle className="w-4 h-4 text-green-400" />,
  session_linked: <Link2 className="w-4 h-4 text-blue-400" />,
  device_matched: <Zap className="w-4 h-4 text-yellow-400" />,
  conversion: <TrendingUp className="w-4 h-4 text-green-500" />,
};

const eventColors = {
  identity_resolved: 'from-green-900/30 to-green-900/10 border-green-500/20',
  session_linked: 'from-blue-900/30 to-blue-900/10 border-blue-500/20',
  device_matched: 'from-yellow-900/30 to-yellow-900/10 border-yellow-500/20',
  conversion: 'from-green-900/40 to-green-900/20 border-green-500/30',
};

export default function OrbitalEventFeed() {
  const [events, setEvents] = useState<ResolutionEvent[]>(resolutionEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        // Simulate new events
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
    <div className="rounded-lg border border-blue-900/30 overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-blue-900/20 bg-slate-900/50">
        <div>
          <h3 className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            Live Resolution Events
          </h3>
          <p className="text-xs text-blue-300/60 mt-0.5">Real-time identity resolution stream</p>
        </div>
        <div className={cn(
          "p-2 rounded-lg transition-all",
          isRefreshing ? "bg-blue-500/30" : "bg-slate-700/30"
        )}>
          <RefreshCw className={cn(
            "w-4 h-4 text-blue-300",
            isRefreshing && "animate-spin"
          )} />
        </div>
      </div>

      <div className="divide-y divide-blue-900/20 max-h-96 overflow-y-auto">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={cn(
              "p-4 hover:bg-slate-800/50 transition-colors border-l-4",
              idx === 0 ? "border-l-blue-400 bg-slate-800/30" : "border-l-slate-700"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                {eventIcons[event.type]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-blue-200">{event.userId}</span>
                  <Badge className={cn(
                    "text-[9px] px-1.5 py-0 h-4 border capitalize",
                    event.type === 'identity_resolved' && "bg-green-900/50 text-green-200 border-green-500/30",
                    event.type === 'session_linked' && "bg-blue-900/50 text-blue-200 border-blue-500/30",
                    event.type === 'device_matched' && "bg-yellow-900/50 text-yellow-200 border-yellow-500/30",
                    event.type === 'conversion' && "bg-green-900/60 text-green-100 border-green-500/40",
                  )}>
                    {event.type.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <p className="text-xs text-blue-200 mb-2">{event.description}</p>

                <div className="flex items-center gap-3 text-[10px] text-blue-300/70 font-mono">
                  <span>Confidence: <span className="text-blue-200 font-semibold">{event.confidence.toFixed(1)}%</span></span>
                  <span>•</span>
                  <span>Devices: <span className="text-blue-200 font-semibold">{event.devices}</span></span>
                  <span>•</span>
                  <span>Sessions: <span className="text-blue-200 font-semibold">{event.sessions}</span></span>
                </div>

                <div className="text-[9px] text-blue-300/50 mt-1.5">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-blue-900/20 bg-slate-900/30 text-center">
        <span className="text-[10px] text-blue-300/60">
          Refreshing every 4 seconds • {events.length} recent events
        </span>
      </div>
    </div>
  );
}
