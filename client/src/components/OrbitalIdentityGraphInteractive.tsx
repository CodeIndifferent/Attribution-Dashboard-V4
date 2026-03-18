/*
 * INTERACTIVE ORBITAL IDENTITY GRAPH
 * Canvas-based graph with click handlers for campaign drill-down
 */
import { useEffect, useRef, useState } from "react";
import { Network, X } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  type: 'channel' | 'identity' | 'conversion';
  size: number;
  color: string;
  users: number;
}

interface Link {
  source: Node;
  target: Node;
  strength: number;
  color: string;
}

interface CampaignDetails {
  id: string;
  name: string;
  users: number;
  channels: Array<{ name: string; users: number; percentage: number }>;
  metrics: { ctr: number; cpc: number; roi: number };
}

export default function OrbitalIdentityGraphInteractive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ identities: 0, sessions: 0, conversions: 0 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const campaignDetails: Record<string, CampaignDetails> = {
    twitter: {
      id: 'twitter',
      name: 'Twitter Campaign',
      users: 2847,
      channels: [
        { name: 'Organic Tweets', users: 1424, percentage: 50 },
        { name: 'Promoted Tweets', users: 1138, percentage: 40 },
        { name: 'Retweets', users: 285, percentage: 10 },
      ],
      metrics: { ctr: 2.4, cpc: 0.45, roi: 3.2 },
    },
    google: {
      id: 'google',
      name: 'Google Ads Campaign',
      users: 3421,
      channels: [
        { name: 'Search Ads', users: 2053, percentage: 60 },
        { name: 'Display Ads', users: 1024, percentage: 30 },
        { name: 'Shopping Ads', users: 344, percentage: 10 },
      ],
      metrics: { ctr: 3.1, cpc: 1.25, roi: 2.8 },
    },
    meta: {
      id: 'meta',
      name: 'Meta Campaign',
      users: 2156,
      channels: [
        { name: 'Facebook Ads', users: 1294, percentage: 60 },
        { name: 'Instagram Ads', users: 647, percentage: 30 },
        { name: 'Audience Network', users: 215, percentage: 10 },
      ],
      metrics: { ctr: 1.8, cpc: 0.65, roi: 2.5 },
    },
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize nodes
    const nodes: Node[] = [
      {
        id: 'twitter',
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        vx: 0,
        vy: 0,
        label: 'Twitter',
        type: 'channel',
        size: 12,
        color: '#1DA1F2',
        users: 2847,
      },
      {
        id: 'google',
        x: canvas.width * 0.2,
        y: canvas.height * 0.7,
        vx: 0,
        vy: 0,
        label: 'Google Ads',
        type: 'channel',
        size: 12,
        color: '#4285F4',
        users: 3421,
      },
      {
        id: 'meta',
        x: canvas.width * 0.5,
        y: canvas.height * 0.2,
        vx: 0,
        vy: 0,
        label: 'Meta',
        type: 'channel',
        size: 12,
        color: '#1877F2',
        users: 2156,
      },
      {
        id: 'identity_hub',
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
        vx: 0,
        vy: 0,
        label: 'Identity Hub',
        type: 'identity',
        size: 18,
        color: '#3b82f6',
        users: 284000,
      },
      {
        id: 'conversion',
        x: canvas.width * 0.8,
        y: canvas.height * 0.5,
        vx: 0,
        vy: 0,
        label: 'Conversions',
        type: 'conversion',
        size: 14,
        color: '#10b981',
        users: 3850,
      },
    ];

    const links: Link[] = [
      { source: nodes[0], target: nodes[3], strength: 0.8, color: '#1DA1F240' },
      { source: nodes[1], target: nodes[3], strength: 0.9, color: '#4285F440' },
      { source: nodes[2], target: nodes[3], strength: 0.7, color: '#1877F240' },
      { source: nodes[3], target: nodes[4], strength: 0.95, color: '#10b98140' },
    ];

    const particles: Particle[] = [];
    let animationId: number;

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 4)],
        life: 1,
      });
    };

    const animate = () => {
      // Validate canvas dimensions
      if (!canvas.width || !canvas.height || !isFinite(canvas.width) || !isFinite(canvas.height)) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
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

      // Apply forces
      nodes.forEach((node, i) => {
        // Repulsion from other nodes
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const force = 50000 / (dist * dist);
          node.vx += (dx / dist) * force * 0.01;
          node.vy += (dy / dist) * force * 0.01;
        });

        // Attraction to center
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        if (isFinite(dist) && dist > 0) {
          node.vx += (dx / dist) * 0.05;
          node.vy += (dy / dist) * 0.05;
        }

        // Damping
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary check
        node.x = Math.max(node.size, Math.min(canvas.width - node.size, node.x));
        node.y = Math.max(node.size, Math.min(canvas.height - node.size, node.y));
      });

      // Draw links
      links.forEach(link => {
        ctx.strokeStyle = link.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();

        // Arrow
        const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x);
        ctx.fillStyle = link.color.replace('40', 'ff');
        ctx.beginPath();
        ctx.moveTo(link.target.x, link.target.y);
        ctx.lineTo(
          link.target.x - 10 * Math.cos(angle - Math.PI / 6),
          link.target.y - 10 * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          link.target.x - 10 * Math.cos(angle + Math.PI / 6),
          link.target.y - 10 * Math.sin(angle + Math.PI / 6)
        );
        ctx.fill();

        // Emit particles along link
        if (Math.random() < 0.1) {
          const t = Math.random();
          const px = link.source.x + (link.target.x - link.source.x) * t;
          const py = link.source.y + (link.target.y - link.source.y) * t;
          createParticle(px, py);
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Validate node coordinates
        if (!isFinite(node.x) || !isFinite(node.y) || !isFinite(node.size)) return;

        // Glow effect
        const glowRadius = node.size * 3;
        if (isFinite(glowRadius) && glowRadius > 0) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
          gradient.addColorStop(0, node.color + '40');
          gradient.addColorStop(1, node.color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = hoveredNode === node.id ? '#ffff00' : '#ffffff';
        ctx.lineWidth = hoveredNode === node.id ? 2 : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y - node.size - 15);

        // User count
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '9px monospace';
        ctx.fillText(`${(node.users / 1000).toFixed(0)}K`, node.x, node.y + node.size + 15);
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update stats
      setStats({
        identities: nodes[3].users,
        sessions: nodes.reduce((sum, n) => sum + n.users, 0),
        conversions: nodes[4].users,
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle canvas click
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is on a node
      for (const node of nodes) {
        if (Math.hypot(x - node.x, y - node.y) < node.size + 10) {
          setSelectedNode(node);
          return;
        }
      }
      setSelectedNode(null);
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let hovered = null;
      for (const node of nodes) {
        if (Math.hypot(x - node.x, y - node.y) < node.size + 10) {
          hovered = node.id;
          break;
        }
      }
      setHoveredNode(hovered);
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [hoveredNode]);

  const getSelectedDetails = (): CampaignDetails | null => {
    if (!selectedNode || !campaignDetails[selectedNode.id]) return null;
    return campaignDetails[selectedNode.id];
  };

  const details = getSelectedDetails();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-900/30 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-blue-900/20 bg-slate-900/50">
          <Network className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-200" style={{ fontFamily: 'Syne, sans-serif' }}>
            Identity Resolution Graph
          </span>
          <span className="text-[10px] text-blue-400/60 ml-auto">Click on campaigns to drill down</span>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ height: "400px", display: "block" }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/20">
          <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-1 font-medium">Identities</div>
          <div className="text-lg font-bold text-blue-200 font-mono">{(stats.identities / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/20">
          <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1 font-medium">Sessions</div>
          <div className="text-lg font-bold text-purple-200 font-mono">{(stats.sessions / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/20">
          <div className="text-[10px] text-green-300 uppercase tracking-wider mb-1 font-medium">Conversions</div>
          <div className="text-lg font-bold text-green-200 font-mono">{(stats.conversions / 1000).toFixed(1)}K</div>
        </div>
      </div>

      {/* Campaign Details Panel */}
      {details && (
        <div className="rounded-lg border border-blue-900/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-200">{details.name}</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-blue-900/30 rounded transition-colors"
            >
              <X className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-blue-300 uppercase">Total Users</p>
              <p className="text-xl font-bold text-blue-200">{(details.users / 1000).toFixed(1)}K</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-300 uppercase">CTR</p>
              <p className="text-xl font-bold text-emerald-400">{details.metrics.ctr}%</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-300 uppercase">ROI</p>
              <p className="text-xl font-bold text-purple-400">{details.metrics.roi}x</p>
            </div>
          </div>

          <p className="text-[10px] text-blue-300 uppercase mb-3">Channel Breakdown</p>
          <div className="space-y-2">
            {details.channels.map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-blue-200">{channel.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${channel.percentage}%` }} />
                  </div>
                  <span className="text-sm text-blue-300 font-mono">{(channel.users / 1000).toFixed(1)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
