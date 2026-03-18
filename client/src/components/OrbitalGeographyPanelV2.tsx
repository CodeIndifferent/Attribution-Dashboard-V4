/*
 * Redesigned geographic distribution panel with glassmorphic styling
 */
import { useEffect, useRef, useState } from "react";
import { geographicData, GeographicData } from "@/lib/orbitalData";
import { MapPin, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrbitalGeographyPanelV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<GeographicData | null>(geographicData[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw animated background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(8, 15, 30, 0.95)');
    gradient.addColorStop(1, 'rgba(12, 20, 40, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw continents (simplified)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(canvas.width * 0.08, canvas.height * 0.08, canvas.width * 0.32, canvas.height * 0.42);
    ctx.fillRect(canvas.width * 0.42, canvas.height * 0.12, canvas.width * 0.28, canvas.height * 0.38);
    ctx.fillRect(canvas.width * 0.62, canvas.height * 0.2, canvas.width * 0.32, canvas.height * 0.5);

    // Draw data points with enhanced glow
    const maxUsers = Math.max(...geographicData.map(d => d.users));
    geographicData.forEach(location => {
      const x = ((location.longitude + 180) / 360) * canvas.width;
      const y = ((90 - location.latitude) / 180) * canvas.height;
      const size = 5 + (location.users / maxUsers) * 14;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      outerGlow.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
      outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      outerGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Inner glow
      const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8);
      innerGlow.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      innerGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Point
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 10px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(location.city, x, y + size + 10);
    });
  }, []);

  const totalUsers = geographicData.reduce((sum, d) => sum + d.users, 0);
  const totalRevenue = geographicData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="glass-card rounded-xl overflow-hidden glow-blue">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-cyan-500/20 bg-slate-900/50">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-cyan-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Geographic Distribution
          </h3>
          <span className="text-[10px] text-slate-400 ml-auto">Interactive world map</span>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ height: "320px", display: "block" }}
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            geographicData.forEach(location => {
              const px = ((location.longitude + 180) / 360) * rect.width;
              const py = ((90 - location.latitude) / 180) * rect.height;
              const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
              if (dist < 25) {
                setSelectedLocation(location);
              }
            });
          }}
        />
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="glass-card p-5 border-cyan-500/30 glow-blue">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-cyan-100">
                {selectedLocation.city}, {selectedLocation.country}
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Users</div>
              <div className="text-lg font-extrabold text-cyan-300 font-mono">{(selectedLocation.users / 1000).toFixed(1)}K</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-emerald-500/20">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Revenue</div>
              <div className="text-lg font-extrabold text-emerald-300 font-mono">${(selectedLocation.revenue / 1000).toFixed(0)}K</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-amber-500/20">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Conversions</div>
              <div className="text-lg font-extrabold text-amber-300 font-mono">{selectedLocation.conversions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="glass-card p-5 glow-blue">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Global Users</div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">{(totalUsers / 1000).toFixed(0)}K</div>
          <div className="text-[9px] text-slate-500 mt-1">Across {geographicData.length} cities</div>
        </div>
        <div className="glass-card p-5 glow-emerald">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Global Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">${(totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[9px] text-slate-500 mt-1">Total geographic value</div>
        </div>
      </div>

      {/* Top Locations */}
      <div className="glass-card rounded-xl overflow-hidden glow-blue">
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/50">
          <h4 className="text-sm font-bold text-cyan-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Top Locations
          </h4>
        </div>
        <div className="divide-y divide-slate-700/30">
          {geographicData.slice(0, 5).map((location, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedLocation(location)}
              className="p-4 hover:bg-slate-800/30 transition-all cursor-pointer border-l-4 border-l-slate-700/50 hover:border-l-cyan-400"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100">{location.city}</span>
                <Badge className="text-[8px] px-2 py-0.5 h-5 bg-cyan-900/50 text-cyan-200 border-cyan-500/40">
                  #{idx + 1}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>{(location.users / 1000).toFixed(1)}K users</span>
                <span className="text-emerald-300">${(location.revenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
