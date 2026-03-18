/*
 * DESIGN: Dark Orbital — Canvas-based animated identity graph with force simulation
 * Nodes drift and pulse, edges glow with animated data flow particles
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Network, ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'device' | 'session' | 'email';
  status: 'resolved' | 'fragmented' | 'pending';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: string[];
  confidence: number;
  lastSeen: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'device_link' | 'session_link' | 'email_match' | 'fingerprint';
  strength: number;
  particles: Particle[];
}

interface Particle {
  t: number; // 0-1 along edge
  speed: number;
  opacity: number;
}

const STATUS_COLORS = {
  resolved: { fill: '#10b981', stroke: '#34d399', glow: 'rgba(16,185,129,0.4)' },
  fragmented: { fill: '#f59e0b', stroke: '#fbbf24', glow: 'rgba(245,158,11,0.4)' },
  pending: { fill: '#475569', stroke: '#64748b', glow: 'rgba(71,85,105,0.3)' },
};

const EDGE_COLORS = {
  device_link: '#3b82f6',
  session_link: '#8b5cf6',
  email_match: '#10b981',
  fingerprint: '#f59e0b',
};

function buildNodes(): GraphNode[] {
  const cx = 370, cy = 300;
  const users = [
    { id: 'u1', label: 'Sarah K.', status: 'resolved' as const, confidence: 97, lastSeen: '2m ago' },
    { id: 'u2', label: 'Marcus T.', status: 'resolved' as const, confidence: 92, lastSeen: '5m ago' },
    { id: 'u3', label: 'Priya M.', status: 'resolved' as const, confidence: 99, lastSeen: '1m ago' },
    { id: 'u4', label: 'James R.', status: 'resolved' as const, confidence: 88, lastSeen: '8m ago' },
    { id: 'u5', label: 'Anon-4821', status: 'fragmented' as const, confidence: 61, lastSeen: '12m ago' },
    { id: 'u6', label: 'Anon-7734', status: 'pending' as const, confidence: 44, lastSeen: '28m ago' },
    { id: 'u7', label: 'Elena V.', status: 'resolved' as const, confidence: 94, lastSeen: '3m ago' },
    { id: 'u8', label: 'Anon-2291', status: 'pending' as const, confidence: 38, lastSeen: '15m ago' },
  ];

  const devices = [
    { id: 'd1', label: 'MacBook Pro', userId: 'u1' },
    { id: 'd2', label: 'iPhone 15', userId: 'u1' },
    { id: 'd3', label: 'iPad Air', userId: 'u2' },
    { id: 'd4', label: 'Galaxy S24', userId: 'u3' },
    { id: 'd5', label: 'Surface Pro', userId: 'u3' },
    { id: 'd6', label: 'Firefox/Win', userId: 'u4' },
    { id: 'd7', label: 'Chrome/Win', userId: 'u5' },
    { id: 'd8', label: 'Safari/Mac', userId: 'u6' },
    { id: 'd9', label: 'iPhone 14', userId: 'u7' },
    { id: 'd10', label: 'Chrome/Mac', userId: 'u8' },
  ];

  const emails = [
    { id: 'e1', label: 'sarah@...', userId: 'u1' },
    { id: 'e2', label: 'marcus@...', userId: 'u2' },
    { id: 'e3', label: 'priya@...', userId: 'u3' },
    { id: 'e4', label: 'james@...', userId: 'u4' },
    { id: 'e5', label: 'elena@...', userId: 'u7' },
  ];

  const sessions = [
    { id: 's1', label: '#8821', userId: 'u1' },
    { id: 's2', label: '#4492', userId: 'u2' },
    { id: 's3', label: '#2271', userId: 'u3' },
    { id: 's4', label: '#3318', userId: 'u4' },
    { id: 's5', label: '#9103', userId: 'u5' },
    { id: 's6', label: '#6634', userId: 'u6' },
    { id: 's7', label: '#7721', userId: 'u7' },
    { id: 's8', label: '#2291', userId: 'u8' },
  ];

  const nodes: GraphNode[] = [];

  // Place users in a circle
  users.forEach((u, i) => {
    const angle = (i / users.length) * Math.PI * 2 - Math.PI / 2;
    const r = 160;
    nodes.push({
      ...u,
      type: 'user',
      x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 20,
      y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 20,
      vx: 0, vy: 0,
      radius: 14,
      connections: [],
    });
  });

  // Place devices near their users
  devices.forEach((d) => {
    const user = nodes.find(n => n.id === d.userId);
    if (!user) return;
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      id: d.id, label: d.label, type: 'device',
      status: user.status, confidence: user.confidence, lastSeen: user.lastSeen,
      x: user.x + Math.cos(angle) * 60 + (Math.random() - 0.5) * 20,
      y: user.y + Math.sin(angle) * 60 + (Math.random() - 0.5) * 20,
      vx: 0, vy: 0, radius: 9,
      connections: [d.userId],
    });
    user.connections.push(d.id);
  });

  // Place emails near their users
  emails.forEach((e) => {
    const user = nodes.find(n => n.id === e.userId);
    if (!user) return;
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      id: e.id, label: e.label, type: 'email',
      status: 'resolved', confidence: 99, lastSeen: user.lastSeen,
      x: user.x + Math.cos(angle) * 80 + (Math.random() - 0.5) * 15,
      y: user.y + Math.sin(angle) * 80 + (Math.random() - 0.5) * 15,
      vx: 0, vy: 0, radius: 7,
      connections: [e.userId],
    });
    user.connections.push(e.id);
  });

  // Place sessions near their users
  sessions.forEach((s) => {
    const user = nodes.find(n => n.id === s.userId);
    if (!user) return;
    const angle = Math.random() * Math.PI * 2;
    nodes.push({
      id: s.id, label: s.label, type: 'session',
      status: user.status, confidence: user.confidence, lastSeen: user.lastSeen,
      x: user.x + Math.cos(angle) * 70 + (Math.random() - 0.5) * 15,
      y: user.y + Math.sin(angle) * 70 + (Math.random() - 0.5) * 15,
      vx: 0, vy: 0, radius: 7,
      connections: [s.userId],
    });
    user.connections.push(s.id);
  });

  return nodes;
}

function buildEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const target = nodes.find(n => n.id === connId);
      if (!target) return;
      // Avoid duplicates
      if (edges.some(e => (e.source === node.id && e.target === connId) || (e.source === connId && e.target === node.id))) return;

      let type: GraphEdge['type'] = 'device_link';
      if (target.type === 'email' || node.type === 'email') type = 'email_match';
      else if (target.type === 'session' || node.type === 'session') type = 'session_link';
      else if (node.status === 'fragmented' || target.status === 'fragmented') type = 'fingerprint';

      edges.push({
        source: node.id,
        target: connId,
        type,
        strength: Math.min(node.confidence, target.confidence) / 100,
        particles: Array.from({ length: 2 }, () => ({
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          opacity: 0.4 + Math.random() * 0.4,
        })),
      });
    });
  });
  return edges;
}

export default function AnimatedGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>(buildNodes());
  const edgesRef = useRef<GraphEdge[]>(buildEdges(nodesRef.current));
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'fragmented' | 'pending'>('all');
  const zoomRef = useRef(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    timeRef.current += 0.016;

    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    bg.addColorStop(0, 'rgba(20,30,60,0.3)');
    bg.addColorStop(1, 'rgba(5,8,20,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const z = zoomRef.current;
    const cx = W / 2, cy = H / 2;

    // Apply gentle drift
    nodes.forEach(node => {
      node.vx += (Math.random() - 0.5) * 0.02;
      node.vy += (Math.random() - 0.5) * 0.02;
      node.vx *= 0.95;
      node.vy *= 0.95;
      node.x += node.vx;
      node.y += node.vy;
      // Boundary
      const margin = 60;
      if (node.x < margin) node.vx += 0.3;
      if (node.x > W - margin) node.vx -= 0.3;
      if (node.y < margin) node.vy += 0.3;
      if (node.y > H - margin) node.vy -= 0.3;
    });

    // Filter
    const visibleNodes = filter === 'all' ? nodes : nodes.filter(n => n.status === filter || n.type !== 'user');
    const visibleIds = new Set(visibleNodes.map(n => n.id));

    ctx.save();
    ctx.translate(cx * (1 - z), cy * (1 - z));
    ctx.scale(z, z);

    // Draw edges
    edges.forEach(edge => {
      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return;
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) return;

      const color = EDGE_COLORS[edge.type];
      const opacity = 0.15 + edge.strength * 0.25;

      // Edge line
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = edge.strength > 0.85 ? 1.5 : 1;
      if (edge.type === 'fingerprint') ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Particles along edge
      edge.particles.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const px = src.x + (tgt.x - src.x) * p.t;
        const py = src.y + (tgt.y - src.y) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(timeRef.current * 3 + p.t * 10));
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    });

    // Draw nodes
    visibleNodes.forEach(node => {
      const colors = STATUS_COLORS[node.status];
      const isSelected = selectedNode?.id === node.id;
      const pulse = 0.5 + 0.5 * Math.sin(timeRef.current * 2 + node.x * 0.01);
      const r = node.radius;

      // Glow
      if (node.type === 'user' || isSelected) {
        const glowR = r + 8 + (isSelected ? 4 : 0) + pulse * 4;
        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
        grd.addColorStop(0, colors.glow);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = node.type === 'user' ? 0.6 : 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Node shape
      ctx.beginPath();
      if (node.type === 'user') {
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      } else if (node.type === 'device') {
        const s = r * 0.85;
        ctx.roundRect(node.x - s, node.y - s, s * 2, s * 2, 3);
      } else if (node.type === 'session') {
        ctx.moveTo(node.x, node.y - r);
        ctx.lineTo(node.x + r, node.y);
        ctx.lineTo(node.x, node.y + r);
        ctx.lineTo(node.x - r, node.y);
        ctx.closePath();
      } else {
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      }

      // Fill with gradient
      const grad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
      grad.addColorStop(0, colors.stroke);
      grad.addColorStop(1, colors.fill);
      ctx.fillStyle = grad;
      ctx.globalAlpha = node.type === 'user' ? 1 : 0.85;
      ctx.fill();

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Label for users
      if (node.type === 'user') {
        ctx.font = `bold 10px "Geist Mono", monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + r + 14);
      }
    });

    ctx.restore();
    animFrameRef.current = requestAnimationFrame(draw);
  }, [filter, selectedNode]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const z = zoomRef.current;
    const W = canvas.width, H = canvas.height;
    const ax = (mx - W / 2 * (1 - z)) / z;
    const ay = (my - H / 2 * (1 - z)) / z;

    const hit = nodesRef.current.find(n => {
      const dx = n.x - ax, dy = n.y - ay;
      return Math.sqrt(dx * dx + dy * dy) < n.radius + 8;
    });
    setSelectedNode(hit || null);
  }, []);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(2, zoomRef.current + delta));
    zoomRef.current = newZoom;
    setZoom(newZoom);
  };

  const handleReset = () => {
    nodesRef.current = buildNodes();
    edgesRef.current = buildEdges(nodesRef.current);
    setSelectedNode(null);
  };

  const resolvedCount = nodesRef.current.filter(n => n.type === 'user' && n.status === 'resolved').length;
  const fragmentedCount = nodesRef.current.filter(n => n.type === 'user' && n.status === 'fragmented').length;
  const pendingCount = nodesRef.current.filter(n => n.type === 'user' && n.status === 'pending').length;

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Live Identity Graph
          </span>
          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/15 text-blue-300 border-blue-500/20">
            {nodesRef.current.filter(n => n.type === 'user').length} identities
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          {(['all', 'resolved', 'fragmented', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
                filter === f
                  ? f === 'all' ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : f === 'resolved' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : f === 'fragmented' ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                  : "text-white/40 hover:text-white/60 border border-transparent"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

          <div className="w-px h-4 bg-white/10" />

          {/* Zoom controls */}
          <button onClick={() => handleZoom(0.2)} className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleZoom(-0.2)} className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleReset} className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={740}
            height={480}
            className="w-full"
            style={{ cursor: 'crosshair', display: 'block' }}
            onClick={handleCanvasClick}
          />

          {/* Stats overlay */}
          <div className="absolute top-3 left-3 flex gap-2">
            {[
              { label: 'Resolved', count: resolvedCount, color: '#10b981' },
              { label: 'Fragmented', count: fragmentedCount, color: '#f59e0b' },
              { label: 'Pending', count: pendingCount, color: '#64748b' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-white/60">{s.label}</span>
                <span className="text-[10px] font-mono text-white/80">{s.count}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex gap-3">
            {[
              { label: 'User', color: '#3b82f6', shape: '●' },
              { label: 'Device', color: '#8b5cf6', shape: '■' },
              { label: 'Session', color: '#06b6d4', shape: '◆' },
              { label: 'Email', color: '#10b981', shape: '●' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <span className="text-[10px]" style={{ color: item.color }}>{item.shape}</span>
                <span className="text-[10px] text-white/40">{item.label}</span>
              </div>
            ))}
            <div className="w-px h-3 bg-white/10 self-center" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-white/30">Zoom: {zoom.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Node detail */}
        {selectedNode && (
          <div className="w-56 border-l border-white/[0.07] p-4 shrink-0 animate-fade-in">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Selected Node</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-white">{selectedNode.label}</div>
                <div className="text-[11px] text-white/40 capitalize mt-0.5">{selectedNode.type}</div>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] border capitalize",
                selectedNode.status === 'resolved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  selectedNode.status === 'fragmented' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-slate-500/10 text-slate-400 border-slate-500/20"
              )}>
                {selectedNode.status}
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Confidence</span>
                  <span className="font-mono text-white/70">{selectedNode.confidence}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full",
                      selectedNode.confidence > 80 ? "bg-emerald-400" :
                        selectedNode.confidence > 60 ? "bg-amber-400" : "bg-slate-400"
                    )}
                    style={{ width: `${selectedNode.confidence}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Last Seen</span>
                  <span className="font-mono text-white/60">{selectedNode.lastSeen}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Connections</span>
                  <span className="font-mono text-white/60">{selectedNode.connections.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
