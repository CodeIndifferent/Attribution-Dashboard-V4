/*
 * Geographic distribution panel with world map visualization
 */
import { useEffect, useRef, useState } from "react";
import { geographicData, GeographicData } from "@/lib/orbitalData";
import { MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrbitalGeographyPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<GeographicData | null>(geographicData[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw simple world map background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw continents (simplified)
    ctx.fillStyle = 'rgba(30, 58, 138, 0.3)';
    ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.3, canvas.height * 0.4); // North America
    ctx.fillRect(canvas.width * 0.45, canvas.height * 0.15, canvas.width * 0.25, canvas.height * 0.35); // Europe/Africa
    ctx.fillRect(canvas.width * 0.65, canvas.height * 0.25, canvas.width * 0.3, canvas.height * 0.45); // Asia

    // Draw data points
    const maxUsers = Math.max(...geographicData.map(d => d.users));
    geographicData.forEach(location => {
      // Convert lat/lng to canvas coordinates
      const x = ((location.longitude + 180) / 360) * canvas.width;
      const y = ((90 - location.latitude) / 180) * canvas.height;

      // Size based on users
      const size = 4 + (location.users / maxUsers) * 12;

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Point
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(location.city, x, y + size + 8);
    });
  }, []);

  const totalUsers = geographicData.reduce((sum, d) => sum + d.users, 0);
  const totalRevenue = geographicData.reduce((sum, d) => sum + d.revenue, 0);
  const topLocation = geographicData[0];

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="rounded-lg border border-blue-900/30 overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-blue-900/20 bg-slate-900/50">
          <Globe className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            Geographic Distribution
          </h3>
          <span className="text-[10px] text-blue-400/60 ml-auto">Click to explore</span>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ height: "300px", display: "block" }}
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Simple click detection
            geographicData.forEach(location => {
              const px = ((location.longitude + 180) / 360) * rect.width;
              const py = ((90 - location.latitude) / 180) * rect.height;
              const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
              if (dist < 20) {
                setSelectedLocation(location);
              }
            });
          }}
        />
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="p-4 rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-900/10">
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-200">
                {selectedLocation.city}, {selectedLocation.country}
              </h4>
              <p className="text-xs text-blue-300/60 mt-0.5 font-mono">
                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-blue-900/30">
              <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-1 font-medium">Users</div>
              <div className="text-lg font-bold text-blue-200 font-mono">{(selectedLocation.users / 1000).toFixed(1)}K</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-blue-900/30">
              <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-1 font-medium">Revenue</div>
              <div className="text-lg font-bold text-green-300 font-mono">${(selectedLocation.revenue / 1000).toFixed(0)}K</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-blue-900/30">
              <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-1 font-medium">Conversions</div>
              <div className="text-lg font-bold text-blue-200 font-mono">{selectedLocation.conversions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
          <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-2">Global Users</div>
          <div className="text-2xl font-bold text-blue-300 font-mono">{(totalUsers / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-blue-300/60 mt-1">Across {geographicData.length} cities</div>
        </div>
        <div className="p-4 rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
          <div className="text-xs text-blue-300 uppercase tracking-wider font-medium mb-2">Global Revenue</div>
          <div className="text-2xl font-bold text-green-300 font-mono">${(totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-blue-300/60 mt-1">Total geographic value</div>
        </div>
      </div>

      {/* Top Locations */}
      <div className="rounded-lg border border-blue-900/30 overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="px-4 py-3 border-b border-blue-900/20 bg-slate-900/50">
          <h4 className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            Top Locations
          </h4>
        </div>
        <div className="divide-y divide-blue-900/20">
          {geographicData.slice(0, 5).map((location, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedLocation(location)}
              className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer border-l-4 border-l-blue-500/30 hover:border-l-blue-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-200">{location.city}</span>
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-blue-900/50 text-blue-200 border-blue-500/30">
                  #{idx + 1}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[10px] text-blue-300/70">
                <span>{(location.users / 1000).toFixed(1)}K users</span>
                <span className="text-green-300">${(location.revenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
