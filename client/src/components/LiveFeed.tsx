/*
 * DESIGN: Dark Orbital — Live event feed with animated entries
 */
import { useEffect, useState } from "react";
import { recentEvents } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, UserPlus, Activity } from "lucide-react";

const eventConfig = {
  resolved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  fragmented: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  new: { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function LiveFeed() {
  const [events, setEvents] = useState(recentEvents.slice(0, 6));
  const [newEventId, setNewEventId] = useState<number | null>(null);

  // Simulate live events
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['resolved', 'new', 'fragmented'] as const;
      const names = ['Anon-' + Math.floor(Math.random() * 9000 + 1000), 'User-' + Math.floor(Math.random() * 999)];
      const actions = [
        'Cross-device identity merged',
        'New anonymous session started',
        'Email match confirmed identity',
        'Fingerprint match resolved',
        'Session linked to known profile',
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const newEvent = {
        id: Date.now(),
        type,
        user: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        devices: Math.floor(Math.random() * 3) + 1,
        time: 'just now',
        confidence: Math.floor(Math.random() * 60) + 40,
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 7)]);
      setNewEventId(newEvent.id);
      setTimeout(() => setNewEventId(null), 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Live Resolution Feed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-mono">Live</span>
        </div>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {events.map((event) => {
          const config = eventConfig[event.type as keyof typeof eventConfig] || eventConfig.new;
          const Icon = config.icon;
          const isNew = event.id === newEventId;

          return (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-3 px-5 py-3 transition-all duration-300",
                isNew ? "bg-blue-500/[0.08]" : "hover:bg-white/[0.02]"
              )}
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border", config.bg, config.border)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white truncate">{event.user}</span>
                  <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", config.bg, config.color)}>
                    {event.confidence}%
                  </span>
                </div>
                <div className="text-[11px] text-white/40 truncate mt-0.5">{event.action}</div>
              </div>

              <div className="text-[10px] text-white/30 font-mono shrink-0">{event.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
