/*
 * CAMPAIGN ROI KPI CARDS - Dark orbital theme
 */
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

const kpis = [
  { label: 'Total Spend', value: '$342,850', change: '+12.5%', icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Total Revenue', value: '$1,284,700', change: '+18.2%', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Total Conversions', value: '2,847', change: '+5.4%', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Active Users', value: '284.7K', change: '+2.1%', icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
];

export default function CampaignROI() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div key={i} className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-sm p-5 hover:border-blue-500/40 hover:bg-slate-900/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20">
                {kpi.change}
              </span>
            </div>
            <div>
              <div className="text-xs font-medium text-blue-400/70 uppercase tracking-wider mb-1">{kpi.label}</div>
              <div className="text-2xl font-bold text-blue-100" style={{ fontFamily: 'Syne, sans-serif' }}>
                {kpi.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
