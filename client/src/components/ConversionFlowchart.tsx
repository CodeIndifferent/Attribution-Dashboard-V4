/*
 * CONVERSION FUNNEL FLOWCHART - Vibrant dark theme with modern animations
 * Shows user paths to conversion: campaign engagement → drop-off → organic reconnection
 */
import { useState } from 'react';
import { ChevronRight, Users, TrendingDown, TrendingUp, Zap } from 'lucide-react';

interface FlowNode {
  id: string;
  label: string;
  count: number;
  percentage: number;
  gradient: string;
  icon: React.ReactNode;
}

export default function ConversionFlowchart() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const flowData: FlowNode[] = [
    {
      id: 'campaign',
      label: 'Campaign Engagement',
      count: 284721,
      percentage: 100,
      gradient: 'from-cyan-500 via-blue-500 to-blue-600',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'active',
      label: 'Active Users',
      count: 156234,
      percentage: 54.9,
      gradient: 'from-green-400 via-emerald-500 to-emerald-600',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'dropoff',
      label: 'Drop-off',
      count: 128487,
      percentage: 45.1,
      gradient: 'from-orange-400 via-red-500 to-red-600',
      icon: <TrendingDown className="w-5 h-5" />,
    },
    {
      id: 'reconnect',
      label: 'Organic Reconnection',
      count: 64243,
      percentage: 50,
      gradient: 'from-purple-400 via-purple-500 to-pink-600',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  const detailedPaths = {
    campaign: [
      { channel: 'Paid Search', users: 94200, percentage: 33 },
      { channel: 'Organic Search', users: 182400, percentage: 64 },
      { channel: 'Paid Social', users: 8121, percentage: 3 },
    ],
    active: [
      { channel: 'Email Nurture', users: 62093, percentage: 40 },
      { channel: 'Direct Return', users: 46870, percentage: 30 },
      { channel: 'Referral', users: 47271, percentage: 30 },
    ],
    dropoff: [
      { reason: 'Price Sensitivity', users: 51395, percentage: 40 },
      { reason: 'Competitor Interest', users: 38546, percentage: 30 },
      { reason: 'Timing', users: 38546, percentage: 30 },
    ],
    reconnect: [
      { source: 'Email Campaign', users: 32121, percentage: 50 },
      { source: 'Retargeting Ads', users: 19345, percentage: 30 },
      { source: 'Organic Search', users: 12777, percentage: 20 },
    ],
  };

  return (
    <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md p-6 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>User Conversion Paths</h3>
            <p className="text-xs text-blue-300/60 mt-0.5">Track user progression through conversion funnel</p>
          </div>
        </div>

        {/* Main Flow */}
        <div className="space-y-4 mb-8">
          {flowData.map((node, idx) => (
            <div key={node.id}>
              <button
                onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                className="w-full group"
              >
                <div className={`bg-gradient-to-r ${node.gradient} rounded-xl p-5 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                        {node.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{node.label}</p>
                        <p className="text-sm opacity-90">{node.count.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">{node.percentage}%</p>
                      <ChevronRight className={`w-5 h-5 ml-auto transition-transform duration-300 ${expandedNode === node.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedNode === node.id && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-cyan-500/40 space-y-3 animate-in fade-in duration-300">
                  {node.id === 'campaign' && detailedPaths.campaign.map((path, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/15 transition-all">
                      <span className="text-sm font-semibold text-cyan-300">{path.channel}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-cyan-900/30 rounded-full h-2.5 border border-cyan-500/30">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${path.percentage}%` }} />
                        </div>
                        <span className="text-sm font-bold text-cyan-400 w-20 text-right">{path.users.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                  {node.id === 'active' && detailedPaths.active.map((path, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/15 transition-all">
                      <span className="text-sm font-semibold text-green-300">{path.channel}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-green-900/30 rounded-full h-2.5 border border-green-500/30">
                          <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" style={{ width: `${path.percentage}%` }} />
                        </div>
                        <span className="text-sm font-bold text-green-400 w-20 text-right">{path.users.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                  {node.id === 'dropoff' && detailedPaths.dropoff.map((path, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/15 transition-all">
                      <span className="text-sm font-semibold text-orange-300">{path.reason}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-orange-900/30 rounded-full h-2.5 border border-orange-500/30">
                          <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full" style={{ width: `${path.percentage}%` }} />
                        </div>
                        <span className="text-sm font-bold text-orange-400 w-20 text-right">{path.users.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                  {node.id === 'reconnect' && detailedPaths.reconnect.map((path, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/15 transition-all">
                      <span className="text-sm font-semibold text-purple-300">{path.source}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-purple-900/30 rounded-full h-2.5 border border-purple-500/30">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2.5 rounded-full" style={{ width: `${path.percentage}%` }} />
                        </div>
                        <span className="text-sm font-bold text-purple-400 w-20 text-right">{path.users.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flow Arrow */}
              {idx < flowData.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="text-cyan-500/50 text-2xl animate-bounce">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-cyan-500/20">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">Total Engaged</p>
            <p className="text-2xl font-black text-cyan-300 mt-2">284.7K</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all">
            <p className="text-xs font-bold text-green-400/70 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-2xl font-black text-green-400 mt-2">54.9%</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all">
            <p className="text-xs font-bold text-orange-400/70 uppercase tracking-wider">Drop-off Rate</p>
            <p className="text-2xl font-black text-orange-400 mt-2">45.1%</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <p className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">Reconnection</p>
            <p className="text-2xl font-black text-purple-400 mt-2">50%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
