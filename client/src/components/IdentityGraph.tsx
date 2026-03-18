/*
 * DESIGN: Dark Orbital — Interactive SVG identity graph with glowing nodes and animated edges
 * Nodes: user (circle), device (square), session (diamond), email (hexagon)
 * Colors: resolved=emerald, fragmented=amber, pending=slate
 */
import { useState, useRef, useEffect } from "react";
import { graphNodes, graphEdges, IdentityNode } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Network, X, Monitor, Mail, Clock, Fingerprint, CheckCircle, AlertTriangle, Circle } from "lucide-react";

const statusColors = {
  resolved: { fill: '#10b981', stroke: '#34d399', glow: '#10b98140', text: 'text-emerald-400' },
  fragmented: { fill: '#f59e0b', stroke: '#fbbf24', glow: '#f59e0b40', text: 'text-amber-400' },
  pending: { fill: '#64748b', stroke: '#94a3b8', glow: '#64748b40', text: 'text-slate-400' },
};

const typeShapes = {
  user: 'circle',
  device: 'rect',
  session: 'diamond',
  email: 'circle',
  cookie: 'circle',
};

const typeSizes = {
  user: 14,
  device: 10,
  session: 8,
  email: 8,
  cookie: 7,
};

const edgeColors = {
  device_link: '#3b82f6',
  session_link: '#8b5cf6',
  email_match: '#10b981',
  fingerprint: '#f59e0b',
};

function NodeShape({ node, isSelected, onClick }: { node: IdentityNode; isSelected: boolean; onClick: () => void }) {
  const colors = statusColors[node.status];
  const size = typeSizes[node.type];
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow ring */}
      {(active || node.type === 'user') && (
        <circle
          r={size + 8}
          fill={colors.glow}
          className={node.type === 'user' ? "node-pulse" : ""}
          opacity={active ? 0.6 : 0.3}
        />
      )}
      {/* Outer ring */}
      {isSelected && (
        <circle r={size + 4} fill="none" stroke={colors.stroke} strokeWidth={1.5} opacity={0.6} />
      )}

      {/* Shape */}
      {node.type === 'user' ? (
        <circle r={size} fill={colors.fill} stroke={colors.stroke} strokeWidth={active ? 2 : 1} />
      ) : node.type === 'device' ? (
        <rect x={-size} y={-size} width={size * 2} height={size * 2} rx={3}
          fill={colors.fill} stroke={colors.stroke} strokeWidth={active ? 2 : 1} opacity={0.9} />
      ) : node.type === 'session' ? (
        <polygon
          points={`0,${-size} ${size},0 0,${size} ${-size},0`}
          fill={colors.fill} stroke={colors.stroke} strokeWidth={active ? 2 : 1} opacity={0.85}
        />
      ) : (
        <circle r={size} fill={colors.fill} stroke={colors.stroke} strokeWidth={active ? 2 : 1} opacity={0.85} />
      )}

      {/* Label */}
      {(node.type === 'user' || active) && (
        <text
          y={size + 14}
          textAnchor="middle"
          fill="white"
          fontSize={node.type === 'user' ? 10 : 9}
          fontFamily="Geist Mono, monospace"
          opacity={node.type === 'user' ? 0.8 : 0.6}
        >
          {node.label.length > 12 ? node.label.slice(0, 12) + '…' : node.label}
        </text>
      )}
    </g>
  );
}

function EdgeLine({ edge }: { edge: typeof graphEdges[0] }) {
  const source = graphNodes.find(n => n.id === edge.source);
  const target = graphNodes.find(n => n.id === edge.target);
  if (!source || !target) return null;

  const color = edgeColors[edge.type];
  const opacity = 0.2 + edge.strength * 0.3;

  return (
    <line
      x1={source.x} y1={source.y}
      x2={target.x} y2={target.y}
      stroke={color}
      strokeWidth={edge.strength > 0.9 ? 1.5 : 1}
      opacity={opacity}
      strokeDasharray={edge.type === 'fingerprint' ? '4 3' : undefined}
    />
  );
}

