/*
 * CAMPAIGNS DASHBOARD PAGE - Vibrant charts and modern design
 * Displays campaign overview and performance metrics
 */
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { campaignPerformanceData, dailyActivityData } from '@/lib/dashboardSampleData';
import { TrendingUp, DollarSign, Users, Target, Zap } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import CampaignChannelDrilldown from '@/components/CampaignChannelDrilldown';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.name || payload[0]?.payload?.date}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">{entry.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaignPerformanceData[0] | null>(null);
  const chartData = campaignPerformanceData.map(c => ({
    name: c.name,
    roi: c.roi,
    roas: c.roas,
    revenue: c.revenue / 1000,
  }));

  const statusCounts = {
    active: campaignPerformanceData.filter(c => c.status === 'Active').length,
    planning: campaignPerformanceData.filter(c => c.status === 'Planning').length,
  };

  if (selectedCampaign) {
    return (
      <DashboardLayout title="Campaign Performance" subtitle="Monitor all campaigns across channels and measure ROI">
        <CampaignChannelDrilldown 
          campaign={selectedCampaign} 
          onBack={() => setSelectedCampaign(null)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Campaign Performance" subtitle="Monitor all campaigns across channels and measure ROI">
      <div className="space-y-6">

      {/* KPI Cards - Vibrant */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">Active Campaigns</p>
          </div>
          <p className="text-3xl font-black text-cyan-300">{statusCounts.active}</p>
          <p className="text-xs text-blue-300/60 mt-2">Currently running</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase tracking-wider">Total Spend</p>
          </div>
          <p className="text-3xl font-black text-green-400">${(campaignPerformanceData.reduce((sum, c) => sum + c.spend, 0) / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-300/60 mt-2">Across all campaigns</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">Total Revenue</p>
          </div>
          <p className="text-3xl font-black text-purple-400">${(campaignPerformanceData.reduce((sum, c) => sum + c.revenue, 0) / 1000).toFixed(0)}K</p>
          <p className="text-xs text-purple-300/60 mt-2">From conversions</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase tracking-wider">Avg ROI</p>
          </div>
          <p className="text-3xl font-black text-orange-400">{(campaignPerformanceData.reduce((sum, c) => sum + c.roi, 0) / campaignPerformanceData.length).toFixed(1)}x</p>
          <p className="text-xs text-orange-300/60 mt-2">Average across all</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI by Campaign */}
        <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300">ROI by Campaign</h3>
                <p className="text-xs text-blue-300/60">Return on investment analysis</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRoi1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d9ff" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorRoi2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorRoi3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
                <Bar dataKey="roi" radius={[12, 12, 0, 0]} animationDuration={800}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={[`url(#colorRoi1)`, `url(#colorRoi2)`, `url(#colorRoi3)`][i % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-300">Revenue Trend</h3>
                <p className="text-xs text-green-300/60">Last 30 days performance</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyActivityData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(16, 185, 129, 0.15)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Table - Vibrant */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-300">All Campaigns</h3>
            <p className="text-xs text-cyan-300/60 mt-0.5">Complete campaign performance overview</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Campaign Name</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Channels</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Spend</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Revenue</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Conversions</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">ROI</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">CPA</th>
                <th className="text-center py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaignPerformanceData.map((campaign, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-cyan-500/10 hover:bg-cyan-500/10 cursor-pointer transition-all duration-200 group"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <td className="py-4 px-6 font-semibold text-cyan-100 group-hover:text-cyan-200">{campaign.name}</td>
                  <td className="text-right py-4 px-6 text-blue-300/80">{campaign.channels}</td>
                  <td className="text-right py-4 px-6 text-blue-300/80">${(campaign.spend / 1000).toFixed(1)}K</td>
                  <td className="text-right py-4 px-6 font-semibold text-green-400">${(campaign.revenue / 1000).toFixed(1)}K</td>
                  <td className="text-right py-4 px-6 text-cyan-300">{campaign.conversions.toLocaleString()}</td>
                  <td className="text-right py-4 px-6 font-bold text-cyan-400">{campaign.roi.toFixed(1)}x</td>
                  <td className="text-right py-4 px-6 text-blue-300/80">${campaign.cpa.toFixed(2)}</td>
                  <td className="text-center py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      campaign.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
