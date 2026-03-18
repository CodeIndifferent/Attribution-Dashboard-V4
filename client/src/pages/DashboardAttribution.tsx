/*
 * ATTRIBUTION MODELS DASHBOARD PAGE - Vibrant dark orbital theme
 * Displays multi-touch attribution analysis
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { attributionModelsData } from '@/lib/dashboardSampleData';
import { TrendingUp, Zap } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.channel}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">${(entry.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
};

const modelColors = [
  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', gradient: 'from-blue-500 to-blue-600' },
  { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', gradient: 'from-green-500 to-green-600' },
  { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', gradient: 'from-yellow-500 to-yellow-600' },
  { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', gradient: 'from-purple-500 to-purple-600' },
];

const barColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardAttribution() {
  const modelNames = ['First Touch', 'Last Touch', 'Linear', 'Time Decay'];
  const channels = ['organic', 'email', 'paidAds', 'social', 'direct', 'other'];

  const channelComparison = channels.map(channel => {
    const data: any = { channel: channel.charAt(0).toUpperCase() + channel.slice(1) };
    attributionModelsData.forEach((model, idx) => {
      data[modelNames[idx]] = model[channel as keyof typeof model];
    });
    return data;
  });

  return (
    <DashboardLayout title="Attribution Models" subtitle="Compare different attribution models to understand channel contribution">
      <div className="space-y-6">

      {/* KPI Cards - Vibrant */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {modelNames.map((model, idx) => {
          const modelData = attributionModelsData[idx];
          const total = (modelData.organic + modelData.email + modelData.paidAds + modelData.social + modelData.direct + modelData.other);
          const colors = modelColors[idx];
          return (
            <div key={idx} className={`rounded-lg border ${colors.border} p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:${colors.border.replace('30', '50')} transition-all`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className={`text-xs font-bold ${colors.text}/70 uppercase tracking-wider`}>{model}</p>
              </div>
              <p className={`text-3xl font-black ${colors.text}`}>${(total / 1000).toFixed(0)}K</p>
              <p className={`text-xs ${colors.text}/60 mt-2`}>Total attributed</p>
            </div>
          );
        })}
      </div>

      {/* Attribution Model Comparison */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-300">Attribution by Channel & Model</h3>
              <p className="text-xs text-blue-300/60 mt-0.5">Compare revenue attribution across models</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={channelComparison} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradBar1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="gradBar2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="gradBar3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="gradBar4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
              <XAxis dataKey="channel" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {modelNames.map((model, idx) => (
                <Bar key={idx} dataKey={model} fill={[`url(#gradBar1)`, `url(#gradBar2)`, `url(#gradBar3)`, `url(#gradBar4)`][idx]} radius={[8, 8, 0, 0]} animationDuration={800} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {attributionModelsData.map((model, idx) => {
          const colors = modelColors[idx];
          return (
            <div key={idx} className={`rounded-lg border ${colors.border} p-6 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md overflow-hidden relative`}>
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute top-0 left-1/4 w-48 h-48 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl`} />
              </div>
              <div className="relative z-10">
                <h3 className={`text-sm font-bold ${colors.text} mb-5`}>{modelNames[idx]} Model</h3>
                <div className="space-y-4">
                  {Object.entries(model).map(([channel, value]) => (
                    <div key={channel} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
                      <span className={`text-sm font-semibold capitalize ${colors.text}`}>{channel}</span>
                      <span className={`text-sm font-bold ${colors.text}`}>${((value as number) / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attribution Table */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-300">Detailed Attribution Breakdown</h3>
            <p className="text-xs text-cyan-300/60 mt-0.5">Complete attribution data across all models and channels</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Attribution Model</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Organic</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Email</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Paid Ads</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Social</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Direct</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Other</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {attributionModelsData.map((model, idx) => {
                const total = model.organic + model.email + model.paidAds + model.social + model.direct + model.other;
                return (
                  <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all duration-200 group">
                    <td className="py-4 px-6 font-semibold text-cyan-100 group-hover:text-cyan-200">{modelNames[idx]}</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.organic / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.email / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.paidAds / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.social / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.direct / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(model.other / 1000).toFixed(0)}K</td>
                    <td className="text-right py-4 px-6 font-bold text-cyan-400">${(total / 1000).toFixed(0)}K</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
