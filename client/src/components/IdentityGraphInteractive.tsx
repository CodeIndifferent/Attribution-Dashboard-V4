/*
 * Interactive identity graph - Vibrant dark orbital theme
 * Showing conversion paths with multi-touch attribution
 * Visualizes how users drop off after one channel and convert through another
 */
import { useEffect, useRef, useState } from "react";
import { Network, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Node {
  id: string;
  label: string;
  type: 'channel' | 'event' | 'conversion';
  x: number;
  y: number;
  size: number;
  color: string;
  users: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
  conversions: number;
  color: string;
}

interface ConversionPath {
  id: string;
  path: string[];
  users: number;
  conversions: number;
  conversionRate: number;
  description: string;
}

const conversionPaths: ConversionPath[] = [
  {
    id: 'path_1',
    path: ['Twitter', 'Click', 'Landing', 'Abandon', 'Direct', 'Purchase'],
    users: 247,
    conversions: 37,
    conversionRate: 15.0,
    description: 'Twitter → Abandon → Direct Visit → Purchase',
  },
  {
    id: 'path_2',
    path: ['Google Ads', 'Click', 'Landing', 'Product View', 'Purchase'],
    users: 412,
    conversions: 54,
    conversionRate: 13.1,
    description: 'Google Ads → Direct Conversion',
  },
  {
    id: 'path_3',
    path: ['Meta', 'Click', 'Landing', 'Email Signup', 'Email', 'Purchase'],
    users: 315,
    conversions: 47,
    conversionRate: 14.9,
    description: 'Meta → Email Nurture → Purchase',
  },
  {
    id: 'path_4',
    path: ['Email', 'Click', 'Landing', 'Purchase'],
    users: 178,
    conversions: 38,
    conversionRate: 21.3,
    description: 'Email → Direct Purchase (Highest ROI)',
  },
  {
    id: 'path_5',
    path: ['Twitter', 'Click', 'Abandon', 'Google Ads', 'Retarget', 'Purchase'],
    users: 89,
    conversions: 15,
    conversionRate: 16.9,
    description: 'Twitter → Retargeting → Purchase',
  },
];

export default function IdentityGraphInteractive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPath, setSelectedPath] = useState<ConversionPath>(conversionPaths[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create nodes for selected path
    const pathNodes: Node[] = [];
    const channelColors: Record<string, string> = {
      'Twitter': '#1DA1F2',
      'Google Ads': '#4285F4',
      'Meta': '#1877F2',
      'Email': '#10b981',
      'Direct': '#6b7280',
      'Click': '#3b82f6',
      'Landing': '#8b5cf6',
      'Product View': '#06b6d4',
      'Purchase': '#10b981',
      'Abandon': '#ef4444',
      'Email Signup': '#f59e0b',
      'Retarget': '#ec4899',
    };

    selectedPath.path.forEach((label, i) => {
      const x = (canvas.width / (selectedPath.path.length + 1)) * (i + 1);
      const y = canvas.height / 2 + (Math.sin(i * 0.5) * 50);
      const size = label === 'Purchase' ? 20 : label === 'Abandon' ? 15 : 12;

      pathNodes.push({
        id: `${i}`,
        label,
        type: label === 'Purchase' ? 'conversion' : label === 'Abandon' ? 'event' : 'channel',
        x,
        y,
        size,
        color: channelColors[label] || '#6b7280',
        users: i === 0 ? selectedPath.users : Math.round(selectedPath.users * (1 - i * 0.15)),
      });
    });

    // Draw links
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const from = pathNodes[i];
      const to = pathNodes[i + 1];

      ctx.strokeStyle = `${from.color}60`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      ctx.fillStyle = from.color;
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - 10 * Math.cos(angle - Math.PI / 6), to.y - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - 10 * Math.cos(angle + Math.PI / 6), to.y - 10 * Math.sin(angle + Math.PI / 6));
      ctx.fill();
    }

    // Draw nodes
    pathNodes.forEach(node => {
      // Node circle with glow
      ctx.shadowColor = `${node.color}80`;
      ctx.shadowBlur = 15;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Highlight if hovered
      if (hoveredNode === node.id) {
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // User count below
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${node.users} users`, node.x, node.y + 22);
    });
  }, [selectedPath, hoveredNode]);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Network className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
              Identity Resolution Graph
            </span>
            <span className="text-[10px] text-blue-300/60 ml-3">Multi-touch Attribution Paths</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full bg-gradient-to-b from-slate-900/20 to-slate-900/40"
          style={{ height: "320px" }}
          onMouseMove={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            // Simple hover detection - in production would use proper hit testing
            setHoveredNode(null);
          }}
        />
      </div>

      {/* Conversion Paths */}
      <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-green-300" style={{ fontFamily: 'Syne, sans-serif' }}>
              Top Conversion Paths
            </span>
          </div>
          <div className="space-y-3">
            {conversionPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => setSelectedPath(path)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPath.id === path.id
                    ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20'
                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold text-green-300">{path.description}</div>
                    <div className="text-[10px] text-blue-300/60 mt-2 font-mono">
                      {path.path.join(' → ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-green-400">{path.conversionRate.toFixed(1)}%</div>
                    <div className="text-[10px] text-green-300/60 font-semibold">Conv. Rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-blue-300/70 font-medium">
                  <span>{path.users.toLocaleString()} users entered</span>
                  <span className="text-green-400 font-bold">{path.conversions} converted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution Insights */}
      <div className="rounded-lg border border-orange-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-orange-300" style={{ fontFamily: 'Syne, sans-serif' }}>
              Attribution Insights
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 hover:border-green-500/50 transition-all">
              <div className="text-xs font-bold text-green-400 mb-2">Highest ROI: Email Channel</div>
              <div className="text-[10px] text-green-300/80 leading-relaxed">
                Email campaigns show 21.3% conversion rate. Users who receive email nurturing after initial drop-off are 3.2x more likely to convert.
              </div>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
              <div className="text-xs font-bold text-cyan-400 mb-2">Multi-Touch Attribution</div>
              <div className="text-[10px] text-cyan-300/80 leading-relaxed">
                47% of conversions involve 2+ touchpoints. Twitter users who abandon but later visit via direct link show 16.9% conversion rate.
              </div>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 transition-all">
              <div className="text-xs font-bold text-orange-400 mb-2">Drop-off Recovery</div>
              <div className="text-[10px] text-orange-300/80 leading-relaxed">
                Retargeting campaigns recover 15% of abandoned sessions. Implementing email follow-up for all abandons could increase conversions by 23%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