export default function IdentityGraph() {
  const [selectedNode, setSelectedNode] = useState<IdentityNode | null>(null);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'fragmented' | 'pending'>('all');

  const filteredNodes = filter === 'all'
    ? graphNodes
    : graphNodes.filter(n => n.status === filter);

  const filteredEdges = graphEdges.filter(e => {
    const source = filteredNodes.find(n => n.id === e.source);
    const target = filteredNodes.find(n => n.id === e.target);
    return source && target;
  });

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'oklch(0.1 0.018 258 / 0.5)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Identity Graph
          </span>
          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/15 text-blue-300 border-blue-500/20">
            {graphNodes.filter(n => n.type === 'user').length} identities
          </Badge>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
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
        </div>
      </div>

      <div className="flex">
        {/* SVG Graph */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '420px' }}>
          {/* Background image */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("https://d2xsxph8kpxj0f.cloudfront.net/310519663444090836/bcu7fJXB4mRs4q8aJj5dGs/identity-graph-hero-RN78Pww552UPsonTcuT2Ag.webp")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <svg
            viewBox="0 0 740 600"
            className="w-full h-full"
            style={{ minHeight: '420px' }}
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.3" opacity="0.06" />
              </pattern>
            </defs>
            <rect width="740" height="600" fill="url(#grid)" />

            {/* Edges */}
            <g>
              {filteredEdges.map((edge, i) => (
                <EdgeLine key={i} edge={edge} />
              ))}
            </g>

            {/* Nodes */}
            <g>
              {filteredNodes.map(node => (
                <NodeShape
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                />
              ))}
            </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-3">
            {[
              { label: 'Resolved', color: '#10b981' },
              { label: 'Fragmented', color: '#f59e0b' },
              { label: 'Pending', color: '#64748b' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-white/40">{item.label}</span>
              </div>
            ))}
            <div className="w-px h-3 bg-white/10 self-center" />
            {[
              { label: 'User', shape: '●' },
              { label: 'Device', shape: '■' },
              { label: 'Session', shape: '◆' },
              { label: 'Email', shape: '●' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <span className="text-[10px] text-white/30">{item.shape}</span>
                <span className="text-[10px] text-white/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node detail panel */}
        {selectedNode && (
          <div className="w-64 border-l border-white/[0.07] p-4 shrink-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Node Detail</span>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Node info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  selectedNode.status === 'resolved' ? "bg-emerald-500/15" :
                    selectedNode.status === 'fragmented' ? "bg-amber-500/15" : "bg-slate-500/15"
                )}>
                  {selectedNode.type === 'user' ? <Fingerprint className="w-4 h-4 text-blue-400" /> :
                    selectedNode.type === 'device' ? <Monitor className="w-4 h-4 text-violet-400" /> :
                      selectedNode.type === 'email' ? <Mail className="w-4 h-4 text-emerald-400" /> :
                        <Clock className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{selectedNode.label}</div>
                  <div className="text-[10px] text-white/40 capitalize">{selectedNode.type}</div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Status</span>
                  <div className="flex items-center gap-1">
                    {selectedNode.status === 'resolved' ? <CheckCircle className="w-3 h-3 text-emerald-400" /> :
                      selectedNode.status === 'fragmented' ? <AlertTriangle className="w-3 h-3 text-amber-400" /> :
                        <Circle className="w-3 h-3 text-slate-400" />}
                    <span className={cn("text-xs capitalize", statusColors[selectedNode.status].text)}>
                      {selectedNode.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full",
                          selectedNode.confidence > 80 ? "bg-emerald-400" :
                            selectedNode.confidence > 60 ? "bg-amber-400" : "bg-slate-400"
                        )}
                        style={{ width: `${selectedNode.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/70">{selectedNode.confidence}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Last Seen</span>
                  <span className="text-xs font-mono text-white/60">{selectedNode.lastSeen}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Connections</span>
                  <span className="text-xs font-mono text-white/60">{selectedNode.connections.length}</span>
                </div>
              </div>

              {/* Connected nodes */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Connected To</div>
                <div className="space-y-1">
                  {selectedNode.connections.slice(0, 4).map(connId => {
                    const conn = graphNodes.find(n => n.id === connId);
                    if (!conn) return null;
                    return (
                      <div key={connId} className="flex items-center gap-2 py-1 px-2 rounded bg-white/[0.03]">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[conn.status].fill }} />
                        <span className="text-[11px] text-white/60 truncate">{conn.label}</span>
                        <span className="text-[10px] text-white/30 ml-auto capitalize">{conn.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
